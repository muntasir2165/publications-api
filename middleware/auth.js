const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const error = new Error();
  error.status = 403;

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        return next();
      } catch (error) {
        error.message = 'Invalid/expired token';
        return next(error);
      }
    }

    error.message = 'Authorization token must be Bearer [token]';
    return next(error);
  }

  error.message = 'Authorization header must be present';
  return next(error);
};
