const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app, upload) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);

  app.get('/maker', mid.requiresLogin, controllers.Board.makerPage);

  app.post('/createBoard', mid.requiresLogin, controllers.Board.createBoard);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.get('/board/:_id', mid.requiresLogin, controllers.Board.boardDetailPage);
  app.get('/getBoardData', mid.requiresLogin, controllers.Board.getBoardData);

  app.post('/uploadImage', mid.requiresLogin, upload.single('uploadFile'), controllers.Board.uploadImage);
  app.post('/deleteImage', mid.requiresLogin, controllers.Board.deleteImage);

  app.get('/premium', mid.requiresLogin, controllers.Account.premiumPage);
  app.post('/premiumUpgrade', mid.requiresLogin, controllers.Account.premiumUpgrade);

  app.use(controllers.Account.notFound);
};

module.exports = router;
