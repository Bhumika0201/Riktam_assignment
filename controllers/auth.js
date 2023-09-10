const User = require("../models/User");
const Token = require("../models/Token");

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

/**
 * Creates user with req.body and returns JWT token
 * @param {*} req
 * @param {*} res
 */
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

/**
 * Function for login that authenticates user based on credentials and saves and returns  JWT token
 * @param {*} req
 * @param {*} res
 */

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  let tokenSaved = await Token.findOne({ token: token });
  if (!tokenSaved) await Token.create({ token: token });
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

/**
 * Deletes token from database
 * @param {*} req
 * @param {*} res
 */
const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    await Token.findOneAndDelete({ token: token });
    res.status(StatusCodes.OK).json({ msg: "User Logged out" });
  } catch (err) {
    throw new BadRequestError("Error Occoured");
  }
};

module.exports = {
  register,
  login,
  logout,
};
