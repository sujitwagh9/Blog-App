import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err instanceof ApiError) {
    return res.status(statusCode).json({ message });
  }

  // For non-operational errors
  return res.status(statusCode).json({
    message: message || "Something went wrong!",
    stack: err.stack,
  });
};

export default errorHandler;
