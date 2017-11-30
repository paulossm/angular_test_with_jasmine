/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = {};
    
    $scope.loadQuestion = function (questionNumber) {
        if(questionNumber == undefined || questionNumber < 0 || questionNumber >= $scope.exam.length) {
            return;
        }
        
        // pausar temporizador de prova
        $scope.pauseTimer();

        // Carregar enunciado
        $scope.enunciado = $scope.exam[questionNumber].enunciado;

        // Carregar Alternativas
        $scope.alternativas = $scope.exam[questionNumber].alternativas;

        // Carregar Letras Instanciadas
        $scope.letras = $scope.exam[questionNumber].letraInstanciada.split(",");

        /*
         Configurar Objeto resposta para a questão atual
         Limpa a alternativa marcada.
         */
        $scope.answer.selectedOption = 'N/R';
        if ($scope.answers[questionNumber] != undefined) {
            if ($scope.answers[questionNumber].answer != '') {
                $scope.answer.selectedOption = $scope.answers[questionNumber].answer;
            }
        } else {
            $scope.answer.selectedOption = "N/R";
        }

        // retoma o temporizador de prova
        $scope.resumeTimer();
    };
    
    $scope.pauseTimer = function() {
        if($scope.clockTicking) {
            $scope.clockTicking = $interval.cancel($scope.clockTicking);
        }
    };
    
    $scope.resumeTimer = function() {
        $scope.clockTicking = $interval($scope.countDown, 1000);
    }
});