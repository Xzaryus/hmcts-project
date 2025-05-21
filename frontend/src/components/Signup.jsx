
import React, { useState } from 'react';
import { signupUser } from '../api/signupAPI';

const SignUpForm = ({ switchToLogin, onSignupSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (pw) => {
        const nonLetters = (pw.match(/[^a-zA-Z]/g) || []).length;
        return nonLetters >= 3;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validatePassword(password)) {
            setError('Password must contain at least 3 non-alphabetic characters');
            return;
        }

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
        <div className="login-form">
            <h2>Sign Up</h2>
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
                <h6>Password must contain at least 3 non-alphabetic characters</h6>
                <br />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p>{error}</p>}
            <p>Already have an account? </p> <button onClick={switchToLogin}>Login</button>
        </div>
    );
};

export default SignUpForm;
