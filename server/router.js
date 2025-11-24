const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // router for draw model
  app.get('/getDraws', mid.requiresLogin, controllers.Draw.getDraws);

  // router for login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // router for signup
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // router for logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // router for maker
  app.get('/maker', mid.requiresLogin, controllers.Draw.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Draw.makeDraw);

  // router for about feature page
  app.get('/about', mid.requiresSecure, controllers.Draw.aboutPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
