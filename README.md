# Task Manager API

A simple RESTful Task Manager API built using Node.js, Express, and MongoDB.

## Features

-   User registration and authentication with JWT.
-   Create, read, update, and delete tasks.
-   Protected routes using middleware.

## Getting Started

### Prerequisites

-   Node.js
-   MongoDB

### Installation

1.  Clone the repository:

bashCopy code

`git clone https://github.com/yourusername/task-manager-api.git` 

2.  Change to the project directory:

bashCopy code

`cd task-manager-api` 

3.  Install dependencies:

Copy code

`npm install` 

4.  Create a `config` directory and create two JSON files, `env.development.json` and `env.production.json`, for development and production environments, respectively:

jsonCopy code

`{
  "NODE_ENV": "development",
  "PORT": 5000,
  "MONGO_URI": "mongodb://localhost:27017/task-manager-api-development",
  "JWT_SECRET": "your_development_jwt_secret_here"
}` 

Replace `your_development_jwt_secret_here` with your actual JWT secret for the development environment.

5.  Start the development server:

sqlCopy code

`npm start` 

Your API will be available at `http://localhost:5000`.

## API Endpoints

### User Routes

-   Register a new user:
    
    -   POST `/api/users/register`
    -   JSON Payload: `{"username": "your_username", "password": "your_password"}`
-   Authenticate and log in a user:
    
    -   POST `/api/users/login`
    -   JSON Payload: `{"username": "your_username", "password": "your_password"}`

### Task Routes (all routes require authentication)

-   Get all tasks:
    
    -   GET `/api/tasks`
-   Create a new task:
    
    -   POST `/api/tasks`
    -   JSON Payload: `{"title": "task_title", "description": "task_description"}`
-   Get a task by ID:
    
    -   GET `/api/tasks/:id`
-   Update a task by ID:
    
    -   PUT `/api/tasks/:id`
    -   JSON Payload: `{"title": "updated_task_title", "description": "updated_task_description"}`
-   Delete a task by ID:
    
    -   DELETE `/api/tasks/:id`
