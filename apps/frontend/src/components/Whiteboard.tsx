import React, { useEffect, useRef, useState } from "react";
import { socket, toDisplay, whiteBoardState } from "../recoil";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import WhiteBoardControls from "./WhiteBoardControls";
import { userRole } from "../recoil";
import { useParams } from "react-router-dom";

// function Whiteboard() {
//   const CanvasRef = useRef<HTMLCanvasElement | null>(null);
//   const ContextRef = useRef<CanvasRenderingContext2D | null>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState("#343a40");
//   const [action, setAction] = useState<"draw" | "erase" | null>(null);
//   const Socket = useRecoilValue(socket);
//   const Role = useRecoilValue(userRole);
//   const { sessionId } = useParams();
//   const setToDisplay = useSetRecoilState(toDisplay);
//   const [WhiteBoardState, setWhiteBoardState] = useRecoilState(whiteBoardState);

//   useEffect(() => {
//     const canvas = CanvasRef.current;
//     if (!canvas) return;

//     const dpr = window.devicePixelRatio || 1;
//     const rect = canvas.getBoundingClientRect();

//     canvas.width = rect.width * dpr;
//     canvas.height = rect.height * dpr;

//     // canvas.height = canvas.offsetHeight;
//     // canvas.width = canvas.offsetWidth;

//     const ctx = canvas.getContext("2d");
//     if (ctx) {
//       ctx.lineCap = "round";
//       ctx.lineJoin = "round";
//       ContextRef.current = ctx;
//       ctx.scale(dpr, dpr);
//     }

//     if (WhiteBoardState.length > 0) {
//       const canvas = CanvasRef.current;
//       if (!canvas) return;

//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;

//       const { height, width } = canvas.getBoundingClientRect();

//       let xStart: number;
//       let yStart: number;
//       let xTimes: number;
//       let yTimes: number;

//       if (WhiteBoardState[1].event === "board-color") {
//         xTimes = width / WhiteBoardState[2].adminWidth;
//         yTimes = height / WhiteBoardState[2].adminHeight;
//         xStart = WhiteBoardState[2].x * xTimes;
//         yStart = WhiteBoardState[2].y * yTimes;

//         let color = "";
//         let lineWidth = 2;
//         for (let i = 1; i < WhiteBoardState.length; i++) {
//           console.log(WhiteBoardState[i].event);
//           switch (WhiteBoardState[i].event) {
//             case "board-clear":
//               ctx.clearRect(0, 0, canvas.width, canvas.height);
//               break;
//             case "board-erase":
//               color = "#d4d4d4";
//               lineWidth = 20;
//               break;
//             case "board-draw":
//               color = "#343a40";
//               lineWidth = 2;
//               break;
//             case "board-color":
//               color = WhiteBoardState[i].stroke;
//               break;
//             case "mouse-move":
//               {
//                 const newX = xTimes * WhiteBoardState[i].x;
//                 const newY = yTimes * WhiteBoardState[i].y;
//                 ctx.beginPath();
//                 ctx.moveTo(xStart, yStart);
//                 ctx.lineTo(newX, newY);
//                 ctx.strokeStyle = color;
//                 ctx.lineWidth = lineWidth;
//                 ctx.stroke();
//                 xStart = newX;
//                 yStart = newY;
//               }
//               break;
//             case "mouse-up":
//               console.log("Mouse up!");
//               // isDrawing = false;
//               break;
//             default:
//               break;
//           }
//         }
//       } else {
//         xTimes = width / WhiteBoardState[1].adminWidth;
//         yTimes = height / WhiteBoardState[1].adminHeight;
//         xStart = WhiteBoardState[1].x * xTimes;
//         yStart = WhiteBoardState[1].y * yTimes;

//         let color = "#343a40";
//         let lineWidth = 2;
//         let isDrawing = false;

