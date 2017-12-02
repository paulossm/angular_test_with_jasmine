/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {

    $scope.requestExam = function() {
        if($scope.matricula == ''|| $scope.idEvento == '' || $scope.requestUrl == '') {
            $("body").addClass("notLoaded");
            return;
        }
        /* REQUEST EXAM */
        $http.get($scope.requestUrl + '&idEvento=' + $scope.idEvento + '&matricula=' + $scope.matricula + "&larguradapagina=203").then(function (response) {
            console.log(response.data);
            if(!(typeof response.data == 'object') || response.data['idProva'] === undefined) {
                $("body").addClass("notLoaded");
            } else {
                $scope.exam = response.data;
                $scope.store_local_data(response.data);
                $scope.configExam(response.data);
                $scope.configClock();
                $scope.loadQuestion($scope.currentQuestion);
                if( $("body").hasClass("notLoaded") )
                    $("body").removeClass("no7tLoaded");
                $("body").removeClass("loading");
            }
        }, function (error) {
            $("body").addClass("notLoaded");
        });    
    };
});