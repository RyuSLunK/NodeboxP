
var app = angular.module('consentForm', []);

app.controller('Demographic',function($scope,$http){
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
    DoNotWishtoBeContacted: null
  };
  $scope.lookupLists = {
    Genders: [
      {GenderID: 1, GenderDescription: "Male"},
      {GenderID: 2, GenderDescription: "Female"}
    ]
  };
  $scope.lookup = function(codes){
    console.log("LOOKUP FIRED");
    $http.get('/getGenericList?s=' + codes.join(',')).then(function(response){
      if(!response.error){
        $scope.lookupLists = response.data;
        console.log(response.data);
        console.log(response);
      }
    });
  };
  lookup_init_list = ["Grade","Language","Country","Education Levels"];
  $scope.lookup(lookup_init_list);
/*lookup_init_list.forEach(function(item){
  $scope.lookup(item);
});*/

window.tester = $scope.lookupLists;
window.scopetest = $scope;
});
app.directive('debugdemo', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    template: '<div>{{JSON.stringify(examinee)}}</div>'
  };
});
app.directive('demographic', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    templateUrl: '/views/Templates/demographic.html'
  };
});
app.controller('Signature', function($scope){

  $scope.checkname = function(){
    console.log("name checked");
  };
  $scope.firstname = "Scott";
  $scope.lastname = "Lackey";
  $scope.user_firstname = "";
  $scope.user_lastname = "";
  $scope.user_
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
});
app.directive("lorem", function(){
  return {
    restrict: 'AE',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/lorem.html'
  };
});
app.directive("signature", function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/signature.html'
  }
});

console.log("Loaded");
