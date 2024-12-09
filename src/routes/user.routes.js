import express from "express";
import { registerUser, loginUser, refreshAccessToken , forgotPassword, resetPassword} from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/register", registerUser);


router.post("/login", loginUser);


router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
