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