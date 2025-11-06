import { User } from "../models/user.models.js";
import { ApiResponce } from "../utils/api-responce.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail } from "../utils/mail.js";

const generateRefreshAndAccessToken = async (userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshTokens = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

const registeruser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    isEmailVerified: false,
  });

  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user?.email,
    subject: "Verify your email",
    mailgenContent: emailVerificationContent(
      user.username,
      `${request.protocol}://${request.get("host")}/api/v1/users/auth/verify-email/${unhashedToken}`,
    ),
    text: `Your verification token is ${unhashedToken}. It will expire in 20 minutes.`,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshTokens -__v -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(
      new ApiResponce(
        201,
        { user: createdUser },
        "User registered successfully & verification email sent",
      ),
    );
});

export {registeruser}
