(function(window, undefined) {'use strict';


angular.module('adf.widget.timetracker', ['adf.provider', 'tasker'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('timetracker', {
        title: 'Time Tracker',
        description: 'track billable hours to projects',
        templateUrl: '{widgetsPath}/timetracker/src/view.html',
        frameless:true,
        edit: {
          templateUrl: '{widgetsPath}/timetracker/src/edit.html'
        }
      });
  }]);



angular.module("adf.widget.timetracker").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/timetracker/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/timetracker/src/view.html","<embed src=timetracker/angular-time-pausetracker/index.html style=width:100%;min-height:600px;><div id=app><div id=head><div class=circles><div class=progress-wrapper ng-controller=currentPause id=pause><div class=\"progress pause\" ng-show=\"run === false\">{{currentText}}</div><div round-progress max=max current=current color=white bgcolor=#262b34 radius=70 stroke=10 semi=false rounded=false clockwise=false responsive=false duration=2400 animation=easeInOutQuart ng-class={dimmedpause:run}></div></div><div class=progress-wrapper ng-controller=currentTask><div class=\"progress task\" ng-show=\"run === true\">{{currentText}}</div><div round-progress max=max current=current color=#00c0ff bgcolor=#262b34 radius=70 stroke=3 semi=false rounded=false clockwise=false responsive=false duration=2400 animation=easeInOutQuart ng-class={dimmedplay:!run}></div></div></div><div class=interaction ng-controller=controls><span class=btn ng-click=startpause()><i class=\"mdi mdi-pause\" ng-show=\"run === true\"></i><i class=\"mdi mdi-play\" ng-show=\"run === false\"></i></span> <span class=\"btn primary\" ng-click=addnote()><i class=\"mdi mdi-plus\"></i></span></div></div><div id=content ng-controller=tasks><div style=text-align:center ng-hide=\"tasks.length > 0\"><h2 style=\"margin:20px 0 0 0;\"><img src=https://lexlab.io/llp_core/img/lll3.svg></h2><h3 style=margin:0;>You have no recorded tasks yet</h3></div><input placeholder=Filter ng-show=\"tasks.length > 0\" type=text id=filter ng-model=taskfilter><ul><li class=list-animation ng-repeat=\"task in tasks | filter: taskfilter track by $index\"><span class=date>{{task.date}}</span> <b>{{task.note}}</b><span class=right><span class=time>{{task.ftime}}</span><span class=pause>{{task.fpause}}</span><i class=\"mdi mdi-delete\" ng-click=delete($index)></i></span></li></ul></div></div>");}]);


