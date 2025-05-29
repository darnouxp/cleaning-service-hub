const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ 
      where: { id: decoded.id, isActive: true },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

const authorize = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        include: [{ model: Role, as: 'role' }]
      });

      if (!user || !roles.includes(user.role.name)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking permissions' });
    }
  };
};

const generateToken = (user) => {
  const expiresInEnv = process.env.JWT_EXPIRES_IN;
  const fallbackExpiresIn = '3600s';

  console.log('🔍 JWT_EXPIRES_IN from env:', expiresInEnv);
  console.log('👤 Generating token for user ID:', user.id, 'with role:', user.role);

  const validExpiresIn =
    typeof expiresInEnv === 'string' && expiresInEnv.trim() !== ''
      ? expiresInEnv
      : fallbackExpiresIn;

  console.log('⏳ Using expiresIn value:', validExpiresIn);

  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: validExpiresIn }
  );
};

module.exports = { auth, authorize, generateToken }; 