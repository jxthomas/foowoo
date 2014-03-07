
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var restaurant = require('./routes/restaurant');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//---- used by front end for searching
app.get('/boro/:name/:page',restaurant.boroList);
app.get('/name/:name/:page',restaurant.nameList);
app.get('/cusine/:cusine/:boro/:page',restaurant.cusineBoroList)
//---- for yelp
app.get('/yelp/:address/:phone/:cusine_description',restaurant.yelp);


//catch all route
app.get('*', function(req, res){
  res.send(404);
});

module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
