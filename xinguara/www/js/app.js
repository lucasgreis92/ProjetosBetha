// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'firebase', 'app.services', 'angularSoap', 'tabSlideBox'])

        .run(function ($ionicPlatform, $q, $http, $rootScope, $location, $window, $timeout) {

            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

            });
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

            // config das tabs
            $ionicConfigProvider.tabs.position('top');

            // desabilitar cache de views para evitar dor de cabeça
            $ionicConfigProvider.views.maxCache(0);

            // transição entre telas default da plataforma
            $ionicConfigProvider.views.transition('platform');

            $stateProvider

                    .state('index', {
                        url: '/index',
                        urlTemplate: '',
                        controller: 'IndexCtrl'
                    })

                    // esse state abstract é que faz o menu aparecer
                    // aonde eu quiser o menu eu uso o estado 'app.meu_novo_state'
                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'LoginCtrl'
                    })

                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login-zima.html',
                        controller: 'LoginCtrl',
                        resolve: {
                            Address: function () {
                                return [];
                            }
                        }
                    })

                    .state('formCreateAccount', {
                        url: '/criar-conta',
                        templateUrl: 'templates/create-account.html',
                        controller: 'CriarContaCtrl'
                    })

                    .state('prospectendereco', {
                        url: '/prospect-endereco',
                        templateUrl: 'templates/prospect_endereco.html',
                        controller: 'ProspectEnderecoCtrl',
                        resolve: {
                            Address: function () {
                                var data = {};
                                // carregar dados de endereço, locais ou de servidor, aqui no resolve
                                data.estados = [
                                    {id: 1, nome: 'RS'},
                                    {id: 2, nome: 'SC'},
                                    {id: 3, nome: 'PR'}
                                ];
                                data.cidades = [
                                    {id: 1, nome: 'Barra Velha'},
                                    {id: 2, nome: 'Blumenau'},
                                    {id: 3, nome: 'Navegantes'}
                                ];
                                data.bairros = [
                                    {id: 1, nome: 'Machados'},
                                    {id: 2, nome: 'Centro'},
                                    {id: 3, nome: 'Gravatá'}
                                ];
                                return data;
                            }
                        }
                    })

                    .state('tipoconta', {
                        url: '/tipo-conta',
                        templateUrl: 'templates/tipo-conta.html',
                        controller: 'TipoContaCtrl'
                    })

                    .state('recuperarsenha', {
                        url: '/recuperar-senha',
                        templateUrl: 'templates/recuperar_senha.html',
                        controller: 'RecuperarSenhaCtrl'
                    })

                    .state('pessoafisica', {
                        url: '/pessoa-fisica',
                        templateUrl: 'templates/pessoa_fisica.html',
                        controller: 'PessoaFisicaCtrl'
                    })

                    .state('pessoajuridica', {
                        url: '/pessoa-juridica',
                        templateUrl: 'templates/pessoa_juridica.html',
                        controller: 'PessoaJuridicaCtrl'
                    })

                    //app = menu.html
                    //home = home.html
                    .state('app.home', {
                        url: '/home',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/home.html',
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('editarperfil', {
                        url: '/editarperfil',
                        templateUrl: 'templates/perfil.html',
                        controller: 'HomeCtrl'
                    })

                    .state('filtros', {
                        url: '/filtros',
                        templateUrl: 'templates/filtros.html',
                        controller: 'HomeCtrl'
                    })

                    // tabs
                    .state('app.home.todos', {
                        url: '/todos',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/todos.html',
                                controller: 'HomeCtrl'
                            },
                            'tab-todos': {
                                templateUrl: 'templates/todos.html',
                                controller: 'HomeCtrl'
                            }
                        },
                        resolve: {
                            itens: function (WSService) {
                                return WSService.getProdutos();
                            }
                        }
                    })

                    .state('app.home.promocao', {
                        url: '/promocao',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/promocao.html',
                                controller: 'HomeCtrl'
                            },
                            'tab-promocao': {
                                templateUrl: 'templates/promocao.html',
                                controller: 'HomeCtrl'
                            }
                        },
                        resolve: {
                            itens: function (WSService) {
                                return WSService.getProdutos();
                            }
                        }
                    })

                    .state('app.home.santagula', {
                        url: '/santagula',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            },
                            'tab-santagula': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            }
                        },
                        resolve: {
                            itens: function (WSService) {
                                return WSService.getProdutos();
                            }
                        }
                    })

                    .state('app.home.traseiro', {
                        url: '/traseiro',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            },
                            'tab-traseiro': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            }
                        },
                        resolve: {
                            itens: function (WSService) {
                                return WSService.getProdutos();
                            }
                        }
                    })

                    .state('app.home.dianteiro', {
                        url: '/dianteiro',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            },
                            'tab-dianteiro': {
                                templateUrl: 'templates/filtros.html',
                                controller: 'HomeCtrl'
                            }
                        },
                        resolve: {
                            itens: function (WSService) {
                                return WSService.getProdutos();
                            }
                        }
                    })

                    .state('addproduto', {
                        url: '/adicionar-produto',
                        templateUrl: 'templates/add_produto.html',
                        controller: 'AddProdutoCtrl',
                        params: {produto: null, tab: null},
                        resolve: {
                            produto: function ($stateParams, sharedUtils) {
                                console.log('app.js addproduto resolve');
                                console.log($stateParams.produto);
                                sharedUtils.setLocalStorage('addproduto', $stateParams.produto);
                                return $stateParams.produto;
                            }
                        }
                    })

                    .state('carrinho', {
                        url: '/carrinho',
                        templateUrl: 'templates/carrinho.html',
                        controller: 'CartCtrl',
                        resolve: {
                            itens: function (CartService) {
                                return CartService.getCart();
                            }
                        }
                    })

                    .state('sobre', {
                        url: '/sobre',
                        templateUrl: 'templates/sobre.html',
                        controller: 'CartCtrl',
                        resolve: {
                            itens: function () {
                                return [];
                            }
                        }
                    })

                    .state('meuspedidos', {
                        url: '/pedidos',
                        templateUrl: 'templates/pedidos_historico.html',
                        controller: 'PedidoHistoricoCtrl',
                        resolve: {
                            pedidos: function (WSService) {
                                return WSService.getPedidos();
                            }
                        }
                    })

                    .state('editaritemcarrinho', {
                        url: '/editar-item-carrinho',
                        templateUrl: 'templates/editar_produto_carrinho.html',
                        controller: 'EditarItemCartCtrl',
                        params: {produto: null},
                        resolve: {
                            produto: function ($stateParams) {
                                console.log('$stateParams.produto');
                                console.log($stateParams);
                                return $stateParams.produto;
                            }
                        }
                    })

                    .state('conferirpedido', {
                        url: '/conferir-pedido',
                        templateUrl: 'templates/conferencia.html',
                        controller: 'ConferirPedidoCtrl',
                        resolve: {
                            itens: function (CartService) {
                                return CartService.getCart();
                            }
                        }})
                    
                    .state('visualizaritemhistorico', {
                        
                    });

            /* admin zone */


            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/home');
        });