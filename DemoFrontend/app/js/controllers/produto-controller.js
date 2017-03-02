var myApp = angular.module('myApp');
myApp.controller('ProdutoController', ['$scope', 'recursoProduto', '$routeParams', function ($scope, recursoProduto, $routeParams) {

        $scope.produto = {};
        $scope.mensagem = '';
        $scope.produto.quantidade = 1;


        $scope.decQtd = function () {
            $scope.produto.quantidade--;
        }
        $scope.incQtd = function () {
            $scope.produto.quantidade++;
        }
        if ($routeParams.produtoId) {
            recursoProduto.get({produtoId: $routeParams.produtoId}, function (produto) {
                $scope.produto = produto;
                $scope.produto.quantidade = 1;
            }, function (erro) {
                console.log(erro);
                $scope.mensagem = 'Não foi possível obter o produto';
            });
        }
    }]);
