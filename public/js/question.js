console.log("question file loaded");
angular.module('consentForm')
.controller('Question', function($scope,$http, formStatus){
  var dataz = {PID: "169,170",FT: "8"};
  console.log("QUESTION");
  $scope.typeMap = {
    1: "Multiple Choice",
    2: "Date",
    3: "Date Range",
    4: "Numeric",
    5: "Open Ended",
    6: "Non-Std Variable"
  };
  $http.post('/getQuestions',dataz).then(function(response){

    if(!response.error){
      $scope.phases = response.data;
      window.qscope = $scope;
      console.log(response.data);
    } else {
      console.log(response.error);
    }
  });
})
.directive("questionSection", function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Question',
    templateUrl: '/views/Templates/questionnaire.html'
  };
})
.directive("questionSet", function(){
  return {
    restrict: 'E',
    controller: 'Question',
    replace: 'true'
  };
})
.directive("qType", function(){
  return {
    restrict: 'A',
    controller: 'Question',
    replace: 'true',
    compile: function(tElem, tAttrs){
      tElem.append("<p>{{question.QuestionText}}</p>");
      return {
        pre: function(scope, elem, attr, ctrl){
          switch(attr.qType){
            case 1:

              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              break;
            case 5:
              break;
            case 6:
              break;
            default:
              console.log("default");
          }
        }
      };
    }
  }
});
