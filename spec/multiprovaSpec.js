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
    describe("the $scope.store_local_data function", function() {
        
        /*
            Responsável por verificar o suporte ao armazenamento local no navegador
            e alocar os dados da prova após a requisição
            
            Requisitos:
                Válidos:
                    - data['idProva']['idProvaInstanciada'] precisa estar definido [1]
                    - ao invocar document.getElementById("examDuration"), este deve ser um valor válido [2]
                    
                Inválidos:
                    - data está indefinido [3]
                    - data não está no formato válido [4]
                    - Storage está indefinido [5]
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
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should store local data correctly', function() { 
            this.data.mockFullData();
            var Storage = {};
            
            $scope.store_local_data(this.data);
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should store exam-id correctly', function() { 
            this.data.idProva.idProvaInstanciada = 1;
            
            $scope.store_local_data(this.data);
            
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should not perform action due to undefined data input', function() { 
            this.data = undefined;
            
            $scope.store_local_data(this.data);
            
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should not perform action due to invalid data input format', function() { 
            this.data = ['myData'];
            
            $scope.store_local_data(this.data);
            
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should identify lack of support to localStorage', function() { 
            this.data.mockFullData();
            window.Storage = undefined;
            
            $scope.store_local_data(this.data);
            
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
    });
})