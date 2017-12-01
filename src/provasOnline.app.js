/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {

    $scope.store_local_data = function (data) {
            if(!data || !data['idProva'] || typeof Storage == 'undefined') {
                $("body").addClass("notLoaded");
                return false;
            }
        
            var store = data;
            store['start-time'] = new Date().toISOString();
            store['duration'] = document.getElementById("examDuration").value;
            store['current-question'] = '0';
            store['exam-id'] = data['idProva']['idProvaInstanciada'];
            var stringStorage = JSON.stringify(store);
            localStorage.setItem("exam-" + $scope.idEvento, stringStorage);
        };
});