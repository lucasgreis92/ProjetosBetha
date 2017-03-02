var myApp = angular.module('myApp', ['minhasDiretivas', 'ngAnimate', 'ngRoute', 'ngResource', 'meusServicos']);

myApp.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);


    $routeProvider.when('/produtos', {
        templateUrl: 'partials/principal.html',
        controller: 'ProdutosController'
    });
    $routeProvider.when('/', {
        templateUrl: 'partials/principal.html',
        controller: 'ProdutosController'
    });

    $routeProvider.when('/carrinho/new/:produtoId/:quantidade', {
        templateUrl: 'partials/carrinho.html',
        controller: 'CarrinhoController'
    });
    $routeProvider.when('/carrinho/list', {
        templateUrl: 'partials/carrinho.html',
        controller: 'CarrinhoController'
    });

    $routeProvider.when('/add-item/:produtoId', {
        templateUrl: 'partials/add-item.html',
        controller: 'ProdutoController'
    });

    $routeProvider.otherwise({redirectTo: '/produtos'});

});