import React, { useState } from 'react';
import { loginUser } from '../api/loginAPI';

const LoginForm = ({ switchToSignup, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = { username, password };

        try {
            const data = await loginUser(loginData); // Call the loginUser function
            console.log('Login successful:', data);
            onLoginSuccess();
        } catch (err) {
            setError('Invalid Username or Password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <p>Dont't have an account? <button onClick={switchToSignup}>Sign Up</button></p>
        </div>
    );
};

export default LoginForm;
