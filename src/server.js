const express = require('express');
const path = require('path');
const cors = require('cors');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

// Create new code
app.post('/api/code', async (req, res) => {
    try {
        const { title = 'Untitled', content = '', language = 'javascript' } = req.body;
        
        if (!content.trim()) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }

        const result = await db.createCode(title, content, language);
        res.json({ 
            id: result.id, 
            message: 'Code created successfully',
            url: `/code/${result.id}` 
        });
    } catch (error) {
        console.error('Error creating code:', error);
        res.status(500).json({ error: 'Failed to create code' });
    }
});

// Get code by ID
app.get('/api/code/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const code = await db.getCode(id);
        
        if (!code) {
            return res.status(404).json({ error: 'Code not found' });
        }

        res.json(code);
    } catch (error) {
        console.error('Error fetching code:', error);
        res.status(500).json({ error: 'Failed to fetch code' });
    }
});

// Update code
app.put('/api/code/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, language } = req.body;

        if (!content.trim()) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }

        const result = await db.updateCode(id, title, content, language);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Code not found' });
        }

        res.json({ message: 'Code updated successfully' });
    } catch (error) {
        console.error('Error updating code:', error);
        res.status(500).json({ error: 'Failed to update code' });
    }
});

// Get all codes (for listing)
app.get('/api/codes', async (req, res) => {
    try {
        const codes = await db.getAllCodes();
        res.json(codes);
    } catch (error) {
        console.error('Error fetching codes:', error);
        res.status(500).json({ error: 'Failed to fetch codes' });
    }
});

// Frontend Routes

// Raw text route
app.get('/code/:id/raw', async (req, res) => {
    try {
        const { id } = req.params;
        const code = await db.getCode(id);
        
        if (!code) {
            return res.status(404).send('Code not found');
        }

        res.set('Content-Type', 'text/plain');
        res.send(code.content);
    } catch (error) {
        console.error('Error fetching raw code:', error);
        res.status(500).send('Failed to fetch code');
    }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    db.close();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
