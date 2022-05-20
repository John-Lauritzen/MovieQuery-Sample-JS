var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');
var fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/movies', (req, res, next) => {
    //get title value of search query from URL
    var title = req.query.search;
    //Get API Key from file
    try {
        var data = fs.readFileSync('api.txt', 'utf8');
        console.log(data);
        var APIkey = data;
    } catch (err) {
        console.error(err);
    }
    //Create URLs for querying TMDB
    var TMDBquery = 'https://api.themoviedb.org/3/search/movie?api_key=' + APIkey + '&language=en-US&query=' + title + '&include_adult=false';
    var TMDBconfig = 'https://api.themoviedb.org/3/configuration?api_key=' + APIkey
    console.log(TMDBquery);
    //Create variables for storing config and response
    var Baseurl = '';
    var Size = '';
    var TMDBresults = '';
    //Query TMDB - TO BE FIXED: Variables are not available outside of axios resulting in emptry result and incomplete data
    axios
        .get(TMDBconfig)
        .then(res => {
            Baseurl = res.data.images.secure_base_url;
            Size = res.data.images.poster_sizes[4];
        })
        .catch(error => {
            console.error(error);
        })
    axios
        .get(TMDBquery)
        .then(res => {
            console.log(res.status);
            //Store results
            var TMDBdata = res.data.results;
            //Iterate over the first 10 results and store
            var i = 0;
            var Tempdata = '{ "data" : [';
            while (i <10) {
                console.log(TMDBdata[i].title);

                Tempdata += '{"movie_id":' + TMDBdata[i].id + 
                ', "title":"' + TMDBdata[i].title + 
                '", "poster_image_url":"' + Baseurl + Size + TMDBdata[i].poster_path +
                '", "popularity_summary":"' + TMDBdata[i].popularity + ' out of ' + TMDBdata[i].vote_count +
                '" }';
                if(i == 9) {
                    Tempdata += ' ]}';
                }
                else {
                    Tempdata += ', ';
                }
                //console.log(Tempdata);
                i++;
            };
            console.log(Tempdata);
            const TMDBresults = Tempdata;
        })
        .catch(error => {
            console.error(error);
        })
    console.log(TMDBresults);
    res.send(TMDBresults);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
