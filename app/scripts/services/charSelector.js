angular.module('wearWhat')
  .factory('charSelector', function(){
    var obj = {};

    obj.selectChar = function (weatherType, temp) {

      var date = new Date();
      var day = date.getDay();

      //test per day
      //var day = 6;

      if((weatherType === "Rain" || weatherType === "Drizzle" || weatherType === 'Thunderstorm') && temp >= 60){
        return 'hotraincoat.png';
      }else if(weatherType === "Rain" || weatherType === "Drizzle" || weatherType === 'Thunderstorm'){
        return 'raincoat.png';
      }else if(temp >= 80 && (day === 0 || day === 6)){
        return 'swimtrunks.png';
      }else if(temp >= 75 && (day === 0 || day === 6)){
        return 'shortshirtswimtrunks.png';
      }else if(temp >= 65){
        return 'shortshirtshorts.png';
      }else if(temp >= 60){
        return 'longshirtshorts.png';
      }else if(temp >= 55){
        return 'shortshirtlongpants.png';
      }else if(temp >= 40 && weatherType != 'Snow'){
        return 'longshirtlongpants.png';
      }else if(weatherType == 'Snow'){
        return 'snowboots.png';
      }else if(temp < 40){
        return 'hatandgloves.png';
      }

    };

    return obj;
  });
