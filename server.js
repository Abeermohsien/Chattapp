const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatingmess = require("./utils/messages");
const createAdapter = require("@socket.io/redis-adapter").createAdapter;
const redis = require("redis");
require("dotenv").config();
const { createClient } = redis;
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Seting  static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatApp Bot";
 

// returning when client connects
io.on("connection", (socket) => {
  console.log(io.of("/").adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcoming current user
    socket.emit("message", formatingmess(botName, "Welcome to Chatapp!"));

    // Broadcasting when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatingmess(botName, `${user.username} has joined the chat`)
      );

    // retruning users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listening for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatingmess(user.username, msg));
  });

  // retruning when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatingmess(botName, `${user.username} has left the chat`)
      );

      // returnin users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
