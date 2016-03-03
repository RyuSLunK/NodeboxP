angular.module('consentForm')
  .directive('debugArrows', function() {
    return {
      restrict: 'E',
      replace: true,
      template: '<button ng-repeat="index in [0,1,2,3]" ng-click="changeTo(index)">View {{index + 1}}</button>',
      compile: function(tElem, tAttrs) {
        //compile before rendering the goodies
        return {
          pre: function(scope, elem, attrs, ctrl) {

          },
          post: function(scope, elem, attrs, ctrl) {
            //generally attach your stuff here
          }
        };
      }
    };
  })
  .directive('loader', function() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', '$http', function($scope, $http) {
        $scope.parseQuery = function(qstr) {
          var query = {};
          var a = qstr.substr(1).split('&');
          for (var i = 0; i < a.length; i++) {
            var b = a[i].split('=');
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
          }
          return query;
        };
        console.log("Starting");
        $scope.$on('$destroy', function(event, data) {
          console.log("LOADER DESTROYED");
          $scope.$emit('loaderDestroyed');
        });
        var paramData = {};
        if ($scope.$root.debug || !location.search) {
          console.log("Using backup development string");
          paramData = $scope.parseQuery("?ID=19025&PHASES=169|170|171|172&F=3&LANG=EN");
        } else {
          paramData = $scope.parseQuery(location.search);
        }

        console.log("Calling");
        $http.post('/getSetup', paramData).then(function(response) {
          console.log("Got the setup data");
          console.log(response.data);
          console.log("sending emit");
          $scope.$emit('hasSetupData', response.data);
        }, function(error) {});

      }],
      compile: function(tElem, tAttrs) {
        tElem.append("<h1>{{status}}</h1>");
        //compile before rendering the goodies
        return {
          pre: function(scope, elem, attrs, ctrl) {

          },
          post: function(scope, elem, attrs, ctrl) {
            //generally attach your stuff here
          }
        };
      }
    };
  })
  .directive('main', function() {
    return {
      restrict: 'E',
      replace: 'true',
      controller: ['$scope', '$http', function($scope, $http) {
        window.mainScope = $scope;
        window.changetest = $scope;
        $scope.current_index = 0;
        $scope.debug = true;
        $scope.setupData = {};
        $scope.$on('hasSetupData', function(event, data) {
          console.log("emit heard");
          $scope.allSetupData = data;
          $scope.$on('signatureReady',function(event, data2){
            console.log("destroy emit heard");
            console.log("sending broadcast to signature");
            $scope.$broadcast('pageReady',$scope.allSetupData);
          });
          $scope.changeTo(1);


        });
        $scope.changeTo = function(index) {

          $scope.current_index = index;

        };
        $scope.$watch('setupData', function() {
          /*console.log("SETUP DATA CHANGED");
          $scope.changeTo(1);
          $scope.$broadcast('pageReady');*/
        });
        $scope.$watch('current_index', function(newValue, oldValue) {
          switch (newValue) {
            case 0:
              break;
            case 1:

              break;
            case 2:

              break;
            case 3:
              break;
            default:

          }
        });
      }],
      compile: function(tElem, tAttrs) {
        //compile before rendering the goodies
        return {
          pre: function(scope, elem, attrs, ctrl) {

          },
          post: function(scope, elem, attrs, ctrl) {
            //generally attach your stuff here
            var kids = elem.children();
            for (var i = 0; i < kids.length; i++) {
              kids.eq(i).attr("ng-show", "index == " + i);
            }
          }
        };
      }
    };
  })
  .directive('debugdemo', function() {
    return {
      restrict: 'E',
      replace: 'true',
      controller: 'Demographic',
      template: '<div>{{JSON.stringify(examinee)}}</div>'
    };
  })
  .directive('banner', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      templateUrl: '/views/Templates/banner.html'
    };
  })
  .directive("lorem", function() {
    return {
      restrict: 'AE',
      replace: 'true',
      controller: 'Signature',
      templateUrl: '/views/Templates/lorem.html'
    };
  })
  .directive('candidateInformation', function() {
    return {
      restrict: 'E',
      replace: 'true',
      controller: 'Demographic',
      templateUrl: '/views/Templates/demographic.html'
    };
  })
  .directive('selectable', function() {
    return {
      restrict: "E",
      transclude: true,
      /*templateUrl: "/views/Templates/multi-select.html",*/
      template: "<div></div><multi-choice class='multi-select button' data-value='{{choice.LkpValue}}'>{{choice.ValueDescription}}</multi-choice>",
      compile: function(elem, attrs) {


        elem.children().eq(1).attr("ng-repeat", 'choice in ' + attrs.lookup);
        if (attrs.searchable == "true") {
          elem.prepend("<div class='scrollfix'><input type='text' list-search ng-model='search' placeholder='search'/></div>");

        }
        return {
          pre: function(scope, elem, attrs, ctrl) {

          },
          post: function(scope, elem, attrs, ctrl) {

          }
        }
      }
    };
  })
  .directive('multiChoice', function() {
    return {
      restrict: "E",
      link: function(scope, elem, attrs) {
        elem.bind("click", function() {
          elem.toggleClass("selected");
        });
      }
    };
  })
  .directive('listSearch', function() {
    return {
      restrict: "A",
      scope: true,
      link: function(scope, elem, attrs) {
        scope.$watch('search', function(newValue, oldValue) {
          var val = newValue;
          var elems = elem.parent().parent().find("multi-choice");
          if (val == '') {

            for (var i = 0; i < elems.length; i++) {
              if (elems.eq(i).hasClass("hide")) {
                elems.eq(i).toggleClass("hide");
              }
            }
          } else {
            for (var i = 0; i < elems.length; i++) {
              if (elems.eq(i).text().toLowerCase().indexOf(val.toLowerCase()) == -1) {
                if (!elems.eq(i).hasClass("hide")) {
                  elems.eq(i).toggleClass("hide");
                }
              } else {
                if (elems.eq(i).hasClass("hide")) {
                  elems.eq(i).toggleClass("hide");
                }
              }
            }
          }
        });
        elem.bind("change", function() {

        });
      }
    };
  })
  .directive("termsAndAgreement", function($http) {
    function link(scope, element, attrs) {

    }
    return {
      restrict: 'E',
      replace: 'true',
      controller: 'Signature',
      templateUrl: '/views/Templates/terms-and-agreement.html',
      link: link
    }
  })
  .directive('stuck', function() {
    return {
      restrict: 'A',
      replace: 'true',
      compile: function(tElem, tAttrs) {
        //compile before rendering the goodies
        //tElem.wrap("<div></div>");

        //tElem.parent().wrap("<div class='stuck-container'></div>");
        //  tElem.parent().parent().css("height",tElem.css("height"));
        return {
          pre: function(scope, elem, attrs, ctrl) {
            elem.wrap("<div class='stuck-wrap'></div>");
            elem.parent().wrap('<div class="stuck-container"></div>');
          },
          post: function(scope, elem, attrs, ctrl) {
            //generally attach your stuff here

          }
        };
      }
    };
  })
  .directive("questionSection", function() {
    return {
      restrict: 'E',
      replace: 'true',
      controller: 'Question',
      templateUrl: '/views/Templates/questionnaire.html'
    };
  })
  .directive("questionSet", function() {
    return {
      restrict: 'E',
      controller: 'Question',
      replace: 'true'
    };
  })
  .directive("qType", function() {
    return {
      require: '^^questionSet',
      restrict: 'A',
      replace: 'true',
      scope: {

      },
      compile: function(tElem, tAttrs) {
        tElem.prepend("<p>{{question.QuestionText}} typof <b>{{typeMap[question.InputTypeID]}}</b></p>");

        return {
          post: function(scope, elem, attr, ctrl) {
            if (attr.qType == 5) {
              elem.append("<textarea name='" + attr.paseQuestionId + "' rows='4' cols='50'></textarea>");
            }
          }
        };
      }
    }
  })
  .directive('response', function() {
    return {
      restrict: 'E',
      replace: 'true',
      compile: function(tElem, tAttrs) {
        //compile block
        return {
          pre: function(scope, elem, attrs, ctrl) {

          },
          post: function(scope, elem, attrs, ctrl) {

            switch (parseInt(elem.parent().attr("q-type"))) {
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

            }
          }
        };
      }
    }
  });
