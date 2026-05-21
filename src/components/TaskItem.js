import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";

function TaskItem({ task }) {
    const { deleteTask, toggleTask, editTask } = useTaskContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description,
        priority: task.priority

    });

    const handleEdit = () => {
        editTask(task.id, editData);
        setIsEditing(false);
    }

    const handleCancel = () => {
        setEditData({
            title: task.title,
            description: task.description,
            priority: task.priority
        });
        setIsEditing(false);
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ff4757';
            case 'medium': return '#ffa502';
            case 'low': return '#26de81';
            default: return '#ddd';
        }
    }

    if (isEditing) {
        return (
            <div className="task-item editing">
                <input
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Task title..."
                />
                <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                />

                <select value={editData.priority}
                    onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value }))}>
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>
                </select>

                <div className="edit-actions">
                    <button onClick={handleEdit}>
                        Save
                    </button>
                    <button onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
                <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}>
                        {task.priority}
                    </span>

                </div>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                    <small>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                    </small>

                    <div className="task-actions">
                        <button onClick={() => toggleTask(task.id)}
                            className={`toggle-btn ${task.completed ? 'completed' : ''}`}>
                            {task.completed ? 'Completed' : 'Pending'}
                        </button>

                        <button onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button onClick={() => deleteTask(task.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskItem;