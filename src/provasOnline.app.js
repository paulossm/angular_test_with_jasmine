/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = {};
    
    $scope.countDown = function () {
        if ($scope.time.minutes.left == 0 && $scope.time.seconds.left == 0) {
            if ($scope.time.hours.left > 0) {
                $scope.time.hours.left--;
                $scope.time.minutes.left = 59;
                $scope.time.seconds.left = 59;
                exam['time-left'] = $scope.time;
                localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
                return;
            } else {
                // tempo esgotado - finalizar prova
                $scope.timeIsOver = true;
                $scope.time.seconds.left = 0;
                $scope.clockTicking = $interval.cancel($scope.clockTicking);
                exam['time-left'] = $scope.time;
                localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam))
                $scope.confirmSubmit();
                return;
            }
        }
        if ($scope.time.seconds.left == 0) {
            if ($scope.time.minutes.left > 0) {
                $scope.time.minutes.left--;
                $scope.time.seconds.left = 59;
                exam['time-left'] = $scope.time;
                localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam))
            }
            return;
        }
        $scope.time.seconds.left--;
        exam['time-left'] = $scope.time;
        localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam))
    };
    
});