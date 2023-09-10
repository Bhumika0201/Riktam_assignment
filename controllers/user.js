const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { BadRequestError, NotFoundError } = require("../errors");

/**
 * Function to add user if role is Admin
 * @param {*} req
 * @param {*} res
 */
const addUser = async (req, res) => {
  console.log(req.user);
  if (!(req.user.role == "admin")) {
    throw new BadRequestError("Only Admins can add or update User");
  }
  req.body.password = "DefaultPass1@"; //Set default password In Ideal case one can have field verified in user table and set it to false and make a tokens table that store  validity token . Send it to user on mail once verified token user can set password
  if (!(req.user.role == "admin")) {
    throw new BadRequestError("Only Admins can add or update User");
  }
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

/**
 * Function to update user if role is Admin
 * @param {*} req
 * @param {*} res
 */
const updateUser = async (req, res) => {
  if (!(req.user.role == "admin")) {
    throw new BadRequestError("Only Admins can add or update User");
  }
  const { name, email } = req.body;
  if (!name && !email) {
    throw new BadRequestError("Name and Email cannot be empty");
  }
  const userUpdate = await User.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!userUpdate) {
    throw new NotFoundError(`No user with email ${email}`);
  }
  res.status(StatusCodes.OK).json({ userUpdate });
};

/**
 * Function to search user from database
 * @param {*} req
 * @param {*} res
 */
const searchUser = async (req, res) => {
  let users = [];
  if (!req.query.userStr) {
    users = await User.find();
  } else {
    const userStr = "." + req.query.userStr + ".";

    users = await User.find({
      $or: [
        {
          name: {
            $regex: userStr,
            $options: "i",
          },
        },
        {
          email: {
            $regex: userStr,
            $options: "i",
          },
        },
      ],
    });
  }
  if (!users.length) throw new NotFoundError(`No user found`);
  res.status(StatusCodes.OK).json({ users: users });
};

module.exports = {
  addUser,
  updateUser,
  searchUser,
};
