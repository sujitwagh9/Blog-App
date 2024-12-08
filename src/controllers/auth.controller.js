import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";

// Function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);  
    if (!decoded || !decoded.exp) {
      return true;  
    }
    return decoded.exp * 1000 < Date.now(); 
  } catch (error) {
    return true; 
  }
};



const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
  
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      // Remove expired refresh tokens
      if (user.refreshTokens && user.refreshTokens.length > 0) {
        user.refreshTokens = user.refreshTokens.filter(token => !isTokenExpired(token));
      } else {
        user.refreshTokens = [];
      }
  
      // Add the new refresh token to the array
      user.refreshTokens.push(refreshToken);
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Error while generating tokens");
    }
  };
  


//Register User

const registerUser = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return next(new ApiError(400, "All fields are required!"));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(new ApiError(400, "Username or email already in use!"));
    }

    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    await newUser.save();

    
    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1h" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
  } catch (error) {
    next(new ApiError(500, "Error while registering user"));
  }
};



// Controller for LoginUser


const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ApiError(400, "All credentials are required!"));
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Incorrect password"));
    }

    
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
   

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(new ApiError(500, "Error while logging in"));
  }
};


//refreshAccessToken

const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(400, "Refresh token is required"));
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return next(new ApiError(401, "Invalid refresh token"));
      }

      const user = await User.findById(decoded._id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return next(new ApiError(403, "Refresh token mismatch"));
      }

      const accessToken = user.generateAccessToken();
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    next(new ApiError(500, "Error while refreshing token"));
  }
};

export { registerUser, loginUser, refreshAccessToken};
