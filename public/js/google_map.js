/*
 *  used to show our location
 */
function initialize() {

  //412 BWAY NYC
  var myLatlng = new google.maps.LatLng(40.718955,-74.001839);
  var mapOptions = {
    zoom: 16,
    center: myLatlng
  };
  //create map
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  //mark our location
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'We are over here'
  });

  //show infoWindow on map
  var infowindow = new google.maps.InfoWindow({
      content: "<p id='infoWindow'>We are here</p>"
  });
  
  infowindow.open(map,marker);
}
//create script 
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
      'callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;



