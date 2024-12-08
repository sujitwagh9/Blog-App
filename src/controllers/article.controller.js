import { Article } from "../models/article.models.js";
import ApiError from "../utils/ApiError.js";



//controller for createArticle

const createArticle = async (req, res, next) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return next(new ApiError(400, "Title and content are required"));
  }

  try {
    const newArticle = new Article({
      title,
      content,
      author: req.user._id, 
      tags,
    });

    await newArticle.save();

    res.status(201).json({
      message: "Article created successfully",
      article: newArticle,
    });
  } catch (error) {
    next(new ApiError(500, "Error while creating article"));
  }
};



//controller for updateArticle


const updateArticle = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return next(new ApiError(404, "Article not found"));
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You are not authorized to edit this article"));
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.tags = tags || article.tags;

    await article.save();

    res.status(200).json({
      message: "Article updated successfully",
      article,
    });
  } catch (error) {
    next(new ApiError(500, "Error while updating article"));
  }
};



//controller for getArticle


const getArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id).populate("author", "username email");

    if (!article) {
      return next(new ApiError(404, "Article not found"));
    }

    res.status(200).json({
      message: "Article retrieved successfully",
      article,
    });
  } catch (error) {
    next(new ApiError(500, "Error while retrieving the article"));
  }
};



//controller for getAllArticles(Need to Study!)

const getAllArticles = async (req, res, next) => {
  const { page = 1, limit = 10, title } = req.query;

  try {
    const query = title ? { title: { $regex: title, $options: "i" } } : {};

    const articles = await Article.find(query)
      .skip((page - 1) * limit)  
      .limit(Number(limit))      
      .populate("author", "username email") 
      .sort({ publishedDate: -1 }); 

    res.status(200).json({
      message: "Articles retrieved successfully",
      articles,
      page,
      limit,
    });
  } catch (error) {
    next(new ApiError(500, "Error while retrieving articles"));
  }
};


//controller for deletion of Article

const deleteArticle = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return next(new ApiError(404, "Article not found"));
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You are not authorized to delete this article"));
    }

    await article.remove();

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    next(new ApiError(500, "Error while deleting article"));
  }
};


//published/unpublished

const togglePublish = async (req, res, next) => {
  const { id } = req.params;

  try {
    const article = await Article.findById(id);

    if (!article) {
      return next(new ApiError(404, "Article not found"));
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "You are not authorized to update this article"));
    }

    article.isPublished = !article.isPublished;
    await article.save();

    res.status(200).json({
      message: article.isPublished ? "Article published successfully" : "Article unpublished successfully",
      article,
    });
  } catch (error) {
    next(new ApiError(500, "Error while toggling publish state"));
  }
};

export { createArticle, updateArticle, getArticle, getAllArticles, deleteArticle, togglePublish };
