const Score = require('../models/Score');
const Judge = require('../models/Judge');
const Team  = require('../models/Team');

exports.submitScore = async (req, res) => {
  const { teamId, judgeId, points } = req.body;

  if (points < 0) 
    return res.status(400).json({ message: 'Points must be non-negative' });

  try {
    const judge = await Judge.findById(judgeId);
    if (!judge) return res.status(404).json({ message: 'Judge not found' });

    const remaining = judge.maxPoints - judge.assignedPoints;
    if (points > remaining) {
      return res.status(400).json({
        message: `Insufficient budget. You have only ${remaining} pts left.`
      });
    }

    // 1) create the score
    const score = await Score.create({
      team: teamId,
      judge: judgeId,
      points
    });

    // 2) update judge’s assignedPoints
    judge.assignedPoints += points;
    await judge.save();

    // 3) (optional) add to team.scores array
    await Team.findByIdAndUpdate(teamId, { $push: { scores: score._id } });

    // 4) emit refresh if you want
    req.app.get('io')?.emit('teams-updated');  

    return res.status(201).json(score);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
