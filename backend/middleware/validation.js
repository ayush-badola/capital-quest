exports.validateTeamsResponse = (req, res, next) => {
  if (!Array.isArray(res.locals.teams)) {
    return res.status(500).json({
      success: false,
      error: 'Invalid data format: expected array'
    });
  }
  next();
};