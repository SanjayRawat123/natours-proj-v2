/* eslint-disable no-unused-expressions */
const express = require('express');
const morgan = require('morgan');

const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError')
const tourRouters = require('./routes/tourRoute');
const userRouters = require('./routes/userRoute');

const app = express();

//1] Middlewares
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log("Running in development mode");
} else if (process.env.NODE_ENV === 'production') {
  // Production-specific configurations
  // For example, you might want to use a different database, caching, error handling, etc.
  console.log('Running in production mode');
} else {
  console.log('NODE_ENV is not set or is in an unexpected state');
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers)
  next();
})



app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)
module.exports = app;

