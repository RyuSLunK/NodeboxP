console.log("question file loaded");
angular.module('consentForm')
.controller('Question', function($scope,$http, formStatus){
  var dataz = {PID: "169,170,171,172",FT: "3"};
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
    require: '^^questionSet',
    restrict: 'A',
    replace: 'true',
    scope: {

    },
    compile: function(tElem, tAttrs){
      tElem.prepend("<p>{{question.QuestionText}} typof <b>{{typeMap[question.InputTypeID]}}</b></p>");

      return {
        post: function(scope, elem, attr, ctrl){
          if(attr.qType == 5){
            elem.append("<textarea name='" + attr.paseQuestionId + "' rows='4' cols='50'></textarea>");
          }
        }
      };
    }
  }
})
.directive('response',function(){
  return {
    restrict: 'E',
    replace: 'true',
    compile: function(tElem, tAttrs){
      //compile block
      return {
        pre: function(scope, elem, attrs, ctrl){

          },
        post: function(scope, elem, attrs, ctrl){
          console.log("switch eval: " + parseInt(elem.parent().attr("qType")));
          switch(parseInt(elem.parent().attr("q-type"))){
            case 1:
              //multiple choice
              var parent = elem.parent();
              var name = parent.attr("phase-question-id");
              var value = attrs.pqrid;
              elem.prepend("<input type='radio' name='" + name + "' value='" + value + "'/>");
              break;
            case 2:
            //date
              break;
            case 3:
            //date range
              break;
            case 4:
            //numeric
              break;
            case 5:
            //open ended
              elem.prepend("<textarea name")
              break;
            case 6:
            //non-std variable
              break;
            default:
              console.log("default");
            }
        }
      };
    }
  }
});
