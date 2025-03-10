const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });
//database connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log("DB connection successful!"));
////end///

// const tourSchema = mongoose.Schema({
//   name: {
//     type: String,
//     require: [true, 'A tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.3

//   },
//   price: {
//     type: Number,
//     require: [true, 'A tour must have ']
//   }

// })
// const Tour = mongoose.model('Tour', tourSchema);
// const testTour = new Tour({
//   name: "The forest hiker",
//   rating: '4.3',
//   price: '497'
// })

// testTour.save().then(
//   doc => {
//     console.log(doc);
//   }
// ).catch(err => {
//   console.log('Error:', err);
// });





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app runnig on port ${port}`);
});
