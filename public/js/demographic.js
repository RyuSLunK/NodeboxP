angular.module('consentForm')
.controller('Demographic',function($scope,$http,formStatus){

  $scope.getRegex = function(name){
    if(name == "day"){
      return "^[1-9]$|^[0-2]\d$|^3[0-1]$";
    } else if (name == "year") {
      return "^19[0-9][0-9]$";
    }
  };
  formStatus.addScope("Demographic",$scope);
  $scope.debugobj = "";
  $scope.setName = function(first,last){
    $scope.examinee.FirstName = first;
    $scope.examinee.LastName = last;
  }
  $scope.staticList = {
    months : [{name: "January", value: 1},{name: "February",value: 2},{name: "March", value: 3},
              {name: "April",value: 4},{name: "May", value: 5},{name: "June", value: 6},
              {name: "July", value: 7},{name: "August", value: 8},{name: "September", value: 9},
              {name: "October", value: 10},{name: "November", value: 11},{name: "December", value: 12}]
  }
  $scope.examinee = {
    ExamineeID: null,
    PhaseID: null,
    CandidateID: null,
    LastName: null,
    FirstName: null,
    MiddleInitial: null,
    DateofBirth: null,
    EmailAddress: null,
    GenderID: null,
    StateID: null,
    LivesWithMother: null,
    LivesWithFather: null,
    LivesWithSelf: null,
    MotherEdLevelID: null,
    FatherEdLevelId: null,
    SelfEdLevelID: null,
    GradeID: null,
    MotherCountryOfOriginID: null,
    FatherCountryOfOriginID: null,
    SelfCountryOfOriginID: null,
    NoConsentForm: null,
    DateOfConsent: null,
    ConsentCollectedExaminerID: null,
    ConsentCollectSiteID: null,
    SignatureVerified: null,
    SignatureVerifiedByUserID: null,
    SignatureVerifiedDate: null,
    DateRecieved: null,
    ConsentFormTypeID: null,
    StatusID: null,
    LockUpdates: null,
    WrongConsentForm: null,
    LanguageSpokenAtHomeID: null,
    OtherLanguageSpokenAtHome: null,
    AnyMedications: null,
    MedicationsList: null,
    DoNotWishtoBeContacted: null,
    ModelTest: "TRUE"
  };
  $scope.lookupLists = {};

  $scope.lookup = function(codes){

    $http.post('/getGenericList',{s: codes.join(',')}).then(function(response){
      if(!response.error){
        $scope.lookupLists = response.data;

        console.log(response.data);
      }
    });
  };
  lookup_init_list = ["Grade","Language","Country","Education Levels"];
  if(!$scope.lookupLists.hasGenerics){$scope.lookupLists.hasGenerics = true;$scope.lookup(lookup_init_list);}


window.tester = $scope.lookupLists;
window.scopetest = $scope;
})
.directive('demographic', function(){
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
});
app.directive('selectable', function(){
  return {
    restrict: "E",
    transclude: true,
    /*templateUrl: "/views/Templates/multi-select.html",*/
    template: "<input type='text' list-search ng-model='search' placeholder='search'/><div multi-choice class='multi-select button' data-value='{{choice.LkpValue}}'>{{choice.ValueDescription}}</div>",
    compile: function(elem, attrs){
      console.log("COMPILE");
      elem.children().eq(1).attr("ng-repeat",'choice in ' + attrs.lookup);
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
});
app.directive('multiChoice', function(){
  console.log("multi-choice definition");
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      console.log("multi-choice");
      elem.bind("click",function(){
        console.log(this);
        elem.toggleClass("selected");
      });
    }
  };
});
app.directive('listSearch',function(){
  return {
    restrict: "A",
    scope: true,
    link: function(scope, elem, attrs){
      console.log("SEARCH SCOPE");
      console.log(scope);

      scope.$watch('search',function(newValue, oldValue){
        var val = newValue;
        var elems = elem.parent().find("div");
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
});
