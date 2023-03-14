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

`git@github.com:Gevorg91/todo-api.git` 

2.  Install dependencies:

`npm install` 

3.  Start the development server:

`npm start` 

Your API will be available at `http://localhost:3000`.

## API Endpoints

### User 

-   Register a new user:
    
    -   POST `/api/users/register`
    -   JSON Payload: `{"username": "your_username", "password": "your_password"}`
-   Authenticate and log in a user:
    
    -   POST `/api/users/login`
    -   JSON Payload: `{"username": "your_username", "password": "your_password"}`

### Task (all routes require authentication)

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
