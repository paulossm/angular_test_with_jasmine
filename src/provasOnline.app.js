/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = "";
    
    $scope.isAnswered = function (questionNumber) {
        return $scope.answers[questionNumber].answer != undefined;
    };

    
});