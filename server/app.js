require("dotenv").config({
  path: "variables.env",
});

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const passport = require("passport");
const bodyParser = require("body-parser");
const moment = require("moment");
const http = require("http");
moment.locale("en");
const path = require("path");
const socketio = require("socket.io");

const PORT = process.env.PORT || 5000;

// lets require/import the mongodb native drivers.
const mongoose = require("mongoose");

mongoose.Promise = require("bluebird");

const UserRoutes = require("./routes/user_routes");
const AuthorizationRoutes = require("./routes/authorization_routes");

var app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { origins: "*:*" });

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080", // dev to prod
    //origin: "https://defensehere.herokuapp.com", // dev to prod
  })
);

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: false }));
const jsonParser = bodyParser.json();
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

require("./routes/passport")(passport);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Out custom routes
app.use("/", UserRoutes);
app.use("/", AuthorizationRoutes);

var cons = require("consolidate");
app.engine("html", cons.swig);
app.use(express.static(__dirname + "/views/dist"));
app.set("views", __dirname + "/views/dist");
app.set("view engine", "html");

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post(
  "/login/local",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/fail",
  })
);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // Listen for chat message
    socket.on("chatMessage", (msg) => {
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });
  });

  // Runs when client discoenncts
  socket.on("disconnect", () => {
    io.emit("message", `Some has left the chat`);
  });

  socket.on("connection", () => {
    io.emit("message", `Someone connected`);
  });
});

server.listen(PORT, () =>
  console.log(`Teknasyon web listening on port ${PORT}!`)
);
