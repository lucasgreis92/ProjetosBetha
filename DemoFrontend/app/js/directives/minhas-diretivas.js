angular.module('minhasDiretivas', [])
        .directive('meuPainel', function () {

            var ddo = {};

            ddo.restrict = "AE";
            ddo.transclude = true;
            
            ddo.scope = {
                descricao: '@',
                url: '@',
                complemento: '@',
                valor: '@'
            };

            ddo.templateUrl = 'js/directives/meu-painel.html';

            return ddo;
        });
