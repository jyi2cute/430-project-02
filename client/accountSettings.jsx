const React = require('react');
const { PasswordChangeWindow } = require('./passwordChange.jsx');
const { createRoot } = require('react-dom/client');

//form function for the user profile
const UserProfileForm = (props) => {
    return (
        <section className="userProfileSettings">
            <h3>General Account Information</h3>
            <p>Username: **{props.username}**</p>
            <p>Member Since: {props.memberSince}</p>
        </section>
    );
};

//function for the account settings of the user
const AccountSettings = (props) => {
    return (
        <div id="accountSettings">
            <h1>Account Settings</h1>

            <UserProfileForm 
                username={props.intialData.username} 
                memberSince={props.intialData.memberSince} 
            />
            <PasswordChangeWindow/>
        </div>
    );
};

const init = () => {
    const intialData = JSON.parse(document.getElementById('app').dataset.intialData);
    const root = createRoot(document.getElementById('app'));
    root.render(<AccountSettings intialData={intialData} />);
};

window.onload = init;