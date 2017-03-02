var myApp = angular.module('myApp');
myApp.controller('CarrinhoController', function ($scope, $routeParams, recursoCarrinho, recursoProduto, recursoCadastroVenda) {

    $scope.mensagem = '';
    $scope.carrinho = recursoCarrinho.get('lista');

    $scope.addItem = function (produto) {
        if (typeof $scope.carrinho === "undefined") {
            $scope.carrinho = {};
        }
        if (typeof $scope.carrinho.listaItem === "undefined") {
            $scope.carrinho.listaItem = [];
        }
        $scope.carrinho.listaItem.push(produto);
        recursoCarrinho.put('lista', $scope.carrinho);
        $scope.mensagemAdjust();

    };
    $scope.removeItem = function (produtoId) {
        $scope.carrinho.listaItem.remove(produtoId);
        $scope.mensagemAdjust();
    };

    $scope.enviarCarrinho = function () {

        var venda = {};
        venda.vendaItemCollection = [];
        venda.valorTotal = 0;
        popular = function (element, index, array) {
            var vendaItem = {};
            vendaItem.valor = element.valor;
            vendaItem.idProduto = element.id;
            vendaItem.quantidade = element.quantidade;
            venda.valorTotal += (element.valor * element.quantidade)
            venda.vendaItemCollection[index] = vendaItem;
        }
        $scope.carrinho.listaItem.forEach(popular);
        $scope.carrinho = {};
        $scope.carrinho.listaItem = [];
        recursoCarrinho.put('lista', $scope.carrinho);
        console.log(venda);
        recursoCadastroVenda.incluirVenda(venda);
        $scope.mensagem = 'Venda concluída!';
    };
    $scope.total = 0;
    totalizar = function (element, index, array) {
        $scope.total += (element.valor * element.quantidade)
    }
    $scope.mensagemAdjust = function () {
        if ($scope.carrinho.listaItem.length) {
            $scope.mensagem = '';
        } else {
            $scope.mensagem = 'Não foram adicionados itens no carrinho!';
        }
    };
    if ($routeParams.produtoId) {
        recursoProduto.get({produtoId: $routeParams.produtoId}, function (produto) {
            produto.quantidade = 1;
            if ($routeParams.quantidade) {
                produto.quantidade = $routeParams.quantidade;
            }
            $scope.addItem(produto);
            $scope.carrinho.listaItem.forEach(totalizar);
        }, function (erro) {
            console.log(erro);
            $scope.mensagem = 'Não foi possível obter o produto';
        });
    } else {
        if (typeof $scope.carrinho === "undefined") {
            $scope.carrinho = {};
        }
        if (typeof $scope.carrinho.listaItem === "undefined") {
            $scope.carrinho.listaItem = [];
        }
        $scope.mensagemAdjust();
        $scope.carrinho.listaItem.forEach(totalizar);
    }




});