const express = require('express');
const router = express.Router();
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/events', require('./events'));
router.use('/connections', require('./connections'));
router.use('/resources', require('./resources'));
router.use('/gamification', require('./gamification'));
module.exports = router;
