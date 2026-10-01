const express = require('express');
const router = express.Router();
router.use((req, res) => res.status(501).json({ success: false, message: 'This module is scheduled for the next implementation phase' }));
module.exports = router;
