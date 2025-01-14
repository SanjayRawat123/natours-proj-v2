const express = require('express');
const tourController = require('./../controller/tour-controller');
const router = express.Router();

router.param('id', tourController.checkID);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody,tourController.addTours);
router
    .route('/:id')
    .delete(tourController.deleteTour)
    .get(tourController.getTour);

module.exports = router;