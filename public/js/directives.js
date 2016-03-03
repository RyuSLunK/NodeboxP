angular.module('consentForm')
.directive('debugArrows', function(){
  return {
    restrict: 'E',
    replace: true,
    template: '<button ng-repeat="index in [0,1,2]" ng-click="changeTo(index)">View {{index + 1}}</button>',
    compile: function(tElem, tAttrs){
      //compile before rendering the goodies
      return {
        pre: function(scope, elem, attrs, ctrl){

        },
        post: function(scope, elem, attrs, ctrl){
          //generally attach your stuff here
        }
      };
    }
  };
})
.directive('main', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: ['$scope','$http', function($scope,$http){
      window.changetest = $scope;
      $scope.current_index = 0;
      $scope.changeTo = function(index){
        console.log("Changed to: " + index);
        $scope.current_index = index;
      };
    }],
    compile: function(tElem, tAttrs){
      //compile before rendering the goodies
      return {
        pre: function(scope, elem, attrs, ctrl){

        },
        post: function(scope, elem, attrs, ctrl){
          //generally attach your stuff here
          var kids = elem.children();
          for(var i=0;i<kids.length;i++){
            kids.eq(i).attr("ng-show","index == " + i);
          }
        }
      };
    }
  };
})
.directive('debugdemo', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    template: '<div>{{JSON.stringify(examinee)}}</div>'
  };
})
.directive('banner', function(){
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    templateUrl: '/views/Templates/banner.html'
  };
})
.directive("lorem", function(){
  return {
    restrict: 'AE',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/lorem.html'
  };
})
.directive('candidateInformation', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    templateUrl: '/views/Templates/demographic.html'
  };
})
.directive('multiSelect', function(){
  return {
    require: '^^demographic',
    restrict: 'E',
    replace: 'true',
    scope: {
      items: '='
    },
    controller: 'Demographic',
    template: '<h1>{{i}}',
    /*compile: {
      pre: function(scope, element, attrs){
        element.attr("ng-repeat","item in " + attrs.whichlist);
        element.append(angular.element("<li>{{item.ValueDescription}}</li>"));
        console.log("IN COMPILE");
        return element;
      },
      post: function(scope, element, attrs){
        console.log("IN POST");
      }
    }*/
    compile: function(tElem, tAttrs){
        console.log(name + ': compile');
        var sel = angular.element("<select></select>");
        sel.attr("ng-model",tAttrs.whichmodel);
        sel.attr("ng-options","item.LkpValue as item.ValueDescription for item in " + tAttrs.whichlist);
        tElem.append(sel);
        var ul = angular.element("<ul></ul>");
        ul.attr("ng-model",tAttrs.whichmodel);
        ul.attr("")
        /*tElem.attr("ng-repeat","item in " + tAttrs.whichlist);
        tElem.attr("ng-model",tAttrs.whichmodel);
        tElem.append(angular.element("<li>{{item.ValueDescription}}</li>"));*/
        console.log(tElem);
        return {
          pre: function(scope, iElem, iAttrs){
            console.log(name + ': pre link');
            console.log(iElem);
            //console.log(scope.lookupLists.Country.values);
          },
          post: function(scope, iElem, iAttrs){
            console.log(name + ': post link');
            console.log(iElem);
            //console.log(scope.lookupLists.Country.values);
            console.log(scope);
          }
        }
      }

  }
})
.directive('selectable', function(){
  return {
    restrict: "E",
    transclude: true,
    /*templateUrl: "/views/Templates/multi-select.html",*/
    template: "<div></div><multi-choice class='multi-select button' data-value='{{choice.LkpValue}}'>{{choice.ValueDescription}}</multi-choice>",
    compile: function(elem, attrs){
      console.log("COMPILE");
      console.log(attrs);
      elem.children().eq(1).attr("ng-repeat",'choice in ' + attrs.lookup);
      if(attrs.searchable == "true"){
        elem.prepend("<div class='scrollfix'><input type='text' list-search ng-model='search' placeholder='search'/></div>");
        console.log(elem);
      }
      return {
        pre: function(scope, elem, attrs, ctrl){
          console.log("PRE");
        },
        post: function(scope, elem, attrs, ctrl){
          console.log("POST");
          console.log(elem);
          console.log(elem.children());

        }
      }
    }
  };
})
.directive('multiChoice', function(){
  console.log("multi-choice definition");
  return {
    restrict: "E",
    link: function(scope, elem, attrs){
      console.log("multi-choice");
      elem.bind("click",function(){
        console.log(this);
        elem.toggleClass("selected");
      });
    }
  };
})
.directive('listSearch',function(){
  return {
    restrict: "A",
    scope: true,
    link: function(scope, elem, attrs){
      console.log("SEARCH SCOPE");
      console.log(scope);

      scope.$watch('search',function(newValue, oldValue){
        var val = newValue;
        var elems = elem.parent().parent().find("multi-choice");
        if(val == ''){

          for(var i=0;i<elems.length;i++){
            if(elems.eq(i).hasClass("hide")){
              elems.eq(i).toggleClass("hide");
            }
          }
        } else {
          for(var i=0;i<elems.length;i++){
            if(elems.eq(i).text().toLowerCase().indexOf(val.toLowerCase()) == -1){
              if(!elems.eq(i).hasClass("hide")){
                elems.eq(i).toggleClass("hide");
              }
            } else {
              if(elems.eq(i).hasClass("hide")){
                elems.eq(i).toggleClass("hide");
              }
          }
          }
        }
      });
      elem.bind("change", function(){
        console.log(this);
      });
    }
  };
})
.directive("termsAndAgreement", function($http){
  function link(scope, element, attrs){

  }
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/terms-and-agreement.html',
    link: link
  }
})
.directive('stuck', function(){
  return {
    restrict: 'A',
    replace: 'true',
    compile: function(tElem, tAttrs){
      //compile before rendering the goodies
      //tElem.wrap("<div></div>");
      console.log(tElem);
      //tElem.parent().wrap("<div class='stuck-container'></div>");
    //  tElem.parent().parent().css("height",tElem.css("height"));
      return {
        pre: function(scope, elem, attrs, ctrl){
          elem.wrap("<div class='stuck-wrap'></div>");
          elem.parent().wrap('<div class="stuck-container"></div>');
        },
        post: function(scope, elem, attrs, ctrl){
          //generally attach your stuff here
        }
      };
    }
  };
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
