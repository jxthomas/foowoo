//
// controller.js
//

//console.info('controller fired!');



var restaurantControllers = angular.module('restaurantControllers', []);	

restaurantControllers.controller('RestaurantCtrl', ['$scope','$http', '$modal','$routeParams',
   function ($scope,$http,$modal) {
   
   //
   // setup list of boroughs
   //   
	

    $scope.boroList = [ {name:"Bronx"},
	                    {name:"Brooklyn"},
	                    {name:"Manhattan"},
	                    {name:"Queens"},
	                    {name:"Staten Island"},
	                    {name:"Unknown"}
                      ];
    //
    // setup list of cusine
    //  
    $scope.cusineList =   [
                                     {name:"Afghan"},
                                     {name:"African"},
                                     {name:"American"},
                                     {name:"Armenian"},
                                     {name:"Asian"},
                                     {name:"Australian"},
                                     {name:"Bagels/Pretzels"},
                                     {name:"Bakery"},
                                     {name:"Bangladeshi"},
                                     {name:"Barbecue"},
                                     {name:"Bottled beverages, including water, sodas, juices, etc."},
                                     {name:"Brazilian"},
                                     {name:"Café/Coffee/Tea"},
                                     {name:"Cajun"},
                             	     {name:"Californian"},
                                     {name:"Caribbean"},
                                     {name:"Chicken"},
                                     {name:"Chinese"},
                                     {name:"Chinese/Cuban"},
                                     {name:"Chinese/Japanese"},
                                     {name:"Continental"},
                                     {name:"Creole"},
                                     {name:"Creole/Cajun"},
                                     {name:"Czech"},
                                     {name:"Delicatessen"},
                                     {name:"Donuts"},
                                     {name:"Eastern European"},
                                     {name:"Egyptian"},
                                     {name:"English"},
                                     {name:"Ethiopian"},
                                     {name:"Filipino"},
                                     {name:"French"},
                                     {name:"Fruits/Vegetables"},
                                     {name:"German"},
                                     {name:"Greek"},
                                     {name:"Hamburgers"},
                                     {name:"Hawaiian"},
                                     {name:"Hotdogs"},
                                     {name:"Hotdogs/Pretzels"},
                                     {name:"Ice Cream, Gelato, Yogurt, Ices"},
                                     {name:"Indian"},
                                     {name:"Indonesian"},
                                     {name:"Iranian"},
                                     {name:"Irish"},
                                     {name:"Italian"},
                                     {name:"Japanese"},
                                     {name:"Jewish/Kosher"},
                                     {name:"Juice, Smoothies, Fruit Salads"},
                                     {name:"Korean"},
                                     {name:"Latin (Cuban, Dominican, Puerto Rican, South & Central American)"},
                                     {name:"Mediterranean"},
                                     {name:"Mexican"},
                                     {name:"Middle Eastern"},
                                     {name:"Moroccan"},
                                     {name:"Not Listed/Not Applicable"},
                                     {name:"Nuts/Confectionary"},
                                     {name:"Other"},
                                     {name:"Pakistani"},
                                     {name:"Pancakes/Waffles"},
                                     {name:"Peruvian"},
                                     {name:"Pizza"},
                                     {name:"Pizza/Italian"},
                                     {name:"Polish"},
                                     {name:"Portuguese"},
                                     {name:"Russian"},
                                     {name:"Salads"},
                                     {name:"Sandwiches"},
                                     {name:"Sandwiches/Salads/Mixed Buffet"},
                                     {name:"Scandinavian"},
                                     {name:"Seafood"},
                                     {name:"Soul Food"},
                                     {name:"Soups"},
                                     {name:"Soups & Sandwiches"},
                                     {name:"Southwestern"},
                                     {name:"Spanish"},
                                     {name:"Steak"},
                                     {name:"Tapas"},
                                     {name:"Tex-Mex"},
                                     {name:"Thai"},
                                     {name:"Turkish"},
                                     {name:"Vegetarian"},
                                     {name:"Vietnamese/Cambodian/Malaysia"}                
                                   ]
    
    //
    //use this to set currentPage on front end
    //
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    //
    // our search by borough function to call MongoDB
    //
    $scope.getBoro = function(boro_name,page) {

        
        //console.log( boro_name);
        //console.log('<< Page '+ page + ' >>');
        /*
        $http.get('/boro/{boro_name}/1').success(function(data) {
            $scope.boro_restaurants = data;
        })
        */
        
        // our REST call to our Express backend
        $http.get('/boro/' + boro_name +'/' + page)
            .then(function(res){
      
            //res.data is an array - set the total document count and result set
            $scope.doc_count = res.data.total_docs;
            $scope.boro_list = res.data.results;
           

            $scope.setPage(page);
  
  
             
        });//.then function
    }//getBoro
    
    $scope.searchByName = function(restaurant_name,page){
    	//console.log('search fired');
    	//console.log(restaurant_name);
    	if (restaurant_name == 'undefined'){
    		return;
    	}
    	$http.get('/name/' + restaurant_name + '/' + page)
            .then(function(res){
                    
                //res.data is an array - set the total document count and result set
                $scope.name_doc_count = res.data.total_docs;
                $scope.name_restaurant_list = res.data.results;
                   

                $scope.setPage(page);
          
          
                     
            });//.then function
    }
    $scope.searchByCusine = function(cusine,boro,page){
    	//console.log('cusine search fired');
    	//console.log('Cusine = ' + cusine);
    	//console.log('Borough = ' + boro);

    	if (cusine == 'undefined' || boro == 'undefined'){
    		//console.log('undefined trapped');
    		return
    	}
    	$http.get('/cusine/' + cusine +'/' + boro + '/' + page)
            .then(function(res){
                    
                //res.data is an array - set the total document count and result set
                $scope.cusine_doc_count = res.data.total_docs;
                $scope.cusine_list = res.data.results;
                   

                $scope.setPage(page);
          
          
                     
            });//.then function
    }
      

    
    $scope.yelp = function(restaurant){
        // concatenate building number / street name / zipcode
    	var address = restaurant.building.trim() + '+'+ restaurant.street.trim();
        // replace blanks with + sign and tack on zipcode
    	address = address.replace(/\s+/g, '+') + '+' + restaurant.zipcode ;
    	address = address.replace(' ','+');
    	//console.log('after address===>'+address + ' phone = ' + restaurant.phone);
    	
    	
    	//call our yelp endpoint
        $http.get('/yelp/' + address +'/' + restaurant.phone + '/' + restaurant.cusine_description )
            .then(function(res){
                if (res.data.rating){  
                /*	
                 	console.log('rating ' + res.data.rating);
                	console.log('mobile_url ' + res.data.mobile_url);
                	console.log('rating image ' +res.data.rating_img_url);
                	console.log('review_count ' + res.data.review_count);
                	console.log('snippet_image ' + res.data.image_url);
                	console.log('url ' + res.data.url);
                */	
                	
                	$scope.yelpData = res.data; 
                	
                	//setup modal window
                	var ModalInstanceCtrl = function ($scope, $modalInstance,yelpData ) {
                		//console.log(yelpData);
                		$scope.yelpData = yelpData;
          		        $scope.ok = function () {
          		            $modalInstance.dismiss('cancel')
          		         };  
          		        $scope.cancel = function () {
          		            $modalInstance.dismiss('cancel');
          		        };
            	    };   
            	    //show modal window
                	var modalInstance = $modal.open({
                		      templateUrl: 'yelpmodal.html',
                		      controller: ModalInstanceCtrl,
                		      resolve: {
                		        yelpData: function () {
                		          return $scope.yelpData;
                		        }
                		      }
                	});
                	
                } else { // we didn't find a Yelp hit
                	alert ("No yelp listing found for " + restaurant.dba);
   
                }//if     	
            })//.then function
    }//$scope.yelp
    

 
  }]);
/*
 *  setup images in carousel
 */

function carouselCtrl ($scope){
	  $scope.myInterval = 5000;
          console.log('carouselCtrl  fired!');
	  var slides = $scope.slides = [
                                   {image:'/images/couple_dining.jpg',text:''},
                                   {image:'/images/iStock_couple_dining.jpg',text:''},
                                   {image:'/images/two_guys_dining.jpg', text:''}
	                                ];

}
// scroller
function ScrollCtrl($scope, $location, $anchorScroll) {
    $scope.scrollControl = function (anchor){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash(anchor);
      // call $anchorScroll()
      $anchorScroll();
    };
}
 
