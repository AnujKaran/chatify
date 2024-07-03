const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  receivedRequest: [
    {
      type: mongoose.Schema.Types.ObjectId,
      timestamp: { type: Date, default: Date.now },
      ref:'userModels'
    },
  ],

  friends: [
    {
      friendID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'userModels'
      },
      chatRoomID: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  groups:[ {
    type: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    ref:'chatRoomModels'
  },],
  status:{
    type:String,
    default:'online'
  }
});

const userModels = mongoose.model("userModels", userSchema);

module.exports = userModels;
