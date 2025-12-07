const boardExports = require('./Board.js');
module.exports.Account = require('./Account.js');

module.exports.Board = boardExports.BoardModel;
module.exports.mongoose = boardExports.mongoose;
