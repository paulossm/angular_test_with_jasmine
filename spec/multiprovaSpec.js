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