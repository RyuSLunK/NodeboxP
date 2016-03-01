
var app = angular.module('consentForm', []);
window.apptest = app;

app.service('formStatus', function () {
  var scopeRegister = {};
  var candidateFN;
  var candidateLN;
  var status = {
    last_step: {
      index: null,
      description: null
    },
    current_step: {
      index: 0,
      description: "Not Loaded"
    }
  }
  return {
    getStatus: function () {
      return status;
    },
    setStatus: function (step) {
      status.last_step = status.current_step;
      status.current_step = step;
      if(step.index == 1){
        scopeRegister.Demographic.examinee.LastName = step.lname;
        scopeRegister.Demographic.examinee.FirstName = step.fname;          
      }
    },
    addScope: function (name, scope){
      scopeRegister[name] = scope;
    }
  }
});
app.directive('debugdemo', function(){
  return {
    restrict: 'E',
    replace: 'true',
    controller: 'Demographic',
    template: '<div>{{JSON.stringify(examinee)}}</div>'
  };
});

app.directive('banner', function(){
  return {
    restrict: 'E',
    replace: 'true',
    templateUrl: '/views/Templates/banner.html'
  };
});

app.directive("lorem", function(){
  return {
    restrict: 'AE',
    replace: 'true',
    controller: 'Signature',
    templateUrl: '/views/Templates/lorem.html'
  };
});

console.log("Loaded");
