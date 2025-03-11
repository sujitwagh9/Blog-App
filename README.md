# BlogApp

BlogApp is a web application that allows users to create, read, update, and delete articles while managing user roles and authentication. It supports features like user registration, login, JWT-based authentication, role-based access, and additional functionalities like password reset using email.

## Live Server

You can test the endpoints on the below server link
 ```bash
https://blog-app-ejan.onrender.com
 ```

## Features

- **User Management**: Register, login, and manage user roles (reader, author, admin).
- **Article Management**: Create, read, update, and delete blog articles.
- **Authentication**: Secure JWT-based authentication with access and refresh tokens.
- **Password Reset**: Request password reset via email and update passwords securely.
- **Role-Based Access**: Restrict access to specific resources based on user roles.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB
- **Email Service**: Nodemailer (integrated with Gmail SMTP)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sujitwagh9/Blog-App.git
   cd Blog-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
   JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
   JWT_ACCESS_TOKEN_EXPIRY=15m
   JWT_REFRESH_TOKEN_EXPIRY=7d
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the application:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login with username and password
- **POST** `/api/users/refresh-token` - Refresh access token
- **POST** `/api/users/forgot-password` - Request password reset
- **POST** `/api/users/reset-password` - Reset password using the token

### Articles
- **GET** `/api/articles/all` - Get all articles
- **GET** `/api/articles/:id` - Get a specific article by ID
- **POST** `/api/articles/create` - Create a new article (author/admin only)
- **PUT** `/api/articles/update/:id` - Update an article (author/admin only)
- **DELETE** `/api/articles/delete/:id` - Delete an article (admin only)


## Testing with Postman

1. Use the `/api/users/login` endpoint to obtain an access token and include it in the `Authorization` header as a `Bearer` token for protected routes.

## Upcoming Features

- Add support for comments and likes on articles.
- Implement a front-end for the application using React.
- Introduce search and filter functionality for articles.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.


### Author
[@sujitwagh9](https://github.com/sujitwagh9)
