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
    describe("the $scope.nextQuestion function", function() {
        
        /*
            A função $scope.nextQuestion deve alterar o estado do objeto $scope.currentQuestion 
            e incrementar em 1 caso a questão atual não seja a última.
            
            Requisitos: 
                - o valor em $scope.currentQuestion deve estar entre 0 e (n-1) sendo 'n' o número de questões da prova atual

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
            $scope.finishExam = jasmine.createSpy('finishExam');
        });
      
        
        it('should increment $scope.currentQuestion by 1, update localStorage and call to $scope.loadQuestion()', function() {            
            $scope.exam.length = 10;
            $scope.currentQuestion = 8;
            $scope.nextQuestion();
            
            expect($scope.currentQuestion).toEqual(9);
            expect(localStorage.setItem).toHaveBeenCalled();
            expect($scope.loadQuestion).toHaveBeenCalled();
            expect($scope.finishExam).not.toHaveBeenCalled();
        });
        
        it('should identify that $scope.currentQuestion is already the last question and call $scope.finishExam()', function() {            
            $scope.exam.length = 10;
            $scope.currentQuestion = 9;
            $scope.nextQuestion();
            
            expect($scope.currentQuestion).toEqual(9);
            expect(localStorage.setItem).not.toHaveBeenCalled();
            expect($scope.loadQuestion).not.toHaveBeenCalled();
            expect($scope.finishExam).toHaveBeenCalled();
        });
    });
})