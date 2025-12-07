const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// function for the user to login
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// function for the user to sign up
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const settingsPage = (req, res) => res.render('settings');

const changePassword = async (req, res) => {
  const { oldPass, newPass, newPass2 } = req.body;

  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  try {
    const account = await Account.findByUsername(req.session.account.username);

    const isAuthenticated = await Account.validatePassword(oldPass, account.password);
    if (!isAuthenticated) {
      return res.status(401).json({ error: 'Incorrect current password.' });
    }

    const newHash = await Account.generateHash(newPass);
    account.password = newHash;
    await account.save();

    return res.json({ message: 'Password sucessfully chnaged!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred while changing the password.' });
  }
};

const premiumPage = (req, res) => res.render('premium');

const premiumUpgrade = async (req, res) => {
  try {
    const account = await Account.findByUsername(req.session.account.username);

    if (account.isPremium) {
      return res.status(200).json({ message: 'You are already MoodBoard PRO!' });
    }

    account.isPremium = true;
    await account.save();

    req.session.account = Account.toAPI(account);

    return res.json({ message: 'Upgrade successful! Welcome to MoodBoard PRO.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred during stimulation.' });
  }
};

const notFound = (req, res) => res.status(404).render('404');

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  settingsPage,
  premiumPage,
  premiumUpgrade,
  notFound,
};
