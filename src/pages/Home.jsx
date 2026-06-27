import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // состояние авторизации(типо зашел ли пользователь в аккаунт)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="home-wrapper">
            <div className="brutal-grid">

                {/* бегущая строка */}
                <div className="grid-item item-marquee">
                    <div className="marquee-content">
                        GET SH*T DONE • GET SH*T DONE • GET SH*T DONE • GET SH*T DONE • GET SH*T DONE •
                    </div>
                </div>

                {/* заголовок */}
                <div className="grid-item item-main">
                    <div className="badge-grid">v 2.0</div>
                    <h1 className="grid-title">
                        TIME<br />
                        TO<br />
                        ACT.
                    </h1>
                    <p className="grid-subtitle">
                        Stop planning plans. Write down tasks, do them, and cross them off with pleasure.
                    </p>
                </div>

                {/* квадрат -_- */}
                <div className="grid-item item-accent">
                    <span className="huge-emoji">🔥</span>
                    <h2 className="accent-text">NO EXCUSES</h2>
                </div>

                {/*кнопка старта */}
                <div
                    className="grid-item item-action"
                    style={{ backgroundColor: user ? '#ffd500' : '' }}
                >
                    <p className="action-label" style={{ fontWeight: user ? '900' : 'normal', textTransform: 'uppercase' }}>
                        {user ? "Your tasks are waiting." : "Ready to start?"}
                    </p>
                    <button
                        className="grid-start-btn"
                        style={{ background: user ? '#000' : '', color: user ? '#fff' : '' }}
                        onClick={() => navigate(user ? '/todo' : '/auth')}
                    >
                        {user ? "To the work area ➔" : "DO IT! ➔"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Home;