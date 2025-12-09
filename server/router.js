const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app, upload) => {
  // login router
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // signup router
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // logout router
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // getBoards router
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);

  // maker router
  app.get('/maker', mid.requiresLogin, controllers.Board.makerPage);

  // createBoard router
  app.post('/createBoard', mid.requiresLogin, controllers.Board.createBoard);

  // settings router
  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  // change password router
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  // board id router
  app.get('/board/:_id', mid.requiresLogin, controllers.Board.boardDetailPage);

  // getBoardData router
  app.get('/getBoardData', mid.requiresLogin, controllers.Board.getBoardData);

  // upload and delete image routers
  app.post('/uploadImage', mid.requiresLogin, upload.single('uploadFile'), controllers.Board.uploadImage);
  app.post('/deleteImage', mid.requiresLogin, controllers.Board.deleteImage);

  // premium router
  app.get('/premium', mid.requiresLogin, controllers.Account.premiumPage);
  app.post('/premiumUpgrade', mid.requiresLogin, controllers.Account.premiumUpgrade);

  // default router
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // 404 router
  app.use(controllers.Account.notFound);
};

module.exports = router;
