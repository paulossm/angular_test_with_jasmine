/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = {};
    
    $scope.configClock = function (startTime, duration, timeLeft) {

        $scope.timeIsOver = false;
        
        if (startTime && startTime.getTime) {
            var now = startTime;
        } else {
            now = new Date();
            exam['start-time'] = now.toISOString();   
        }
        
        var regex = /^(([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$)+/;
        if (duration && regex.test(duration)) {
            $scope.exam.duration = duration;
        } else {
            duration = document.getElementById("examDuration").value;
            if(regex.test(duration)) {
                $scope.exam.duration = duration;
                exam['duration'] = $scope.exam.duration;    
            } else {
                return;
            }
        }
        
        var final = new Date(now.getTime());
        var examTime = $scope.exam.duration.split(":");
        var hours = examTime[0];
        var minutes = examTime[1];
        var seconds = examTime[2];
        
        final.setHours(final.getHours() + parseInt(hours));
        final.setMinutes(final.getMinutes() + parseInt(minutes));
        final.setSeconds(final.getSeconds() + parseInt(seconds));
        
        $scope.examTime = {
            'startTime': now,
            'endTime': final
        };
        
        if (timeLeft && timeLeft.hours && timeLeft.minutes && timeLeft.seconds) {
            $scope.time = timeLeft;
        } else {
            $scope.time = {
                'hours': {
                    'left': ''
                },
                'minutes': {
                    'left': ''
                },
                'seconds': {
                    'left': ''
                }
            };
            
            var totalTime = ($scope.examTime.endTime - $scope.examTime.startTime);
            var totalInSeconds = Math.round(totalTime / 1000);
            $scope.time.hours.left = Math.floor(totalInSeconds / 3600);
            totalInSeconds -= ($scope.time.hours.left * 3600);
            $scope.time.minutes.left = Math.floor(totalInSeconds / 60);
            $scope.time.seconds.left = totalInSeconds - ($scope.time.minutes.left * 60);

            exam['time-left'] = $scope.time;
        }
        
        localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
    };
    
});