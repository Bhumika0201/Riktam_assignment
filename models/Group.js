const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.ObjectId;
const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Group name"],
      minLength: 5,
    },
    memberIds: {
      type: [ObjectId],
    },
    messageIds: {
      type: [ObjectId],
    },
    groupCreatedBy: ObjectId,
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
