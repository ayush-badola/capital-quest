const express = require('express');
const router = express.Router();
const judgeController = require('../controllers/judgeController');
const Judge = require('../models/Judge');

// Get all judges
router.get('/', judgeController.getAllJudges);

// Create a new judge
router.post('/', judgeController.createJudge);

// Get judge by ID
router.get('/:id', judgeController.getJudgeById);

// Update judge's maximum points
router.put('/:id', judgeController.updateJudgePoints);

// Delete a judge
router.delete('/:id', judgeController.deleteJudge);

module.exports = router;