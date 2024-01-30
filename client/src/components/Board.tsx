import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Socket, io } from "socket.io-client";
import { useBoardContext } from "../context/BoardContext";

const Board = ({ roomId }: { roomId?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {brushColor,brushSize} = useBoardContext()

  const [socket, setSocket] = useState<Socket | null>();
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight * 0.96,
  ]);

  useEffect(() => {
    (async () => {
      const newSocket = io("http://localhost:3000");
      setSocket(newSocket);
    })();

    const handleWindowResize = () => {
      // console.log([window.innerWidth, window.innerHeight]);
      setWindowSize([window.innerWidth * 0.8, window.innerHeight * 0.96]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      console.log(socket);
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
        console.log(data);
        // Create an image object from the data URL
        const image = new Image();
        image.src = data;

        const canvas = canvasRef.current as HTMLCanvasElement;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Draw the image onto the canvas
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
        };
      });
    }
  }, [roomId, socket]);

  useEffect(() => {
    // Variables to store drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      isDrawing = true;

      console.log(`drawing started`, brushColor, brushSize);
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    // Function to draw
    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }

      [lastX, lastY] = [e.offsetX, e.offsetY];
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
      isDrawing = false;
    };

    const canvas: HTMLCanvasElement | null =
      canvasRef.current as HTMLCanvasElement;
    const ctx = canvasRef.current?.getContext("2d");

    // Set initial drawing styles
    if (ctx) {
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    // Event listeners for drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseout", endDrawing);

    return () => {
      // Clean up event listeners when component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseout", endDrawing);
    };
  }, [roomId, brushColor, brushSize, socket]);

  return (
    <div className="shadow-md rounded-md overflow-hidden border-2 border-blue-300 m-4">
      <canvas
        ref={canvasRef}
        width={windowSize[0]}
        height={windowSize[1]}
        style={{ backgroundColor: "white" }}
      />
    </div>
  );
};

export default Board;
