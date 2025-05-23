const express = require('express');
const router  = express.Router();
const { submitScore } = require('../controllers/scoreController');

router.post('/', submitScore);

module.exports = router;
