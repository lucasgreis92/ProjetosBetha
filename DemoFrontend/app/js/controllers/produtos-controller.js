var myApp = angular.module('myApp');
myApp.controller('ProdutosController', function ($scope, recursoProduto) {

    $scope.produtos = [];
    $scope.filtro = '';
    $scope.mensagem = '';


    $scope.produtos = recursoProduto.findAll();

});