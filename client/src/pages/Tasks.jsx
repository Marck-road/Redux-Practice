import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../store/authSlice'; // Adjust path as needed
import { addTask, deleteTask, fetchTasks, toggleTaskStatus } from '../store/tasksSlice';

const Tasks = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { items: tasks, loading, error } = useSelector((state) => state.tasks);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
        navigate('/login');
        } else {
        dispatch(fetchTasks(token));
        }
    }, [dispatch, navigate, token]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (title.trim()) {
        dispatch(addTask({ 
            title, 
            description, 
            status: 'pending',
            token 
        }));
        setTitle('');
        setDescription('');
        }
    };

    const handleToggle = (id, currentStatus) => {
        dispatch(toggleTaskStatus({ id, currentStatus, token }));
    };

    const handleDelete = (id) => {
        dispatch(deleteTask({ id, token }));
    };

    const handleLogout = () => {
        dispatch(logoutAction());
        localStorage.removeItem('token'); // Clean up token
        navigate('/login');
    };

    if (loading) return <div>Loading tasks...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <h2>My Tasks</h2>
        <button onClick={handleLogout}>Logout</button>
        
        <form onSubmit={handleAddTask} style={{ marginTop: '20px' }}>
            <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            /><br />
            <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ></textarea><br />
            <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
            </button>
        </form>
        
        <ul style={{ marginTop: '20px' }}>
            {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: '10px' }}>
                <strong>{task.title}</strong> - {task.status}
                {task.description && <p style={{ margin: '5px 0', color: '#666' }}>{task.description}</p>}
                <button 
                onClick={() => handleToggle(task.id, task.status)}
                disabled={loading}
                >
                Toggle
                </button>
                <button 
                onClick={() => handleDelete(task.id)}
                disabled={loading}
                style={{ marginLeft: '5px' }}
                >
                Delete
                </button>
            </li>
            ))}
        </ul>
        
        {tasks.length === 0 && !loading && (
            <p>No tasks found. Add your first task above!</p>
        )}
        </div>
    );
};

export default Tasks;