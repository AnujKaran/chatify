const chatRoomModels = require("../Models/ChatRoomModel");
const userModels = require("../Models/UserModel");

//sending all users info
const sendAllUsers = async (req, res) => {
  try {
    const allUsers = await userModels.find();
    if (allUsers) {
      res.status(200).send(allUsers);
    }
  } catch (error) {
    res.status(404).send("error happend");
  }
};

// sending MyInfo
const sendMyInfo = async (req, res) => {
  try {
    const userId = req.id;
    // console.log("user id = ",userId)
    const myInfo = await userModels.findById(userId);
    console.log(myInfo)
    if (!myInfo) {
      // console.log('User not found')
      return res.status(400).send("Cookies missing :(");
    }
    return res.status(200).send(myInfo);
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

// send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.id;

    const friend = await userModels.findByIdAndUpdate(
      friendId,
      { $push: { receivedRequest: userId } },
      { new: true }
    );
    if (!friend) {
      return res.status(400).send("User not found");
    }

    return res.status(200).send("Friend request sent");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
// Add friend
const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.id;

    const user = await userModels.findById(userId);
    const friend = await userModels.findById(friendId);

    if (!user || !friend) {
      return res.status(400).send("User not found :(");
    }

    if (user.friends.some((temp) => temp.friendID == friendId)) {
      return res
        .status(400)
        .send(friend.name + " already exsits in your friends list. ");
    }
    const chatRoom = await chatRoomModels.create({
      participants: [userId, friendId],
    });
    user.friends.push({ friendID: friendId, chatRoomID: chatRoom._id });
    user.receivedRequest = user.receivedRequest.filter((id) => id != friendId);
    friend.friends.push({ friendID: userId, chatRoomID: chatRoom._id });

    const res1 = await user.save();
    const res2 = await friend.save();

    if (res1 && res2) {
      return res.status(200).send("Successfully added :)");
    }
    return res.status(400).send("Something bad happend");
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

//method for sendReceived requets to client
const sendReceivedRequets = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModels.findById(userId).populate("receivedRequest");

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // console.log(friendsRequets)
    return res.status(200).send(user.receivedRequest);
  } catch (error) {
    // console.log(error)
    return res.status(500).send("Internal server error");
  }
};

//method for remove friend request
const removeRequest = async (req, res) => {
  try {
    const { friendId } = req.body;

    const user = await userModels.findById(req.id);

    user.receivedRequest = user.receivedRequest.filter((id) => id != friendId);

    const res1 = await user.save();
    if (res1) {
      return res.status(200).send("Request removed");
    }
  } catch (error) {
    return res.status(502).send("Internal server error");
  }
};
//method for send friends to client
const sendFriends = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModels.findById(userId).populate("friends.friendID");

    return res.status(200).send(user.friends);
  } catch (error) {
    return res.status(500).send("Internal server errror");
  }
};

// method for getting friend messages
const getMessages = async(req,res)=>{
  try {
    
    const {chatRoomId} = req.params;
    
    const messages = (await chatRoomModels.findById(chatRoomId)).messages;
  //  console.log('messages - ',messages)
    if(messages){
      return res.status(200).send(messages)
    }
    return res.status(400).send("something bad happend :(")
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
}

module.exports = {
  sendAllUsers,
  sendMyInfo,
  addFriend,
  sendFriendRequest,
  sendReceivedRequets,
  sendFriends,
  removeRequest,
  getMessages,
  
};