//         for (let i = 1; i < WhiteBoardState.length; i++) {
//           console.log(WhiteBoardState[i].event);
//           switch (WhiteBoardState[i].event) {
//             case "board-clear":
//               ctx.clearRect(0, 0, canvas.width, canvas.height);
//               break;
//             case "board-erase":
//               isDrawing = true;
//               color = "#d4d4d4";
//               lineWidth = 20;
//               break;
//             case "board-draw":
//               isDrawing = true;
//               color = "#343a40";
//               lineWidth = 2;
//               break;
//             case "board-color":
//               color = WhiteBoardState[i].stroke;
//               break;
//             case "mouse-down":
//               isDrawing = true;
//               xStart = xTimes * WhiteBoardState[i].x;
//               yStart = yTimes * WhiteBoardState[i].y;

//               ctx.beginPath();
//               ctx.moveTo(xStart, yStart);
//               break;
//               break;
//             case "mouse-move":
//               if (!isDrawing) {
//                 break;
//               } else {
//                 const newX = xTimes * WhiteBoardState[i].x;
//                 const newY = yTimes * WhiteBoardState[i].y;
//                 ctx.beginPath();
//                 ctx.moveTo(xStart, yStart);
//                 ctx.lineTo(newX, newY);
//                 ctx.strokeStyle = color;
//                 ctx.lineWidth = lineWidth;
//                 ctx.stroke();
//                 xStart = newX;
//                 yStart = newY;
//               }
//               break;
//             case "mouse-up":
//               isDrawing = false;
//               ctx.closePath();
//               break;
//             default:
//               break;
//           }
//         }
//       }
//     }

//     function handleEvents(event: MessageEvent) {
//       const parsed = JSON.parse(event.data);
//       const canvas = CanvasRef.current;
//       const ctx = canvas?.getContext("2d");
//       const { height, width } = canvas!.getBoundingClientRect();

//       const dpr = window.devicePixelRatio || 1;
//       // const rect = canvas.getBoundingClientRect();

//       // canvas.width = rect.width * dpr;
//       // canvas.height = rect.height * dpr;

//       if (!ctx) return;

//       switch (parsed.event) {
//         case "whiteBoard-draw":
//           setAction("draw");
//           ctx.strokeStyle = "#343a40";
//           ctx.lineWidth = 2;
//           break;
//         case "start-drawing-board": {
//           const xTimes =
//             Number(width * dpr) / Number(parsed.payload.adminWidth);
//           const yTimes =
//             Number(height * dpr) / Number(parsed.payload.adminHeight);
//           const newX = xTimes * parsed.payload.x;
//           const newY = yTimes * parsed.payload.y;
//           ctx.beginPath();
//           ctx.moveTo(newX, newY);
//           break;
//         }
//         case "move-drawing-board": {
//           const xTimes = Number(width) / Number(parsed.payload.adminWidth);
//           const yTimes = Number(height) / Number(parsed.payload.adminHeight);
//           const newX = xTimes * parsed.payload.x;
//           const newY = yTimes * parsed.payload.y;
//           ctx.lineTo(newX, newY);
//           ctx.stroke();
//           break;
//         }
//         case "whiteBoard-color-change":
//           ctx.strokeStyle = parsed.payload.strokeStyle;
//           break;
//         case "whiteBoard-erase":
//           ctx.strokeStyle = "#d4d4d4";
//           ctx.lineWidth = 20;
//           break;
//         case "whiteBoard-clear":
//           clearCanvas();
//           break;
//         case "whiteBoard-close":
//           setWhiteBoardState([]);
//           setToDisplay("video");
//           break;
//         default:
//           break;
//       }
//     }

//     Socket?.addEventListener("message", handleEvents);

//     return () => {
//       Socket?.removeEventListener("message", handleEvents);
//     };
//   }, [Socket, setToDisplay, WhiteBoardState, setWhiteBoardState]);

//   function start(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
//     const canvas = CanvasRef.current;
//     const ctx = ContextRef.current;
//     if (!canvas || !ctx) return;

