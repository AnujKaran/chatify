const mongoose = require("mongoose");

const chatRoomSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "userModels" }],
  messages: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModels",
       
      },
      msg: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  chatType:{type:String, default:'single'},
  name:{type:String}
});
const chatRoomModels = mongoose.model('chatRoomModels',chatRoomSchema)
module.exports = chatRoomModels