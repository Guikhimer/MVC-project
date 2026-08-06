const jwt = require('jsonwebtoken');

const getTokenFromRequest = (req) => {
  const cookies = Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .filter(Boolean)
      .map((cookie) => {
        const separator = cookie.indexOf('=');
        return [cookie.slice(0, separator).trim(), decodeURIComponent(cookie.slice(separator + 1))];
      })
  );

  const bearerToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  return cookies.token || bearerToken;
};

const optionalAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token || !process.env.JWT_SECRET) {
    res.locals.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = req.user;
  } catch {
    res.locals.user = null;
  }

  return next();
};

const requireAuth = (req, res, next) => {
  optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária para esta operação.',
      });
    }

    return next();
  });
};

module.exports = { optionalAuth, requireAuth };
