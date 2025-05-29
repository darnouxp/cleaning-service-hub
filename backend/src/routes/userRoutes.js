const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { User, MaidProfile, ClientProfile } = require('../models');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: MaidProfile,
          as: 'maidProfile'
        },
        {
          model: ClientProfile,
          as: 'clientProfile'
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      firstName,
      lastName,
      phoneNumber,
      email
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Update maid profile
router.put('/maid-profile', auth, async (req, res) => {
  try {
    const { hourlyRate, experience, services, availability } = req.body;
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: MaidProfile,
        as: 'maidProfile'
      }]
    });

    if (!user || user.role !== 'MAID') {
      return res.status(404).json({ error: 'Maid profile not found' });
    }

    if (user.maidProfile) {
      await user.maidProfile.update({
        hourlyRate,
        experience,
        services,
        availability
      });
    } else {
      await MaidProfile.create({
        userId: user.id,
        hourlyRate,
        experience,
        services,
        availability
      });
    }

    res.json({ message: 'Maid profile updated successfully' });
  } catch (error) {
    console.error('Error updating maid profile:', error);
    res.status(500).json({ error: 'Failed to update maid profile' });
  }
});

// Update client profile
router.put('/client-profile', auth, async (req, res) => {
  try {
    const { address, city, state, zipCode, preferences, preferredContactMethod } = req.body;
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: ClientProfile,
        as: 'clientProfile'
      }]
    });

    if (!user || user.role !== 'CLIENT') {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    if (user.clientProfile) {
      await user.clientProfile.update({
        address,
        city,
        state,
        zipCode,
        preferences,
        preferredContactMethod
      });
    } else {
      await ClientProfile.create({
        userId: user.id,
        address,
        city,
        state,
        zipCode,
        preferences,
        preferredContactMethod
      });
    }

    res.json({ message: 'Client profile updated successfully' });
  } catch (error) {
    console.error('Error updating client profile:', error);
    res.status(500).json({ error: 'Failed to update client profile' });
  }
});

// Get maid profile
router.get('/maid/:id', async (req, res) => {
  try {
    const maid = await User.findOne({
      where: {
        id: req.params.id,
        role: 'MAID',
        isActive: true
      },
      include: [{
        model: MaidProfile,
        as: 'maidProfile'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!maid) {
      return res.status(404).json({ error: 'Maid not found' });
    }

    res.json(maid);
  } catch (error) {
    console.error('Error fetching maid profile:', error);
    res.status(500).json({ error: 'Failed to fetch maid profile' });
  }
});

// Get client profile
router.get('/client/:id', auth, async (req, res) => {
  try {
    const client = await User.findOne({
      where: {
        id: req.params.id,
        role: 'CLIENT'
      },
      include: [{
        model: ClientProfile,
        as: 'clientProfile'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client profile:', error);
    res.status(500).json({ error: 'Failed to fetch client profile' });
  }
});

// Admin-only: Get all users
router.get('/', auth, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router; 