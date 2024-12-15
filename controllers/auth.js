const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Ensure the JWT_COOKIE_EXPIRE is a valid number and convert it to milliseconds
  const expiresIn = Number(process.env.JWT_EXPIRE);
  
  if (isNaN(expiresIn) || expiresIn <= 0) {
    throw new Error('Invalid JWT_COOKIE_EXPIRE value');
  }

  // Calculate the expiration date
  const expirationDate = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000);

  // Set up the options for the cookie
  const options = {
    expires: expirationDate,  // Valid Date object for expiration
    httpOnly: true,  // Make the cookie HTTP only
  };

  // Ensure secure cookie only in production
  if (process.env.NODE_ENV === "production") {
    options.secure = true;  // Only send the cookie over HTTPS in production
  }

  // Validate expiration date is a valid Date
  if (!(options.expires instanceof Date) || isNaN(options.expires.valueOf())) {
    throw new TypeError('option expires is invalid');
  }

  // Log the expiration details (for debugging purposes)
  console.log('JWT Cookie expires in:', expiresIn, 'ms');
  console.log('Expiration Date:', options.expires);

  // Send the response with the token set in a cookie
  res.status(statusCode).cookie("token", user.getSignedJwtToken(), options).json({
    success: true,
    token: user.getSignedJwtToken(),
  });
};

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
