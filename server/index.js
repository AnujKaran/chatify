const dotEnv = require("dotenv").config();
const express = require("express");
const http = require("http");
require("./DB/MongoDB");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const app = express();
const { Server } = require("socket.io");
// middle wares

// app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization'
}));
app.use(express.json())
app.use(bodyParser.json());
const server = http.createServer(app);

const { signUpUser, loginUser } = require("./Controller/AuthController");
const { sendAllUsers, sendMyInfo } = require("./Controller/UserController");
const { LoginChecker } = require("./Validator/LoginChecker");
const { userRouter } = require("./Routes/userRoutes");
const chatRoomModels = require("./Models/ChatRoomModel");
const userModels = require("./Models/UserModel");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

const emailToSocketId = new Map();
io.on("connection", (socket) => {
  socket.on("MapEmailToSocketID", (email) => {
    emailToSocketId.set(email, socket.id);
  });

  // event to receive message from client-side
  socket.on("message", async (data) => {
    const { sender, receiver, msg, chatRoomId } = data;
    // console.log(data)
    const senderId = await userModels.findOne({ email: sender });

    const chatRoom = await chatRoomModels.findById(chatRoomId);
    // console.log(chatRoom)
    // console.log(msg);
    chatRoom.messages.push({ senderId: senderId, msg: msg });
    const res = await chatRoom.save();

    if (emailToSocketId.get(receiver)) {
      // console.log(receiver + " " + emailToSocketId.get(receiver));
      io.to(emailToSocketId.get(receiver)).emit("message", {
        senderId,
        msg,
      });
    }
  });

  // socket event for call
  socket.on("user-call", (data) => {
    const { receiverEmail } = data;
    // console.log(data)
    io.to(emailToSocketId.get(receiverEmail)).emit("incoming-call", data);
  });

  socket.on("call-accept", (data) => {
    const { callerEmail } = data;

    io.to(emailToSocketId.get(callerEmail)).emit("call-accept", data);
  });

  socket.on("hang-up", (data) => {
    io.to(emailToSocketId.get(data.callerEmail)).emit("hang-up", data);

    io.to(emailToSocketId.get(data.receiverEmail)).emit("hang-up", data);
  });
  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
  });
});

server.listen(9000, () => {
  console.log(`Server is running on port ${9000}`);
});

app.post("/signup", signUpUser);
app.post("/login", loginUser);
// Sending all users to the newly connected user
app.post("/getAllUsers", sendAllUsers);

app.use(LoginChecker); // Middleware for checking if a user is logged in or not
app.use("/user", userRouter);

app.post("/user/info", sendMyInfo);
