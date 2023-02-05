function validateBody(schema) {
  return (req, res, next) => {
    return schema.validate(req.body);
  };
}

module.exports = {
  validateBody,
};
