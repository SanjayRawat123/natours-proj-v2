const Tour = require('../models/tourModel');
const APIFeatures = require("../utils/apiFeatures");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

exports.aliasTopTour = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// eslint-disable-next-line arrow-body-style


exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            newTour
        }
    });

});
// exports.createTour = async (req, res) => {
//     try {
//         //   const newTour = new Tour();
//         //   newTour.save()
//         const newTour = await Tour.create(req.body);

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 newTour
//             }
//         })
//     } catch (error) {
//         res.status(400).json({
//             status: "Bed Request",
//             message: 'invalid data sent'
//         })
//     }

// };



exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .fieldLimiting()
        .paginate();
    const tours = await features.query;
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }

    });
    // try {
    //     console.log(req.query)

    //Build query
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excluedFields = ['page', 'sort', 'limit', 'fields'];
    // excluedFields.forEach(el => delete queryObj[el])

    // // 1B) : Advance filtering
    // //converting queryObj object in string 
    // let qureyStr = JSON.stringify(queryObj);
    // qureyStr = qureyStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(qureyStr))

    // //{ difficulty: 'easy', duration:{$gte:5}}
    // //{ difficulty: 'easy', duration:{gte:5}}
    // //gte,gt,lge,lt

    // let query = Tour.find(JSON.parse(qureyStr));

    //2) Sorting 
    // http://localhost:3000/api/v1/tours?sort=price,ratingsAverage
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     console.log(sortBy)
    //     query = query.sort(sortBy)
    // } else {
    //     query = query.sort('-createdAt');
    // }

    //3) Field limiting

    // if (req.query.fields) {
    //     const fields = req.query.fields.split(',').join(' ');
    //     query = query.select(fields);
    // } else {
    //     query = query.select('-__v');
    // }

    // //4)Pagination
    // //    http://localhost:3000/api/v1/tours?page=1&limit=3
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit)

    // if (req.query.page) {
    //     const numTours = await Tour.countDocuments();
    //     if (skip >= numTours) throw new Error('This page not exist')
    // }

    //ExcuteQuery
    // const features = new APIFeatures(Tour.find(), req.query)
    //     .filter()
    //     .sort()
    //     .fieldLimiting()
    //     .paginate();
    // const tours = await features.query;



    // const query = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy')
    //tours = await query

    //send response
    //     res.status(200).json({
    //         status: 'success',
    //         results: tours.length,
    //         data: {
    //             tours
    //         }

    //     });
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }


});

exports.getTourById = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id)
    if (!tour) {
        return next(new AppError('no tour found with id ', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });

});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!tour) {
        return next(new AppError('no tour found with id ', 404));
    }
    res.status(200).json({
        status: 'updateTour success',
        data: {
            tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('no tour found with id ', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    });
});

