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
            sessionStorage.setItem('jwt_token', data.token);
            onLoginSuccess();
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Invalid Username or Password');
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            <p>Don't have an account? </p> <button onClick={switchToSignup}>Sign Up</button>
        </div>
    );
};

export default LoginForm;
