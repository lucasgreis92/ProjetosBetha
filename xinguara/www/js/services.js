angular.module('app.services', [])

        // factory = a function é chamada e o seu valor é retornado (executado)
        // service = é dado um new na function e o objeto é retornado (executado)

        .factory('sharedUtils', ['$ionicLoading', '$ionicPopup', '$window', '$ionicHistory', function ($ionicLoading, $ionicPopup, $window) {


                var functionObj = {};
                functionObj.showLoading = function () {
                    $ionicLoading.show({
                        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                        animation: 'fade-in', // The animation to use
                        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                        showDelay: 0 // The delay in showing the indicator
                    });
                };
                functionObj.hideLoading = function () {
                    $ionicLoading.hide();
                };
                functionObj.showAlert = function (title, message) {
                    var alertPopup = $ionicPopup.alert({
                        title: title,
                        template: message
                    });
                };
                functionObj.showAlertCallback = function (title, message, callback) {
                    $ionicPopup.alert({
                        title: title,
                        template: message
                    }).then(callback);
                };

                functionObj.getAlert = function (title, message) {
                    var alertPopup = $ionicPopup.alert({
                        title: title,
                        template: message
                    });
                    return alertPopup;
                };

                functionObj.isEmpty = function (value) {
                    return value == '' || value == 'undefined' || value == undefined || value == null || value == 'null' || value == 0 || value.length == 0 || value == false;
                }

                functionObj.toJSON = function (value) {
                    return angular.toJson(value);
                }

                functionObj.parseJSON = function (value) {
                    var result = false;
                    
                    if (!functionObj.isEmpty(value)) {
                        result = JSON.parse(value);
                    }
                    return result;
                }

                functionObj.setSessionStorage = function (key, value) {
                    $window.sessionStorage.setItem(key, functionObj.toJSON(value));
                }

                functionObj.getSessionStorage = function (key) {
                    return functionObj.parseJSON($window.sessionStorage.getItem(key));
                }

                functionObj.setLocalStorage = function (key, value) {
                    $window.localStorage.setItem(key, functionObj.toJSON(value));
                }

                functionObj.getLocalStorage = function (key) {
                    return functionObj.parseJSON($window.localStorage.getItem(key));
                }

                functionObj.removeItemFromArray = function (array, attr, value) {
                    var i = array.length;
                    while (i--) {
                        if (array[i]
                                && array[i].hasOwnProperty(attr)
                                && (arguments.length > 2 && array[i][attr] === value)) {

                            array.splice(i, 1);

                        }
                    }
                    return array;
                }

                return functionObj;
            }])

        .factory('fireBaseData', function ($rootScope, $firebase) {
            var ref = firebase.database().ref();
            var refUser = firebase.database().ref('users');
            var refNotify = null;
            var refBaby = null;
            var refOrder = null;


            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    refNotify = firebase.database().ref('users/' + user.uid + '/notify');
                    refBaby = firebase.database().ref('users/' + user.uid + '/baby');
                }
            })

            return {
                ref: function () {
                    return ref;
                },
                refUser: function () {
                    return refUser;
                },
                refNotify: function () {
                    return refNotify;
                },
                refBaby: function () {
                    return refBaby;
                }
            }
        })

        .service('UserService', function (fireBaseData, sharedUtils, $state, AdminService, $ionicSideMenuDelegate, $ionicHistory, $window, CartService) {

            // outer closure acessível na inner
            var that = this;

            this.setUserSessionStorage = function (loginEmail) {

                // busca um objeto User no FB e seta no $rootScope ("sessão"/escopo global)
                firebase.auth().onAuthStateChanged(function (user) {

                    // on = retorna o snapshot e insere um listener
                    // once = retorna o snapshot (não insere listener)
                    fireBaseData.refUser().child(user.uid).once('value', function (snapshot) {
                        var userLogged = snapshot.val();
                        console.log('User no $window.sessionStorage.usuario ');

                        if (!sharedUtils.isEmpty(userLogged) && sharedUtils.isEmpty(userLogged.photoURL)) {
                            userLogged.photoURL = 'img/panda_fundo_preto.svg'
                        }

                        sharedUtils.setSessionStorage('usuario', userLogged);
                        console.log(sharedUtils.getSessionStorage('usuario'));

                        var state = 'app.home';
                        if (AdminService.isAdmin(loginEmail)) {
                            state = 'adminmenu.home';
                        }

                        $state.go(state);
                        sharedUtils.hideLoading();
                    });
                })
            }

            this.getUserSessionStorage = function () {
                return sharedUtils.getSessionStorage('usuario');
            }

            this.update = function (user, userUID) {
                console.log('--- método UserService.update ---');

                // pegando o user da Session para setar o doc e docURL
                var usuario = sharedUtils.getLocalStorage('usuario');

                var userFirebase = {
                    fullname: user.fullname == undefined ? '' : user.fullname,
                    nickname: user.nickname == undefined ? '' : user.nickname,
                    emailone: user.emailone == undefined ? '' : user.emailone,
                    emailtwo: user.emailtwo == undefined ? '' : user.emailtwo,
                    celphone: user.celphone == undefined ? '' : user.celphone,
                    birthday: user.birthday,
                    address: user.address == undefined ? '' : user.address,
                    number: user.number == undefined ? '' : user.number,
                    addresscompl: user.addresscompl == undefined ? '' : user.addresscompl,
                    zipcode: user.zipcode == undefined ? '' : user.zipcode,
                    city: user.city == undefined ? '' : user.city,
                    state: user.state == undefined ? '' : user.state,
                    country: 'Brasil',
                    doc: usuario.doc,
                    docURL: usuario.docURL
                }

                fireBaseData.refUser().child(userUID).update(userFirebase).then(function () {
                    sharedUtils.showAlert('Sucesso', 'Perfil salvo com sucesso!');
                    console.log('--- Salvou ok --- Fim do método UserService.update(user, userUID) --- ');
                    sharedUtils.setLocalStorage('usuario', userFirebase);
                });
            }

            this.setUserLocalStorage = function (loginEmail) {
                firebase.auth().onAuthStateChanged(function (user) {

                    // on = retorna o snapshot e insere um listener
                    // once = retorna o snapshot (não insere listener)
                    fireBaseData.refUser().child(user.uid).once('value', function (snapshot) {
                        var userLogged = snapshot.val();
                        console.log('User no $window.localStorage.usuario ');

                        if (!sharedUtils.isEmpty(userLogged) && sharedUtils.isEmpty(userLogged.photoURL)) {
                            userLogged.photoURL = 'img/panda_fundo_preto.svg'
                        }

                        sharedUtils.setLocalStorage('usuario', userLogged);
                        console.log(sharedUtils.getLocalStorage('usuario'));

                        var state = 'app.home';
                        if (AdminService.isAdmin(loginEmail)) {
                            state = 'adminmenu.home';
                        }

                        $state.go(state);
                        sharedUtils.hideLoading();
                    });
                })
            }

            this.isUserLogged = function () {
                return !sharedUtils.isEmpty(sharedUtils.getLocalStorage('usuario'));
            }

            this.login = function (user) {
                firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function (result) {

                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });

                    // Após logar, busca os dados do user no Firebase e seta no SessionStorage
                    that.setUserLocalStorage(user.email);

                    // Inicializa o carrinho do usuário logado
                    CartService.newCart();

                },
                        function (error) {
                            var errorCode = error.code;
                            sharedUtils.hideLoading();

                            if (errorCode === 'auth/wrong-password') {
                                sharedUtils.showAlert('Ops...', 'Senha incorreta');
                            } else if (errorCode === 'auth/user-not-found') {
                                sharedUtils.showAlert('Atenção', 'E-mail não cadastrado');
                            } else if (errorCode === 'auth/invalid-email') {
                                sharedUtils.showAlert('E-mail inválido', 'O e-mail precisa estar no formato nome@dominio.com.br');
                            } else {
                                sharedUtils.showAlert('Ops...', 'Aconteceu um erro inesperado. Verifique se o e-mail e senha estão corretos, caso o problema persista tente de novo em instantes');
                            }
                        }
                );
            }

            this.logout = function () {
                console.log('click logout');
                firebase.auth().signOut().then(function () {

                    $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
                    $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });

                    $window.localStorage.clear();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();

                    $state.go('login');

                }, function (error) {
                    sharedUtils.showAlert('Ops...', 'Ocorreu um erro ao fazer logout. Tente novamente.');
                });
            }

        })

        .service('AdminService', function ($firebaseArray, fireBaseData, $firebaseObject, sharedUtils, $state) {

            this.isAdmin = function (email) {
                var emailZima = 'zima@zimainformatica.com.br';
                var emailZimaah = 'zimaah@gmail.com';
                var emailKarin = 'karin_sabrina.l@hotmail.com';
                var emailBabyPanda = 'reenvio@babypanda.com.br';
                var is = email == emailZima || email == emailZimaah || email == emailKarin || email == emailBabyPanda
                console.log('isAdmin == ' + is);

                return is;
            }

            this.getUsers = function () {
                console.log('--- AdminService.getUsers() ---');
                var customers = $firebaseObject(fireBaseData.refUser());

//                $routeProvider.when('/', {
//                    controller: 'MyCtrl as ctrl',
//                    templateUrl: 'view.html',
//                    resolve: {
//                        items: function ($firebaseArray, itemsRef) {
//                            // load the view, when the data is available
//                            // this is where $loaded() belongs      
//                            return $firebaseArray(itemsRef).$loaded();
//                        }
//                    }
//                });

                return customers;

            }

            this.getUsersByDate = function (start, end) {
                fireBaseData.refUser().orderByChild('birthday').startAt('2011-10-10').endAt('2018-10-10').on('value', function (snapshot) {
                    console.log('opa');
                });
            }

            this.checkLogin = function () {
                var user = sharedUtils.getLocalStorage('usuario');
                if (sharedUtils.isEmpty(user)) {
                    $state.go('login');
                }
            }
        })

        .service('UploadService', function (sharedUtils, fireBaseData) {
            // acessando a outer closure na inner closure
            var that = this;

            /* DOC */
            this.removeDocFromDatabase = function (userID, callbackSuccess) {

                if (!callbackSuccess) {
                    callbackSuccess = function () {
                        console.log("Removendo o doc from database (setting user.doc = '' )");
                    };
                }

                fireBaseData.refUser().child(userID).update({doc: ''}).then(callbackSuccess());
            }
            this.removeDocFromStorage = function (userID, oldFileName, callbackSuccess) {
                var userDocRef = firebase.storage().ref().child('user_photos/' + userID + '/doc/' + oldFileName);

                if (!callbackSuccess) {
                    callbackSuccess = function () {
                        console.log('Removendo from storage: ' + oldFileName);
                    }
                }

                userDocRef.delete().then(callbackSuccess()).catch(function (error) {
                    console.log('Erro ao remover from storage: ' + oldFileName);
                    console.log(error);
                })
            }
            this.addDocToDatabase = function (userID, docName, fileURL, $scope) {
                // salvando no Firebase
                fireBaseData.refUser().child(userID).update({doc: docName, docURL: fileURL}).then(function () {
                    // atualizando o User da Session
                    var usuario = sharedUtils.getLocalStorage('usuario');
                    usuario.doc = docName;
                    usuario.docURL = fileURL;
                    $scope.user.doc = docName;
                    $scope.user.docURL = fileURL;
                    sharedUtils.setLocalStorage('usuario', usuario);

                    sharedUtils.hideLoading();
                    sharedUtils.showAlert('Sucesso', 'Arquivo enviado com sucesso!');
                });
            }
            this.removeDoc = function (userID, user) {
                that.removeDocFromStorage(userID, user.doc);

                var alert = sharedUtils.getAlert('Removido', 'Arquivo removido com sucesso!');

                that.removeDocFromDatabase(userID, function () {
                    alert.then(function () {
                        var usuario = sharedUtils.getLocalStorage('usuario');
                        usuario.doc = '';
                        usuario.docURL = '';
                        sharedUtils.setLocalStorage('usuario', usuario);

                        sharedUtils.refresh();
                    });
                });
            }

            /* PHOTO */
            this.removePhotoFromDatabase = function (userID, callbackSuccess) {

                if (!callbackSuccess) {
                    callbackSuccess = function () {
                        console.log('Removendo foto from database');
                    }
                }

                fireBaseData.refUser().child(userID).update({photo: ''}).then(callbackSuccess);
            }
            this.removePhotoFromStorage = function (userID, oldFileName) {
                var userDocRef = firebase.storage().ref().child('user_photos/' + userID + '/photo/' + oldFileName);

                userDocRef.delete().then(function () {
                    console.log('Removendo from photo storage: ' + oldFileName);
                }).catch(function (error) {
                    console.log('Erro ao remover photo from storage: ' + oldFileName);
                    console.log(error);
                })
            }
            this.addPhotoToDatabase = function (userID, docName, fileURL, $scope) {
                fireBaseData.refUser().child(userID).update({photo: docName, photoURL: fileURL}).then(function () {
                    // atualizando o User da Session
                    var usuario = sharedUtils.getLocalStorage('usuario');
                    usuario.photo = docName;
                    usuario.photoURL = fileURL;
                    $scope.user.photo = docName;
                    $scope.user.photoURL = fileURL;
                    sharedUtils.setLocalStorage('usuario', usuario);
                    sharedUtils.hideLoading();
                    sharedUtils.showAlert('Sucesso', 'Arquivo enviado com sucesso!');
                });
            }
            this.removePhoto = function (userID, user) {
                that.removePhotoFromStorage(userID, user.photo);

                var alert = sharedUtils.getAlert('Removida', 'Foto removida com sucesso!');

                that.removePhotoFromDatabase(userID, function () {
                    alert.then(function () {
                        var usuario = sharedUtils.getLocalStorage('usuario');
                        usuario.photo = '';
                        usuario.photoURL = 'img/panda_fundo_preto.svg';
                        sharedUtils.setLocalStorage('usuario', usuariosdgg);

                        sharedUtils.refresh();
                    });
                });
            }

            this.doUploadDocListener = function (user, userID, $scope) {

                var fileUpload = document.getElementById('doc');

                fileUpload.addEventListener('change', function () {
                    var firstFile = this.files[0]; // get the first file uploaded
                    var fileName = firstFile.name;

                    var userDocRef = firebase.storage().ref().child('user_photos/' + userID + '/doc/' + fileName);

                    // removendo as referências do doc antigo no database e storage
                    that.removeDocFromDatabase(userID);
                    that.removeDocFromStorage(userID, user.doc);

                    var uploadTask = userDocRef.put(firstFile);

                    uploadTask.on('state_changed', function (snapshot) {
                        sharedUtils.showLoading();

                        // error upload
                    }, function (error) {
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert('Falhou', 'Por favor, tente enviar o arquivo novamente');

                        // success upload
                    }, function () {
                        that.addDocToDatabase(userID, fileName, uploadTask.snapshot.downloadURL, $scope);
                    }
                    );
                })


            }
            this.doUploadPhotoListener = function (user, userID, $scope) {
                var fileUpload = document.getElementById('photo');

                fileUpload.addEventListener('change', function () {
                    var firstFile = this.files[0]; // get the first file uploaded
                    var fileName = firstFile.name;

                    var userPhotosRef = firebase.storage().ref().child('user_photos/' + userID + '/photo/' + firstFile.name);

                    // removendo as referências do doc antigo no database e storage
                    that.removePhotoFromDatabase(userID);
                    that.removePhotoFromStorage(userID, user.doc);

                    var uploadTask = userPhotosRef.put(firstFile);

                    uploadTask.on('state_changed', function (snapshot) {
                        sharedUtils.showLoading();

                        // error upload
                    }, function (error) {
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert('Falhou', 'Por favor, tente enviar o arquivo novamente');

                        // success upload
                    }, function () {
                        that.addPhotoToDatabase(userID, fileName, uploadTask.snapshot.downloadURL, $scope);
                    }
                    );
                })
            }
            this.doUploadClipButtonDocListener = function () {
                var clipButton = document.getElementById('teste');
                console.log(clipButton);
                clipButton.addEventListener('click', function () {
                    document.getElementById('doc').click();
                })
            }
        })

        .service('WSService', function ($http, $q) {
            var base_url = "http://www.cooldomain.com/SoapTest/webservicedemo.asmx";
            this.HelloWorld = function () {
//                return $soap.post(base_url, "HelloWorld");
            }

            // simulação de uma chamada HTTP GET para buscar um JSON
            // o arquivo santagula.json encontra-se na pasta json (na raiz do projeto)
            this.getProdutosSantaGula = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosTodos = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosPromocoes = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosTraseiro = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosDianteiro = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosMiudo = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
            this.getProdutosSubprodutos = function () {
                var deferred = $q.defer();

                $http.get('json/santagula.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }

            this.getProdutoByID = function (produtoID) {
                var deferred = $q.defer();

                console.log('services.js 1');
                $http.get('json/santagula.json').success(function (data) {
                    console.log('services.js 2');
                    deferred.resolve(data);
                    console.log('services.js 3');
                });
                return deferred.promise;
            }
            
            this.getPedidos = function() {
                var deferred = $q.defer();

                $http.get('json/pedidos.json').success(function (data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }

        })

        .service('CartService', function (sharedUtils) {

            // para acessar o contexto 'this' dentro de outros contextos
            var that = this;

            // chamado quando o usuário loga
            this.newCart = function () {
                var newCart = [];
                sharedUtils.setLocalStorage('cart', newCart);
                return newCart;
            }

            // adicionar item no carrinho da sessão
            this.addItem = function (item, callback) {

                try {
                    // array de produtos
                    var cart = sharedUtils.getLocalStorage('cart');

                    if (sharedUtils.isEmpty(cart)) {
                        cart = that.newCart();
                    }

                    // size da lista para gerar o ID único no carrinho
                    var size = cart.length;

                    // identificador único (assim o carrinho pode ter 2 ou mais itens iguais)
                    item.uid = size;

                    cart.push(item);

                    // callback executado após remover o item do carrinho
                    if (typeof callback === 'function') {
                        callback();
                    }
                } catch (exception) {
                    sharedUtils.showAlert('Ops', 'Erro ao adicionar o item no carrinho');
                    console.log(exception);
                }

                sharedUtils.setLocalStorage('cart', cart);
                console.log('CartService.addItem');
                console.log(cart);
            }

            this.updateQuantidadeProdutoCarrinho = function (produto, callback) {
                var cart = sharedUtils.getLocalStorage('cart');

                // jQuery
                $.each(cart, function () {
                    if (this.uid == produto.uid) {
                        this.quantidade = produto.quantidade;
                    }
                });

                sharedUtils.setLocalStorage('cart', cart);

                // callback executado após atualizar a quantidade de produtos no carrinho
                if (typeof callback === 'function') {
                    callback();
                }
            }

            // remover item no carrinho da sessão
            this.removeItem = function (itemUID, callback) {
                var cart = sharedUtils.getLocalStorage('cart');

                try {
                    // remover o item pelo uid (o UID tem que ser único pois podemos ter o mesmo produto 2 vezes na lista)
                    cart = $.grep(cart, function (element) {
                        return element.uid != itemUID;
                    });
                    sharedUtils.setLocalStorage('cart', cart);

                    // callback executado após remover o item do carrinho
                    if (typeof callback === 'function') {
                        callback();
                    }
                } catch (exception) {
                    sharedUtils.showAlert('Ops', 'Erro ao remover o item do carrinho');
                    console.log(exception);
                }

                return cart;
            }

            // listar todos itens do carrinho
            this.getCart = function () {
                var cart = sharedUtils.getLocalStorage('cart');
                console.log('CartService.getCart()');
                console.log(cart);
                return cart;
            }

            this.getItemByUID = function (itemUID) {
                var cart = sharedUtils.getLocalStorage('cart');
                var item = null;
                $.grep(cart, function (element) {
                    if (element.uid == itemUID) { // se o item no array tiver o mesmo ID do parâmetro
                        item = element;
                        return;
                    }
                }, true) // true = retorna o objeto e não array
                return item;
            }

            this.totalizarValores = function (itens) {
                var total = 0;

                angular.forEach(itens, function (value, key) {

                    // somando: o preço da caixa * quantidade de caixas do pedido
                    total += value.precoCaixa * value.quantidade;
                });

                return total;
            }

        });
