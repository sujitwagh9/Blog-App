import { Article } from "../models/article.models.js";
import ApiError from "../utils/ApiError.js";



//controller for createArticle

const createArticle = async (req, res, next) => {
  try {
    // Automatically assign the logged-in user as the author
    const articleData = {
      ...req.body,
      author: req.user._id // Assuming user._id is available from auth middleware
    };

    const article = await Article.create(articleData);
    
    res.status(201).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};



//controller for updateArticle


const updateArticle = async (req, res, next) => {
  try {
    // req.resource is available from isOwnerOrAdmin middleware if you chose to attach it
    const article = req.resource;
    
    Object.assign(article, req.body);
    await article.save();

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
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

    const [articles, total] = await Promise.all([
      Article.find(query)
        .skip((page - 1) * limit)  
        .limit(Number(limit))      
        .populate("author", "username email") 
        .sort({ publishedDate: -1 }),
      Article.countDocuments(query)
    ]); 

    res.status(200).json({
      success: true,
      articles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new ApiError(500, "Error while retrieving articles"));
  }
};


//controller for deletion of Article

const deleteArticle = async (req, res, next) => {
  try {
    // Use req.resource from isOwnerOrAdmin middleware
    const article = req.resource;
    await article.deleteOne(); // Using deleteOne() instead of remove() which is deprecated
    
    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    next(new ApiError(500, "Error while deleting article"));
  }
};


//published/unpublished

const togglePublish = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return next(new ApiError(404, "Article not found"));
    }

    article.isPublished = !article.isPublished;
    await article.save();

    res.status(200).json({
      success: true,
      message: article.isPublished ? "Article published successfully" : "Article unpublished successfully",
      article,
    });
  } catch (error) {
    next(new ApiError(500, "Error while toggling publish state"));
  }
};

const getArticlesByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const articles = await Article.find({ author: userId }).populate("author", "username email"); 

    res.status(200).json({
      message: "Articles retrieved successfully",
      articles,
    });
  } catch (error) { 
    next(new ApiError(500, "Error while retrieving articles by user"));
  }
};




export { createArticle, updateArticle, getArticle, getAllArticles, deleteArticle, togglePublish, getArticlesByUser };
