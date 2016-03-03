/*Controller Names: Demographic, Signature, Question*/
angular.module('consentForm',['ngSanitize'])
  .controller('Demographic', function($scope, $http) {
    window.demographicScope = $scope;
    $scope.getRegex = function(name) {
      if (name == "day") {
        return "^[1-9]$|^[0-2]\d$|^3[0-1]$";
      } else if (name == "year") {
        return "^19[0-9][0-9]$";
      }
    };
    //formStatus.addScope("Demographic", $scope);
    $scope.debugobj = "";
    $scope.setName = function(first, last) {
      $scope.examinee.FirstName = first;
      $scope.examinee.LastName = last;
    }
    $scope.staticList = {
      months: [{
        name: "January",
        value: 1
      }, {
        name: "February",
        value: 2
      }, {
        name: "March",
        value: 3
      }, {
        name: "April",
        value: 4
      }, {
        name: "May",
        value: 5
      }, {
        name: "June",
        value: 6
      }, {
        name: "July",
        value: 7
      }, {
        name: "August",
        value: 8
      }, {
        name: "September",
        value: 9
      }, {
        name: "October",
        value: 10
      }, {
        name: "November",
        value: 11
      }, {
        name: "December",
        value: 12
      }]
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

    $scope.lookupGeneric = function() {
      if (!$scope.hasGenerics) {
        var codes = ["Grade", "Language", "Country", "Education Levels", "Ethnicity"];
        $scope.hasGenerics = true;
        $http.post('/getGenericList', {
          s: codes.join(',')
        }).then(function(response) {
          if (!response.error) {
            $scope.lookupLists = response.data;
            console.log("GENERIC LOADED");
          }
        });
      }
    };
    $scope.lookupGeneric();
    window.tester = $scope.lookupLists;
    window.scopetest = $scope;
  })
  .controller('Signature', function($scope) {

    $scope.$on('pageReady',function(event, data){
      console.log("broadcast heard");
      console.log(data);
      $scope.terms = decodeURIComponent(data.terms[0].html_body);
    });
    window.signatureScope = $scope;

    $scope.checkname = function() {

    };
    $scope.iagree = function() {



    };
    $scope.nothanks = function() {

    };
    window.scopertest = $scope;
    $scope.firstname = "Scott";
    $scope.lastname = "Lackey";
    $scope.user_firstname = "";
    $scope.user_lastname = "";

    $scope.user_date = new Date(Date.now());
    $scope.agree = false;
    $scope.debug = function() {
      window.temp1 = $scope.user_date

    };
    $scope.logit = function() {

    };
    $scope.validate = function() {
      if ($scope.firstname != $scope.user_firstname || $scope.lastname != $scope.user_lastname || $scope.agree == false || $scope.user_date) {
        return true;
      } else {
        return false;
      }
    }
    $scope.$emit('signatureReady');
  })
  .controller('Question', function($scope, $http) {
    window.questionScope = $scope;
    var dataz = {
      PID: "169,170,171,172",
      FT: "3"
    };

    $scope.typeMap = {
      1: "Multiple Choice",
      2: "Date",
      3: "Date Range",
      4: "Numeric",
      5: "Open Ended",
      6: "Non-Std Variable"
    };
    $http.post('/getQuestions', dataz).then(function(response) {

      if (!response.error) {
        $scope.phases = response.data;
        window.qscope = $scope;

      } else {

      }
    });
  });
