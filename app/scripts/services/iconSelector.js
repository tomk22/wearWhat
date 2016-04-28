angular.module('wearWhat')
  .factory('iconSelector', function(){
    var obj = {};

    obj.selectIcon = function (weatherType) {
      var icons = {
        'Rain': 'rain.png',
        'Clear': 'sun.png',
        'Clouds' : 'cloud.png',
        'Snow': 'snow.png',
        'Drizzle': 'rain.png',
        'Thunderstorm': 'storm.png',
        'Fog': 'fog.png',
        'Mist': 'fog.png'
      };

      return icons[weatherType];

    };

    return obj;
  });
