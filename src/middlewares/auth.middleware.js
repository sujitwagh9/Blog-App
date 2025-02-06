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

const authorize = (roles) => {
  // Convert single role to array if needed
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Requires role(s): ${allowedRoles.join(', ')}`));
    }
    next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Unauthorized"));
  }
  next();
};

const isOwnerOrAdmin = (model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return next(new ApiError(404, "Resource not found"));
      }

      // Allow if user is admin or the owner of the resource
      if (req.user.role === "admin" || resource.author.toString() === req.user._id.toString()) {
        req.resource = resource; // Optionally attach resource to request
        return next();
      }

      return next(new ApiError(403, "You don't have permission to perform this action"));
    } catch (error) {
      return next(new ApiError(500, "Error checking resource ownership"));
    }
  };
};

export { authenticate, authorize, isAdmin, isOwnerOrAdmin };


