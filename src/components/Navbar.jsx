import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BsNavbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

     // ИМПОРТИРУЕМ FIREBASE
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

     // авторизован ли пользователь?
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // функция выхода
    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <BsNavbar expand="lg" className="todo-navbar mb-4">
            <Container>
                {/* logo */}
                <BsNavbar.Brand as={Link} to="/" style={{ fontFamily: 'Archivo Black', fontSize: '24px' }}>
                    BRUTAL_TODO.
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />

                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* показываем "Working space" ТОЛЬКО если юзер вошел */}
                        {user && (
                            <Nav.Link as={Link} to="/todo" style={{ fontWeight: 'bold' }}>
                                WORKING SPACE
                            </Nav.Link>
                        )}
                    </Nav>


                    <Nav className="ms-auto align-items-center">
                        {user ? (
                            // если юзер есть тогда показываем красную кнопку выйти
                            <button
                                onClick={handleLogout}
                                className="search-btn-brutal mt-2 mt-lg-0"
                                style={{
                                    width: 'auto',
                                    padding: '0 20px',
                                    height: '40px',
                                    background: '#ff3b30',
                                    color: '#fff',
                                    fontSize: '14px'
                                }}
                            >
                                EXIT
                            </button>
                        ) : (
                            // если юзера нет тогда показываем желтую кнопку войти
                            <button
                                onClick={() => navigate('/auth')}
                                className="search-btn-brutal mt-2 mt-lg-0"
                                style={{
                                    width: 'auto',
                                    padding: '0 20px',
                                    height: '40px',
                                    background: '#ffd500',
                                    color: '#000',
                                    fontSize: '14px'
                                }}
                            >
                                LOGIN
                            </button>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
}

export default Navbar;