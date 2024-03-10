import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import { useBoardContext } from "../context/BoardContext";

const setCanvasSize = () => {
  return [window.innerWidth * 0.7, window.innerHeight * 0.8];
};

const Board = ({ roomId }: { roomId?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { setCanvasEl, saveCanvasHistory, toolType, brushColor, brushSize } =
    useBoardContext();

  const [socket, setSocket] = useState<Socket | null>();
  const [windowSize, setWindowSize] = useState(setCanvasSize());

  useEffect(() => {
    (async () => {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);
    })();

    const handleWindowResize = () => {
      setWindowSize(setCanvasSize);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    // console.log(socket);
    socket.on("connect", () => {
      socket.emit("join-room", {
        id: socket.id,
        roomId,
        message: "Joined a new User",
      });
    });
    socket.on("join-room", (message) => {
      console.log("joined");
      // if (socket.id === data.id) return;
      toast.success(message);
    });
    // Event listener for receiving canvas data from the socket
    socket.on("canvasImage", (data) => {
      // console.log(data);
      // Create an image object from the dataURL
      const image = new Image();
      image.src = data;

      const canvas = canvasRef.current as HTMLCanvasElement;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // Draw the image onto the canvas
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
    });
  }, [roomId, socket]);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;
    setCanvasEl(canvas);
    // Variables to store drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let snapshot: ImageData;
    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      // alert("drawing started")
      console.log(`drawing started`, brushColor, brushSize);
      if (e.type === "mousedown" && e instanceof MouseEvent) {
        [lastX, lastY] = [e.offsetX, e.offsetY];
      } else if (e.type === "touchstart" && e instanceof TouchEvent) {
        [lastX, lastY] = [e.touches[0].clientX, e.touches[0].clientY];
      }
      // Set initial drawing styles
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // copying canvas data & passing as snapshot value.. this avoids dragging the image
      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    // Function to draw
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !ctx) return;
      ctx.putImageData(snapshot, 0, 0);

      let x = 0,
        y = 0;
      if (e.type === "mousemove" && e instanceof MouseEvent) {
        (x = e.offsetX), (y = e.offsetY);
      } else if (e.type === "touchmove" && e instanceof TouchEvent) {
        (x = e.touches[0].clientX), (y = e.touches[0].clientY);
      }
      switch (toolType) {
        case "rectangle":
          drawRectangle(ctx, x, y);
          break;
        case "triangle":
          drawTriangle(ctx, x, y);
          break;
        case "circle":
          drawCircle(ctx, x, y);
          break;
        case "line":
          drawLine(ctx, x, y);
          break;
        case "eraser":
          erase(ctx, x, y);
          break;
        case "brush":
        default:
          drawBrush(ctx, x, y);
          break;
      }
    };

    // Function to end drawing
    const endDrawing = () => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const dataURL = canvas.toDataURL(); // Get the data URL of the canvas content

      // Send the dataURL or image data to the socket
      // console.log('drawing ended')
      if (socket) {
        socket.emit("canvasImage", { roomId, dataURL });
        console.log("drawing ended");
      }
      saveCanvasHistory();
      isDrawing = false;
    };

    function drawBrush(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    function drawRectangle(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ) {
      ctx.beginPath();
      ctx.strokeRect(x, y, lastX - x, lastY - y);
    }
    function drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.lineTo(lastX * 2 - x, y);
      ctx.closePath();
      ctx.stroke();
    }
    function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.beginPath();
      const radius = Math.sqrt((lastX - x) ** 2 + (lastY - y) ** 2);
      ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    function erase(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }

    // Event listeners for drawing from computer
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    // canvas.addEventListener("mouseout", endDrawing);

    // Event listeners for drawing from mobile
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", endDrawing);

    return () => {
      // Clean up event listeners when component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseout", endDrawing);

      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDrawing);
    };
  }, [roomId, toolType, brushColor, brushSize, socket]);

  return (
      <canvas
        ref={canvasRef}
        width={windowSize[0]}
        height={windowSize[1]}
        style={{ backgroundColor: "white" }}
      />
  );
};

export default Board;
