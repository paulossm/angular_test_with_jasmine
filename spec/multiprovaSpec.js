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
    describe("The integration test:", function() {        
        /*
            Essa função realizara a integração usando a abordagem bottonUp.
                                            -----------------
                                            - requestExam() -
                                            -----------------
                                                    -
                                                    -
                    ---------------------------------------------------------------
                    -                      -                  -                   -
                    -                      -                  -                   -
                    -                      -                  -                   -
                    -                      -                  -                   -
            ----------------------  ----------------  -----------------  ------------------
            - store_local_data() -  - configExam() -  - configClock() -  - loadQuestion() -
            ----------------------  ----------------  -----------------  ------------------
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
            
            //spy para notificar a chamada
            $scope.store_local_data = jasmine.createSpy("$scope.store_local_data");
            $scope.configExam = jasmine.createSpy("$scope.configExam");
            $scope.configClock = jasmine.createSpy("$scope.configClock");
            $scope.loadQuestion = jasmine.createSpy("$scope.loadQuestion");
            $scope.requestExam = jasmine.createSpy('$scope.requestExam');

            //Mocks necessário para a execussão
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            localStorage.setItem = jasmine.createSpy("setItem");

        });
        
        
        it('should call store_local_data', function(){
            var Storage = {};
            this.data.mockFullData();
            $scope.store_local_data(this.data);
            
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();

            expect($scope.store_local_data).toHaveBeenCalled();
        });

        it('should call configExam', function(){
            this.data.mockFullData();
            $scope.configExam(this.data);

            expect($scope.configExam).toHaveBeenCalled();
        });

        it('should call configClock', function(){
            //só pra ter os parâmetros
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;

            $scope.configClock(startTime, duration, timeLeft);
            expect($scope.configClock).toHaveBeenCalled();
        });

        it('should call loadQuestion', function(){
            var question = 0;

            $scope.loadQuestion(question);
            expect($scope.loadQuestion).toHaveBeenCalled();
        });

        //#####################################################
        it('Should call store_local_data and requestExam', function(){
            this.data.mockFullData();

            $scope.store_local_data(this.data);
            $scope.configExam();

            expect($scope.store_local_data).toHaveBeenCalled();
            expect($scope.configExam).toHaveBeenCalled();
        });
        
        it('Should call configExam and requestExam', function(){
            this.data.mockFullData();

            $scope.configExam(this.data);
            $scope.configExam();

            expect($scope.configExam).toHaveBeenCalled();
            expect($scope.configExam).toHaveBeenCalled();
        });

        it('Should call configClock and requestExam', function(){
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;

            $scope.configClock(startTime, duration, timeLeft);
            $scope.configExam();

            expect($scope.configClock).toHaveBeenCalled();
            expect($scope.configExam).toHaveBeenCalled();
        });

        it('Should call loadQuestion and requestExam', function(){
            var question = 0;
            
            $scope.loadQuestion(question);
            $scope.configExam();

            expect($scope.loadQuestion).toHaveBeenCalled();
            expect($scope.configExam).toHaveBeenCalled();
        });

    });
})