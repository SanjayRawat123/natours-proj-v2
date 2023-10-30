const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};

//create chackBody middleware    
//check if body contains the name and price property
//If not ,then send back 404 (bad request)
//add it to the post handler stack
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }
    next();
};


exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        requestedAt: req.requestTime,
        results: tours.length,
        status: 'succes',
        data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        status: 'succes',
        data: {
            tour
        }
    });
};

exports.addTours = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    // eslint-disable-next-line prefer-object-spread
    const newTours = Object.assign({ id: newId }, req.body);
    tours.push(newTours);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTours
            }
        });

    });
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });

};
