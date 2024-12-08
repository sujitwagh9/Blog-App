import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Access token required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded; // Store user data in req.user
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired access token"));
  }
};

export default authenticate;
