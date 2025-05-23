const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { validateTeamsResponse } = require('../middleware/validation');

router.get('/', 
  async (req, res, next) => {
    try {
      const teams = await Team.find().populate({
      path: 'scores',
      populate: {
        path: 'judge',
        select: 'name'
      }
    });
    res.locals.teams = teams;
    next();
    } catch (err) {
      next(err);
    }
  },
  validateTeamsResponse,
  (req, res) => {
    try {
        console.log('Formatting teams data...');
      const formattedTeams = res.locals.teams.map(team => ({
        _id: team._id,
        name: team.name,
        order: team.order,
        totalPoints: team.scores.reduce((sum, score) => sum + (score?.points || 0), 0)
      }));
console.log('Formatted teams:', formattedTeams);
      res.json({
        success: true,
        data: formattedTeams
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error formatting team data'
      });
    }
  }
);


router.post('/', async (req, res) => {
  try {
    const lastTeam = await Team.findOne().sort('-order');
    const newTeam = new Team({
      name: req.body.name,
      order: lastTeam ? lastTeam.order + 1 : 1
    });
    
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;