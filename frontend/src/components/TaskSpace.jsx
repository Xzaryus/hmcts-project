import { useEffect } from 'react'
import { deleteTask, updateTask, } from '../api/taskActions'

function TaskSpace({tasks, refreshUI, filter}) {

    useEffect(() => {
        
        refreshUI().catch(err => {
            console.error('Error refreshing tasks:', err);
        });
    }, [refreshUI]);

    const toggleCompletion = async (taskId, currentStatus) => {
        try {
            await updateTask(taskId, { completed: !currentStatus });
        } catch (err) {
            console.error('Error updating task:', err);
        } finally {
            refreshUI();
        }
    }
    const handleDelete = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error('Error deleting task:', err);
        } finally {
            refreshUI();
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'complete') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    })

    return (
        <div id="task-space">
            {filteredTasks.length === 0 ? (
                <p>No tasks found. Please add a task.</p>) : (
                    filteredTasks.map((task) => (
                        <div className="task" key={task.id}>
                            <h3>{task.task}</h3>
                            <p>{task.description}</p>
                            <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
                            <p>Status: {task.completed ? 'Completed' : 'Not completed'}</p>
                            <button onClick={() => toggleCompletion(task.id, task.completed)}>
                                {task.completed ? 'Mark incomplete' : 'Mark complete'}
                            </button>
                            <button id='delete-task' onClick={() => handleDelete(task.id)}>
                            Delete
                            </button>
                        </div>
                ))
            )}
        </div>
    )
}

export default TaskSpace