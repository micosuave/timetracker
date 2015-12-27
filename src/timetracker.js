'use strict';

angular.module('adf.widget.timetracker', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('timetracker', {
        title: 'Time Tracker',
        description: 'track billable hours to projects',
        templateUrl: '{widgetsPath}/timetracker/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/timetracker/src/edit.html'
        }
      });
  });
