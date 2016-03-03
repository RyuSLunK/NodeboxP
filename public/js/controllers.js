/*Controller Names: Demographic, Signature, Question*/
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
  lookup_init_list = ["Grade","Language","Country","Education Levels","Ethnicity"];
  if(!$scope.lookupLists.hasGenerics){$scope.lookupLists.hasGenerics = true;$scope.lookup(lookup_init_list);}


window.tester = $scope.lookupLists;
window.scopetest = $scope;
})
.controller('Signature', function($scope, formStatus){
  formStatus.addScope("Signature",$scope);
  $scope.checkname = function(){
    console.log("name checked");
  };
  $scope.iagree = function(){
    console.log("LAST: " + JSON.stringify(formStatus.getStatus().last_step) + "\nCURRENT: " + JSON.stringify(formStatus.getStatus().current_step));
    formStatus.setStatus({index: 1, description: "I Agree was clicked", fname: $scope.user_firstname, lname: $scope.user_lastname});
      console.log("LAST: " + JSON.stringify(formStatus.getStatus().last_step) + "\nCURRENT: " + JSON.stringify(formStatus.getStatus().current_step));
  };
  $scope.nothanks = function(){
    formStatus.setStatus({index: 1, description: "I Agree was clicked", fname: $scope.firstname, lname: $scope.lastname});
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
})
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
});
