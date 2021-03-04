const express = require('express');
const router = express.Router();

const publicationController = require('./../controllers/publication');

router
  .route('/')
  .get(publicationController.getAllPublications)
  .post(publicationController.postPublication);

router
  .route('/:publicationId')
  .get(publicationController.getPublicationById)
  .put(publicationController.updatePublication)
  .delete(publicationController.deletePublication);

module.exports = router;