//     setIsDrawing(true);
//     const { left, top, height, width } = canvas.getBoundingClientRect();
//     const x = e.clientX - left;
//     const y = e.clientY - top;
//     ctx.beginPath();
//     ctx.moveTo(x, y);
//     Socket?.send(
//       JSON.stringify({
//         event: "start-drawing-board",
//         payload: {
//           sessionId: sessionId,
//           x: x,
//           y: y,
//           adminHeight: height,
//           adminWidth: width,
//         },
//       })
//     );
//   }
//   function draw(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
//     if (!isDrawing || action === null) return;

//     const canvas = CanvasRef.current;
//     const ctx = ContextRef.current;
//     if (!canvas || !ctx) return;
//     const { left, top, height, width } = canvas.getBoundingClientRect();
//     const x = e.clientX - left;
//     const y = e.clientY - top;
//     ctx.lineTo(x, y);
//     ctx.strokeStyle = color;
//     if (action === "erase") {
//       ctx.lineWidth = 20;
//     } else {
//       ctx.lineWidth = 2;
//     }
//     ctx.stroke();
//     Socket?.send(
//       JSON.stringify({
//         event: "move-drawing-board",
//         payload: {
//           sessionId: sessionId,
//           x: x,
//           y: y,
//           adminHeight: height,
//           adminWidth: width,
//         },
//       })
//     );
//   }

//   function stop() {
//     setIsDrawing(false);

//     Socket?.send(
//       JSON.stringify({
//         event: "stop-drawing-board",
//         payload: {
//           sessionId,
//         },
//       })
//     );
//   }

//   const clearCanvas = () => {
//     const canvas = CanvasRef.current;
//     const ctx = canvas?.getContext("2d");

//     if (!canvas || !ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   return (
//     <div className="flex-1 min-h-0">
//       <canvas
//         className="h-[90%] w-full bg-neutral-300 rounded-xl cursor-crosshair mb-4"
//         ref={CanvasRef}
//         onMouseDown={(e) => start(e)}
//         onMouseMove={(e) => draw(e)}
//         onMouseUp={stop}
//         onMouseLeave={stop}
//       />
//       {Role === "admin" && (
//         <WhiteBoardControls
//           action={action}
//           setAction={setAction}
//           setColor={setColor}
//           clearCanvas={clearCanvas}
//         />
//       )}
//     </div>
//   );
// }

// export default Whiteboard;

import { getStroke } from "perfect-freehand";

const average = (a: number, b: number) => (a + b) / 2;
function getSvgPathFromStroke(points: number[][], closed = true) {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}

type Point = [number, number];
type Stroke = {
  points: Point[];
  color: string;
  size: number;
};

