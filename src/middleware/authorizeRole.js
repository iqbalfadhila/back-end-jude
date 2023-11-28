// authorizeRole.js
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
      const userRole = req.user.role;
    //   console.log(requiredRole)
    //   console.log(userRole)
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Akses ditolak. Role tidak sesuai.' });
      }
  
      next();
    };
  };
  
  module.exports = authorizeRole;
  