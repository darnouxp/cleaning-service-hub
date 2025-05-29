const { Op } = require('sequelize');
const db = require('../models');

exports.getServiceCatalog = async (req, res) => {
  try {
    const { cityCode, tenantID } = req.query;
    if (!cityCode || !tenantID) {
      return res.status(400).json({ error: 'cityCode and tenantID are required' });
    }

    const today = new Date();
    const services = await db.serviceCatalog.findAll({
      where: {
        cityCode,
        tenantID: Number(tenantID),
        seasonStart: { [Op.lte]: today },
        seasonEnd: { [Op.gte]: today }
      }
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service catalog', details: err.message });
  }
}; 