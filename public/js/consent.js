
var app = angular.module('consentForm', []);
app.controller('Signature', function($scope){
  $scope.checkname = function(){
    console.log("name checked");
  };
});
app.directive("lorem", function(){
  return {
    restrict: 'AE',
    replace: 'true',
    controller: 'Signature',
    template: '<span>lorem dolor akismet ventulas</span>'
  };

});
console.log("Loaded");
