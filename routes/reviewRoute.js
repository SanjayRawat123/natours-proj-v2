const express = require('express');
const tourController = require('../controller/tour-controller');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController')

const router = express.Router({ mergeParams: true });
// POST /tour/234fad4/reviews
// POST /reviews

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        // reviewController.setTourUserIds,
        reviewController.createReview
    );
  
    

module.exports = router;