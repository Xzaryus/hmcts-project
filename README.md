## API Documentation

### POST /tasks
- **Description**: Create a new task.
- **Request Body**:
  ```json
  {
    "task": "Task Name",
    "description": "Task description",
    "due_date": "2025-05-01T12:00:00Z"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1
  }
  ```

### GET /tasks
- **Description**: Get all tasks, optionally filtered by completion status.
- **Query Parameters**: `showCompleted=true|false`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "task": "Task 1",
      "description": "Description 1",
      "completed": false,
      "due_date": "2025-05-01T12:00:00Z"
    }
  ]
  ```

### PUT /tasks/:id
- **Description**: Update an existing task.
- **Request Body**:
  ```json
  {
    "task": "Updated Task Name",
    "description": "Updated Description",
    "completed": true,
    "due_date": "2025-06-01T12:00:00Z"
  }
  ```

### DELETE /tasks/:id
- **Description**: Delete a task by ID.
- **Response**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
