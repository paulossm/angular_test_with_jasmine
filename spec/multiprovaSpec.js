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
    describe("the $scope.countDown function", function() {
        
        /*
            A função $scope.countDown realiza a contagem regressiva do tempo de prova sendo sinvronizado a cada segundo.
            Além disso, a função deve identificar quando o tempo é esgotado e atribuir true para $scope.timeIsOver
            
            Foram extraídos 7 casos de testes da tabela de decisão criada para esta função:
            link para a tabela: https://docs.google.com/spreadsheets/d/1WK_cTohZMmG4w66cr360SJ4xatJMGVfTu7IzuyPWk5k/edit?usp=sharing

        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos consultados durante a execução do caso de teste */
            $scope.time = {
                hours: {left: ''},
                minutes: {left: ''},
                seconds: {left: ''}
            };
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            localStorage.setItem = jasmine.createSpy("setItem");
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should decrease $scope.time.minutes.left by 1 and set $scope.time.seconds.left to 59', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(59);
            expect($scope.time.minutes.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should decrease $scope.time.hours.left by 1 and set 59 to $scope.time.minutes.left and $scope.time.seconds.left', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.time.hours.left).toEqual(0);
            expect($scope.time.minutes.left).toEqual(59);
            expect($scope.time.seconds.left).toEqual(59);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (5)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (6)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (7)
        it('should set $scope.timeIsOver to true', function() { 
            $scope.confirmSubmit = jasmine.createSpy("timeIsOverCallBack");
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.timeIsOver).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });
})