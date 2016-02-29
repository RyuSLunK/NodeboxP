angular.module('consentForm')
.controller('Demographic',function($scope,$http){
  $scope.debugobj = "";

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
/*  $scope.$watch($scope.examinee,function(){
    console.log("changed");
    $scope.debugobj = JSON.stringify($scope.examinee);
    console.log("set");
  });*/
  $scope.lookupLists = {
    Genders: [
      {GenderID: 1, GenderDescription: "Male"},
      {GenderID: 2, GenderDescription: "Female"}
    ]
  };
  $scope.lookup = function(codes){
    console.log("LOOKUP FIRED");
    $http.post('/getGenericList',{s: codes.join(',')}).then(function(response){
      if(!response.error){
        $scope.lookupLists = response.data;
        console.log(response.data);
        console.log(response);
      }
    });
  };
  lookup_init_list = ["Grade","Language","Country","Education Levels"];
  $scope.lookup(lookup_init_list);


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
});
