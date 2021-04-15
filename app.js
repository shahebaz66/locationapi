var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-shahebaz:admin123@shahebaz.r8yb8.mongodb.net/food?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{console.log("db connected");});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
const Schema = mongoose.Schema;


const mySchema = new Schema({
  
  X: String,
  Latitude:String,
  Longitude:String,
  FoodItems:String,
  FacilityType:String,
  loc : { type: {type:String}, coordinates: [ Number ] }
});

mySchema.index( { loc : "2dsphere" } )
const Location = mongoose.model('Location', mySchema);
app.get('/:longitude/:latitude',async (req,res)=>{

  var data=await Location.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ Number(req.params.longitude) , Number(req.params.latitude) ] },
         distanceField: "calculated",
         maxDistance: 500,
         query: { FacilityType: "Truck" },
         
      }
    }
 ])
  
  res.status(200).json(data)
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3100,()=>{console.log("connected");})
module.exports = app;
