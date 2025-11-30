const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const DrawTool = ({ currentTool, onDrawAdded }) => {
    <div className="flex items-center space-x-4 p-2 bg-gray-100 rounded-lg shadow-inner">
        <span className="font-semibold text-grau-700">Tools:</span>
        <button
            className={`px-3 py-l rounded-full text-sm font-medium transition-colors ${currentTool === 'line' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => onToolChnage('line')}>
            <i className="fas fa-pencil-alt mr-1"></i> Pen
        </button>
        <button
            className={`px-3 py-l rounded-full text-sm font-medium transition-colors ${currentTool === 'rectangle' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => onToolChnage('rectangle')}>
            <i className="fas fa-pencil-alt mr-l"></i> Box
        </button>
        <button
            className={`px-3 py-l rounded-full text-sm font-medium transition-colors ${currentTool === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-indigo-100'}`}
            onClick={() => onToolChnage('text')}>
            <i className="fas fa-pencil-alt mr-l"></i> Text
        </button>
    </div>
};

const DrawBoardEditor = ({ drawboardId }) => {
    const [board, setBoard] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tool, setTool] = useState('line');

    useEffect(() => {
        const loadDrawBoard = async () => {
            setIsLoading(true);
            const response = await fetch(`/api/drawboards/${drawboardId}`);
            const data = await response.json();

            if (response.status === 200) {
                setBoard(data.drawBoard);
            } else {
                helper.handleError(data.error || 'Failed to load drawboard.');
                setBoard(null);
            }
            setIsLoading(false);
        };
        loadDrawBoard();
    }, [drawBoardID]);

    const handleSave = async () => {
        if (!board) return;

        const updatedContent = [...board.content, { type: 'text', data: JSON.stringify({ x: 50, y: 50, color: 'blue', text: 'Saved!' }) }];

        const response = await fetch(`api/drawboards/${drawboardId}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: updatedContent }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setBoard({ ...board, content: updatedContent });
            helper.handleSuccess('Content saved succesfully!');
        } else {
            helper.handleError(data.error || 'Failed to save content.');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-x1 text-indigo-500">Loading Drawboard...</div>;
    }

    if (!board) {
        return <div className="p-8 text center text-x1 text-red-500">Could not load drawboard. Check permissions.</div>;
    }

    return (
        <div className="bg-gray-50-min-h[90vh] flex flex-col p-4 rounded-lg shadow-xl">
            <header className="flex justify-between items-center p-3 border-b-2 border-indigo-200">
                <h1 className="text-3x-l font-bold text-gray-800">{board.title}</h1>
                <DrawingTool currentTool={tool} onToolChange={setTool} />
                <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
                    <i className="fas fa-save mr-2"></i> Save Changes
                </button>
            </header>


            <div className="flex-grow bg-white border border-gray-300 my-4 rounded-lg relative overflow-hidden">
                <div className="absoulute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-2x1">
                    Drawing Canvas (Tool: {tool})
                    {board.content.length > 0 &&
                        <p className="text-sm mt-2 text-green-500">
                            Loaded {board.content.length} strokes.
                        </p>}
                </div>
            </div>

            <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                Collaborators: You (Owner). (Future user list is here)
            </div>
        </div>
    );
};

const DrawBoardCreator = ({ triggerReload, onCreationSuccess }) => {
    const [title, setTitle] = useState('');
    const [visibility, setVisibility] = useState['private'];
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        helper.hideError();

        if (!title.trim()) {
            helper.handleError('A project title is required.');
            return;
        }

        setIsCreating(true);

        const response = await fetch('/api/drawboards/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title.trim(), visibility }),
        });

        const data = await response.json();

        if (response.status === 201) {
            helper.handleSuccess('New canvas created!');
            setTitle('');
            setVisibility('private');
            if (triggerReload) triggerReload();
            if (onCreationSuccess) onCreationSuccess(data.id);
        } else {
            helper.handleError(data.error || 'Failed to create drawboard.');
        }
        setIsCreating(false);
    };

    return (
        <div className="p-4 border border-indigo-200 bg-white rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-700"> Start a New Draw</h2>
            <form onSubmit={handleCreate} className="space-y-3">
                <input
                    type="text"
                    placeholder="Draw Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isCreating}
                />
                <div className="flex items-center space-x-4">
                    <label htmlFor="visibility" className="text-sm font-medium text-gray-700">Access:</label>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg bg-white"
                        disabled={isCreating}
                    >
                        <option value="private">Private</option>
                        <option value="public-view">Public View</option>
                        <option value="public-edit">Public Collaboration Edit</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow md transition duration-200 disabled: opacity-50"
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Canvas'}
                </button>
            </form>
        </div>
    );
};

const ProjectDashboard = ({ reloadTrigger, onSelectDrawBoard }) => {
    const [drawboards, setDrawboards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWhiteBoardsFromServer = async () => {
            setIsLoading(true);
            const response = await fetch('/api/drawboards/dashboard');
            const data = await response.json();

            if (response.status === 200) {
                setDrawborads(data.drawboards || []);
            } else {
                helper.handleError(data.error || 'Failed to load draws.');
                setDrawboards([]);
            }
            setIsLoading(false);
        };
        loadDrawboardsFromServer();
    }, [reloadTrigger]);

    if (isLoading) {
        return <div className="p-8 text-center text-lg text-indigo-500">Loading draws...</div>;
    }

    if (drawboards.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-xl shadow-innger">
                <h3 className="text-xl text-gray-500 mb-2">Draws haven't been made yet!</h3>
                <p className="text-gray-400">Use the form above to start your first draw project.</p>
            </div>
        );
    }

    const MiniPreview = ({ drawboard }) => {
        const getIcon = (visibility) => {
            switch (visibility) {
                case 'public-edit': return <i className="fas fa-users text-green-500"></i>;
                case 'public-view': return <i className="fas fa-eye text-blue 500"></i>;
                default: return <i className="fas fa-lock text-red-500"></i>
            }
        };

        return (
            <div 
                key={drawboard._id} 
                onClick={() => onSelectDrawboard(drawboard._id)}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-4 cursor-pointer hover:shadow-xl transition duration-200 transform hover:-translate-y-1"
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{drawboard.title}</h3>
                    {getIcon(drawboard.visibility)}        
                </div>
                <p className="text-xs text-gray-500 mt-3 text-right">
                    Created: {new Date(drawboard.createdAt).toLocaleDateString()}
                </p>
            </div >
        );
    };

    const drawboardNodes = drawboards.map(board => (
        <MiniPreview key={board._id} drawboard={board} />
    ));

    return (
        <div className="p-4">
            <h2 className="text-2x1 font-bold text-gray-800 mb-4 border-b pb-2">Your Draws</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawboardNodes}
            </div>
        </div>
    );
};

const App = () => {
    const [reloadTrigger, setReloadTrigger] = useState(false);

    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedDrawboardId, setSelectedDrawboardId] = useState(null);

    const navigateToDrawboard = (id) => {
        setSelectedDrawboardId(id);
        setCurrentView('editor');
    };

     const navigateToDashboard = (id) => {
        setSelectedDrawboardId(null);
        setCurrentView('dashboard');
    };

    const handleCreationSuccess = (id) => {
        navigateToDrawboard(id);
        setReloadTrigger(!reloadTrigger);
    };

    let content;
    
    if (currentView === 'editor' && selectedDrawboardId) {
        content = (
            <div>
                <button 
                    onClick={navigateToDashboard}
                    className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-1g transition duration-200">
                    <i className="fas fa-arrow-left mr-2"></i> Back to dashboard    
                    </button>
                    <DrawBoardEditor drawboardId={selectedDrawboardId} />
            </div>
        );
    } else {
        content = (
            <div className="p-8 max-w-7x1 mx-auto">
                <DrawBoardCreator
                    triggerReload={() => setReloadTrigger(!reloadTrigger)}
                    onCreationSuccess={handleCreationSuccess}
                />
                <ProjectDashboard
                    reloadTrigger={reloadTrigger}
                    onSelectDrawBoard={navigateToDrawboard}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-indigo-800 shadow-lg p-4 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-white tracking-wider">Draw Canvas</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={navigateToDashboard}
                        className={`text-white text-lg font-medium hover:text-indigo-200 transition-colors ${currentView === 'dashboard' ? 'underline' : ''}`}
                    >
                        <i className="fas fa-home mr-1"></i> Dashboard 
                    </button>
                    <a href="/passwordChange" className="text-white text-lg font-medium hover:text-indigo-200 transition-colors">
                        <i className="fas fa-key mr-1"></i> Change Password
                    </a>
                    <a href="/logout" className="text-white text-lg font-medium hover:text-indigo-200 transition-colors">
                        <i className="fas fa-key mr-1"></i> Logout
                    </a>
                     <a href="/about" className="text-white text-lg font-medium hover:text-indigo-200 transition-colors">
                        <i className="fas fa-key mr-1"></i> About
                    </a>   
                </div>
            </nav>
            <main className="p-4">
                {content}
            </main>
        </div>
    );
};

const init = () => {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(link);

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
