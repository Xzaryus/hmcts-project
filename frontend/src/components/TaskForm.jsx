
import { useState } from 'react';
import { createTask } from '../api/taskActions'; // import your post function
const TaskForm = ({ closeForm, refreshUI }) => {
// State for task data
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');

// Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
    // Validate input
    if (!task || !dueDate) {
        setError('Task and Due Date are required.');
        return;
    }

    const taskData = { task, description, due_date: dueDate };

    try {
        const response = await createTask(taskData);
        console.log(`Task created with ID: ${response.id}`);
        await refreshUI();
        closeForm(); // Close the form on success
    } catch (err) {
        setError('Failed to create task');
        console.error(err);
    }
    };

    return (
        <div id="task-form">
            <form onSubmit={handleSubmit}>
                <h2>Create Task</h2>
                {error && <p className="error">{error}</p>}{/* Need to style this */}
                <label>
                Task:
                </label>
                <br />
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                />
                <br />
                <label>
                Description:
                </label>
                <br />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br />
                <label>
                Due Date:
                </label>
                <br />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Create Task</button>
                <br />
                <button type="button" onClick={closeForm}>Cancel</button>
            </form>
        </div>
    );

};

export default TaskForm;