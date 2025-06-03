exports.adminOnly = (req, res, next) => {
  return req.user?.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'Admin access only' });
};
