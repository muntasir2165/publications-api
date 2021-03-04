const express = require('express');
const router = express.Router();

const publicationController = require('../controllers/publication');

router.route('/').get(publicationController.getPublicationsByLoggedInUser);

module.exports = router;
