import { useTaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";

function TaskList() {
    const { tasks, taskStats } = useTaskContext();

    if (tasks.length === 0) {
        return (
            <div className="empty-search">
                <h3>No tasks found</h3>
                <p>
                    Add a task to get started!
                </p>
            </div>
        )
    }
    return (
        <div className="task-list">
            <div className="task-stats">
                <span>Total: {taskStats.total}</span>
                <span>Completed: {taskStats.completed}</span>
                <span>
                    Pendings: {taskStats.pending}
                </span>
            </div>
            <div className="tasks">
                {tasks.map(task => (<TaskItem key={task.id} task={task} />)
                )}
            </div>
        </div>
    )
}


export default TaskList;