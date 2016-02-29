
var app = angular.module('consentForm', []);
window.apptest = app;


app.directive('debugdemo', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    template: '<div>{{JSON.stringify(examinee)}}</div>'
  };
});

app.directive('banner', function(){
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: '/views/Templates/banner.html'
  };
});

app.directive("lorem", function(){
  return {
    restrict: 'AE',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/lorem.html'
  };
});

console.log("Loaded");
