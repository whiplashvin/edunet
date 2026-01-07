import { User } from "./User";
import { producer } from ".";

export class SessionManager {
  static instance: SessionManager;
  sessions: Map<string, User[]> = new Map();

  constructor() {
    this.sessions = new Map();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SessionManager();
    }
    return this.instance;
  }

  addUser(sessionId: string, user: User) {
    if (this.sessions.get(sessionId)) {
      this.sessions.set(sessionId, [
        ...(this.sessions.get(sessionId) ?? []),
        user,
      ]);
    } else {
      this.sessions.set(sessionId, [user]);
    }
    console.log(`${user.username} joined`);
    this.sessions
      .get(sessionId)
      ?.forEach((u) => console.log({ username: u.username, id: u.id }));
  }

  userLeft(sessionId: string, user: User) {
    user.socket.close();
    this.sessions.set(
      sessionId,
      this.sessions.get(sessionId)?.filter((x) => x.id !== user.id) || []
    );
    console.log(`${user.username} left`);
    this.sessions
      .get(sessionId)
      ?.forEach((u) => console.log({ username: u.username, id: u.id }));
  }
  imageOpen(sessionId: string) {
    console.log("image open");
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "image-open" }));
      }
    });
  }
  imageLoad(sessionId: string, urls: string[]) {
    console.log("image load");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: 0,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({ event: "image-load", payload: { imgUrl: urls } })
        );
      }
    });
  }
  imageNextPage(sessionId: string, currPage: number, urls: string[]) {
    console.log("next page");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: currPage,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "image-next-page",
            payload: {
              currPage,
            },
          })
        );
      }
    });
  }
  imagePrevPage(sessionId: string, currPage: number, urls: string[]) {
    console.log("prev page");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-open",
            imgUrl: urls,
            currPage: currPage,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "image-prev-page",
            payload: {
              currPage,
            },
          })
        );
      }
    });
  }
  imageClose(sessionId: string) {
    console.log("image close");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "image-close",
            imgUrl: [],
            currPage: 0,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "image-close" }));
      }
    });
  }
  whiteBoardOpen(sessionId: string) {
    console.log("wb open");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-open",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-open" }));
      }
    });
  }
  whiteBoardClose(sessionId: string) {
    console.log("wb close");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-close",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-close" }));
      }
    });
  }
  whiteBoardDraw(sessionId: string) {
    console.log("wb draw");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-draw",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-draw" }));
      }
    });
  }
  mouseDownWhiteBoard(
    sessionId: string,
    x: string,
    y: string,
    height: string,
    width: string
  ) {
    console.log("wb draw start");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            event: "mouse-down",
            sessionId: sessionId,
            timeStamp: Date.now(),
            x: x,
            y: y,
            adminHeight: height,
            adminWidth: width,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "start-drawing-board",
            payload: {
              x: x,
              y: y,
              adminHeight: height,
              adminWidth: width,
            },
          })
        );
      }
    });
  }
  mouseMoveWhiteBoard(
    sessionId: string,
    x: string,
    y: string,
    height: string,
    width: string
  ) {
    console.log("wb draw move");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "mouse-move",
            x: x,
            y: y,
            adminHeight: height,
            adminWidth: width,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "move-drawing-board",
            payload: {
              x: x,
              y: y,
              adminHeight: height,
              adminWidth: width,
            },
          })
        );
      }
    });
  }
  mouseUpWhiteBoard(sessionId: string) {
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "mouse-up",
          }),
        },
      ],
    });
  }
  whiteBoardColorChange(sessionId: string, color: string) {
    console.log("wb stroke change");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-color",
            stroke: color,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(
          JSON.stringify({
            event: "whiteBoard-color-change",
            payload: {
              strokeStyle: color,
            },
          })
        );
      }
    });
  }
  whiteBoardErase(sessionId: string) {
    console.log("wb erase");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-erase",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-erase" }));
      }
    });
  }
  whiteBoardClear(sessionId: string) {
    console.log("wb clear");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "board-clear",
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      if (user.userRole !== "admin") {
        user.socket.send(JSON.stringify({ event: "whiteBoard-clear" }));
      }
    });
  }

  message(sessionId: string, content: { user: string; text: string }) {
    console.log("chat");
    producer.send({
      topic: "events",
      messages: [
        {
          value: JSON.stringify({
            sessionId: sessionId,
            timeStamp: Date.now(),
            event: "message",
            sender: content.user,
            content: content.text,
          }),
        },
      ],
    });
    this.sessions.get(sessionId)?.forEach((user) => {
      user.socket.send(
        JSON.stringify({ event: "message", payload: { content: content } })
      );
    });
  }
  removeParticipant(participant: string, sessionId: string) {
    console.log("remove parti");

    this.sessions.get(sessionId)?.find((p) => {
      if (p.username === participant) {
        p.socket.send(JSON.stringify({ event: "removed" }));
        p.socket.close();
      }
    });
    this.sessions.set(
      sessionId,
      this.sessions
        .get(sessionId)
        ?.filter((user) => user.username !== participant) || []
    );
  }
  endClass(sessionId: string) {
    console.log("ended.");
    this.sessions.get(sessionId)?.find((p) => {
      if (p.userRole !== "admin") {
        p.socket.send(JSON.stringify({ event: "class-ended" }));
      }
      p.socket.close();
    });
    this.sessions.set(sessionId, []);
    console.log(this.sessions.get(sessionId));
  }
  joinRequest(sessionId: string, username: string, uniqueId: string) {
    this.sessions.get(sessionId)?.forEach((u) => {
      if (u.userRole === "admin") {
        u.socket.send(
          JSON.stringify({
            event: "join-request",
            payload: {
              user: username,
              uniqueId: uniqueId,
            },
          })
        );
      }
    });
  }
}
