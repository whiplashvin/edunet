import { WebSocketServer } from "ws";
import { User } from "./User";
import { Kafka } from "kafkajs";
import { createClient } from "redis";
import { SessionManager } from "./SessionManager";
import * as dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: 3001 });

const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_URL!],
});

const redisSubscriber = createClient({
  url: process.env.REDIS_URL,
});
const redisPublisher = createClient({
  url: process.env.REDIS_URL,
});

const producer = kafka.producer();
wss.on("connection", async (ws) => {
  const u = new User(ws);
  ws.onclose = () => {
    console.log(`${u.username} left.`);
    u.destroy();
  };
});

(async () => {
  await redisSubscriber.connect();
  redisSubscriber.on("error", (err) => console.log("Redis sub Error", err));
  await redisPublisher.connect();
  redisSubscriber.on("error", (err) => console.log("Redis pub Error", err));
  console.log("Redis connected");
  await producer.connect();
  console.log("kafka producer running.");
})()
  .then(async () => {
    while (true) {
      const res = await redisSubscriber.rPop("join-request");
      if (res) {
        const parsed = JSON.parse(res);
        SessionManager.getInstance().joinRequest(
          parsed.sessionId,
          parsed.username,
          parsed.uniqueId
        );
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
wss.on("listening", () => console.log("WebSocket running on port 3001"));
export { producer, redisPublisher };
