app.controller('ShoppingCart', function(
									$scope,
                                    StoreFactory,
                                    UserFactory,
                                    ShoppingCart,
                                    $cookies,
                                    $timeout,
                                    md5,
                                    ngDialog
								){

    $scope.cart = {};
    $scope.modal = {};
    $scope.account = {
        mobile : '',
        password : ''
    };

    $scope.loginmsg = '';
    $scope.registermsg = '';

    $scope.register = {
        mobile : '',
        name : '',
        location : '',
        password : '',
        repeat_password : ''
    };

    init();

    function init(){
        $scope.cart = ShoppingCart.getItems();
    }

    $scope.shoppingcartchanged = function(){
		var total = 0;
        var count = 0;
		for(var i in $scope.cart.list){
            total += parseFloat($scope.cart.list[i].price) * parseInt($scope.cart.list[i].count);
			count += parseInt($scope.cart.list[i].count);
		}

		$scope.cart.total = total;
        $scope.cart.count = count;

        var now = new Date()
        var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);

        $cookies.put('shoppingcart', JSON.stringify($scope.cart), { expires : exp });
    }

    $scope.remove_item = function(k){
		$scope.cart.list.splice(k, 1);

		$scope.shoppingcartchanged();
    }

    $scope.checkout = function(){
        var mobile = md5.createHash('mobile');
        var mobile_number = $cookies.get(mobile);

        if(mobile_number){
            $scope.finish_transaction();
        }
        else {
            $scope.login_modal();
        }
        
    }

    $scope.login_modal = function(){
        $scope.modal = {
            title : 'PLEASE LOGIN',
            close : 'GO BACK SHOPPING',
        };

        ngDialog.openConfirm({
            template: 'GenericModal',
            className: 'ngdialog-theme-plain custom-width',
            preCloseCallback: function(value) {
                var nestedConfirmDialog = ngDialog.openConfirm({
                    template:
                            '<p>Are you sure you want to update </p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-secondary" data-ng-click="closeThisDialog(0)">No' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" data-ng-click="confirm(1)">Yes' +
                            '</button></div>',
                    plain: true,
                    className: 'ngdialog-theme-plain custom-width'
                });
                
                return nestedConfirmDialog;
            },
            scope: $scope,
            showClose: false
        })
        .then(function(value){
            
            console.log('resolved:' + value);
        }, function(value){
            console.log('else');

        });
    }

    $scope.login = function(){
        var error=0;
        for(var i in $scope.account){
            if($scope.account[i].replace(/\s/g,'') == ""){
                error++;
            }
        }

        if(error>0){
            $scope.loginmsg = "Invalid Mobile # or Password";

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.loginmsg = "";
            }, 5000);
        }
        else {
            var filter = {
                mobile : $scope.account.mobile,
                password: $scope.account.password
            }

            var promise = UserFactory.auth(filter);
            promise.then(function(data){
                var now = new Date()
                var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);

                var mobile = md5.createHash('mobile');
                $cookies.put(mobile, data.data.result[0].mobile_number, { expires : exp });

                $scope.finish_transaction();
            })
            .then(null, function(data){
                $scope.loginmsg = "Invalid Mobile # or Password";

                var to = $timeout(function() {
                    $timeout.cancel(to);
                    $scope.loginmsg = "";
                }, 5000);
            });
        }
    }

    $scope.finish_transaction = function(){
        var hash = md5.createHash('mobile');
        var mobile_number = $cookies.get(hash);

        var data = {
            mobile_number : mobile_number,
            order : JSON.stringify($scope.cart.list)
        };

        var promise = StoreFactory.checkout(data);
        promise.then(function(data){
            console.log(data.data);
        })
        .then(null, function(data){
            
        });
    }
});