import { useState, useEffect } from 'react';
import { refreshTasks } from './api/taskActions';
import TaskForm from './components/TaskForm';
import Menu from "./components/Menu";
import TaskSpace from './components/TaskSpace';
import { getToken } from './api/loginAPI';
import LoginForm from './components/Login';
import SignUpForm from './components/Signup';

function App() {

  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); //all, incomplete or completed
  const [loggedIn, setLoggedIn] = useState(false);
  const [signup, setSignup] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const token = getToken();

      if (!token) {
        setLoggedIn(false);
        return;
      }

      try {
        const freshTasks = await refreshTasks();
        setTasks(freshTasks);
        setLoggedIn(true);
      } catch (err) {
        console.error('Session token validation failed:', err);

        if (err.response?.status === 403) {
          alert(err.response?.data?.error || 'Session expired');
        }
        handleLogout();
      }
    };

    validateSession();
  }, []);

  const refreshUI = async () => {
    try{
      const freshTasks = await refreshTasks();
      setTasks(freshTasks);
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jwt_token');
    setLoggedIn(false);
  };

  const switchToSignup = () => {
    setSignup(true);
  };

  const switchToLogin = () => {
    setSignup(false);
  };
  
  return (
    <>
      {loggedIn ? (
        <>
          <Menu 
            openForm={() => setShowForm(true)}
            setFilter={setFilter}
            filter={filter}
            handleLogout={handleLogout}
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
        ) : signup ? (
          <SignUpForm 
            onSignupSuccess={() => setLoggedIn(true)}
            switchToLogin={switchToLogin}
          />
        ) : (
          <LoginForm
            onLoginSuccess={() => setLoggedIn(true)}
            switchToSignup={switchToSignup}
          />
        )}
    </>
  );
}

export default App
