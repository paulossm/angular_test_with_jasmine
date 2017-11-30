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

    // Suíte de testes
    describe("the $scope.navigate function", function() {
        
        /*
            A função $scope.navigate deve alterar o estado do objeto $scope.currentQuestion em relação à questão a qual o aluno está visualizando.
            Requisitos (Definição de classes de equivalência): 
                Válidos:
                    - A entrada deve ser um número inteiro positivo entre 0 e (n-1) sendo 'n' o número de questões da prova atual. [1]
                Inválidos:
                    - A entrada está fora do intervalo de questões [2]
                    - A entrada é um valor undefined [3]

        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos $scope.exam e $scope.currentQuestion que é consultado durante a execução do caso de teste */
            $scope.exam = {
                length: '',
            };
            $scope.currentQuestion = 0;
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            $scope.loadQuestion = jasmine.createSpy('loadQuestion');
            localStorage.setItem = jasmine.createSpy('setItem');
        });
      
        // Caso de teste que cobre a classe (1)
        it('should set the $scope.currentQuestion object to a valid value', function() {
            /*
                Como o intervalo de valores permitido é dinâmico, é preciso configurar o tamanho do array "$scope.exam" 
                para ser consultado dentro da função e decidir se o valor de entrada é valido ou não.
            */
            $scope.exam.length = 10;
            var question = 5;
            $scope.navigate(question);
            
            expect($scope.currentQuestion).toEqual(5);
            expect($scope.loadQuestion).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre a classe (2)
        it('should not set the $scope.currentQuestion due to an invalid numeric input', function() {
            $scope.exam.length = 3;
            var question = 5;
            $scope.navigate(question);
            
            expect($scope.currentQuestion).not.toEqual(5);
            expect($scope.loadQuestion).not.toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre a classe (3)
        it('should not set the $scope.currentQuestion due to an undefined input', function() {
            $scope.exam.length = 3;
            var question = undefined;
            $scope.navigate(question);
            expect($scope.currentQuestion).not.toEqual(undefined);
            expect($scope.loadQuestion).not.toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
		
    });
})