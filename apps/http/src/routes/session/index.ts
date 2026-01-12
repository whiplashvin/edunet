import express from "express";
import { generateSessionId, generateTaskId } from "../../../utils/utils";
import { db } from "@repo/db/db";
import { adminMiddleware } from "../../middleware/admin";
import multer from "multer";
import { redisClient, redisPublisher, redisSubscriber } from "../..";
import { RoomServiceClient, AccessToken } from "livekit-server-sdk";
import { userMiddleware } from "../../middleware/user";

require("dotenv").config();

const devkey = process.env.LIVE_KIT_KEY;
const secret = process.env.LIVE_KIT_SECRET;

const route = express();
const livekitHost = process.env.LIVEKIT_URL!;

const svc = new RoomServiceClient(livekitHost, devkey, secret);

async function adminVideoToken(roomName: string, participantName: string) {
  const at = new AccessToken(devkey, secret, {
    identity: participantName,
    ttl: "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  return await at.toJwt();
}
async function userVideoToken(roomName: string, participantName: string) {
  const at = new AccessToken(devkey, secret, {
    identity: participantName,
    ttl: "10m",
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canPublishData: false,
    canSubscribe: true,
  });
  return await at.toJwt();
}
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.post("/", adminMiddleware, async (req, res) => {
  const { title } = req.body;
  const sessionId = generateSessionId();
  await db.session.create({
    data: {
      sessionId,
      title,
    },
  });
  res.status(200).json({
    sessionId,
  });
});
route.get("/all", adminMiddleware, async (req, res) => {
  const allSessions = await db.session.findMany();
  res.status(200).json({ allSessions });
});
route.get("/all-active", userMiddleware, async (req, res) => {
  const allSessions = await db.session.findMany({
    where: { status: "active" },
  });
  res.status(200).json({ allSessions });
});

route.post("/:sessionId/start", adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  const jwtToken = req.jwtToken;

  if (!sessionId) {
    return;
  }
  const session = await db.session.update({
    where: { sessionId: sessionId as string },
    data: { status: "active" },
  });
  const opts = {
    name: sessionId as string,
    emptyTimeout: 10 * 60,
    maxParticipants: 20,
    canPublish: true,
    canSubscribe: true,
  };
  const room = await svc.createRoom(opts);
  res.status(200).json({
    message: "Session started successfully.",
    jwtToken,
    sessionTitle: session.title,
    room,
  });
});

route.get("/:sessionId/videoToken", userMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  let token: string;
  const user = await db.user.findFirst({ where: { id: req.userId } });
  if (!sessionId) {
    return;
  }
  if (!user) {
    return;
  }
  if (user.role === "admin") {
    token = await adminVideoToken(sessionId as string, user.username);
  } else {
    token = await userVideoToken(sessionId as string, user.username);
  }

  res.status(200).json({
    message: "Video started successfully.",
    token,
  });
});

route.post("/:sessionId/join", userMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return;
  }
  const jwtToken = req.jwtToken;
  const user = await db.user.findFirst({ where: { id: req.userId } });
  if (!user) {
    return;
  }
  const session = await db.session.findUnique({
    where: { sessionId: sessionId as string },
  });
  if (!session) {
    res.status(400).json({ message: "No session found with the sessionId" });
    return;
  }

  const uniqueId = generateTaskId();
  new Promise<void>((resolve, reject) => {
    redisSubscriber.subscribe(uniqueId, (message) => {
      const parsed = JSON.parse(message);

      if (parsed.permission === "allowed") {
        resolve();
      } else {
        reject();
      }
    });
    redisPublisher.lPush(
      "join-request",
      JSON.stringify({
        username: user.username,
        sessionId: sessionId,
        uniqueId,
      })
    );
  })
    .then(async () => {
      const latestEvent = await db.currentRoomState.findFirst({
        where: {
          session_Id: session.sessionId,
        },
        orderBy: {
          epoch: "desc",
        },
      });
      console.log(latestEvent);
      const correspondingPayload = await db.payload.findMany({
        where: { currRoomStateId: latestEvent?.id },
        orderBy: {
          epoch: "asc",
        },
        select: {
          adminHeight: true,
          adminWidth: true,
          imgUrl: true,
          x: true,
          y: true,
          currPage: true,
          event: true,
          stroke: true,
        },
      });
      console.log(correspondingPayload);
      res.status(200).json({
        message: "Session joined successfully.",
        jwtToken,
        sessionTitle: session.title,
        currentState: {
          state: latestEvent?.event,
          payload: correspondingPayload,
        },
      });
    })
    .catch(() => {
      res.status(403).json({ message: "Admin did not allow you to join." });
    });
});

route.post("/:sessionId/end", adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return;
  }
  await db.session.update({
    where: {
      sessionId: sessionId as string,
    },
    data: {
      status: "inactive",
    },
  });

  svc.deleteRoom(sessionId as string);
  res.status(200).json({ message: "Session ended successfully" });
});

route.post("/:sessionId/slides/pdf", upload.single("file"), (req, res) => {
  const { sessionId } = req.params;
  const file = req.file;
  const taskId = generateTaskId();
  const payload = {
    sessionId,
    file,
    taskId,
  };
  redisClient.lPush("pdfUpload", JSON.stringify(payload));
  res.status(200).json({ message: "Image uploading", taskId });
});

route.get("/task/:taskId", adminMiddleware, async (req, res) => {
  const { taskId } = req.params;

  try {
    const images = await db.image.findMany({
      where: { taskId: taskId as string },
    });

    if (images.length > 0) {
      res.status(200).json({ images, status: "completed" });
      return;
    } else {
      res.status(200).json({ status: "in_progress" });
      return;
    }
  } catch (err) {
    res.status(500).json({ status: "failed", error: err });
    return;
  }
});

route.get("/:sessionId/participants", adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return;
  }
  const participants = await svc.listParticipants(sessionId as string);
  res.status(200).json({ participants });
});
route.post(
  "/:sessionId/participant/remove",
  adminMiddleware,
  async (req, res) => {
    const { sessionId } = req.params;
    if (!sessionId) {
      return;
    }
    const { identity } = req.body;
    const removed = await svc.removeParticipant(sessionId as string, identity);
    res.status(200).json({ removed });
  }
);
route.get("/:sessionId/chat", userMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  if (!sessionId) {
    return;
  }
  const chat = await db.chat.findMany({
    where: { session_Id: sessionId as string },
    orderBy: { epoch: "asc" },
    select: {
      sender: true,
      content: true,
    },
  });
  res.status(200).json({ chat });
});
export { route as sessionRoute };
