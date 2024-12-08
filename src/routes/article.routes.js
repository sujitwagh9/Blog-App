import express from "express";
import { createArticle, updateArticle, getArticle, getAllArticles, deleteArticle, togglePublish } from "../controllers/article.controller.js";
import authenticate from "../middlewares/auth.middleware.js"; 

const router = express.Router();


router.get("/all", getAllArticles);


router.get("/:id", getArticle);


router.post("/create", authenticate, createArticle);


router.put("/update/:id", authenticate, updateArticle);


router.delete("/delete/:id", authenticate, deleteArticle);


router.patch("/:id/publish", authenticate, togglePublish);

export default router;

