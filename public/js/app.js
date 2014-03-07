'use strict';

/* App Module */
// Angular module, defining routes for the app

var restaurantApp = angular.module('restaurantApp', [ 'ngRoute','restaurantControllers','phonecatFilters',
    'ui.bootstrap'])
restaurantApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

		$routeProvider.
			//when('/boro/:name/:page', { templateUrl: 'partials/boroList.html', controller: RestaurantCtrl }).
			//when('/poll/:pollId', { templateUrl: 'partials/item.html', controller: PollItemCtrl }).
			//when('/new', { templateUrl: 'partials/new.html', controller: PollNewCtrl }).
			// If invalid route, just redirect to the main list view
			otherwise({ redirectTo: '/' });
                $locationProvider.html5Mode(true);
	}]);

/*
 *  use this filter to format the telephone numbers
 */

angular.module('phonecatFilters', []).filter('phoneFormat', function() {
  return function(value) {

     var tel = value.toString();
     var npa = tel.slice(0,3);   
     var nnx = tel.slice(3,6);
     var number =  tel.slice(6);
     var result = '(' + npa + ') ' + nnx + '-' + number;
     //console.log (tel + ' / ' + result);
    return  result;
  };
});

//console.info('app.js fired!');		
