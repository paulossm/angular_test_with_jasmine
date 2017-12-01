"use strict";

describe('MultiprovaTest', function() {
    // Inicializa o modulo angular para os testes
    beforeEach(module('provasOnline'));
    
    var $controller, $rootScope, $interval, $http, $timeout;
  
    /* antes de cada teste, injeta os atributos controller e escopo
       para ficarem acessíveis dentro dos testes
    */
    beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_, _$http_, _$timeout_) {
        $controller = _$controller_;                  
        $rootScope = _$rootScope_;
        $interval = _$interval_;
        $http = _$http_;
        $timeout = _$timeout_;
    }));

    // Suite de Testes
    describe("the $scope.configClock function", function() {
        
        /*
            A função $scope.configClock é responsável por configurar o tempo de prova com base
            no tempo definido pelo professor e o momento em que o aluno abre a janela para começar
            a realizar a prova.
            
            Parâmetros:
                - startTime: representa o horário que o aluno começou a prova.
                - duration: tempo máximo para fazer a prova definido pelo professor.
                - timeLeft: caso o aluno esteja voltando, este argumento possui o tempo restante do aluno para fazer a prova.
            
            Requisitos: 
                Válidos:
                    - duration deve ser um valor no formato "hh:mm:ss" que representa um tempo. [1]
                    - startTime deve ser uma data com hora (timestamp) ou ser undefined. [2]
                    - timeLeft deve ser um objeto idêntico a $scope.time ou ser undefined. [3]
                
                Inválidos:
                    - duration é um valor undefined [4]
                    - duration não está no formato correto [5]
                    - duration representa um tempo negativo [6]
                    - duration representa um valor inválido e o acesso ao DOM também [7]
                    - startTime está definido mas não representa uma data com hora. [8]
                    - timeLeft está definido mas não é um objeto $scope.time [9]

        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos consultados durante a execução do caso de teste */
            $scope.exam = {};            
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            localStorage.setItem = jasmine.createSpy("setItem");
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should set $scope.startTime and $scope.duration and calculate time left', function() { 
            var startTime = new Date();
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toEqual(startTime.getTime());
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt('01'));
            expect($scope.time.minutes.left).toEqual(parseInt('01'));
            expect($scope.time.seconds.left).toEqual(parseInt('01'));
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should create $scope.startTime and calculate time left', function() { 
            var startTime = undefined;
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt('01'));
            expect($scope.time.minutes.left).toEqual(parseInt('01'));
            expect($scope.time.seconds.left).toEqual(parseInt('01'));
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should create $scope.startTime and use time left from arguments', function() { 
            var startTime = undefined;
            var duration = "1:00:00";
            var timeLeft = {
                'hours': {'left': 0},
                'minutes': {'left': 15},
                'seconds': {'left': 0}
            };
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(timeLeft.hours.left);
            expect($scope.time.minutes.left).toEqual(timeLeft.minutes.left);
            expect($scope.time.seconds.left).toEqual(timeLeft.seconds.left);
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should access DOM to retrieve duration information', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt("01"));
            expect($scope.time.minutes.left).toEqual(parseInt("01"));
            expect($scope.time.seconds.left).toEqual(parseInt("01"));
            
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (5)
        it('should access DOM to retrieve duration information due to an invalid input', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = "1h30m0s";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (6)
        it('should access DOM to retrieve duration information due to an invalid input', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = "-3:30:20";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (7)
        it('should not perform any action because both duration parameter and DOM are undefined', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: undefined});
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).not.toBeDefined();
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (8)
        it('should create a new Date object for startTime because the parameter is invalid', function() { 
            var startTime = "2017, 10 Fev";
            var compareDate = new Date("2017-02-10");
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.examTime.startTime.getTime()).toBeGreaterThan(compareDate.getTime());
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (9)
        it('should create a new $scope.time object because timeLeft parameter is invalid', function() { 
            var startTime = undefined;
            var duration = "01:00:00";
            var timeLeft = {};
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.time.hours.left).toEqual(parseInt("01"));
            expect($scope.time.minutes.left).toEqual(parseInt("00"));
            expect($scope.time.seconds.left).toEqual(parseInt("00"));
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });
})