/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
     var exam = {};
    
    $scope.navigate = function (questionNumber) {
        if (questionNumber == undefined || questionNumber >= $scope.exam.length || questionNumber < 0) {
            return;
        } else {
            $scope.currentQuestion = questionNumber;
            exam['current-question'] = $scope.currentQuestion;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
            $scope.loadQuestion($scope.currentQuestion);
        }
    };
    
    $scope.nextQuestion = function () {
        // Save answer for current question before loading the next one
        // $scope.saveAnswer();
        if ($scope.currentQuestion + 1 < $scope.exam.length) {
            ++$scope.currentQuestion;
            exam['current-question'] = $scope.currentQuestion;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
            $scope.loadQuestion($scope.currentQuestion);
        } else {
            $scope.finishExam();
        }
    };
    
    $scope.previousQuestion = function () {
        // Save answer for current question before loading the next one
        // $scope.saveAnswer();
        if ($scope.currentQuestion > 0) {
            --$scope.currentQuestion;
            exam['current-question'] = $scope.currentQuestion;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
            $scope.loadQuestion($scope.currentQuestion);
        }
    };
});