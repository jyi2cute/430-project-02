const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDraw = (e, onDrawAdded) => {
    e.preventDefault();
    helper.hideError();

    // const name = e.target.querySelector('#domoName').value;
    // const age = e.target.querySelector('#domoAge').value;
    // {/*added in the new attribute*/}
    // const favoritePower = e.target.querySelector('#domoFavoritePower').value;

    // if(!name || !age || !favoritePower) {
    //     helper.handleError('All fields are required');
    //     return false;
    // }

    // {/*added in the new attribute*/}
    // helper.sendPost(e.target.action, {name, age, favoritePower}, onDomoAdded);
    // return false;
}

const DrawForm = (props) => {
    return( 
        <form id="drawForm"
            onSubmit={(e) => handleDraw(e, props.triggerReload)}
            name="drawForm"
            action="/maker"
            method="POST"
            className="drawForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            {/*added in the form input for the new attribute*/}
            <label htmlFor="favoritePower">Favorite Power: </label>
            <input id="domoFavoritePower" type="text" name="favoritePower" placeholder="Favorite Power" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DrawList = (props) => {
    const [draws, setDraws] = useState(props.draws);
    
    useEffect(() => {
        const loadDrawsFromServer = async () => {
            const response = await fetch('/getDraws');
            const data = await response.json();
            setDraws(data.draws);
        };
        loadDomosFromServer();
    }, [props.reloadDraws]);

    if(draws.length === 0) {
        return (
            <div className="drawList">
                <h3 className="emptyDraw">No Draws Yet!</h3>
            </div>
        );
    }

    const drawNodes = draws.map(draw => {
        return (
            <div key={draw.id} className="draw">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                {/*Display new attribute*/}
                <h3 className="domoFavoritePower">Favorite Power: {domo.favorite_power}</h3>
            </div>
        );
    });

    return (
        <div className="drawList">
            {drawNodes}
        </div>    
    );
};

const App = () => {
    const [reloadDraws, setReloadDraws] = useState(false);

    return (
        <div>
            <div id="makeDraw">
                <DrawForm triggerReload={() => setReloadDomos(!reloadDraws)} />
            </div>
            <div id="draws">
                <DrawList domos={[]} reloadDraws={reloadDraws} />
            </div>
            {/* added in about feature page*/}
            <a href="/about" className="aboutLinkButton">About Domo</a>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;
