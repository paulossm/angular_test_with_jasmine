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
    describe("$scope.navigate", function() {
		
        // Caso de teste
		it('should set the correct question to $scope', function() {
          
          var $scope = $rootScope.$new();
          var controller = $controller('provaCtrl', { $scope: $scope });
          
          $scope.exam = ['test'];
          var question = 0;
          $scope.navigate(question);
          expect($scope.currentQuestion).toEqual(0);
        });
      
      it('should set the correct question to $scope', function() {
          
          var $scope = $rootScope.$new();
          var controller = $controller('provaCtrl', { $scope: $scope });
          
          $scope.exam = ['test'];
          var question = -1;
          $scope.navigate(question);
          expect($scope.currentQuestion).toEqual(-1);
        });
		
    });
})