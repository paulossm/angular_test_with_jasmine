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