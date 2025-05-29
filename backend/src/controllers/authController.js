const jwt = require('jsonwebtoken');
const { User, MaidProfile, ClientProfile, Role } = require('../models');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
  const expiresInEnv = process.env.JWT_EXPIRES_IN;
  const fallbackExpiresIn = '3600s';

  console.log('🔍 JWT_EXPIRES_IN from env:', expiresInEnv);
  console.log('👤 Generating token for user ID:', user.id);

  const validExpiresIn =
    typeof expiresInEnv === 'string' && expiresInEnv.trim() !== ''
      ? expiresInEnv
      : fallbackExpiresIn;

  console.log('⏳ Using expiresIn value:', validExpiresIn);

  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: validExpiresIn }
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
      serviceAreas,
      languages,
      otherLanguages,
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

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Get the role ID
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Create user with roleId
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      roleId: roleRecord.id
    });

    if (role === 'MAID') {
      // Process languages
      let processedLanguages = languages || [];
      if (otherLanguages && otherLanguages.trim()) {
        const additionalLanguages = otherLanguages
          .split(',')
          .map(lang => lang.trim().toUpperCase())
          .filter(lang => lang && !processedLanguages.includes(lang));
        processedLanguages = [...processedLanguages, ...additionalLanguages];
      }

      await MaidProfile.create({
        userId: user.id,
        hourlyRate: hourlyRate || 0,
        experience: experience || 0,
        services: services || [],
        serviceAreas: serviceAreas || [],
        languages: processedLanguages
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
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Role, as: 'role' },
        { model: MaidProfile, as: 'maidProfile' },
        { model: ClientProfile, as: 'clientProfile' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
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