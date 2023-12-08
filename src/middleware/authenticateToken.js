const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
  }

  const cleanToken = token.replace('Bearer ', '');

  jwt.verify(cleanToken, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error(err); // Cetak kesalahan untuk debugging
      return res.status(403).json({ message: 'Token tidak valid.' });
    }

    // Setel pengguna yang telah diotentikasi ke objek permintaan
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
