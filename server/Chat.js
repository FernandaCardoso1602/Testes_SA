const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let users = {};

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  socket.on("registerUser", (username) => {
    users[socket.id] = { id: socket.id, name: username };
    io.emit("updateUsers", Object.values(users));
  });

  socket.on("sendMessage", ({ message, to }) => {
    if (users[to]) {
      io.to(to).emit("receiveMessage", { message, from: users[socket.id].name });
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", Object.values(users));
  });
});

server.listen(3001, () => console.log("Servidor rodando na porta 3001"));
