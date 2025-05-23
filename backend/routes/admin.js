const express = require('express');
const router = express.Router();
const { nextTeam, getCurrentTeam } = require('../controllers/adminController');

router.get('/current-team', getCurrentTeam);
router.post('/next-team', nextTeam);

module.exports = router;