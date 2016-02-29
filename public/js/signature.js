angular.module('consentForm').controller('Signature', function($scope){

  $scope.checkname = function(){
    console.log("name checked");
  };
  $scope.iagree = function(){

  };
  window.scopertest = $scope;
  $scope.firstname = "Scott";
  $scope.lastname = "Lackey";
  $scope.user_firstname = "";
  $scope.user_lastname = "";
  
  $scope.user_date = new Date(Date.now());
  $scope.agree = false;
  $scope.debug = function(){
    window.temp1 = $scope.user_date

  };
  $scope.logit = function(){console.log($scope.firstname+$scope.lastname+$scope.user_firstname+$scope.user_lastname+$scope.user_date+$scope.agree);};
  $scope.validate = function(){
    if($scope.firstname != $scope.user_firstname || $scope.lastname != $scope.user_lastname || $scope.agree == false || $scope.user_date){
      return true;
    } else {return false;}
  }
}).directive("signature", function($http){
  function link(scope, element, attrs){

  }
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/signature.html',
    link: link
  }
});
