const models = require('../models');

const { Draw } = models;

const makerPage = (req, res) => res.render('app');

// about feature page
const aboutPage = (req, res) => res.render('about');

const makeDraw = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.favoritePower) {
    return res.status(400).json({ error: 'Name, age, and favorite power are required!' });
  }

  const drawData = {
    name: req.body.name,
    age: req.body.age,
    // added new attribute to model data
    favorite_power: req.body.favoritePower,
    owner: req.session.account._id,
  };

  try {
    const newDraw = new Draw(drawData);
    await newDraw.save();
    // added new attribute returned to controller responese
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      favoritePower: newDomo.favorite_power,
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
    const docs = await Draw.find(query).select('name age favorite_power').lean().exec();

    return res.json({ draws: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving draws!' });
  }
};

module.exports = {
  makerPage,
  makeDraw,
  getDraws,
  aboutPage,
};
