import React, { useState, useEffect } from 'react';

const CodeList = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCodes();
    }, []);

    const fetchCodes = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/codes');
            
            if (!response.ok) {
                throw new Error('Failed to fetch codes');
            }
            
            const data = await response.json();
            setCodes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading codes...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>Error: {error}</p>
                <button onClick={fetchCodes} className="btn btn-secondary">
                    Retry
                </button>
            </div>
        );
    }

    if (codes.length === 0) {
        return (
            <div className="empty-state">
                <h3>No codes yet</h3>
                <p>Create your first code snippet!</p>
                <a href="/new" className="btn btn-primary">
                    Create New Code
                </a>
            </div>
        );
    }

    return (
        <div className="code-list">
            <h2>Recent Codes</h2>
            <div className="codes-grid">
                {codes.map(code => (
                    <div key={code.id} className="code-card">
                        <div className="code-card-header">
                            <h3>
                                <a href={`/code/${code.id}`}>
                                    {code.title || 'Untitled'}
                                </a>
                            </h3>
                            <span className="language-badge">
                                {code.language.toUpperCase()}
                            </span>
                        </div>
                        
                        <div className="code-preview">
                            <pre>{code.preview}...</pre>
                        </div>
                        
                        <div className="code-card-footer">
                            <span className="code-date">
                                {new Date(code.updated_at).toLocaleDateString()}
                            </span>
                            <div className="code-actions">
                                <a 
                                    href={`/code/${code.id}?mode=view`}
                                    className="btn btn-sm btn-secondary"
                                >
                                    View
                                </a>
                                <a 
                                    href={`/code/${code.id}?mode=edit`}
                                    className="btn btn-sm btn-secondary"
                                >
                                    Edit
                                </a>
                                <a 
                                    href={`/code/${code.id}/raw`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-secondary"
                                >
                                    Raw
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CodeList;
