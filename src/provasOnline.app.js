/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = "";

    location.hash = "takingExam";

    $(window).on('hashchange', function () {
        location.hash = "takingExam";
    });

    $scope.requestUrl = "http://" + window.location.host + document.getElementsByName("requestUrl")[0].value;
    $scope.idEvento = document.getElementsByName("idEvento")[0].value;
    $scope.matricula = document.getElementsByName("matricula")[0].value;

    $scope.configExam = function (data) {

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

    $scope.configClock = function () {

        $scope.timeIsOver = false;

        if(exam["start-time"]) {
            var now = new Date(exam["start-time"]);
        } else {
            now = new Date();
            exam['start-time'] = now.toISOString();
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
        }

        /* TEMPO DE PROVA DEFINIDO PELO PROFESSOR */
        if(exam["duration"]) {
            $scope.exam.duration = exam['duration'];
        } else {
            $scope.exam.duration = document.getElementById("examDuration").value;
            exam['duration'] = $scope.exam.duration;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
        }

        var final = new Date(now);
        var examTime = $scope.exam.duration.split(":");
        var hours = examTime[0];
        var minutes = examTime[1];
        var seconds = examTime[2];

        final.addHours(hours);
        final.addMinutes(minutes);
        final.addSeconds(seconds);

        $scope.examTime = {
            'startTime': now,
            'endTime': final
        };

        if(exam["time-left"]) {
            $scope.time = exam['time-left'];
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
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
        }
    };

    $scope.loadQuestion = function (questionNumber) {

        // pausar temporizador de prova
        if($scope.clockTicking)
            $scope.clockTicking = $interval.cancel($scope.clockTicking);

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
        $scope.clockTicking = $interval($scope.countDown, 1000);
    };

    $scope.saveAnswer = function () {
        $scope.answers[$scope.currentQuestion] = {
            "question": $scope.currentQuestion + 1,
            "answer": $scope.answer.selectedOption
        };
        exam["answers"] = $scope.answers;
        localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
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

    $scope.navigate = function (questionNumber) {
        if (questionNumber >= $scope.exam.length || questionNumber < 0) {
            return;
        } else {
            $scope.currentQuestion = questionNumber;
            exam['current-question'] = $scope.currentQuestion;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
            $scope.loadQuestion($scope.currentQuestion);
        }
    };

    $scope.isAnswered = function (questionNumber) {
        return $scope.answers[questionNumber].answer != undefined;
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

    $scope.finishExam = function () {
        // ask user for confirmation
        $("#confirmSubmit").insertAfter($("#finish")).attr("hidden", false);
        // pausa tempo de prova
        $scope.clockTicking = $interval.cancel($scope.clockTicking);
    };

    $scope.confirmSubmit = function () {
        if(!(exam["finished"])) {
            exam['finished'] = true;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
        }
        if($scope.clockTicking)
            $scope.clockTicking = $interval.cancel($scope.clockTicking);

        $scope.showResults();
        $("header").detach();
        $("#confirmSubmit").detach();
    };

    $scope.cancelSubmit = function () {
        $scope.clockTicking = $interval($scope.countDown, 1000);
        $("#confirmSubmit").attr("hidden", true);
    };

    $scope.getNota = function (str_answers) {
        $http.get(document.getElementsByName("finishUrl")[0].value + "&idEvento=" + $scope.idEvento + "&idProva=" + $scope.idProva + "&matricula=" + $scope.matricula + "&respostas=" + str_answers)
            .then(function (response){
                localStorage.setItem("evaluation", JSON.stringify(response.data));
                $scope.resultado = response.data;
                $scope.gabarito = [];
                for(var i = 0; i < $scope.resultado.gabarito.length; i++) {
                    if($scope.resultado.gabarito[i] == $scope.resultado.respostaAluno[i])
                        $scope.gabarito[i] = "<i class='fa fa-check-circle text-success'></i>";
                    else
                        $scope.gabarito[i] = "<i class='fa fa-times-circle text-danger'></i>";
                }
                $scope.fillSheet();
                return true;
            }, function (error){
                $scope.resultado = "não corrigiu.";
                return false;
            });
    };

    $scope.fillSheet = function() {

        var gabarito = document.querySelectorAll("#answersTable #gabarito");
        var acertos = document.querySelectorAll("#answersTable #acerto");

        for(var i = 0; i < acertos.length; i++) {
            gabarito[i].innerHTML = $scope.resultado.gabarito[i];
            acertos[i].innerHTML += ($scope.gabarito[i]);
        }

    };

    $scope.exit = function () {
        if(localStorage.getItem("exam-" + $scope.idEvento)) {
            localStorage.clear();
        }
        var exit_url = document.getElementsByName("exitUrl")[0].value;
        window.location = exit_url;
    };

    $scope.showResults = function () {

        $scope.shortAnswers = '';
        for(var i = 0; i < $scope.answers.length; i++) {
            if($scope.answers[i].answer == "N/R")
                $scope.answers[i].answer = "-";
            $scope.shortAnswers += $scope.answers[i].answer;
        }
        if(localStorage.getItem("evaluation")) {
            $scope.resultado = JSON.parse(localStorage.getItem("evaluation"));
            $scope.gabarito = [];
            for(var i = 0; i < $scope.resultado.gabarito.length; i++) {
                if($scope.resultado.gabarito[i] == $scope.resultado.respostaAluno[i])
                    $scope.gabarito[i] = "<i class='fa fa-check-circle text-success'></i>";
                else
                    $scope.gabarito[i] = "<i class='fa fa-times-circle text-danger'></i>";
            }

            $scope.fillSheet();
        } else {
            $scope.getNota($scope.shortAnswers);
        }

        // review questions and send
        $("#reviewExam").addClass("shown");
        $("#mainContent > *:not('#reviewExam')").each(function() {
            $(this).detach();
        });
    };

    $scope.reload = function () {
        $("body").removeClass("notLoaded");
        $scope.requestExam();
    };

    // Checar se existe prova armazenada localmente
    if(localStorage.getItem("exam-" + $scope.idEvento)) { // a prova já foi carregada
        // All values are stored as STRING, then it is necessary to convert before using
        if(JSON.parse(localStorage.getItem("exam-" + $scope.idEvento) == "")) {
            localStorage.removeItem("exam-" + $scope.idEvento);
        } else {
            exam = JSON.parse(localStorage.getItem("exam-" + $scope.idEvento));
            $scope.configExam(exam);
            $scope.configClock();
            $scope.loadQuestion(parseInt(exam['current-question']));
            if(exam['finished']) {
                $timeout(function() {
                    $scope.confirmSubmit();
                }, 100);
            }
            $("body").removeClass("loading");
        }

    } else {
        $scope.store_local_data = function (data) {
            if (typeof Storage !== "undefined") {
                var store = data;
                store['start-time'] = new Date().toISOString();
                store['duration'] = document.getElementById("examDuration").value;
                store['current-question'] = '0';
                store['exam-id'] = data['idProva']['idProvaInstanciada'];
                var stringStorage = JSON.stringify(store);
                console.log(stringStorage);
                localStorage.setItem("exam-" + $scope.idEvento, stringStorage);

                /*localStorage.setItem("exam", JSON.stringify(data));
                localStorage.setItem("exam-id", data['idProva']['idProvaInstanciada']);
                localStorage.setItem("start-time", new Date().toISOString());
                localStorage.setItem("duration", document.getElementById("examDuration").value);
                localStorage.setItem("answers", "");
                localStorage.setItem("time-left", "");
                localStorage.setItem("current-question", '0');*/
                //return true;
            } else {
                // tratar quando navegador não suportar local storage
                //return false;
            }
        };

        $scope.requestExam = function() {
            /* REQUEST EXAM */
            $http.get($scope.requestUrl + '&idEvento=' + $scope.idEvento + '&matricula=' + $scope.matricula + "&larguradapagina=203").then(function (response) {
                if(response.data == "" || response.data['idProva'] === undefined) {
                    $("body").addClass("notLoaded");
                } else {
                    exam = response.data;
                    $scope.store_local_data(response.data);
                    $scope.configExam(response.data);
                    $scope.configClock();
                    $scope.loadQuestion($scope.currentQuestion);
                    if( $("body").hasClass("notLoaded") )
                        $("body").removeClass("notLoaded");
                    $("body").removeClass("loading");
                }
            }, function (error) {
                $("body").addClass("notLoaded");
            });
        };

        $scope.requestExam();

    }
});