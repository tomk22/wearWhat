angular.module('wearWhat')
  .factory('weatherAPI', function ($http) {

    var obj = {};

    obj.getWeather = function(city){

      var api = "http://api.openweathermap.org/data/2.5/weather?q=";
      var city = city;
      var units = "&units=imperial";
      var appid = "&APPID=9ff602f60c82b38c9a18ceab53521d78"
      var cb = "&callback=JSON_CALLBACK";

      var url = api + city + ",us" + units + appid + cb;

      return $http.jsonp(url);
    };

    return obj;
  });
