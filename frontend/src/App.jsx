import { useState } from 'react'
import { refreshTasks } from './api/taskActions'
import TaskForm from './components/TaskForm'
import Menu from "./components/Menu"
import TaskSpace from './components/TaskSpace'

function App() {

  const [showForm, setShowForm] = useState(false)
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all') //all, incomplete or completed

  const refreshUI = async () => {
    try{
      const freshTasks = await refreshTasks();
      setTasks(freshTasks);
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    }
  };
  
  return (
    <>
      <Menu 
        openForm={() => setShowForm(true)}
        setFilter={setFilter}
        filter={filter}
        />
      {showForm && <TaskForm closeForm={() => setShowForm(false)}
        refreshUI={refreshUI}
        />}
      <TaskSpace 
        tasks={tasks}
        refreshUI={refreshUI}
        filter={filter}
        />
    </>
  );
}

export default App
