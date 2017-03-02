var myService = angular.module('meusServicos', ['ngResource']);

var endereco = 'http://localhost:8080';

myService.factory('recursoProduto', function ($resource) {

    return $resource(endereco + '/DemoWS/rs/produto/:produtoId', {}, {
        'findAll': {
            method: 'GET',
            isArray: true
        }
    });

});
myService.factory('recursoVenda', function ($resource) {

    return $resource(endereco + '/DemoWS/rs/venda/:produtoId', {}, {
        'findAll': {
            method: 'GET',
            isArray: true
        }
    });

});
myService.factory('recursoCadastroVenda', function (recursoVenda, $q) {
    var service = {};
    service.incluirVenda = function (carrinho) {
        return $q(function (resolve, reject) {
            recursoVenda.save(carrinho, function () {
                resolve({
                    mensagem: 'Venda incluída com sucesso',
                    inclusao: true
                });
            }, function (erro) {
                console.log(erro);
                reject({
                    mensagem: 'Não foi possível incluir a venda'
                });
            });
        });
    };
    return service;

});

myService.factory('recursoCarrinho', function ($cacheFactory) {

    return $cacheFactory('carrinho');

});
        