const express = require('express');
const morgan = require('morgan');
const tourRouters = require('./routes/tourRoute');
const userRouters = require('./routes/userRoute');
const app = express();

//1] Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})



app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
module.exports = app;

