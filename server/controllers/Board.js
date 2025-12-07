const models = require('../models');

const { Board } = models;

const makerPage = (req, res) => res.render('app');

// function to create the mood board
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

// function to retrieve the mood board
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

const boardDetailPage = (req, res) => {
  const boardId = req.params._id;

  return res.render('boardDetail', { boardId });
};

const getBoardData = async (req, res) => {
  const boardId = req.query._id;

  try {
    const doc = await Board.findOne({ _id: boardId, owner: req.session.account._id }).lean().exec();

    if (!doc) {
      return res.status(404).json({ error: 'Board not found or unauthorized.' });
    }

    return res.json({ board: doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving board data!' });
  }
};

const uploadImage = async (req, res) => {
  const { boardId, imageUrl, caption } = req.body;

  if (!boardId || !imageUrl || !caption) {
    return res.status(400).json({ error: 'Board ID, image URL, and caption are required.' });
  }

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId, owner: req.session.account._id },
      {
        $push: {
          images: {
            url: imageUrl,
            caption,
            _id: new models.mongoose.Types.ObjectId(),
          },
        },
      },
      { new: true },
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found or unauthorized.' });
    }

    return res.json({ message: 'Image added successfully!', board: updatedBoard });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error uploading image to board!' });
  }
};

const deleteImage = async (req, res) => {
  const { boardId, imageId } = req.body;

  if (!boardId || !imageId) {
    return res.status(400).json({ error: 'Board ID and Image ID are required.' });
  }

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId, owner: req.session.account._id },
      {
        $pull: {
          images: { _id: imageId },
        },
      },
      { new: true },
    );

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found or unauthorized.' });
    }

    return res.json({ message: 'Image deleted sucessfully!', board: updatedBoard });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting image!' });
  }
};

module.exports = {
  makerPage,
  createBoard,
  getBoards,
  boardDetailPage,
  getBoardData,
  uploadImage,
  deleteImage,
};
