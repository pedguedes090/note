import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import CodeList from './components/CodeList';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <AppContent />
            </div>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const isEditorPage = location.pathname.includes('/code/') || location.pathname === '/new';
    
    return (
        <>
            <header className="app-header">
                <h1>
                    <a href="/">CodeShare</a>
                </h1>
                <p>Share your code snippets</p>
            </header>
            
            <main className={`app-main ${!isEditorPage ? 'with-padding' : ''}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/code/:id" element={<CodeEditor />} />
                    <Route path="/new" element={<CodeEditor />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </>
    );
}

function Home() {
    return (
        <div className="home">
            <div className="home-actions">
                <a href="/new" className="btn btn-primary">
                    Create New Code
                </a>
            </div>
            <CodeList />
        </div>
    );
}

export default App;
