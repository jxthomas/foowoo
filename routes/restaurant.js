'use strict'


//setup Mongoose and connect to MongoDB
var mongoose = require ("mongoose"); // our MongoDB ODM
var paginate = require('mongoose-pagination'); //we need to page through our results set for 'all' type queries

// using our MongoDB nyc database, restaurant collections
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nyc';
var Restaurant;
var restaurantSchema = mongoose.Schema({
   boro_name: {type:String},
   dba      : {type:String},
   building : {type:String},
   street   : {type:String},
   zip_code : {type:String},
   phone    : {type:Number},
   grade    : {type:String},
   cusine_description   : {type:String}  

});

//get our configuration data
var nconf = require('nconf');

// First get commandline arguments and environment vars....
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({ file: './config.json' });

// Provide default values for settings not provided above.
nconf.defaults({
    'yelp': {
              consumer_key: "consumer-key", 
              consumer_secret: "consumer-secret",
              token: "token",
              token_secret: "token-secret"
    }
});


//setup yelp api
var yelp = require("yelp").createClient({
  consumer_key: nconf.get('yelp:consumer_key'), 
  consumer_secret: nconf.get('yelp:consumer_secret'),
  token: nconf.get('yelp:token'),
  token_secret: nconf.get('yelp:token_secret')
});


//------------ TESTING ----------------------------
//console.log(yelp)
//mongoose.set('debug', true)
//------------ TESTING ----------------------------


//connect to MongoDB
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  Restaurant = mongoose.model('restaurant', restaurantSchema);
  }
});

 


/*
 * GET restaurant listing by boro
 */

exports.boroList = function(req, res){


  //console.log("show boro listing for " + req.params.name)
  Restaurant.find({'boro_name':req.params.name},null)
      .select('dba building street phone current_grade cusine_description zipcode -_id')
      .sort('dba')
      .paginate( req.params.page,10, function(error, docs,total) 
      {
          if (error) {
              console.error(error);
              res.send(500, { error: 'something blew up' });
          } else {
              console.log('Total Documents:', total);
              res.send({'total_docs': total,'results' : docs});
          }
      });
}



/*
 * GET restaurant listing by cusine
 */

exports.cusineList = function(req, res){
  //console.log("show cusine listing");
  Restaurant.find()
            .distinct('cusine_description', function(error, descriptions) {
                if (error) {
                   console.error(error);
                   res.send(500, { error: 'something blew up' });
                } else {
                   res.send({'results' : descriptions.sort()});
                }
            });
}



/*
 * GET restaurant listing by restaurant name
 */

exports.nameList = function(req, res){
  var searchArg = req.params.name.toUpperCase() //all of restaurant names are in uppercase
  //console.log("show name listing for " + searchArg)

  Restaurant.find({dba: new RegExp('^'+searchArg)})
      .select('dba building street phone current_grade cusine_description zipcode -_id')
      .sort('dba')
      .paginate( req.params.page,10, function(error, docs,total) 
      {
          if (error) {
              console.error(error);
              res.send(500, { error: 'something blew up' });
          } else {
          //    console.log('Total Documents:', total);
              res.send({'total_docs': total,'results' : docs});
          }
      });
}


/*
 * GET restaurant listing by street name
 */

exports.streetList = function(req, res){
  var searchArg = req.params.name.toUpperCase() //all of street names are in uppercase
  console.log("show street listing for " + searchArg)

  Restaurant.find({street: new RegExp(searchArg)})
      .select('dba building street phone current_grade cusine_description zipcode -_id')
      .sort('dba')
      .paginate( req.params.page,3, function(error, docs,total) 
      {
          if (error) {
              console.error(error);
              res.send(500, { error: 'something blew up' });
          } else {
          //    console.log('Total Documents:', total);
              res.send({'total_docs': total,'results' : docs});
          }
      });
}
/*
*
* GET restaurant listing by cusine and boro
*/

exports.cusineBoroList = function(req, res){
 //console.log("show listing for " + req.params.cusine + ' in ' + req.params.boro);
 Restaurant.find({cusine_description:  req.params.cusine  ,boro_name: req.params.boro })
     .select('dba building street phone current_grade cusine_description zipcode -_id')
     .sort('dba')
     .paginate( req.params.page,10, function(error, docs,total) 
     {
         if (error) {
             console.error(error);
             res.send(500, { error: 'something blew up' });
         } else {
         //    console.log('Total Documents:', total);
             res.send({'total_docs': total,'results' : docs});
         }
     });
}
exports.yelp = function(req, res){
      

       yelp.search({location: req.params.address,telephone : req.params.phone ,term : req.params.cusine_description},
       function(error, data) {
          var yelpData = {};
          if (error) {
              console.error(error);
              res.send(500, { error: 'something blew up' });
          } else {
              var places =  data['businesses'];
          
              for (var i=0;i<places.length;i++) {
              
                  if (places[i].phone == req.params.phone) {
                      //console.log(places[i]);
                      yelpData = places[i]
                      //console.log(yelpData);
                      break;
                  }
              }
              res.send(yelpData);
          }

       });
 
}