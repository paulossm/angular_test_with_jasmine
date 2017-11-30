"use strict";

describe('MultiprovaTest', function() {
    // Inicializa o modulo angular para os testes
    beforeEach(module('provasOnline'));
    
    var $controller, $rootScope, $interval;
  
    /* antes de cada teste, injeta os atributos controller e escopo
       para ficarem acessíveis dentro dos testes
    */
    beforeEach(inject(function(_$controller_, _$rootScope_, _$interval_) {
        $controller = _$controller_;                  
        $rootScope = _$rootScope_;
        $interval = _$interval_;
    }));

    // Suite de Testes
    describe("the $scope.loadQuestion function", function() {
        
        /*
            A função $scope.loadQuestion deve carregar na tela o enunciado e alternativas 
            da questão atual e ativa a contagem regressiva do tempo
            com uma chamada a $scope.clockTicking;
            
            Requisitos: 
                Válidos:
                    - O valor do parâmetro deve ser um número entre 0 e (n-1) sendo n o número de questões na prova. [1]
                Inválidos:
                    - O valor do parâmetro é menor que 0 [2]
                    - O valor do parâmetro é maior que número de questões [3]
                    - O valor do parâmetro é undefined [4]

        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos consultados durante a execução do caso de teste */
            $scope.exam = [];
            $scope.currentQuestion = 0;
            $scope.clockTicking = true;
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            $scope.pauseTimer = jasmine.createSpy("pauseTimer");
            $scope.resumeTimer = jasmine.createSpy("resumeTimer");
        });
        
        // Caso de teste que cobre classe (1)
        it('should update enunciado, alternativas and letras when a valid question number is passed', function() {            
            $scope.exam = [{
                enunciado: 'enuciado-mock',
                alternativas: 'alternativas-mock',
                letraInstanciada: "a,b,c,d"
            }];
            $scope.answers = [{answer: 'b'}];
            $scope.answer = {selectedOption: ''};
            
            var question = 0;
            $scope.loadQuestion(question);
            
            expect($scope.enunciado).toEqual($scope.exam[question].enunciado);
            expect($scope.alternativas).toEqual($scope.exam[question].alternativas);
            expect($scope.letras).toEqual($scope.exam[question].letraInstanciada.split(','));
            expect($scope.answer.selectedOption).toEqual($scope.answers[question].answer);  
            expect($scope.pauseTimer).toHaveBeenCalled();
            expect($scope.resumeTimer).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should not update enunciado, alternativas or letras when an invalid question number is passed', function() {            
            $scope.exam = [];
            $scope.answers = [];
            $scope.answer = {selectedOption: 'N/A'};

            var question = -1;
            $scope.loadQuestion(question);
            
            expect($scope.enunciado).not.toBeDefined();
            expect($scope.alternativas).not.toBeDefined();
            expect($scope.letras).not.toBeDefined();
            expect($scope.answer.selectedOption).toEqual('N/A');  
            expect($scope.pauseTimer).not.toHaveBeenCalled();
            expect($scope.resumeTimer).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should not update enunciado, alternativas or letras when an invalid question number is passed [2]', function() {            
            $scope.exam = [];
            $scope.exam.length = 5;
            $scope.answers = [];
            $scope.answer = {selectedOption: 'N/A'};

            var question = 6;
            $scope.loadQuestion(question);
            
            expect($scope.enunciado).not.toBeDefined();
            expect($scope.alternativas).not.toBeDefined();
            expect($scope.letras).not.toBeDefined();
            expect($scope.answer.selectedOption).toEqual('N/A');  
            expect($scope.pauseTimer).not.toHaveBeenCalled();
            expect($scope.resumeTimer).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should not update enunciado, alternativas or letras when an undefined question number is passed', function() {            
            $scope.exam = [];
            $scope.exam.length = 5;
            $scope.answers = [];
            $scope.answer = {selectedOption: 'N/A'};

            var question = undefined;
            $scope.loadQuestion(question);
            
            expect($scope.enunciado).not.toBeDefined();
            expect($scope.alternativas).not.toBeDefined();
            expect($scope.letras).not.toBeDefined();
            expect($scope.answer.selectedOption).toEqual('N/A');  
            expect($scope.pauseTimer).not.toHaveBeenCalled();
            expect($scope.resumeTimer).not.toHaveBeenCalled();
        });
    });
})