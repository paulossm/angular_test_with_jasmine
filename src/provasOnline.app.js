/**
 * Created by multiprova on 26/05/17.
 */

var app = angular.module('provasOnline', []);

app.controller('provaCtrl', function($scope, $http, $interval, $timeout) {
    var exam = "";

    location.hash = "takingExam";

    

    $scope.navigate = function (questionNumber) {
        if (questionNumber >= $scope.exam.length || questionNumber < 0) {
            return;
        } else {
            $scope.currentQuestion = questionNumber;
            exam['current-question'] = $scope.currentQuestion;
            localStorage.setItem("exam-" + $scope.idEvento, JSON.stringify(exam));
            //$scope.loadQuestion($scope.currentQuestion);
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