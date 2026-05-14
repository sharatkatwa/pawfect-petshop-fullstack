const asyncHandler = (handleController) => {
  return (req, res, next) =>
    Promise.resolve(handleController(req, res, next)).catch((error) =>
      next(error),
    );
};

module.exports = asyncHandler
