/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = "";

    

    $scope.configExam = function (data) {
        if(!data || !data.previews || !data.idProva) {
            $("body").addClass("notLoaded");
            return;
        }
        
        $scope.exam = data['previews'];
        $scope.idProva = data['idProva']['idProvaInstanciada'];

        if (data["current-question"]) {
            $scope.currentQuestion = parseInt(data["current-question"]);
        } else {
            $scope.currentQuestion = 0;
            data['current-question'] = 0;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(data));
        }

        $scope.totalQuestions = $scope.exam.length;
        $scope.answer = {selectedOption: 'N/R'};
        if (data["answers"]) {
            $scope.answers = data["answers"];
        } else {
            $scope.answers = new Array($scope.exam.length);
            /* fill answer sheet */
            for (var i = 0; i < $scope.answers.length; i++) {
                $scope.answers[i] = {
                    "question": i + 1,
                    "answer": 'N/R'
                }
            }
            data['answers'] = $scope.answers;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(data));
        }
        $scope.letter = String.fromCharCode(97);
    };

});