const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Please send message text"],
    },
    senderId: {
      type: ObjectId,
      required: true,
    },
    groupId: {
      type: ObjectId,
      required: true,
    },
    usersLiked: {
      type: [ObjectId],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Message", MessageSchema);
