import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"; 
import articleRoutes from "./routes/article.routes.js";
import errorHandler from "./middlewares/errorHandler.js"; 

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true,
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.use(express.static("public"));

app.use(cookieParser());


app.use("/api/users", userRoutes); 
app.use("/api/articles", articleRoutes); 

app.use(errorHandler);

export { app };
