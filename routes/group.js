const express = require("express");

const router = express.Router();
const {
  createGroup,
  deleteGroup,
  addMembers,
  getAllGroups,
  sendMessage,
  likeMessage,
} = require("../controllers/group");

router.route("/").post(createGroup).get(getAllGroups);
router.route("/:grpid").delete(deleteGroup);
router.route("/add-member/:grpid").post(addMembers);
router.route("/:grpid/send-message").post(sendMessage);
router.route("/:grpid/:msgid/like").get(likeMessage);

module.exports = router;
