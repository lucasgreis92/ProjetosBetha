angular.module('starter.controllers', [])

        .controller('IndexCtrl', function (AdminService, $rootScope, $state, sharedUtils) {
            var state = 'app.home';
//            var user = $rootScope.user;

            var user = sharedUtils.getLocalStorage('usuario');

            // não tem usuário, manda pro login
            if (sharedUtils.isEmpty(user)) {
                state = 'login';
            } else {
                var email = user.email == undefined ? user.email == null ? '' : user.email : user.mail;
                if (AdminService.isAdmin(email)) {
                    state = 'adminmenu.home';
                }
            }
            $state.go(state);
        })

        .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            //$scope.$on('$ionicView.enter', function(e) {
            //});

            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            // Open the login modal
            $scope.login = function () {
//                $scope.modal.show();
                $state.go('login');
            };

            // Perform the login action when the user submits the login form
            $scope.doLogin = function () {
                console.log('Doing login', $scope.loginData);

                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function () {
                    $scope.closeLogin();
                }, 1000);
            };

            $scope.c = 'CCC';
        })

        .controller('LoginCtrl', function (sharedUtils, $scope, $state, $ionicHistory, AdminService, UserService) {
            console.log('LoginCtrl');

            // se tem usuário setado no local storage, passa o login e entra no app
            if (UserService.isUserLogged()) {
                var state = 'app.home';
                if (AdminService.isAdmin($scope.usuario.emailone)) {
                    state = 'adminmenu.home';
                }
                $state.go(state);
            }

            // lógica de negócio
            $scope.doLogin = function (form, user) {

                if (user === undefined || user.email === undefined || user.password === undefined) {
                    sharedUtils.showAlert('Ops...', 'E-mail/Senha inválidos');
                } else {
                    sharedUtils.showLoading();

                    if (form.$valid) {
                        UserService.login(user);
                    } else {
                        console.log('Erro no login...');
                    }
                }
            }
            $scope.createProspect = function () {

                // inicializa o objeto 'prospect' e joga no localStorage
                // esse objeto vai guardar os dados do cadastro que serão
                // submetidos via WS para o Backend-Java -> ERP para aprovação
                sharedUtils.setLocalStorage('prospect', {prospect: true});
                console.log('LoginCtrl $scope.prospect');

                console.log(sharedUtils.getLocalStorage('prospect'));
            }
            $scope.logout = function () {
                UserService.logout();
            }

            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
        })

        .controller('RecuperarSenhaCtrl', function ($state, $scope, sharedUtils) {

            $scope.doClickRecuperarSenha = function () {
                console.log('Lógica do botão Recuperar Senha...');
            }
            $scope.goBack = function () {
                $state.go('login');
            }
        })

        .controller('TipoContaCtrl', function ($scope, sharedUtils, $state) {

            // navegação
            $scope.doClickAbrirFormPF = function () {

                // busca o prospect do localStorage
//                var prospect = sharedUtils.getLocalStorage('prospect');
//                prospect.tipo = 'PF';

                // salva para disponibilizar no controller e na view
                sharedUtils.setLocalStorage('prospect', {prospect: true, tipo: 'PF'});
//                sharedUtils.setLocalStorage('prospect', prospect);

                // abre a pessoa_fisica.html
                // 'pessoafisica' é um state no arquivo app.js
                $state.go('pessoafisica');

                // log
                console.log('log prospect');
                console.log(sharedUtils.getLocalStorage('prospect'));
            }
            $scope.doClickAbrirFormPJ = function () {
                // busca o prospect do localStorage
//                var prospect = sharedUtils.getLocalStorage('prospect');
//                prospect.tipo = 'PJ';

                // salva para disponibilizar no controller e na view
                sharedUtils.setLocalStorage('prospect', {prospect: true, tipo: 'PJ'});
//                sharedUtils.setLocalStorage('prospect', prospect);

                // abre a pessoa_juridia.html
                // 'pessoajuridica' é um state no arquivo app.js
                $state.go('pessoajuridica');

                // log
                console.log('log prospect');
                console.log(sharedUtils.getLocalStorage('prospect'));
            }
            $scope.goIndex = function () {
                $state.go('login');
            }
        })

        .controller('PessoaFisicaCtrl', function ($scope, $state, sharedUtils) {

            // setando a máscara de CPF
            $('#cpf').mask('000.000.000-00', {reverse: true});

            $scope.doClickBuscarEnderecoCEP = function () {
                console.log('LoginCtrl.doClickBuscarEnderecoCEP...');
            }
            $scope.doClickAbrirFormEndereco = function (prospectParam) {
                var prospect = sharedUtils.getLocalStorage('prospect');

                // mescla as propriedades do prospect da sessão e do formulário
                // e atribui ao primeiro parâmetro (prospect)
                Object.assign(prospect, prospectParam);

                // salva
                sharedUtils.setLocalStorage('prospect', prospect);

                console.log('log prospect');
                console.log(sharedUtils.getLocalStorage('prospect'));
                $state.go('prospectendereco');
            }
            $scope.goTipoConta = function () {
                $state.go('tipoconta');
            }
        })

        .controller('PessoaJuridicaCtrl', function ($scope, $state, sharedUtils) {

            $('#cnpj').mask('00.000.000/0000-00', {reverse: true});

            $scope.doClickBuscarEnderecoCEP = function () {
                console.log('LoginCtrl.doClickBuscarEnderecoCEP...');
            }
            $scope.doClickAbrirFormEndereco = function (prospectParam) {
                var prospect = sharedUtils.getLocalStorage('prospect');

                // mescla as propriedades do prospect da sessão e do formulário
                // e atribui ao primeiro parâmetro (prospect)
                Object.assign(prospect, prospectParam);

                // salva
                sharedUtils.setLocalStorage('prospect', prospect);

                console.log('log prospect');
                console.log(sharedUtils.getLocalStorage('prospect'));
                $state.go('prospectendereco');
            }
            $scope.goTipoConta = function () {
                $state.go('tipoconta');
            }
        })

        .controller('ProspectEnderecoCtrl', function (Address, $scope, $state, sharedUtils) {
            // Address é injetado via resolve, no state 'pessoafisica' no app.js
            $scope.estados = Address.estados;
            $scope.cidades = Address.cidades;
            $scope.bairros = Address.bairros;

            $scope.doClickAbrirFormEmailSenha = function (prospectParam) {
                var prospect = sharedUtils.getLocalStorage('prospect');

                Object.assign(prospect, prospectParam);

                sharedUtils.setLocalStorage('prospect', prospect);

                console.log('log prospect');
                console.log(sharedUtils.getLocalStorage('prospect'));
                $state.go('formCreateAccount');
            }
            $scope.goTipoConta = function () {
                $state.go('tipoconta');
            }

        })

        .controller('CriarContaCtrl', function ($scope, $state, sharedUtils, $ionicHistory, AdminService, firebase, CartService) {

            $scope.doCreateAccount = function (form, login) {
                if (form.$valid) {

                    firebase.auth().createUserWithEmailAndPassword(login.email, login.password).then(function (result) {

                        /* Aqui é a function de success callback do cadastro do usuário no Firebase.
                         * 
                         * É aqui que você vai inserir o código que vai enviar o JSON com os dados do
                         * prospect que está tentando criar sua conta no Xinguara App. */

                        var prospect = sharedUtils.getLocalStorage('prospect');

                        // setando no prospect o e-mail que foi cadastrado no Firebase
                        prospect.email = result.email;

                        // setando no prospect o UID dele no Firebase
                        prospect.uid = result.uid;

                        sharedUtils.setLocalStorage('prospect', prospect);

                        // log
                        console.log('Prospect que vai ser enviado para o WS Java...');
                        console.log(prospect);

                        // aqui você faz sua chamada para o WS Java

                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });

                        sharedUtils.showAlert('Parabéns', 'Conta criada com sucesso. Agora é só aproveitar!');

                        var state = 'app.home';
                        if (AdminService.isAdmin(login.email)) {
                            console.log('isAdmin = true');
                            state = 'adminmenu.home';
                        }

                        // Inicializa o carrinho do usuário logado
                        CartService.newCart();

                        /*
                         * ATENÇÃO ! ! !
                         * 
                         * Hoje após o login o prospect, que virou usuário, é redirecionado
                         * diretamente para o home do app.
                         * 
                         * Verificar se deixa assim ou coloca uma trava exibindo outra tela.
                         */
                        $state.go(state);

                    },
                            function (error) {
                                if (error.code === 'auth/email-already-in-use') {
                                    sharedUtils.showAlert('Ops', 'Esse e-mail já está cadastrado');
                                }
                                console.log('Erro ao criar conta...');
                            }
                    );

                } else {
                    console.log('Dados ao criar conta inválidos...');
                }
            }
            $scope.goEndereco = function () {
                $state.go('prospectendereco');
            }

        })

        .controller('HomeCtrl', function ($scope, $state, $ionicHistory, $ionicSideMenuDelegate, sharedUtils, UserService,
                UploadService, firebase, $ionicTabsDelegate, WSService, CartService) {

            $scope.tabs = [
                {text: "Todos"},
                {text: "Promoções"},
                {text: "Santa Gula"},
                {text: "Traseiro"},
                {text: "Dianteiro"},
                {text: "Miúdos"},
                {text: "Subprodutos"}
            ];

            // navegação
            $scope.goBack = function () {
                var backView = $ionicHistory.backView();
                backView.go();
            }
            $scope.goHome = function () {
                $state.go('app.home.todos');
            }
            $scope.toggleSideMenu = function () {
                $ionicSideMenuDelegate.toggleLeft();
            }
            $scope.doClickAbrirCarrinho = function () {
                $state.go('carrinho');
            }
            $scope.doClickPesquisar = function () {
                console.log('Lógica para pesquisar os produtos...');
            }

            // perfil do usuário 
            $scope.doClickSalvarUsuario = function (user) {

                firebase.auth().onAuthStateChanged(function (userLogged) {
                    if (userLogged) {
                        UserService.update($scope.user, userLogged.uid);
                    }
                })
            }
            $scope.removePhoto = function () {

                firebase.auth().onAuthStateChanged(function (userLogged) {
                    if (userLogged) {
                        var user = sharedUtils.getSessionStorage('usuario');
                        UploadService.removePhoto(userLogged.uid, user);
                    }
                })
            }

            //  Tabs
            $scope.onTabSelected = function () {

                var index = $ionicTabsDelegate.selectedIndex();

                switch (index) {

                    // Todos
                    case 0:
                    {
                        console.log('Tab selecionada: ' + index);
                        var produtos = WSService.getProdutos();
                        $scope.produtos = produtos;
                        break;
                    }

                    // Promoção
                    case 1:
                    {
                        var produtos = WSService.getProdutos();
                        $scope.produtos = produtos;
                        console.log('Tab selecionada: ' + index);
                        break;
                    }

                    // Santa Gula
                    case 2:
                    {
                        console.log('Tab selecionada: ' + index);
                        break;
                    }

                    // Dianteiro
                    case 3:
                    {
                        console.log('Tab selecionada: ' + index);
                        break;
                    }

                    // Traseiro
                    case 4:
                    {
                        console.log('Tab selecionada: ' + index);
                        break;
                    }
                }
            }

            // Tab Todos
//            $scope.produtos = itens;

            // Carrinho
            $scope.addItemCart = function (item) {
                CartService.addItem(item);
            }
            $scope.hasItens = function () {
                var has = false;
                var carrinho = sharedUtils.getLocalStorage('cart');
                if (!sharedUtils.isEmpty(carrinho)) {
                    has = carrinho.length > 0;
                }
                return has;
            }
            $scope.countItens = function () {
                var carrinho = sharedUtils.getLocalStorage('cart');
                return carrinho.length;
            }
        })

        .controller('CartCtrl', function ($scope, itens, CartService, $state, sharedUtils) {

            // todos os itens do carrinho jogados no $scope para ser usado na view
            $scope.itens = itens;

            // navegação
            $scope.goBack = function () {
                $state.go('app.home');
            }
            $scope.doClickEditarItemCarrinho = function (produto) {

                // abre o form de edição
                console.log('produto para editar');
                console.log(produto);
                $state.go('editaritemcarrinho', {produto: produto});
            }
            $scope.doClickConferirPedido = function () {
                $state.go('conferirpedido');
            }

            $scope.hasItens = function () {
                var has = false;
                if (!sharedUtils.isEmpty($scope.itens)) {
                    has = $scope.itens.length > 0;
                }
                return has;
            }
            $scope.totalPedido = CartService.totalizarValores($scope.itens);

        })

        .controller('EditarItemCartCtrl', function ($state, $scope, sharedUtils, CartService, produto) {

            // disponibiliza o item na view através da variável 'produto'
            $scope.produto = produto;

            console.log('$scope.produto');
            console.log($scope.produto);

            $scope.doClickRemoverItemCarrinho = function (produto) {

                // function executada após remover o item do carrinho
                var callback = function () {
                    sharedUtils.showAlertCallback('Sucesso', 'Produto removido do carrinho', function () {
                        $state.go('carrinho');
                    });
                }

                CartService.removeItem(produto.uid, callback);
            }
            $scope.doClickUpdateQuantidadeProdutoCarrinho = function (produto) {
                // function executada após atualizar a quantidade de produto no carrinho
                var callback = function () {
                    sharedUtils.showAlertCallback('Sucesso', 'Quantidade atualizada', function () {
                        $state.go('carrinho');
                    });
                }

                CartService.updateQuantidadeProdutoCarrinho(produto, callback);
            }
            $scope.goBack = function () {
                $state.go('carrinho');
            }
            $scope.decQtd = function () {
                $scope.produto.quantidade--;
            }
            $scope.incQtd = function () {
                $scope.produto.quantidade++;
            }
        })

        .controller('AddProdutoCtrl', function (sharedUtils, $state, $scope, produto, CartService) {

            if (sharedUtils.isEmpty(produto)) {
                $scope.produto = sharedUtils.getLocalStorage('addproduto');
            } else {
                $scope.produto = produto;
            }

            console.log('$scope.produto');
            console.log($scope.produto);

            // quantidade inicial de produtos para adicionar no carrinho
            $scope.produto.quantidade = 1;

            $scope.decQtd = function () {
                console.log(11);
                $scope.produto.quantidade--;
            }

            $scope.incQtd = function () {
                console.log(22);
                $scope.produto.quantidade++;
            }

            $scope.doClickAddProdutoCarrinho = function (produto) {

                // function executada após remover o item do carrinho
                var callback = function () {
                    sharedUtils.showAlertCallback('Sucesso', 'Produto adicionado no carrinho', function () {

                        // redireciona para home
                        $state.go('app.home');
                    });
                }

                CartService.addItem(produto, callback);
            }

            $scope.goBack = function () {
                $state.go('app.home');
            }
        })

        .controller('ConferirPedidoCtrl', function ($scope, $state, itens) {

            $scope.itens = itens;
            $scope.goBack = function () {
                $state.go('carrinho');
            }
        })

        .controller('PedidoHistoricoCtrl', function ($scope, $state, pedidos) {

            $scope.pedidos = pedidos;
            console.log('Array de Pedidos e Itens do pedido');
            console.log($scope.pedidos);

            $scope.goBack = function () {
                $state.go('app.home');
            }
            $scope.doClickVisualizarItemHistorico = function(item){
                $state.go('visualizaritemhistorico', {item: item});
            }

        })
        
        .controller('VisualizarItemHistoricoCtrl', function ($scope, $state, item) {

            $scope.item = item;

            $scope.goBack = function () {
                $state.go('editaritemcarrinho');
            }

        });

