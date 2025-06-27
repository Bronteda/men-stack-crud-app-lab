// middleware/authMiddleware.js

function isAuthenticated(req, res, next) {
  if (!req.session.user || !req.session.user._id) {
    return res.redirect("/auth/sign-in");
  }
  next();
}

module.exports = { isAuthenticated };
