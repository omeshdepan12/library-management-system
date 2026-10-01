const express = require('express');
const { permissionMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_DASHBOARD]), (req, res) => {
  res.json({ success: true, message: 'Notifications module is scheduled for Q2 implementation' });
});

router.post('/test', permissionMiddleware([PERMISSIONS.VIEW_DASHBOARD]), (req, res) => {
  res.json({ success: true, message: 'Test notification would be sent here' });
});

module.exports = router;
