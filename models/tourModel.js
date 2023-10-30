const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.3

    },
    price: {
        type: Number,
        require: [true, 'A tour must have ']
    }

});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;