const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = path.join(__dirname, '../database/codes.db');
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('Connected to SQLite database');
                this.createTables();
            }
        });
    }

    createTables() {
        const createCodesTable = `
            CREATE TABLE IF NOT EXISTS codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL DEFAULT 'Untitled',
                content TEXT NOT NULL,
                language TEXT NOT NULL DEFAULT 'javascript',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.run(createCodesTable, (err) => {
            if (err) {
                console.error('Error creating codes table:', err);
            } else {
                console.log('Codes table ready');
            }
        });
    }

    // Create new code
    createCode(title, content, language) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO codes (title, content, language, created_at, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `;
            
            this.db.run(sql, [title, content, language], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    // Get code by ID
    getCode(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM codes WHERE id = ?';
            
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Update code
    updateCode(id, title, content, language) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE codes 
                SET title = ?, content = ?, language = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.db.run(sql, [title, content, language, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
        });
    }

    // Get all codes (for listing)
    getAllCodes() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT id, title, language, created_at, updated_at,
                       substr(content, 1, 100) as preview
                FROM codes 
                ORDER BY updated_at DESC
            `;
            
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database;
