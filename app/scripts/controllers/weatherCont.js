angular.module('wearWhat')
  .controller('weatherCont', function($scope, $interval, weatherAPI, iconSelector, charSelector){

    $scope.update = function(city){

      weatherAPI.getWeather(city).success(function(data){

        var weather = data.weather[0].main;
        $scope.weather = weather;
        $scope.humidity = data.main.humidity;
        var temp = Math.floor(data.main.temp);
        $scope.temp = temp;
        $scope.wind = Math.round(data.wind.speed * 10)/10;
        $scope.inputCity = data.name;

        $scope.weatherIcon = iconSelector.selectIcon(weather);
        $scope.charIcon = charSelector.selectChar(weather, temp);

      });

    };
  });
