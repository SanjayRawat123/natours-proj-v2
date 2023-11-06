const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    duration:{
        type:String,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true, 'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have difficulty']
    },

    ratingsAverage: {
        type: Number,
        default: 4.3

    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have ']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,'Tour must have Discription']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true , 'a tour must have cover image']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[String]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;