"use strict";

describe('MultiprovaTest', function() {
    // Inicializa o modulo angular para os testes
    beforeEach(module('provasOnline'));
    
    var $controller, $rootScope;
  
    /* antes de cada teste, injeta os atributos controller e escopo
       para ficarem acessíveis dentro dos testes
    */
    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;                  
        $rootScope = _$rootScope_;
    }));

    // Suite de Testes
    describe("the $scope.previousQuestion function", function() {
        
        /*
            A função $scope.previousQuestion deve alterar o estado do objeto $scope.currentQuestion 
            e decrementar em 1 caso a questão atual não seja a primeira.
            
            Requisitos: 
                - o valor em $scope.currentQuestion deve ser maior que 0

        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos $scope.exam e $scope.currentQuestion que é consultado durante a execução do caso de teste */
            $scope.exam = {length: ''};
            $scope.currentQuestion = 0;
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            $scope.loadQuestion = jasmine.createSpy('loadQuestion');
            localStorage.setItem = jasmine.createSpy('setItem');
        });
      
        
        it('should decrement $scope.currentQuestion by 1, update localStorage and call to $scope.loadQuestion()', function() {            
            $scope.exam.length = 10;
            $scope.currentQuestion = 2;
            $scope.previousQuestion();
            
            expect($scope.currentQuestion).toEqual(1);
            expect(localStorage.setItem).toHaveBeenCalled();
            expect($scope.loadQuestion).toHaveBeenCalled();
        });
        
        it('should identify that $scope.currentQuestion is already the first question and do nothing', function() {
            $scope.exam.length = 10;
            $scope.currentQuestion = 0;
            $scope.previousQuestion();
            
            expect($scope.currentQuestion).toEqual(0);
            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect($scope.loadQuestion).not.toHaveBeenCalled();
        });
    });
})