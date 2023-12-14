const express = require('express');
const tourController = require('../controller/tour-controller');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

// router.param('id', tourController.checkID);
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);
router
    .route('/:id')
    .delete(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour)
    .get(tourController.getTourById)
    .patch(tourController.updateTour);




// // POST /tour/234fad4/reviews
// // GET /tour/234fad4/reviews

// router
// .route('/:tourId/reviews')
// .post(authController.protect, authController.restrictTo('user'),
//     reviewController.createReview);

module.exports = router;