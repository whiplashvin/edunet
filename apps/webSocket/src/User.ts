import { WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SessionManager } from "./SessionManager";
import { redisPublisher } from ".";

export class User {
  id: string;
  userRole: "admin" | "user" | null;
  socket: WebSocket;
  username: string | null;
  sessionId: string | null;

  constructor(ws: WebSocket) {
    this.id = genId();
    this.userRole = null;
    this.socket = ws;
    this.username = null;
    this.sessionId = null;
    this.init();
  }

  private init() {
    this.socket.on("message", (data) => {
      const parsed = JSON.parse(data as unknown as string);
      switch (parsed.event) {
        case "join":
          const user = jwt.verify(
            parsed.payload.jwtToken,
            "jwtSecret"
          ) as JwtPayload;
          if (!user) {
            this.socket.close();
          }
          this.username = user.username;
          this.userRole = user.role;
          this.sessionId = parsed.payload.sessionId;
          SessionManager.getInstance().addUser(parsed.payload.sessionId, this);
          break;
        case "leave":
          SessionManager.getInstance().userLeft(parsed.payload.sessionId, this);
          break;
        case "image-open":
          SessionManager.getInstance().imageOpen(parsed.payload.sessionId);
          break;
        case "image-close":
          SessionManager.getInstance().imageClose(parsed.payload.sessionId);
          break;
        case "whiteBoard-open":
          SessionManager.getInstance().whiteBoardOpen(parsed.payload.sessionId);
          break;
        case "whiteBoard-close":
          SessionManager.getInstance().whiteBoardClose(
            parsed.payload.sessionId
          );
          break;
        case "whiteBoard-draw":
          SessionManager.getInstance().whiteBoardDraw(parsed.payload.sessionId);
          break;
        case "start-drawing-board":
          SessionManager.getInstance().mouseDownWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y,
            parsed.payload.adminHeight,
            parsed.payload.adminWidth
          );
          break;
        case "move-drawing-board":
          SessionManager.getInstance().mouseMoveWhiteBoard(
            parsed.payload.sessionId,
            parsed.payload.x,
            parsed.payload.y,
            parsed.payload.adminHeight,
            parsed.payload.adminWidth
          );
          break;
        case "stop-drawing-board":
          SessionManager.getInstance().mouseUpWhiteBoard(
            parsed.payload.sessionId
          );
          break;
        case "whiteBoard-erase":
          SessionManager.getInstance().whiteBoardErase(
            parsed.payload.sessionId
          );
          break;
        case "whiteBoard-color-change":
          SessionManager.getInstance().whiteBoardColorChange(
            parsed.payload.sessionId,
            parsed.payload.strokeStyle
          );
          break;
        case "whiteBoard-clear":
          SessionManager.getInstance().whiteBoardClear(
            parsed.payload.sessionId
          );
          break;
        case "image-load":
          SessionManager.getInstance().imageLoad(
            parsed.payload.sessionId,
            parsed.payload.imgUrl
          );
          break;
        case "image-next-page":
          SessionManager.getInstance().imageNextPage(
            parsed.payload.sessionId,
            parsed.payload.currPage,
            parsed.payload.imgUrl
          );
          break;
        case "image-prev-page":
          SessionManager.getInstance().imagePrevPage(
            parsed.payload.sessionId,
            parsed.payload.currPage,
            parsed.payload.imgUrl
          );
          break;
        case "message":
          SessionManager.getInstance().message(
            parsed.payload.sessionId,
            parsed.payload.content
          );
          break;
        case "remove-participant":
          SessionManager.getInstance().removeParticipant(
            parsed.payload.participant,
            parsed.payload.sessionId
          );
          break;
        case "end-class":
          SessionManager.getInstance().endClass(parsed.payload.sessionId);
          break;
        case "join-permission":
          redisPublisher.publish(
            parsed.payload.uniqueId,
            JSON.stringify({
              permission: parsed.payload.status,
            })
          );
          break;
        default:
          break;
      }
    });
  }
  destroy() {
    SessionManager.getInstance().userLeft(this.sessionId as string, this);
    this.socket.close();
  }
}
function genId() {
  return Math.random().toString(34).slice(2);
}
