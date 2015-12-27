(function(window, undefined) {'use strict';


angular.module('adf.widget.timetracker', ['adf.provider'])
  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('timetracker', {
        title: 'Time Tracker',
        description: 'track billable hours to projects',
        templateUrl: '{widgetsPath}/timetracker/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/timetracker/src/edit.html'
        }
      });
  }]);

angular.module("adf.widget.timetracker").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/timetracker/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/timetracker/src/view.html","<div><h1>Widget view</h1><p>Content of {{config.sample}}</p></div>");}]);})(window);