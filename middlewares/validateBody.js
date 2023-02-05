function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(error);
    }
    next();
  };
}

module.exports = {
  validateBody,
};
