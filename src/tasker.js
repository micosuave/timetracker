'use strict';

angular.module('tasker', ['angular-svg-round-progress', 'ngAnimate'])
  .run(function ($rootScope) {
        $rootScope.run = false;
        $rootScope.hasState = false;
  })
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
}]);