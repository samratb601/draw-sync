// src/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello from Server.....!");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

io.on("connection", function (socket) {
  console.log("Made a connection : " + socket.id);

  socket.on("join-room", (data) => {
    // console.log("join data:",data);
    socket.join(data.roomId);
    socket.broadcast.to(data.roomId).emit('join-room',
      "A new user joined"
    );
  })
  socket.on('canvasImage', (data) => {
    // console.log("roomID:",data.roomId)
    socket.broadcast.to(data.roomId).emit('canvasImage', data.dataURL);
  });
});

server.listen(3000, () => {
  console.log("Running at localhost:3000");
});

