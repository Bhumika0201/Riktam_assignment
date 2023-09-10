const express = require("express");

const router = express.Router();
const { addUser, updateUser, searchUser } = require("../controllers/user");

router.route("/user").post(addUser);
router.route("/user-search").get(searchUser);

router.route("/update-user/:id").patch(updateUser);

module.exports = router;