function Whiteboard() {
  const CanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#343a40");
  const [action, setAction] = useState<"draw" | "erase" | null>(null);
  const Socket = useRecoilValue(socket);
  const Role = useRecoilValue(userRole);
  const { sessionId } = useParams();
  const setToDisplay = useSetRecoilState(toDisplay);
  const [WhiteBoardState, setWhiteBoardState] = useRecoilState(whiteBoardState);

  const [points, setPoints] = React.useState<Point[]>([]);
  const [strokes, setStrokes] = React.useState<Stroke[]>([]);
  const [strokeWidth, setStrokeWidth] = useState(7);

  const boardReconstructBuffer = useRef<Point[]>([]);
  const boardReconstruct = useRef<Stroke[]>([]);
  const boardReconstructColor = useRef<string>("#343a40");
  const boardReconstructStroke = useRef<number>(7);

  useEffect(() => {
    if (WhiteBoardState.length > 0) {
      console.log("Inside if block");
      const canvas = CanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { height, width } = canvas.getBoundingClientRect();

      let xStart: number;
      let yStart: number;
      let xTimes: number;
      let yTimes: number;

      if (WhiteBoardState[1].event === "board-color") {
        xTimes = width / WhiteBoardState[2].adminWidth;
        yTimes = height / WhiteBoardState[2].adminHeight;
        xStart = WhiteBoardState[2].x * xTimes;
        yStart = WhiteBoardState[2].y * yTimes;
        let color = "";
        let lineWidth = 2;
        for (let i = 1; i < WhiteBoardState.length; i++) {
          switch (WhiteBoardState[i].event) {
            case "board-clear":
              // ctx.clearRect(0, 0, canvas.width, canvas.height);
              // setTemp([]);
              break;
            case "board-erase":
              color = "#d4d4d4";
              lineWidth = 20;
              break;
            case "board-draw":
              color = "#343a40";
              lineWidth = 2;
              break;
            case "board-color":
              color = WhiteBoardState[i].stroke;
              break;
            case "mouse-move":
              {
                const newX = xTimes * WhiteBoardState[i].x;
                const newY = yTimes * WhiteBoardState[i].y;
                ctx.beginPath();
                ctx.moveTo(xStart, yStart);
                ctx.lineTo(newX, newY);
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
                xStart = newX;
                yStart = newY;
              }
              break;
            case "mouse-up":
              console.log("Mouse up!");
              // isDrawing = false;
              break;
            default:
              break;
          }
        }
      } else {
        xTimes = width / WhiteBoardState[1].adminWidth;
        yTimes = height / WhiteBoardState[1].adminHeight;
        xStart = WhiteBoardState[1].x * xTimes;
        yStart = WhiteBoardState[1].y * yTimes;
        let isDrawing = false;

        for (let i = 1; i < WhiteBoardState.length; i++) {
          switch (WhiteBoardState[i].event) {
            case "board-clear":
              boardReconstructBuffer.current = [];
              boardReconstruct.current = [];
              break;
            case "board-erase":
              isDrawing = true;
              boardReconstructColor.current = "#f5faff";
              boardReconstructStroke.current = 14;
              break;
            case "board-draw":
              isDrawing = true;
              boardReconstructColor.current = "#343a40";
              boardReconstructStroke.current = 7;
              break;
            case "board-color":
              boardReconstructColor.current = WhiteBoardState[i].stroke;
              boardReconstructStroke.current = 7;
              break;
            case "mouse-down":
              isDrawing = true;
              xStart = xTimes * WhiteBoardState[i].x;
              yStart = yTimes * WhiteBoardState[i].y;
              boardReconstructBuffer.current.push([xStart, yStart]);
              break;
            case "mouse-move":
              if (!isDrawing) {
                break;
              } else {
                const newX = xTimes * WhiteBoardState[i].x;
                const newY = yTimes * WhiteBoardState[i].y;
                boardReconstructBuffer.current.push([newX, newY]);
              }
              break;
            case "mouse-up":
              isDrawing = false;
              boardReconstruct.current.push({
                points: boardReconstructBuffer.current,
                size: boardReconstructStroke.current,
                color: boardReconstructColor.current,
              });
              boardReconstructBuffer.current = [];
              break;
            default:
              break;
          }
        }
      }
    }
  }, [WhiteBoardState]);

  useEffect(() => {
    const canvas = CanvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ContextRef.current = ctx;
      ctx.scale(dpr, dpr);
    }

    for (const t of boardReconstruct.current) {
      const stroke = getStroke(t.points, {
        size: t.size,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });

      const path = new Path2D(getSvgPathFromStroke(stroke));
      ctx!.fillStyle = t.color;
      ctx!.fill(path);
    }

    for (const s of strokes) {
      const stroke = getStroke(s.points, {
        size: s.size,
        thinning: 0.5,
        smoothing: 0.5,
        streamline: 0.5,
      });

      const path = new Path2D(getSvgPathFromStroke(stroke));
      ctx!.fillStyle = s.color;
      ctx!.fill(path);
    }

    const stroke = getStroke(points, {
      size: strokeWidth,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
    });

    const path = new Path2D(getSvgPathFromStroke(stroke));
    ctx!.fillStyle = color;
    ctx!.fill(path);

    function handleEvents(event: MessageEvent) {
      const parsed = JSON.parse(event.data);
      const canvas = CanvasRef.current;
      const ctx = canvas?.getContext("2d");
      const { height, width } = canvas!.getBoundingClientRect();
      if (!ctx) return;
      switch (parsed.event) {
        case "whiteBoard-draw":
          setAction("draw");
          setColor("#343a40");
          setStrokeWidth(7);
          break;
        case "start-drawing-board": {
          const xTimes = Number(width) / Number(parsed.payload.adminWidth);
          const yTimes = Number(height) / Number(parsed.payload.adminHeight);
          const newX = xTimes * parsed.payload.x;
          const newY = yTimes * parsed.payload.y;
          setPoints([[newX, newY]]);
          break;
        }
        case "move-drawing-board": {
          const xTimes = Number(width) / Number(parsed.payload.adminWidth);
          const yTimes = Number(height) / Number(parsed.payload.adminHeight);
          const newX = xTimes * parsed.payload.x;
          const newY = yTimes * parsed.payload.y;
          setPoints((prev) => [...prev, [newX, newY]]);
          break;
        }
        case "mouse-up":
          setIsDrawing(false);
          setStrokes((prev) => [...prev, { points, color, size: strokeWidth }]);
          setPoints([]);
          break;
        case "whiteBoard-color-change":
          setColor(parsed.payload.strokeStyle);
          break;
        case "whiteBoard-erase":
          setColor("#f5faff");
          setStrokeWidth(14);
          break;
        case "whiteBoard-clear":
          clearCanvas();
          break;
        case "whiteBoard-close":
          setWhiteBoardState([]);
          setToDisplay("video");
          break;
        default:
          break;
      }
    }

    Socket?.addEventListener("message", handleEvents);
    return () => {
      Socket?.removeEventListener("message", handleEvents);
    };
  }, [
    Socket,
    setToDisplay,
    WhiteBoardState,
    setWhiteBoardState,
    color,
    points,
    strokes,
    strokeWidth,
  ]);

  function start(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (Role !== "admin") return;

    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;

    setIsDrawing(true);
    const { left, top, height, width } = canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPoints([[x, y]]);
    Socket?.send(
      JSON.stringify({
        event: "start-drawing-board",
        payload: {
          sessionId: sessionId,
          x: x,
          y: y,
          adminHeight: height,
          adminWidth: width,
        },
      })
    );
  }
  function draw(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isDrawing || action === null) return;
    if (Role !== "admin") return;
    const canvas = CanvasRef.current;
    const ctx = ContextRef.current;
    if (!canvas || !ctx) return;
    const { left, top, height, width } = canvas.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPoints((prev) => [...prev, [x, y]]);
    Socket?.send(
      JSON.stringify({
        event: "move-drawing-board",
        payload: {
          sessionId: sessionId,
          x: x,
          y: y,
          adminHeight: height,
          adminWidth: width,
        },
      })
    );
  }
  const clearCanvas = () => {
    setStrokes([]);
    boardReconstructBuffer.current = [];
    boardReconstruct.current = [];
    ContextRef.current?.clearRect(
      0,
      0,
      CanvasRef.current!.width,
      CanvasRef.current!.height
    );
  };
  function handlePointerUp() {
    if (!points.length) return;
    setStrokes((prev) => [...prev, { points, color, size: strokeWidth }]);
    setPoints([]);
    setIsDrawing(false);
    Socket?.send(
      JSON.stringify({
        event: "stop-drawing-board",
        payload: {
          sessionId,
        },
      })
    );
  }
  return (
    <div className="flex-1 min-h-0">
      <canvas
        className={`${Role === "admin" ? "h-[90%]" : "h-[95%]"} w-full bg-[#f5faff] rounded-xl cursor-crosshair mb-4`}
        ref={CanvasRef}
        onMouseDown={(e) => start(e)}
        onMouseMove={(e) => draw(e)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
      />
      {Role === "admin" && (
        <WhiteBoardControls
          action={action}
          setAction={setAction}
          setColor={setColor}
          clearCanvas={clearCanvas}
          setStrokeWidth={setStrokeWidth}
        />
      )}
    </div>
  );
}

export default Whiteboard;
