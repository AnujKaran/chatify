const { logoutUser } = require("../Controller/AuthController");
const {
  sendAllUsers,
  sendFriendRequest,
  sendReceivedRequets,
  sendFriends,
  addFriend,
  removeRequest,
  getMessages,
} = require("../Controller/UserController");

const express = require("express");

const userRouter = express.Router();

userRouter.post("/friends", sendFriends);
userRouter.post("/allUsers", sendAllUsers);
userRouter.post("/ReceivedRequest", sendReceivedRequets);
userRouter.post("/removeRequest",removeRequest)
userRouter.post("/FriendRequest", sendFriendRequest);
userRouter.post("/addFriend",addFriend);
userRouter.post("/getMessages/:chatRoomId",getMessages)
userRouter.post("/logout",logoutUser)
// userRouter.get('/friends')

module.exports = { userRouter };
