const express = require('express');
const tourController = require('../controller/tour-controller');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController')

const router = express.Router({ mergeParams: true });

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