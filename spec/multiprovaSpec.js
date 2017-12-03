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
    
    describe("the $scope.configClock function", function() {
        
        /*
            A função $scope.configClock é responsável por configurar o tempo de prova com base
            no tempo definido pelo professor e o momento em que o aluno abre a janela para começar
            a realizar a prova.
            
            Parâmetros:
                - startTime: representa o horário que o aluno começou a prova.
                - duration: tempo máximo para fazer a prova definido pelo professor.
                - timeLeft: caso o aluno esteja voltando, este argumento possui o tempo restante do aluno para fazer a prova.
            
            Requisitos: 
                Válidos:
                    - duration deve ser um valor no formato "hh:mm:ss" que representa um tempo. [1]
                    - startTime deve ser uma data com hora (timestamp) ou ser undefined. [2]
                    - timeLeft deve ser um objeto idêntico a $scope.time ou ser undefined. [3]
                
                Inválidos:
                    - duration é um valor undefined [4]
                    - duration não está no formato correto [5]
                    - duration representa um tempo negativo [6]
                    - duration representa um valor inválido e o acesso ao DOM também [7]
                    - startTime está definido mas não representa uma data com hora. [8]
                    - timeLeft está definido mas não é um objeto $scope.time [9]
        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos consultados durante a execução do caso de teste */
            $scope.exam = {};            
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            localStorage.setItem = jasmine.createSpy("setItem");
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should set $scope.startTime and $scope.duration and calculate time left', function() { 
            var startTime = new Date();
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toEqual(startTime.getTime());
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt('01'));
            expect($scope.time.minutes.left).toEqual(parseInt('01'));
            expect($scope.time.seconds.left).toEqual(parseInt('01'));
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should create $scope.startTime and calculate time left', function() { 
            var startTime = undefined;
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt('01'));
            expect($scope.time.minutes.left).toEqual(parseInt('01'));
            expect($scope.time.seconds.left).toEqual(parseInt('01'));
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should create $scope.startTime and use time left from arguments', function() { 
            var startTime = undefined;
            var duration = "1:00:00";
            var timeLeft = {
                'hours': {'left': 0},
                'minutes': {'left': 15},
                'seconds': {'left': 0}
            };
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual(duration);
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(timeLeft.hours.left);
            expect($scope.time.minutes.left).toEqual(timeLeft.minutes.left);
            expect($scope.time.seconds.left).toEqual(timeLeft.seconds.left);
            
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should access DOM to retrieve duration information', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect($scope.examTime.startTime.getTime()).toBeDefined();
            expect($scope.examTime.endTime).toBeGreaterThan($scope.examTime.startTime);
            expect($scope.time.hours.left).toEqual(parseInt("01"));
            expect($scope.time.minutes.left).toEqual(parseInt("01"));
            expect($scope.time.seconds.left).toEqual(parseInt("01"));
            
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (5)
        it('should access DOM to retrieve duration information due to an invalid input', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = "1h30m0s";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (6)
        it('should access DOM to retrieve duration information due to an invalid input', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: "01:01:01"});
            var startTime = undefined;
            var duration = "-3:30:20";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).toEqual("01:01:01");
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (7)
        it('should not perform any action because both duration parameter and DOM are undefined', function() { 
            document.getElementById = jasmine.createSpy("DOM").and.returnValue({value: undefined});
            var startTime = undefined;
            var duration = undefined;
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.exam.duration).not.toBeDefined();
            expect(document.getElementById).toHaveBeenCalled();
            expect(localStorage.setItem).not.toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (8)
        it('should create a new Date object for startTime because the parameter is invalid', function() { 
            var startTime = "2017, 10 Fev";
            var compareDate = new Date("2017-02-10");
            var duration = "01:01:01";
            var timeLeft = undefined;
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.examTime.startTime.getTime()).toBeGreaterThan(compareDate.getTime());
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (9)
        it('should create a new $scope.time object because timeLeft parameter is invalid', function() { 
            var startTime = undefined;
            var duration = "01:00:00";
            var timeLeft = {};
            
            $scope.configClock(startTime, duration, timeLeft);
            
            expect($scope.time.hours.left).toEqual(parseInt("01"));
            expect($scope.time.minutes.left).toEqual(parseInt("00"));
            expect($scope.time.seconds.left).toEqual(parseInt("00"));
            expect(document.getElementById).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });
    
    describe("the $scope.countDown function", function() {
        
        /*
            A função $scope.countDown realiza a contagem regressiva do tempo de prova sendo sinvronizado a cada segundo.
            Além disso, a função deve identificar quando o tempo é esgotado e atribuir true para $scope.timeIsOver
            
            Foram extraídos 7 casos de testes da tabela de decisão criada para esta função:
            link para a tabela: https://docs.google.com/spreadsheets/d/1WK_cTohZMmG4w66cr360SJ4xatJMGVfTu7IzuyPWk5k/edit?usp=sharing
        */
        
        var $scope, controller;
      
        beforeEach(function() {
            $scope = $rootScope.$new();
            controller = $controller('provaCtrl', { $scope: $scope }); 
            
            /* Mock objetos consultados durante a execução do caso de teste */
            $scope.time = {
                hours: {left: ''},
                minutes: {left: ''},
                seconds: {left: ''}
            };
            
            /* Mocks de funções que são chamadas durante a execução do caso de teste */
            localStorage.setItem = jasmine.createSpy("setItem");
        });
        
        
        // Caso de teste que cobre classe (1)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (2)
        it('should decrease $scope.time.minutes.left by 1 and set $scope.time.seconds.left to 59', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(59);
            expect($scope.time.minutes.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (3)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (4)
        it('should decrease $scope.time.hours.left by 1 and set 59 to $scope.time.minutes.left and $scope.time.seconds.left', function() { 
            $scope.time.hours.left = 1;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.time.hours.left).toEqual(0);
            expect($scope.time.minutes.left).toEqual(59);
            expect($scope.time.seconds.left).toEqual(59);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (5)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 1;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (6)
        it('should decrease $scope.time.seconds.left by 1', function() { 
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 1;
            
            $scope.countDown();
            
            expect($scope.time.seconds.left).toEqual(0);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
        
        // Caso de teste que cobre classe (7)
        it('should set $scope.timeIsOver to true', function() { 
            $scope.confirmSubmit = jasmine.createSpy("timeIsOverCallBack");
            $scope.time.hours.left = 0;
            $scope.time.minutes.left = 0;
            $scope.time.seconds.left = 0;
            
            $scope.countDown();
            
            expect($scope.timeIsOver).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalled();
        });
    });
    
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