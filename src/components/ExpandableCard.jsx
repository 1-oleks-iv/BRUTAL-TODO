import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";

function ExpandableCard({ task, onToggle, onEdit, onRemove }) {
    const [open, setOpen] = useState(false);
    const DESCRIPTION_LIMIT = 100;
    const isLongText =
        task.description && task.description.length > DESCRIPTION_LIMIT;
    const displayedDescription =
        open || !isLongText
            ? task.description
            : `${task.description.slice(0, DESCRIPTION_LIMIT)}...`;

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);


const saveEdit = () => {
        if (editTitle.trim() === "") return;

        onEdit(task.id, editTitle, editDescription);
        setIsEditing(false);
    };


    return (

        <Card className={`todo-card priority-${task.priority} h-100 ${task.completed ? 'completed' : ''}`}>
            <Card.Body className="position-relative" style={{ paddingBottom: isEditing ? "20px" : "60px" }}>
                {isEditing ? (
                    <div>
                        <Form.Control
                            className="mb-2"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <Form.Control
                            as="textarea"
                            rows={3}
                            className="mb-3"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <div className="d-flex gap-2 justify-content-end">
                            <Button type="button" size="sm" onClick={saveEdit}>
                                Save
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="d-flex align-items-start">
                            <Form.Check
                                className="me-3 mt-1"
                                checked={task.completed}
                                onChange={() => onToggle(task.id)}
                            />

                            <div className="flex-grow-1">
                                <Card.Title

                                    className="todo-title"
                                >
                                    {task.title}
                                </Card.Title>

                                {task.description && (
                                    <Card.Text

                                        className="todo-description"
                                    >
                                        {displayedDescription}
                                    </Card.Text>
                                )}

                                {isLongText && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="p-0 text-decoration-none fw-bold"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open ? "Hide" : "Show more"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="position-absolute bottom-0 start-0 m-3">
                            {task.createdAt && (
                                <small className="text-secondary">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </small>
                            )}
                        </div>

                        <div className="position-absolute bottom-0 end-0 m-3 d-flex gap-2">
                            <Button
                                type="button"
                                className="edit-btn"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </Button>

                            <Button
                                type="button"
                                className="delete-btn"
                                size="sm"
                                onClick={() => onRemove(task.id)}
                            >
                                <i className="bi bi-trash3"></i>
                            </Button>
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

export default ExpandableCard;