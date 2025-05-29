const express = require('express');
const router = express.Router();
const serviceCatalogController = require('../controllers/serviceCatalog');

router.get('/', serviceCatalogController.getServiceCatalog);
 
module.exports = router; 