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
        console.log(req.query)

        //Build query
        // 1A) Filtering
        const queryObj = { ...req.query };
        const excluedFields = ['page', 'sort', 'limit', 'fields'];
        excluedFields.forEach(el => delete queryObj[el])

        // 1B) : Advance filtering
        //converting queryObj object in string 
        let qureyStr = JSON.stringify(queryObj);
        qureyStr = qureyStr.replace(/\b(gte|gt|lte|lt)\b/g , match =>`$${match}`);
        console.log(JSON.parse(qureyStr))

        //{ difficulty: 'easy', duration:{$gte:5}}
        //{ difficulty: 'easy', duration:{gte:5}}
        //gte,gt,lge,lt
        
        let query = Tour.find(JSON.parse(qureyStr));
        //2) Sorting 
        if(req.query.sort){
            query = query.sort(req.query.sort)    
        }

        //ExcuteQuery
        const tours = await query;


        // const query = await Tour.find()
        // .where('duration')
        // .equals(5)
        // .where('difficulty')
        // .equals('easy')
        //tours = await query

        //send response
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


exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(404).json(
            {
                status: 'fail',
                message: 'Invalid ID'
            }
        )
    }

}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            massage: err
        });
    }
}