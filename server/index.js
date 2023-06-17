const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const router = require("./routes/userRoutes");

const app = express();
const socket = require("socket.io");
mongoose.set("strictQuery", true);
require("dotenv").config();

mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    app.use(express.json());
    app.use(cors());
    app.use("/api/auth", userRoutes);
    app.use("/api/messages", messageRoutes);
    app.use(router);

    const server = app.listen(3001, () => {
      console.log("🚀 Server is running on http://localhost:3001");
    });

    const io = socket(server, {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-receive", data.msg);
        }
      });
    });
  })
  .catch(() => console.log("Erro ao conectar no MongoDB 🙁"));
