
import React, { useState } from 'react';
import { signupUser } from '../api/signupAPI';

const SignUpForm = ({ switchToLogin, onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupData = { username, password };

        try {
            const data = await signupUser(signupData);
            console.log('Signup successful:', data);
            sessionStorage.setItem('jwt_token', data.token);
            onSignupSuccess();
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
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
                <button type="submit">Sign Up</button>
            </form>
            {error && <p>{error}</p>}
            <p>Already have an account? <button onClick={switchToLogin}>Login</button></p>
        </div>
    );
};

export default SignUpForm;
