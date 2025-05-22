const jwt = require('jsonwebtoken');
const { User, MaidProfile, ClientProfile } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array() 
      });
    }

    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      role,
      // Maid-specific fields
      hourlyRate,
      experience,
      services,
      // Client-specific fields
      address,
      preferredContactMethod
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber || !role) {
      console.log('Missing required fields:', { email, password, firstName, lastName, phoneNumber, role });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          email: !email,
          password: !password,
          firstName: !firstName,
          lastName: !lastName,
          phoneNumber: !phoneNumber,
          role: !role
        }
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role
    });

    // Create corresponding profile based on role
    if (role === 'MAID') {
      await MaidProfile.create({
        userId: user.id,
        hourlyRate: hourlyRate || 0,
        experience: experience || 0,
        services: services || []
      });
    } else {
      await ClientProfile.create({
        userId: user.id,
        address: address || '',
        preferences: {
          preferredContactMethod: preferredContactMethod || 'EMAIL'
        }
      });
    }

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: MaidProfile, required: false },
        { model: ClientProfile, required: false }
      ]
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phoneNumber'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    await req.user.update(updates);
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 