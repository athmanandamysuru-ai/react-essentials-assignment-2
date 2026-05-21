import { useState } from 'react';
import { useTaskContext } from "../context/TaskContext";

function TaskForm() {
    const { addTask } = useTaskContext();

    const [formData, setFormData] = useState(
        {
            title: '',
            description: "",
            priority: 'medium'
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title) return;

        addTask(formData);
        setFormData({ title: '', description: '', priority: 'medium' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>
                Add new task
            </h2>
            <div className="form-group">
                <label htmlFor="title"> Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title..."
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="3"
                />
            </div>
            <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}>
                    <option value='low'>Low</option>
                    <option value='medium'>Medium</option>
                    <option value='high'>High</option>

                </select>
            </div>
            <button type="submit" disabled={!formData.title.trim()}>Add task</button>
        </form>
    )
}


export default TaskForm;