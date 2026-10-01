const express = require('express');
const Setting = require('../models/Setting');
const { permissionMiddleware, ownerOnlyMiddleware } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.get('/', permissionMiddleware([PERMISSIONS.VIEW_DASHBOARD]), async (req, res, next) => {
  try {
    const settings = await Setting.find();
    const data = {};
    settings.forEach(s => { data[s.key] = s.value; });
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

router.patch('/', ownerOnlyMiddleware, async (req, res, next) => {
  try {
    const updates = {};
    for (const [key, value] of Object.entries(req.body)) {
      const setting = await Setting.findOneAndUpdate({ key }, { value, updatedBy: req.user._id }, { new: true, upsert: true });
      updates[key] = setting.value;
    }
    res.json({ success: true, data: updates });
  } catch (error) { next(error); }
});

module.exports = router;
