const controllers = require('./controllers');
const mid = require('./middleware');

const Drawboard = controllers.Draw;

const router = (app) => {
  // router for draw model
  app.get('/api/drawboards/dashboard', mid.requiresLogin, Drawboard.getDraws);

  app.post('/api/drawboards/create', mid.requiresLogin, Drawboard.makeDraw);

  app.get('/api/drawboards/:id', mid.requiresLogin, Drawboard.getDrawById);

  app.post('/api/drawboards/:id/update', mid.requiresLogin, Drawboard.updateDrawBoardContent);

  app.get('/maker', mid.requiresLogin, Drawboard.makerPage);

  // router for login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // router for signup
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // router for logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