angular.module('tasker', ['angular-svg-round-progress', 'ngAnimate'])
  .run(["$rootScope", function ($rootScope) {
        $rootScope.run = false;
        $rootScope.hasState = false;
  }])
  .controller('tasks', ['$scope', 'taskService', function ($scope, taskService) {   
   $scope.tasks = taskService.getAll();
   
   $scope.delete = function($index) {
      taskService.remove($index);
   };
   $('#content').slimScroll({
   position: 'right',
   height: '370px',
   railVisible: true,
   alwaysVisible: true,
   color: '#00c0ff',
   wheelStep: 7
});

  function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }

  }])
  .controller('controls', ['$scope', '$rootScope', 'timeService', 'taskService', function ($scope, $rootScope, timeService, taskService) {
   $scope.startpause = function() {
      if ($rootScope.run === false) {
         $rootScope.run = true; 
         $rootScope.hasState = true;
      } else {
         $rootScope.run = false; 
      }
   }
   $('#content').slimScroll({
   position: 'right',
   height: '370px',
   railVisible: true,
   alwaysVisible: true,
   color: '#00c0ff',
   wheelStep: 7
});

  function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }

   $scope.addnote = function() {
      $rootScope.run = false;
      $rootScope.hasState = false;
      
      var note = prompt("What have you done ?");

      if (note != null && note.trim() !== "")  {
         taskService.add(note);
         $rootScope.$broadcast('RESET');
      } else {
         $rootScope.hasState = true;
      }
   };   
  }])
  .controller('currentPause', ['$scope', '$rootScope', '$interval', 'timeService', function ($scope, $rootScope, $interval, timeService) {  
          
   $scope.max = timeService.getConfig('pause');
   $scope.current = timeService.getConfig('pause');
   $scope.currentText = splitTime($scope.current);
   
   $scope.$on('RESET', function() {
      $scope.current = timeService.getConfig('pause');
      $scope.currentText = splitTime($scope.current);
   });
   $('#content').slimScroll({
   position: 'right',
   height: '370px',
   railVisible: true,
   alwaysVisible: true,
   color: '#00c0ff',
   wheelStep: 7
});

  function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }

   $interval(function(){            
      if (!$scope.run && $scope.hasState) {                                      
         if ($scope.current <= 0 && $rootScope.hasState) {
            document.getElementById('alert').play();            
            $rootScope.hasState = false;
         } else {
            $scope.current -= 1;
            $scope.currentText = splitTime($scope.current);
            timeService.setPause($scope.current);
         }
      }
   }, 1000);   
  }])
  .controller('currentTask', ['$scope', '$rootScope', '$interval', 'timeService', function ($scope, $rootScope, $interval, timeService) {  
         
   $scope.max = timeService.getConfig('time');
   $scope.current = timeService.getConfig('time');
   $scope.currentText = splitTime($scope.current);   
   
   $scope.$on('RESET', function() {
      $scope.current = timeService.getConfig('time');
      $scope.currentText = splitTime($scope.current);
   });
   $('#content').slimScroll({
   position: 'right',
   height: '370px',
   railVisible: true,
   alwaysVisible: true,
   color: '#00c0ff',
   wheelStep: 7
});

  function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }

      $interval(function(){            
         if ($scope.run && $scope.hasState) {                        
            if ($scope.current <= 0) {
               document.getElementById('alert').play();
               $rootScope.hasState = false;
            } else {
               $scope.current -= 1;
               $scope.currentText = splitTime($scope.current);
               timeService.setTime($scope.current);
            }
         }
      }, 1000);   
  }])
  .factory('taskService', ['timeService', function (timeService) {
   var date = "";
   var tasks = []; 
   
   if (date === "") {
      var gd = new Date();   
      date += gd.getDay() + "/" + gd.getMonth() + "/" + gd.getFullYear();
   }
    function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }
   return {            
      add: function(note) {
         tasks.push({ 
            date: date,
            note: note,            
            time: timeService.getWorkedTime(false),
            pause: timeService.getWorkedPause(false),
            ftime: timeService.getWorkedTime(true),
            fpause: timeService.getWorkedPause(true)
         });
         
         this.setPersistence();
      },
      
      remove: function(index) {
         tasks.splice(index, 1);
         this.setPersistence();
      },
      
      getAll: function() {
         if (localStorage.getItem('codepen-tasker') === null) {
            this.setPersistence();
         }
         
         if (tasks.length === 0) {
            this.getPersistence();
         }
                  
         return tasks;      
      },
      
      getPersistence: function() {
         tasks = JSON.parse(localStorage.getItem('codepen-tasker'));
      },
      
      setPersistence: function() {
         localStorage.setItem('codepen-tasker',JSON.stringify(tasks));
      }
   }   
  }])
  .factory('timeService', [function () {
   var CONFIG = {
         time: 2400,
         pause: 600
   },
   PAUSE = CONFIG.pause,
   TIME = CONFIG.time;
    function splitTime(time) {
      var minutes = "0" + Math.floor(time / 60);
      var seconds = "0" + (time - minutes * 60);
      return minutes.substr(-2) + ":" + seconds.substr(-2);
   }
   return {  
      
      reset: function() {
         PAUSE = CONFIG.pause;
         TIME = CONFIG.time;
      },
      
      getConfig: function(prop) {
         return CONFIG[prop];
      },
      
      getWorkedPause: function(formatted) {
         if (formatted) {
            return splitTime(CONFIG.pause - PAUSE);
         }
         return CONFIG.pause - PAUSE;   
      },
      
      getWorkedTime: function(formatted) {
         if (formatted) {
            return splitTime(CONFIG.time - TIME);
         }
         
         return CONFIG.time - TIME;   
      },
      
      getTime: function() {
         return TIME;
      },
      
      getPause: function() {
         return PAUSE
      },
      
      setTime: function(val) {
         TIME = val;         
      },
      
      setPause: function(val) {
         PAUSE = val;
      }
   }
}]);})(window);