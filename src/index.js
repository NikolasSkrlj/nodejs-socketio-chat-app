const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server); // zbog ovoga treba drugacije kreirat server pomocu http modula

const {
  generateMessage,
  generateLocationMessage,
} = require("../src/utils/messages");

const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require("../src/utils/users");

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors());

const port = process.env.PORT || 3000;

io.on("connection", (socket) => {
  // socket je objekt i sadrzi info o konekciji
  //console.log("new websocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    // s ovime se kreira logika soba
    socket.join(room);

    socket.emit("recieveMessage", generateMessage("Admin", "Welcome!"));
    //salje se poruka svima u sobi osim sebe
    socket.broadcast
      .to(user.room)
      .emit(
        "recieveMessage",
        generateMessage(
          user.username,
          `User ${user.username} has joined the room!`
        )
      ); // salje svim konekcijama osim trenutne (socket varijabla)

    //salje se svima popis svih usera
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
    //socket.emit
    //io.emit
    //socket.broadcast.emit
  });
  //callback je uvijek zadnji argument i sluzi za potvrdit da je poruka primljena
  socket.on("sendMessage", (message, callback) => {
    //console.log(message);
    const user = getUser(socket.id);

    const filter = new Filter();
    if (filter.isProfane(message.text)) {
      return callback("Profanity not allowed");
    }
    io.to(user.room).emit(
      "recieveMessage",
      generateMessage(user.username, message)
    ); //salje svima

    callback(); // daje acknowledgment klijentu da je poslana poruka svima
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${coords.lat},${coords.long}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "recieveMessage",
        generateMessage("Admin", `User ${user.username} has left`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});
