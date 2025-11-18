const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/events', require('./events'));
router.use('/connections', require('./connections'));
router.use('/resources', require('./resources'));
router.use('/gamification', require('./gamification'));
router.use('/notes', require('./notes'));
router.use('/posts', require('./posts'));
router.use('/helpline', require('./helpline'));
router.use('/lost-items', require('./lostItem'));
router.use('/notices', require('./notice'));
router.use('/placements', require('./placement'));
router.use('/materials', require('./studyMaterial'));
router.use('/files', require('./files'));
router.use('/news', require('./news'));
router.use('/blogs', require('./blog'));
router.use('/posts', require('./posts'));
router.use('/creators', require('./creators'));
router.use('/conversations', require('./conversations'));

module.exports = router;
