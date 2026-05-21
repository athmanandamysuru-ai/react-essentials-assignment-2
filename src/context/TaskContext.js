import { createContext, useContext, useReducer } from 'react';
/* eslint-disable no-unused-expressions */
const initialState = {
    tasks: [
        {
            id: 1,
            title: 'Learn react context',
            description: 'Understand how context API works',
            completed: false,
            priority: "high",
            createdAt: new Date().toISOString()
        }
        ,
        {
            id: 2,
            title: 'Master Reducer',
            description: 'Learn complex state management patterns',
            completed: false,
            priority: "high",
            createdAt: new Date().toISOString()
        }
    ],
    filter: 'all',
    searchTerm: '',
    isLoading: false,
    history: []

};

export const ACTIONS = {
    ADD_TASK: 'ADD_TASK',
    DELETE_TASK: 'DELETE_TASK',
    TOGGLE_TASK: 'TOGGLE_TASK',
    EDIT_TASK: 'EDIT_TASK',
    SET_FILTER: 'SET_FILTER',
    SET_SEARCH: 'SET_SEARCH',
    UNDO_ACTION: 'UNDO_ACTION',
    SET_LOADING: 'SET_LOADING'
};

const taskReducer = (state, action) => {
    const saveToHistory = (currentState) => ({
        ...currentState,
        history: [currentState, ...currentState.history.slice(0, 9)]
    });

    switch (action.type) {
        case ACTIONS.ADD_TASK:
            const newTask = {
                id: Date.now(),
                title: action.payload.title,
                description: action.payload.description,
                completed: false,
                priority: action.payload.priority || 'medium',
                createdAt: new Date().toISOString()
            };

            return saveToHistory({
                ...state,
                tasks: [...state.tasks, newTask]
            });

        case ACTIONS.DELETE_TASK:
            return saveToHistory({
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload)
            });
        case ACTIONS.TOGGLE_TASK:
            return saveToHistory({
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload ? { ...task, completed: !task.completed } : task
                )
            });

        case ACTIONS.EDIT_TASK:
            return saveToHistory({
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
                )
            });

        case ACTIONS.SET_FILTER:
            return {
                ...state,
                filter: action.payload
            };


        case ACTIONS.SET_SEARCH:
            return {
                ...state,
                searchTerm: action.payload
            };

        case ACTIONS.UNDO_ACTION:
            if (state.history.length > 0) {
                const [previousState, ...restHistory] = state.history;
                return {
                    ...previousState,
                    history: restHistory
                };
            };
            return state;

        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };

        default:
            throw new Error(`Unhandled actiontype: ${action.type}`);
    }
};


const TaskContext = createContext();

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTextContext must be used within TaskProvider')
    }
    return context;
};


export const TaskProvider = ({ children }) => {

    const [state, dispatch] = useReducer(taskReducer, initialState);

    const addTask = (taskData) => {
        dispatch({ type: ACTIONS.ADD_TASK, payload: taskData });
    }
    const deleteTask = (taskId) => {
        dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
    }
    const toggleTask = (taskId) => {
        dispatch({ type: ACTIONS.TOGGLE_TASK, payload: taskId });
    }
    const editTask = (taskId, updates) => {
        dispatch({ type: ACTIONS.EDIT_TASK, payload: { id: taskId, updates } });
    }
    const setFilter = (filter) => {
        dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
    }
    const setSearch = (searchterm) => {
        dispatch({ type: ACTIONS.SET_SEARCH, payload: searchterm });
    }

    const undoAction = () => {
        dispatch({ type: ACTIONS.UNDO_ACTION });
    }

    const filteredtasks = state.tasks.filter(task => {
        const matchesFilter =
            state.filter === 'all' ||
            state.filter === 'completed' && task.completed ||
            state.filter === 'pending' && !task.completed;

        const matchesSearch =
            state.searchTerm === '' ||
            task.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(state.searchTerm.toLowerCase());

        return matchesSearch && matchesFilter;
    })

    const taskStats = {
        total: state.tasks.length,
        completed: state.tasks.filter(task => task.completed).length,
        pending: state.tasks.filter(task => !task.completed).length
    }


    const value = {
        tasks: filteredtasks,
        filter: state.filter,
        searchterm: state.searchTerm,
        isLoading: state.isLoading,
        taskStats,
        canUndo: state.history.length> 0,

        addTask,
        deleteTask,
        toggleTask,
        editTask,
        setFilter,
        setSearch,
        undoAction

    };
    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
};


export default TaskProvider;