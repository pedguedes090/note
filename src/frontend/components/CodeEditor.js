import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

// Define Dracula theme for Monaco Editor
const draculaTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'operator', foreground: 'ff79c6' },
        { token: 'namespace', foreground: 'f8f8f2' },
        { token: 'type', foreground: '8be9fd' },
        { token: 'struct', foreground: '8be9fd' },
        { token: 'class', foreground: '8be9fd' },
        { token: 'interface', foreground: '8be9fd' },
        { token: 'parameter', foreground: 'ffb86c' },
        { token: 'variable', foreground: 'f8f8f2' },
        { token: 'variable.predefined', foreground: 'bd93f9' },
        { token: 'constant', foreground: 'bd93f9' },
        { token: 'function', foreground: '50fa7b' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'regexp', foreground: 'f1fa8c' },
        { token: 'delimiter', foreground: 'f8f8f2' },
        { token: 'tag', foreground: 'ff79c6' },
        { token: 'attribute.name', foreground: '50fa7b' },
        { token: 'attribute.value', foreground: 'f1fa8c' },
        { token: 'invalid', foreground: 'ff5555' },
        { token: 'error', foreground: 'ff5555' },
    ],
    colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#44475a',
        'editor.selectionBackground': '#44475a',
        'editor.selectionHighlightBackground': '#424450',
        'editor.wordHighlightBackground': '#424450',
        'editor.wordHighlightStrongBackground': '#424450',
        'editor.findMatchBackground': '#ffb86c',
        'editor.findMatchHighlightBackground': '#424450',
        'editor.hoverHighlightBackground': '#424450',
        'editorLineNumber.foreground': '#6272a4',
        'editorLineNumber.activeForeground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f2',
        'editorWhitespace.foreground': '#424450',
        'editorIndentGuide.background': '#424450',
        'editorIndentGuide.activeBackground': '#6272a4',
        'editorGroupHeader.tabsBackground': '#282a36',
        'tab.activeBackground': '#44475a',
        'tab.inactiveBackground': '#282a36',
        'tab.border': '#191a21',
        'panel.background': '#282a36',
        'sideBar.background': '#282a36',
        'statusBar.background': '#191a21',
        'titleBar.activeBackground': '#191a21',
        'scrollbar.shadow': '#191a21',
        'scrollbarSlider.background': '#44475a',
        'scrollbarSlider.hoverBackground': '#6272a4',
        'scrollbarSlider.activeBackground': '#6272a4',
        'progressBar.background': '#ff79c6',
        'widget.shadow': '#191a21',
        'editorWidget.background': '#44475a',
        'editorWidget.border': '#6272a4',
        'editorSuggestWidget.background': '#44475a',
        'editorSuggestWidget.border': '#6272a4',
        'editorSuggestWidget.selectedBackground': '#424450',
        'editorHoverWidget.background': '#44475a',
        'editorHoverWidget.border': '#6272a4',
        'debugExceptionWidget.background': '#44475a',
        'debugExceptionWidget.border': '#6272a4',
        'editorMarkerNavigation.background': '#44475a',
        'editorMarkerNavigationError.background': '#ff5555',
        'editorMarkerNavigationWarning.background': '#ffb86c',
        'editorMarkerNavigationInfo.background': '#8be9fd',
        'notificationCenter.border': '#44475a',
        'notificationCenterHeader.background': '#282a36',
        'notifications.foreground': '#f8f8f2',
        'notifications.background': '#44475a',
        'notification.background': '#44475a',
        'notificationLink.foreground': '#8be9fd',
        'notificationsErrorIcon.foreground': '#ff5555',
        'notificationsWarningIcon.foreground': '#ffb86c',
        'notificationsInfoIcon.foreground': '#8be9fd',
        'menubar.selectionForeground': '#f8f8f2',
        'menubar.selectionBackground': '#44475a',
        'menu.foreground': '#f8f8f2',
        'menu.background': '#44475a',
        'menu.selectionForeground': '#f8f8f2',
        'menu.selectionBackground': '#424450'
    }
};

const CodeEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || (id ? 'view' : 'edit');
    
    const [code, setCode] = useState({
        title: '',
        content: '',
        language: 'javascript'
    });
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const languages = [
        'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
        'csharp', 'php', 'ruby', 'go', 'rust', 'sql', 'html',
        'css', 'json', 'xml', 'yaml', 'markdown', 'shell'
    ];

    useEffect(() => {
        if (id) {
            fetchCode();
        }
    }, [id]);

    const fetchCode = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`/api/code/${id}`);
            
            if (!response.ok) {
                throw new Error('Code not found');
            }
            
            const data = await response.json();
            setCode(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const saveCode = async () => {
        try {
            setSaving(true);
            setError('');

            if (!code.content.trim()) {
                throw new Error('Content cannot be empty');
            }

            const url = id ? `/api/code/${id}` : '/api/code';
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(code),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save code');
            }

            const result = await response.json();
            
            if (!id && result.id) {
                // Redirect to the new code's view page
                navigate(`/code/${result.id}?mode=view`);
            } else {
                // Show success message or redirect to view mode
                window.location.search = '?mode=view';
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };    const handleEditorChange = (value) => {
        setCode(prev => ({ ...prev, content: value || '' }));
    };

    const getEditorStats = () => {
        if (!code.content) return { lines: 0, chars: 0, words: 0 };
        const lines = code.content.split('\n').length;
        const chars = code.content.length;
        const words = code.content.trim().split(/\s+/).filter(word => word.length > 0).length;
        return { lines, chars, words };
    };

    const handleTitleChange = (e) => {
        setCode(prev => ({ ...prev, title: e.target.value }));
    };

    const handleLanguageChange = (e) => {
        setCode(prev => ({ ...prev, language: e.target.value }));
    };

    const switchMode = (newMode) => {
        const url = new URL(window.location);
        url.searchParams.set('mode', newMode);
        window.location.href = url.toString();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error && id) {
        return (
            <div className="error-page">
                <h2>Error</h2>
                <p>{error}</p>
                <a href="/" className="btn">Go Home</a>
            </div>
        );
    }

    const isEditable = mode === 'edit';
    const isNew = !id;

    return (
        <div className="code-editor">
            <div className="editor-header">
                <div className="editor-controls">
                    <input
                        type="text"
                        value={code.title}
                        onChange={handleTitleChange}
                        placeholder="Enter title..."
                        className="title-input"
                        disabled={!isEditable}
                    />
                    
                    <select
                        value={code.language}
                        onChange={handleLanguageChange}
                        className="language-select"
                        disabled={!isEditable}
                    >
                        {languages.map(lang => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="editor-actions">
                    {!isNew && (
                        <>
                            <button
                                onClick={() => switchMode('view')}
                                className={`btn ${mode === 'view' ? 'btn-active' : 'btn-secondary'}`}
                            >
                                View
                            </button>
                            <button
                                onClick={() => switchMode('edit')}
                                className={`btn ${mode === 'edit' ? 'btn-active' : 'btn-secondary'}`}
                            >
                                Edit
                            </button>
                            <a
                                href={`/code/${id}/raw`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                Raw
                            </a>
                        </>
                    )}
                    
                    {isEditable && (
                        <button
                            onClick={saveCode}
                            disabled={saving || !code.content.trim()}
                            className="btn btn-primary"
                        >
                            {saving ? 'Saving...' : (isNew ? 'Create' : 'Save')}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}            <div className="editor-container">
                <Editor
                    height="100vh"
                    language={code.language}
                    value={code.content}
                    onChange={handleEditorChange}
                    theme="dracula"                    beforeMount={(monaco) => {
                        // Define the Dracula theme
                        monaco.editor.defineTheme('dracula', draculaTheme);
                    }}
                    onMount={(editor, monaco) => {
                        // Add keyboard shortcuts
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                            if (isEditable) {
                                saveCode();
                            }
                        });
                        
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE, () => {
                            if (!isNew) {
                                switchMode(mode === 'edit' ? 'view' : 'edit');
                            }
                        });
                    }}
                    options={{
                        readOnly: !isEditable,
                        minimap: { enabled: true },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        renderWhitespace: 'selection',
                        tabSize: 2,
                        insertSpaces: true,
                        lineNumbers: 'on',
                        rulers: [],
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: 'line',
                        bracketPairColorization: { enabled: true },
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: true,
                    }}
                />
            </div>            <div className="editor-info">
                {!isNew && (
                    <div className="code-info">
                        <p>
                            <strong>ID:</strong> {id} | 
                            <strong>Language:</strong> {code.language} |
                            <strong>Created:</strong> {new Date(code.created_at).toLocaleString()}
                            {code.updated_at !== code.created_at && (
                                <> | <strong>Updated:</strong> {new Date(code.updated_at).toLocaleString()}</>
                            )}
                        </p>
                        <p>
                            <strong>Stats:</strong> {getEditorStats().lines} lines, {getEditorStats().words} words, {getEditorStats().chars} characters
                        </p>                        <p>
                            <strong>Share URL:</strong> 
                            <input
                                type="text"
                                value={`${window.location.origin}/code/${id}`}
                                readOnly
                                className="share-url"
                                onClick={(e) => e.target.select()}
                            />
                        </p>
                        <p className="shortcuts">
                            <strong>Shortcuts:</strong> Ctrl+S (Save) | Ctrl+E (Toggle Edit/View)
                        </p>
                    </div>
                )}                {isNew && (
                    <div className="code-info">
                        <p>
                            <strong>Stats:</strong> {getEditorStats().lines} lines, {getEditorStats().words} words, {getEditorStats().chars} characters
                        </p>
                        <p>
                            <strong>Language:</strong> {code.language} | 
                            <strong>Title:</strong> {code.title || 'Untitled'}
                        </p>
                        <p className="shortcuts">
                            <strong>Shortcuts:</strong> Ctrl+S (Save) | Ctrl+E (Toggle Edit/View)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeEditor;
