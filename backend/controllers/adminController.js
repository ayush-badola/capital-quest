// const Team = require('../models/Team');

// exports.getCurrentTeam = async (req, res) => {
//   try {
//     const currentTeam = await Team.findOne().sort('-order');
//     res.json(currentTeam);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.nextTeam = async (req, res) => {
//   try {
//     const currentTeam = await Team.findOne().sort('-order');
//     const nextTeam = await Team.findOne({ order: { $gt: currentTeam.order } }).sort('order');
    
//     if (!nextTeam) return res.status(404).json({ message: 'No more teams' });
//     res.json(nextTeam);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// controllers/adminController.js
























// const Team = require('../models/Team');

// exports.getCurrentTeam = async (req, res) => {
//   try {
//     // the current team is the one with the highest 'order'
//     const currentTeam = await Team.findOne().sort('-order');
//     return res.json(currentTeam);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// exports.nextTeam = async (req, res) => {
//   try {
//     // 1) find the current (highest order)
//     const currentTeam = await Team.findOne().sort('-order');

//     // 2) try to get the next one
//     let nextTeam = await Team.findOne({ order: { $gt: currentTeam.order } }).sort('order');

//     if (!nextTeam) {
//       // if none found, wrap around to the first (lowest order)
//       nextTeam = await Team.findOne().sort('order');
//     }

//     return res.json(nextTeam);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };


























// controllers/adminController.js
const Team    = require('../models/Team');
const Current = require('../models/current');

// Ensure there’s exactly one Current doc, pointing at some team
async function ensureCurrentDoc() {
  let cur = await Current.findOne();
   const first = await Team.findOne().sort('order');
  if (!cur) {
    // on first-ever call, point at the very first (lowest-order) team
    // const first = await Team.findOne().sort('order');
    cur = await Current.create({ team: first._id });
  }else{
     const exists = await Team.exists({ _id: cur.team });
    if (!exists) {
      // broken pointer: reset to first
      cur.team = first._id;
      await cur.save();
    }
  }
  return cur;
}

exports.getCurrentTeam = async (req, res) => {
  try {
    const curDoc = await ensureCurrentDoc();
    const currentTeam = await Team.findById(curDoc.team);
    return res.json(currentTeam);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.nextTeam = async (req, res) => {
  try {
    // 1) Get (or create) our “pointer” document
    const curDoc = await ensureCurrentDoc();

    // 2) Fetch the full Team object for the current pointer
    const currentTeam = await Team.findById(curDoc.team);
    if (!currentTeam) {
      // sanity check
      return res.status(500).json({ message: 'Current team not found' });
    }

    // 3) Find the very next by order
    let next = await Team.findOne({ order: { $gt: currentTeam.order } }).sort('order');

    // 4) If we’re past the last team, wrap to the first
    if (!next) {
      next = await Team.findOne().sort('order');
    }

    // 5) Persist the new pointer and return it
    curDoc.team = next._id;
    await curDoc.save();
    return res.json(next);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
