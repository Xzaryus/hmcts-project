## API Documentation
Base URL
https://hmcts-project-production.up.railway.app

# Authentication
All requests to the API require JWT authentication. Include the token in the Authorization header as follows:

Authorization: Bearer <your-token>

# Endpoints

POST /signup
Description: Register a new user.

Request Body:

json
{
  "username": "user_name",
  "password": "user_password"
}

Response:

json
{
  "message": "User registered successfully"
}

Errors:

400: Missing required fields or invalid password.
500: Internal server error.

POST /login
Description: Login and get a JWT token.

Request Body:

json
{
  "username": "user_name",
  "password": "user_password"
}

Response:

json
{
  "token": "JWT-token"
}

Errors:

400: Invalid username or password.
500: Internal server error.

POST /tasks
Description: Create a new task.

Request Body:

json
{
  "task": "Task Title",
  "description": "Task description",
  "due_date": "2025-04-26T12:00:00Z"
}

Response:

json
{
  "id": 1
}

Errors:

400: Missing required fields (task, due_date).
500: Internal server error.

GET /tasks
Description: Retrieve all tasks for the authenticated user.

Query Parameters:

showCompleted: Filter tasks by completion status (true/false).

Response:

json
{
  "status": 200,
  "tasks": [
    {
      "id": 1,
      "task": "Task Title",
      "description": "Task description",
      "completed": false,
      "due_date": "2025-04-26T12:00:00Z"
    }
  ]
}

Errors:

500: Internal server error.

PUT /tasks/:id
Description: Update the status of a task.

Request Body:

json
{
  "completed": true
}

Response:

json
{
  "status": 200,
  "message": "Task updated successfully",
  "success": true
}

Errors:

400: Invalid status value.
404: Task not found.
500: Internal server error.

DELETE /tasks/:id
Description: Delete a task by ID.

Response:

json
{
  "status": 200,
  "message": "Task deleted successfully",
  "success": true
}

Errors:

404: Task not found.
500: Internal server error.