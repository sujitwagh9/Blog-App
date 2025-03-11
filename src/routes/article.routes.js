import express from "express";
import { createArticle, updateArticle, getArticle, getAllArticles, deleteArticle, togglePublish, getArticlesByUser } from "../controllers/article.controller.js";
import { authenticate, authorize, isAdmin, isOwnerOrAdmin } from "../middlewares/auth.middleware.js";
import { Article } from "../models/article.models.js";

const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/:id", getArticle);

// Protected routes
router.post("/", 
  authenticate, 
  authorize(["admin", "author"]), 
  createArticle
);

router.put("/:id", 
  authenticate, 
  authorize(["admin", "author"]),
  isOwnerOrAdmin(Article), // Only owner or admin can edit
  updateArticle
);

router.delete("/:id", 
  authenticate, 
  authorize(["admin", "author"]),
  isOwnerOrAdmin(Article), // Only owner or admin can delete
  deleteArticle
);

router.patch("/:id/publish", 
  authenticate, 
  authorize(["admin"]), // Only admin can publish/unpublish
  togglePublish
);

router.get("/user/:userId/articles", 
  authenticate, 
  authorize(["admin", "author"]), 
  getArticlesByUser
);

export default router;

