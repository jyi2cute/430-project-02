const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const { AdComponent } = require('./advertisement.jsx');

//function to handle the creation of the mood board
const handleBoardCreation = (e, onBoardAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#boardTitle').value;
    const description = e.target.querySelector('#boardDescription').value;
    const category = e.target.querySelector('#boardCategory').value;

    if(!title|| !description || !category) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {title, description, category}, onBoardAdded);
    return false;
}

//function for mood board creation form
const BoardCreationForm = (props) => {
    return( 
        <form id="boardForm"
            onSubmit={(e) => handleBoardCreation(e, props.triggerReload)}
            name="boardForm"
            action="/createBoard"
            method="POST"
            className="boardCreationForm"
        >
            <h3>Create New MoodBoard</h3>
            <label htmlFor="boardTitle">Title: </label>
            <input id="boardTitle" type="text" name="name" placeholder="Board Title" autocomplete="off"/>
            <label htmlFor="boardDescription">Description: </label>
            <input id="boardDescription" type="text" name="description" placeholder="A brief summary of the board's theme" autocomplete="off"/>
            <label htmlFor="boardCategory">Category: </label>
            <input id="boardCategory" type="text" name="category" placeholder="Nature" autocomplete="off"/>
            <input className="makeBoardSubmit" type="submit" value="Create Mood Board" />
        </form>
    );
};

//function for the moodboard list
const BoardList = (props) => {
    const [boards, setBoards] = useState(props.boards);
    
    useEffect(() => {
        const loadBoardsFromServer = async () => {
            const response = await fetch('/getBoards');
            const data = await response.json();
            setBoards(data.boards);
        };
        loadBoardsFromServer();
    }, [props.reloadBoards]);

    if(boards.length === 0) {
        return (
            <div className="boardList">
                <h3 className="emptyBoardList">No Mood Boards Yet!</h3>
            </div>
        );
    }

    //function for board nodes
    const boardNodes = boards.map(board => {
        return (
            <div key={board.id} className="boardSummaryCard">
                <div className="boardIcon"></div>
                <h3 className="boardTitle">Title: {board.title}</h3>

                <p className="boardDescription">Description: {board.description}</p>
                <p className="boardCategory">Category: {board.category}</p>
                <a href={`/board/${board._id}`} className="viewBoardLink">View Board Images</a>
            </div>
        );
    });

    return (
        <div className="boardList">
            {boardNodes}
        </div>    
    );
};

//app function
const App = () => {
    const [reloadBoards, setReloadBoards] = useState(false);

    const triggerReload = () => setReloadBoards(prev => !prev);

    return (
        <div>
            <div id="mainHeader">
                <h1>MoodBoard Maker</h1>
            </div>
            <div id="moodBoardApp">
                <BoardCreationForm triggerReload={triggerReload} />

                <AdComponent />
            </div>
            <div id="userBoards">
                <h3>Your Collections</h3>
                <BoardList boards={[]} reloadBoards={reloadBoards} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;
