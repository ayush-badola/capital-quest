const Team = require('../models/Team');
const Score = require('../models/Score');

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort('order');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const lastTeam = await Team.findOne().sort('-order');
    const newTeam = new Team({
      name: req.body.name,
      order: lastTeam ? lastTeam.order + 1 : 1
    });
    
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};