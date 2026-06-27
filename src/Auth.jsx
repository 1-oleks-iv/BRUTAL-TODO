import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            navigate('/todo'); // после успеха кидаем к задачам
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-badge">{isLogin ? "WELCOME BACK!" : "NEWCOMER"}</div>
                <h2 className="auth-title">{isLogin ? "COME ON IN." : "JOIN IN."}</h2>

                {error && <div className="auth-error">ERROR: {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        className="auth-input-brutal"
                        placeholder="YOUR EMAIL"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-input-brutal"
                        placeholder="PASSWORD (MIN. 6 DIGITS)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="auth-submit-btn">
                        {isLogin ? "LOG IN ➔" : "CREATE ACCOUNT ➔"}
                    </button>
                </form>

                <p className="auth-toggle-text">
                    {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                    <button className="auth-toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "REGISTER" : "LOG IN"}
                    </button>
                </p>
            </div>
            <div className="deco-star">💥</div>
        </div>
    );
}

export default Auth;