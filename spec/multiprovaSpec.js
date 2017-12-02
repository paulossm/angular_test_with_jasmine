"use strict";

describe('MultiprovaTest', function() {
    // Inicializa o modulo angular para os testes
    beforeEach(module('provasOnline'));

    var $controller, $rootScope, $interval, $httpBackend, $timeout;

    /* antes de cada teste, injeta os atributos controller e escopo
    para ficarem acessíveis dentro dos testes
    */
    beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_, _$httpBackend_, _$timeout_) {
        $controller = _$controller_;                  
        $rootScope = _$rootScope_;
        $interval = _$interval_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
    }));

    // Suite de Testes
    describe("the $scope.requestExam function", function() {

        /*
        Esta função realiza a requisição da prova via http e então carrega as funções responsáveis por configurar o ambiente de prova.

        Requisitos:
            Válidos:
                - os parâmetros necessário para a requisição $scope.requestUrl, $scope.idEvento e $scope.matricula precisam estar definidos [1]
                - http response deve retornar um valor válido [2]

            Inválidos:
                - algum parâmetro necessário para a reuisição possui valor inválido [3]
                - http retorna erro ou não retorna nada [4]
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
            $scope.store_local_data = jasmine.createSpy("storeLocalData");
            $scope.configExam = jasmine.createSpy("configExam");
            $scope.configClock = jasmine.createSpy("configClock");
            $scope.loadQuestion = jasmine.createSpy("loadQuestion");
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        // [1]
        it('should request and correctly call $scope functions', function() {
            this.data.mockFullData();
            /* Mock http service */
            $httpBackend.when('GET', "/mock-url&idEvento=1&matricula=1111111111&larguradapagina=203").respond(this.data); 
            $scope.requestUrl = '/mock-url';
            $scope.idEvento = 1;
            $scope.matricula = "1111111111";            

            $scope.requestExam();
            
            $httpBackend.expectGET($scope.requestUrl + '&idEvento=' + $scope.idEvento + '&matricula=' + $scope.matricula + "&larguradapagina=203");
            $httpBackend.flush();

            expect($scope.store_local_data).toHaveBeenCalled();
            expect($scope.configExam).toHaveBeenCalled();
            expect($scope.configClock).toHaveBeenCalled();
            expect($scope.loadQuestion).toHaveBeenCalled();
        });
        
        // [2]
        it('should request and check valid response data', function() {
            this.data.mockFullData();
            /* Mock http service */
            $httpBackend.when('GET', "/mock-url&idEvento=1&matricula=1111111111&larguradapagina=203").respond(this.data); 
            $scope.requestUrl = '/mock-url';
            $scope.idEvento = '1';
            $scope.matricula = "1111111111";

            $scope.requestExam();

            $httpBackend.expectGET($scope.requestUrl + '&idEvento=' + $scope.idEvento + '&matricula=' + $scope.matricula + "&larguradapagina=203");
            $httpBackend.flush();

            expect($scope.exam).toEqual(this.data);
        });
        
        // [3]
        it('should identify invalid parameter and abort request', function() {
            var bodySpy = spyOn($.fn, 'addClass');
            this.data.mockFullData();
            /* Mock http service */
            $httpBackend.when('GET', "/mock-url&idEvento=1&matricula=1111111111&larguradapagina=203").respond(this.data); 
            $scope.requestUrl = '';
            $scope.idEvento = 1;
            $scope.matricula = "1111111111";

            $scope.requestExam();

            expect(bodySpy).toHaveBeenCalledWith("notLoaded");
            expect($scope.store_local_data).not.toHaveBeenCalled();
            expect($scope.configExam).not.toHaveBeenCalled();
            expect($scope.configClock).not.toHaveBeenCalled();
            expect($scope.loadQuestion).not.toHaveBeenCalled();
        });
        
        // [4]
        it('should check the response data validity', function() {
            var bodySpy = spyOn($.fn, 'addClass');
            this.data = "";
            /* Mock http service */
            $httpBackend.when('GET', "/mock-url&idEvento=1&matricula=1111111111&larguradapagina=203").respond(this.data); 
            $scope.requestUrl = '/mock-url';
            $scope.idEvento = 1;
            $scope.matricula = "1111111111";

            $scope.requestExam();
            
            $httpBackend.expectGET($scope.requestUrl + '&idEvento=' + $scope.idEvento + '&matricula=' + $scope.matricula + "&larguradapagina=203");
            $httpBackend.flush();

            expect(bodySpy).toHaveBeenCalledWith("notLoaded");
            expect($scope.store_local_data).not.toHaveBeenCalled();
            expect($scope.configExam).not.toHaveBeenCalled();
            expect($scope.configClock).not.toHaveBeenCalled();
            expect($scope.loadQuestion).not.toHaveBeenCalled();
        })
    });
})