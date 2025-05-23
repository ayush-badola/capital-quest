const Judge = require('../models/Judge');

exports.getAllJudges = async (req, res) => {
  try {
    const judges = await Judge.find();
    res.json(judges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createJudge = async (req, res) => {
  try {
    const { name, maxPoints } = req.body;
    const newJudge = new Judge({
      name,
      maxPoints: maxPoints || 100
    });
    
    const savedJudge = await newJudge.save();
    res.status(201).json(savedJudge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getJudgeById = async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id);
    if (!judge) return res.status(404).json({ message: 'Judge not found' });
    res.json(judge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateJudgePoints = async (req, res) => {
  try {
    const { maxPoints } = req.body;
    const updatedJudge = await Judge.findByIdAndUpdate(
      req.params.id,
      { maxPoints },
      { new: true }
    );
    res.json(updatedJudge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteJudge = async (req, res) => {
  try {
    await Judge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Judge deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};