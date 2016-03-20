//
// Constants
//
const apiKey = "";
const forecastURL = "https://api.forecast.io/forecast";

// Weather icons
// Meteocons(http://www.alessioatzeni.com/meteocons/) to Forecast.io icon
// relationships
//
const icons = {
  "clear": "B",
  "clear-day": "B",
  "clear-night": "C",
  "rain": "R",
  "snow": "W",
  "sleet": "U",
  "wind": "F",
  "fog": "K",
  "cloudy": "N",
  "partly-cloudy-day": "H",
  "partly-cloudy-night": "I"
};

// Cities array
// City name corresponding to latitude and longitude
//
const cities = {
  "Rachel, NV":    { coords: { latitude:"37.6447181", longitude: "-115.7603325" }},
  "Depoe Bay, OR": { coords: { latitude:"44.8064391", longitude: "-124.0971234" }},
  "Seattle, WA":   { coords: { latitude:"47.6147624", longitude: "-122.476334"  }},
  "Portland, OR" : { coords: { latitude:"45.5423504", longitude: "-122.7948506" }},
  "Current location": "",
};

// Load city weather
// @param: (string) city name
//
function loadCity(city) {

  // Modify the html location id to the city name requested
  $("#location").html(city);

  if (city == "Current Location"){
    if(navigator.geolocation){
      console.log(city);
      // requires two callbacks -- success method and failure methods
      navigator.geolocation.getCurrentPosition(
        loadWeather, loadDefaultCity
      );
    }else{
      loadDefaultCity();
    }
  } else {
    // Request weather for city
    loadWeather(cities[city])
  }
}

function loadDefaultCity(){
  loadCity("Portland, OR");
}

// Request weather for latitude and longitude and update html tag data
// @param (object) city coordinates
//
function loadWeather(cityCoords){

  console.log(cityCoords);
  var latlon = cityCoords.coords.latitude + "," + cityCoords.coords.longitude;

  $.ajax({
    url: forecastURL + "/" + apiKey + "/" + latlon,
    jsonpCallback: 'jsonCallback',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
      console.log(json);
      $("#current_temp").html(Math.round(json.currently.temperature));
      $("#current_temp").attr("data-icon", icons[json.currently.icon]);
      $("#summary").html(json.currently.summary);
      $("#humidity").html(json.currently.humidity * 100);
    },
    error: function(e){
      console.log(e.message);
    }

  })
}

// Initial page load
$(document).ready(function() {

  loadCity( "Portland, OR" );

  $("a.city").bind("click", function(){
    loadCity($(this).html());
  });

});
