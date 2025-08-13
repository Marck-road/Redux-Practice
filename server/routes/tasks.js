const express = require('express');
const auth = require('../middleware/auth');
const db = require('../config/db');
const router = express.Router();

// Get tasks
router.get('/', auth, (req, res) => {
    db.query(
        'SELECT * FROM tasks WHERE user_id = ?',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Error fetching tasks' });
            }
            
            res.json(results);
        }
    );
});

// Add task with debugging
router.post('/', auth, (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title) {
        return res.status(400).json({ msg: 'Title is required' });
    }
    
    const taskData = [title, description || '', status || 'pending', req.user.id];
    
    db.query(
        'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
        taskData,
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Error adding task' });
            }
                        
            // Return the created task with the new ID
            const newTask = {
                id: result.insertId,
                title,
                description: description || '',
                status: status || 'pending',
                user_id: req.user.id
            };
            
            res.status(201).json(newTask);
        }
    );
});

// Update task - This is what your frontend calls
router.put('/:id', auth, (req, res) => {

    const taskId = req.params.id;
    const { status, title, description } = req.body;
    
    // First, get the current task to see what needs updating
    db.query(
        'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
        [taskId, req.user.id],
        (err, rows) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Error fetching task' });
            }
                        
            if (rows.length === 0) {
                return res.status(404).json({ msg: 'Task not found' });
            }
            
            const currentTask = rows[0];
            
            // Use provided values or keep current ones
            const updatedTitle = title !== undefined ? title : currentTask.title;
            const updatedDescription = description !== undefined ? description : currentTask.description;
            const updatedStatus = status !== undefined ? status : currentTask.status;
                        
            // Update the task
            db.query(
                'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
                [updatedTitle, updatedDescription, updatedStatus, taskId, req.user.id],
                (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ msg: 'Error updating task' });
                    }
                                        
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ msg: 'Task not found' });
                    }
                    
                    // Return the updated task object
                    const updatedTask = {
                        id: parseInt(taskId),
                        title: updatedTitle,
                        description: updatedDescription,
                        status: updatedStatus,
                        user_id: req.user.id
                    };
                    
                    res.json(updatedTask);
                }
            );
        }
    );
});

// Alternative PATCH endpoint for status only (more RESTful)
router.patch('/:id/status', auth, (req, res) => {
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ msg: 'Status is required' });
    }
    
    db.query(
        'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
        [status, req.params.id, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Error updating status' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Task not found' });
            }
            
            // Fetch and return the updated task
            db.query(
                'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
                [req.params.id, req.user.id],
                (err, rows) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ msg: 'Error fetching updated task' });
                    }
                    res.json(rows[0]);
                }
            );
        }
    );
});

// Delete task
router.delete('/:id', auth, (req, res) => {
    db.query(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id],
        (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Error deleting task' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ msg: 'Task not found' });
            }
            
            res.json({ msg: 'Task deleted', id: req.params.id });
        }
    );
});

module.exports = router;