import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/register", registerUser);


router.post("/login", loginUser);


router.post("/refresh-token", refreshAccessToken);

export default router;
