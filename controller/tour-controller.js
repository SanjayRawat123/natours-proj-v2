const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
    try {
        //   const newTour = new Tour();
        //   newTour.save()
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "Bed Request",
            message: 'invalid data sent'
        })
    }

}

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }

        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }


}


