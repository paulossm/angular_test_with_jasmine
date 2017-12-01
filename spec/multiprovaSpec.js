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
    describe("the $scope.configExam function", function() {
        
        /*
            Esta função é responsável por inicializar as variáveis com dados da prova
            que está sendo feita. Ela recebe um objeto data que é resultado de uma requisição
            da aplicação a um serviço externo, e então preenche as variáveis necessárias.
            
            Requisitos:
                Válidos:
                    - data['previews'] e data['idProva']['idProvaInstanciada'] precisam estar definidos [1]
                    - data["current-question"] pode ser indefinido ou um número entre 0 e (n-1) sendo 'n' o número de questões da prova atual[2]
                    - data["answers"] pode ser indefinido ou representar um array de mesmo tamanho do número de questões da prova atual. [3]
                    
                Inválidos:
                    - data está indefinido [4]
                    - data não está no formato válido [5]
        */
        
        var $scope, controller;
      
        beforeEach(function() {
            /* Mock objetos consultados durante a execução do caso de teste */
            this.data = {
                previews: [],
                idProva: {idProvaInstanciada: ''},
                'current-question': '',
                answers: [],
                
                mockFullData: function() {
                    this.previews = ['m','o','c','k'];
                    this.idProva.idProvaInstanciada = 1;
                    this['current-question'] = 1;
                    this.answers = ['a','b', 'c', 'd'];
                }
            };
            
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            localStorage.setItem = jasmine.createSpy("setItem");
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should assign previews and idProva correctly', function() { 
            this.data.previews = ['m','o','c','k'];
            this.data.idProva.idProvaInstanciada = 1;
            
            $scope.configExam(this.data);
            
            expect($scope.exam).toEqual(this.data.previews);
            expect($scope.idProva).toEqual(this.data.idProva.idProvaInstanciada);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should assign current-question correctly', function() { 
            this.data.previews = ['m','o','c','k'];
            this.data.idProva.idProvaInstanciada = 1;
            this.data['current-question'] = '2';
            
            $scope.configExam(this.data);
            
            expect($scope.currentQuestion).toEqual(parseInt(this.data['current-question']));
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
         // Caso de teste que cobre classe (3)
        it('should assign correct data to $scope variables', function() { 
            this.data.mockFullData();
            
            $scope.configExam(this.data);
            
            expect($scope.answers).toEqual(this.data.answers);
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should not perform action due to undefined data input', function() { 
            this.data = undefined;
            
            $scope.configExam(this.data);
            
            expect($scope.exam).not.toBeDefined();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (5)
        it('should not perform action due to invalid data input format', function() { 
            this.data = ['myData'];
            
            $scope.configExam(this.data);
            
            expect($scope.exam).not.toBeDefined();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
    });
})