import { Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "bootstrap-icons/font/bootstrap-icons.css";
import ExpandableCard from "../components/ExpandableCard";

// ЭТО ПОЛНАЯ ЖЕСТЬ

// ИМПОРТ FIREBASE AUTH И FIRESTORE
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";

function Todo() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [task, setTask] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [filter, setFilter] = useState("all");

    //ЗАГРУЗКА ЗАДАЧ ИЗ ОБЛАКА ПРИ ВХОДЕ
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                try {
                    // cоздаем запрос -  получить задачи только текущего пользователя
                    const q = query(
                        collection(db, "tasks"),
                        where("userId", "==", currentUser.uid)
                    );

                    const querySnapshot = await getDocs(q);
                    const fetchedTasks = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));


                    fetchedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setTasks(fetchedTasks);
                } catch (error) {
                    console.error("Error loading tasks:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/auth');
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    const addTask = async (e) => {
        e.preventDefault();
        if (task.trim() === "") return;

        const newTask = {
            title: task,
            description: description,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: priority,
            userId: user.uid //
        };

        try {

            const docRef = await addDoc(collection(db, "tasks"), newTask);

            // обновляем локальный стейт чтобы интерфейс отреагировал мгновенно
            setTasks((prevTasks) => [{ id: docRef.id, ...newTask }, ...prevTasks]);

            setTask("");
            setDescription("");
            setPriority("medium");
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error adding:", error);
        }
    };


    const removeTask = async (taskId) => {
        try {
            await deleteDoc(doc(db, "tasks", taskId));
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        } catch (error) {
            console.error("Error while deleting:", error);
        }
    };


    const toggleTask = async (taskId) => {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (!taskToUpdate) return;

        const newStatus = !taskToUpdate.completed;

        try {
            const taskRef = doc(db, "tasks", taskId);
            await updateDoc(taskRef, { completed: newStatus });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, completed: newStatus } : task
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };


    const editTask = async (taskId, newTitle, newDescription) => {
        if (newTitle.trim() === "") return;

        try {
            const taskRef = doc(db, "tasks", taskId);
            await updateDoc(taskRef, {
                title: newTitle,
                description: newDescription
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, title: newTitle, description: newDescription } : task
                )
            );
        } catch (error) {
            console.error("Error while editing:", error);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "all" ? true : filter === "active" ? !task.completed : task.completed;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f4f4f0' }}>
                <h1 style={{ fontFamily: 'Archivo Black' }}>SYNCHRONIZATION WITH THE CLOUD...</h1>
            </div>
        );
    }

    return (
        <Container className="py-4">
            {/* Поиск */}
            <div className="d-flex justify-content-end mb-4 gap-2 align-items-center">
                {searchOpen ? (
                    <>
                        <input
                            type="search"
                            className="search-input-brutal"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            style={{ maxWidth: "300px", width: "100%" }}
                        />
                        <button
                            type="button"
                            className="search-btn-brutal search-btn-close"
                            onClick={() => {
                                setSearchOpen(false);
                                setSearch("");
                            }}
                        >
                            ✕
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        className="search-btn-brutal search-btn-open"
                        onClick={() => setSearchOpen(true)}
                    >
                        <i className="bi bi-search"></i>
                    </button>
                )}
            </div>

            {/* кнопка формы */}
            <button
                className={`toggle-form-btn ${isFormOpen ? 'open' : ''}`}
                onClick={() => setIsFormOpen(!isFormOpen)}
            >
                {isFormOpen ? "✕ CLOSE FORM" : "➕ NEW TASK"}
            </button>

            {/* форма */}
            {isFormOpen && (
                <div className="todo-form">
                    <Form onSubmit={addTask}>
                        <div className="d-flex flex-column gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Enter task name"
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Form.Select>
                            <button type="submit" className="grid-start-btn mt-2">
                                CREATE TASK
                            </button>
                        </div>
                    </Form>
                </div>
            )}

            {/* фильтры */}
            <div className="d-flex gap-3 justify-content-center mb-4 mt-4">
                <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
                <button className={`filter-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>Active</button>
                <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
            </div>

            {/* Список задач */}
            <Row className="g-3 mt-2 align-items-start">
                {filteredTasks.map((task) => (
                    <Col md={6} key={task.id}>
                        <ExpandableCard
                            task={task}
                            onToggle={toggleTask}
                            onEdit={editTask}
                            onRemove={removeTask}
                            priority={task.priority}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Todo;