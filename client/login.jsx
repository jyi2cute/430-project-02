const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');


//function to handle login
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#loginUser').value;
    const pass = e.target.querySelector('#loginPass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

//function to handle signup
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#signupUser').value;
    const pass = e.target.querySelector('#signupPass').value;
    const pass2 = e.target.querySelector('#signupPass2').value;

    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

//function for login window
const LoginWindow = (props) => {
    return (
        <form id='loginForm'
              name='loginForm'
              onSubmit={handleLogin}
              action="/login"
              method="POST"
              className="mainForm loginForm"
        >
            <h2>Sign In To MoodBoard</h2>
            <label htmlFor="loginUser">Username:</label>
            <input id="loginUser" type="text" name="username" placeholder="your_username" autocomplete="username"/>

            <label htmlFor="loginPass">Password:</label>
            <input id="loginPass" type="password" name="pass" placeholder="your_password" autocomplete="current-password"/>

            <input className="formSubmit" type="submit" value="Login" />
        </form>
    );
};

//function for signup winodw
const SignupWindow = (props) => {
    return (
        <form id="signupForm"
              name='signupForm'
              onSubmit={handleSignup}
              action="/signup"
              method="POST"
              className="mainForm signupForm"
        >
            <h2>Create Your Mood Board Account</h2>
            <label htmlFor="signupUser">Username: </label>
            <input id="signupUser" type="text" name="username" placeholder="your_username" autocomplete="username"/>
            <label htmlFor="signupPass">Password: </label>
            <input id="signupPass" type="password" name="pass" placeholder="your_password" autocomplete="new-password"/>
            <label htmlFor="signupPass2"> Confirm Password: </label>
            <input id="signupPass2" type="password" name="pass2" placeholder="retype password" autocomplete="new-password"/>
            <input className="formSubmit" type="submit" value="Sign up" />
        </form>
    );
};

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <LoginWindow /> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SignupWindow /> );
        return false;
    });

    root.render( <LoginWindow /> );
};

window.onload = init;