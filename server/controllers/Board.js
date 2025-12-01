const models = require('../models');

const { Board } = models;

const makerPage = (req, res) => res.render('app');

const aboutPage = (req, res) => res.render('about');

const createBoard = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.category) {
    return res.status(400).json({ error: 'Title, description, and category are required!' });
  }

  const boardData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    owner: req.session.account._id,
  };

  try {
    const newBoard = new Board(boardData);
    await newBoard.save();
    return res.status(201).json({
      title: newBoard.title,
      description: newBoard.description,
      category: newBoard.category,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Mood board already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making mood board!' });
  }
};

const getBoards = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Board.find(query)
      .select('title description category createdDate').lean().exec();

    return res.json({ boards: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving boards!' });
  }
};

module.exports = {
  makerPage,
  createBoard,
  getBoards,
  aboutPage,
};
