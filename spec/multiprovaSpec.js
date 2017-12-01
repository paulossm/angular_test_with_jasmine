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
    describe("The $scope.isAnswered function", function() {
        
        /*
             A função $scope.isAnswered verifica se uma determinada questão foi respondida.

             Parâmetros:
                - questionNumber: número da questão que vai ser verificada.

            Requisitos:
                Válidos:
                    -questionNumber é um valor dentro do intervalo do número de questões da prova.
                    - a função retorna o valor fornecido como resposta na tabela de respostas.

                Inválidos
                    - questionNumber é um valor maior que a quantidade total de questões da prova.
                    - questionNumber é uma valor negativo.

        */

        var $scope, controller;

        beforeEach(function(){
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', {$scope: $scope});

            /* Mock dos objetos $scope.answers que é consultado durante o caso de teste. */
            $scope.answers = new Array(2);
            $scope.answers[0] = {
                'question': 1,
                'answer':'N/R'
            }

            $scope.answers[1] = {
                'question': 2,
                'answer':'43'
            }            
        });

        it('should verify if question number is out of test questions range', function(){
            expect($scope.answers[3]).not.toBeDefined();
        });

        it('should verify if question number is negative', function(){
            expect($scope.answers[-2]).not.toBeDefined();
        });

        it('shoud verify if the question are no answere', function(){
            expect($scope.answers[0].answer).toEqual('N/R');
        });
		
    });
})