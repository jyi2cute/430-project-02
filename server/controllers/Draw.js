const models = require('../models');

const { DrawModel: Draw } = models;

const makerPage = (req, res) => res.render('app');

// about feature page
const aboutPage = (req, res) => res.render('about');

const makeDraw = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoritePower) {
    return res.status(400).json({ error: 'A title is required to create a new draw board project.' });
  }
  const drawData = {
    title: req.body.title,
    content: [],
    visibility: req.body.visibility || 'private',
    owner: req.session.account._id,
  };

  try {
    const newDraw = new Draw(drawData);
    await newDraw.save();
    // added new attribute returned to controller responese
    return res.status(201).json({
      id: newDraw._id,
      title: newDraw.title,
      message: 'Draw board created successfully.',
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Drawing already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the draw!' });
  }
};

const getDraws = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    // added new attribute selected for retrieval
    const docs = await Draw.find(query).select('_id title visibility createdAt').lean().exec();

    return res.json({ draws: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving draws!' });
  }
};

const getDrawById = async (req, res) => {
  try {
    const drawBoardId = req.params.id;
    const userId = req.session.account._id.toString();

    const doc = await Draw.findById(drawBoardId).lean().exec();

    if (!doc) {
      return res.status(404).json({ error: 'Draw not found.' });
    }

    const isOwner = doc.owner.toString() === userId;
    const isCollaborator = doc.collaborators
    && doc.collaborators.map((c) => c.toString()).includes(userId);

    if (doc.visibility === 'private' && !isOwner && !isCollaborator) {
      return res.status(403).json({ error: 'You do not have permission to view this private draw board.' });
    }
    return res.json({ drawboard: doc });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Invalid drawboard ID.' });
  }
};

const updateDrawBoardContent = async (req, res) => {
  if (!req.body.content) {
    return res.status(400).json({ error: 'Drawing content array is required for saving.' });
  }

  try {
    const drawBoardId = req.params.id;
    const userId = req.session.account._id.toString();

    const drawboard = await Draw.findById(drawBoardId);

    if (!drawboard) {
      return res.status(404).json({ error: 'Draw board not found.' });
    }

    const isOwner = drawboard.owner.toString() === userId;
    const isCollaborator = drawboard.collaborators
     && drawboard.collaborators.map((c) => c.toString().includes(userId));

    const hasWriteAccess = isOwner || isCollaborator || drawboard.visibility === 'public-edit';

    if (!hasWriteAccess) {
      return res.status(403).json({ error: 'You do not have permission to edit this draw board.' });
    }

    drawboard.content = req.body.content;
    await drawboard.save();
    return res.status(200).json({ message: 'Draw board content saved successfully.' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured while saving the draw board content.' });
  }
};

module.exports = {
  makerPage,
  makeDraw,
  getDraws,
  getDrawById,
  updateDrawBoardContent,
  aboutPage,
};
