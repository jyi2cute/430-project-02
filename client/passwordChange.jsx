const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleChangePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const oldPass = e.target.querySelector('#oldPass').value;
    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if (!oldPass || !newPass || !newPass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPass !== newPass2) {
        helper.handleError('New passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { oldPass, newPass, newPass2 }, (response) => {
        if (response.message) {
            helper.handleError(response.message, false);

            e.target.reset();
        }
    });
    return false;
};

const PasswordChangeWindow = (props) => {
    return (
        <form id='passwordChangeForm'
              name='passwordChangeForm'
              onSubmit={handleChangePass}
              action="/changePassword"
              method="POST"
              className="mainForm passwordChangeForm"
        >
            <h2>Change Your Password</h2>
            <label htmlFor="oldPass">Current Password:</label>
            <input id="oldPass" type="password" name="oldPass" placeholder="current password" />

            <label htmlFor="newPass">New Password:</label>
            <input id="newPass" type="password" name="newPass" placeholder="new password" />

            <label htmlFor="newPass2">Confirm New Password:</label>
            <input id="newPass2" type="password" name="newPass2" placeholder="re-type new password" />

            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<PasswordChangeWindow />);
};

module.exports.PasswordChangeWindow = PasswordChangeWindow;

window.onload = init;