const mongoose = require("mongoose");
const Group = require("../models/Group");
const Message = require("../models/Message");
const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

/**
 * This Function creates group
 * @param {*} req
 * @param {*} res
 */
const createGroup = async (req, res) => {
  let obj = {
    name: req.body.name,
    groupCreatedBy: req.user.userId,
    memberIds: [req.user.userId],
  };
  await Group.create(obj);
  res.status(StatusCodes.CREATED).json({ msg: "Group Created Successfully" });
};

/**
 * This Function deletes group based on grpId provided
 * @param {*} req
 * @param {*} res
 */

const deleteGroup = async (req, res) => {
  const grpId = new mongoose.Types.ObjectId(req.params.grpid);
  let group = await Group.findOne({ _id: grpId });
  if (!group) throw new BadRequestError("Please check group id");
  let msgIds = group.messageIds;
  //delete messages with message ids saved in group
  await Message.deleteMany({ _id: { $in: msgIds } });
  await Group.findOneAndDelete({ _id: grpId });
  res.status(StatusCodes.CREATED).json({ msg: "Group Deleted" });
  //delete messages with message ids saved in group
};

/**
 * Adds user Id to the group object in document
 * @param {*} req
 * @param {*} res
 */
const addMembers = async (req, res) => {
  const grpId = new mongoose.Types.ObjectId(req.params.grpid);
  const emails = req.body.emails || [];
  //fetch user ids from email

  let userIds = await User.find({ email: { $in: emails } });
  userIds = userIds.map((user) => user._id);

  if (userIds.length != emails.length)
    throw new BadRequestError(
      "Please check emails, add user if user is not present"
    );

  let group = await Group.findOne({ _id: grpId });
  if (!group) throw new BadRequestError("Please check group id");
  let uniqueIds = getUniqueIds(group.memberIds, userIds);

  await Group.updateOne({ _id: grpId }, { memberIds: uniqueIds });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Group Users added Successfully Successfully" });
};

/**
 * Gets details of all groups with messages,likes etc
 * @param {*} req
 * @param {*} res
 */
const getAllGroups = async (req, res) => {
  let groups = await Group.find();
  let messages = await Message.find();

  //get all users
  let allUsers = [];
  messages.forEach((msg) => {
    allUsers = new Set([
      ...allUsers,
      ...getUniqueIds(msg.usersLiked, [msg.senderId]),
    ]);
  });
  groups.forEach((group) => {
    allUsers = new Set([
      ...allUsers,
      ...getUniqueIds(group.memberIds, [group.groupCreatedBy]),
    ]);
  });
  let allUserIds = getUniqueIds(allUsers, []);

  //make hash map for user
  const userMap = {};
  let userDetails = await User.find({ _id: { $in: allUserIds } });
  userDetails.forEach((val) => {
    userMap[val._id] = val.email;
  });

  //make hash map for msg
  const msgMap = {};

  messages.forEach((msg) => {
    let msgObj = {
      text: msg.text,
      usersLiked: convertEmailArr(msg.usersLiked, userMap),
      senderId: userMap[msg.senderId],
      likeCount: msg.usersLiked.length,
    };
    msgMap[msg.groupId] = msgObj;
  });
  let groupsUpdated = [];
  groups.forEach((val) => {
    let obj = {
      members: convertEmailArr(val.memberIds, userMap),
      messages: msgMap[val._id] || [],
      groupCreatedBy: userMap[val.groupCreatedBy],
      name: val.name,
    };
    groupsUpdated.push(obj);
  });
  res.status(StatusCodes.CREATED).json({ groupDetails: groupsUpdated });
};

/**
 * This function is responsible for sending message in a group keeps tet in the message documenent and updates messageId in group gdocument
 * @param {*} req
 * @param {*} res
 */
const sendMessage = async (req, res) => {
  const grpId = new mongoose.Types.ObjectId(req.params.grpid);

  let group = await Group.findOne({ _id: grpId });
  if (!group) throw new BadRequestError("Please check group id");
  let msgObj = {
    text: req.body.text,
    senderId: req.user.userId,
    groupId: req.params.grpid,
  };
  const msg = await Message.create(msgObj);
  //get Message Id and update message id in group
  const combinedMsgArray = [...group.messageIds, msg._id];
  await Group.updateOne({ _id: grpId }, { messageIds: combinedMsgArray });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Message sent successfuly in ${group.name}` });
};

/**
 * This function stores user id of user liked in message document
 * @param {*} req
 * @param {*} res
 */

const likeMessage = async (req, res) => {
  const grpId = new mongoose.Types.ObjectId(req.params.grpid);

  let group = await Group.findOne({ _id: grpId });
  const msgId = new mongoose.Types.ObjectId(req.params.msgid);

  let msg = await Message.findOne({ _id: msgId });
  if (!group || !msg)
    throw new BadRequestError("Please check group id & message id");

  if (msg.usersLiked.includes(req.user.userId))
    throw new BadRequestError("You already liked message");
  let uniqueIds = getUniqueIds(msg.usersLiked, [req.user.userId]);
  await Message.updateOne({ _id: msgId }, { usersLiked: uniqueIds });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `you liked message ${msg.text}` });
};

function getUniqueIds(arr1, arr2) {
  const combinedArray = [...arr1, ...arr2];
  let uniqueIds = Array.from(new Set(combinedArray.map(JSON.stringify)));
  uniqueIds = uniqueIds.map(
    (id) => new mongoose.Types.ObjectId(JSON.parse(id))
  );
  return uniqueIds;
}

function convertEmailArr(idArr, map) {
  return idArr.map((val) => map[val]);
}

module.exports = {
  createGroup,
  deleteGroup,
  addMembers,
  getAllGroups,
  sendMessage,
  likeMessage,
};
