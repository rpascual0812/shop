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

    $scope.user = {};
    $scope.user.mobile = null;
    $scope.dialog = null;
    $scope.cart = {};
    $scope.modal = {};
    $scope.modal.another_delivery_date = false;
    $scope.account = {
        mobile : '',
        password : ''
    };

    $scope.checkout_msg = {};

    $scope.loginmsg = '';
    $scope.registermsg = '';

    $scope.registration = {
        mobile : '',
        preferred_name : '',
        email_address : '',
        location : '',
        password : '',
        repeat_password : ''
    };

    //DATEPICKER
    $scope.formats = [
        "MMMM YYYY",
        "DD MMM YYYY",
        "ddd MMM DD YYYY",
        "D MMM YYYY HH:mm",
        "lll"
    ];

    $scope.isloginmodal = false;

    $scope.dates = {
        today: moment.tz('UTC').hour(12).startOf('h'), //12:00 UTC, today.
        minDate: moment.tz('UTC').add(1, 'd').hour(7).startOf('h'), //Tomorrow
        maxDate: moment.tz('UTC').add(7, 'd').hour(19).startOf('h'), //6 days
    };

    $scope.minDate = $scope.dates.minDate;
    $scope.maxDate = $scope.dates.maxDate;

    init();

    function init(){
        $scope.cart = ShoppingCart.getItems();
    }

    $scope.set_mobile_cookie = function(){
        if($scope.user.mobile){
            var now = new Date()
            var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);

            var mobile = md5.createHash('mobile');
            $cookies.put(mobile, $scope.user.mobile, { expires : exp });    
        }
    }

    $scope.shoppingcartchanged = function(){
        $scope.set_mobile_cookie();

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
        $scope.set_mobile_cookie();

		$scope.cart.list.splice(k, 1);

		$scope.shoppingcartchanged();
    }

    $scope.checkout = function(){
        var mobile = md5.createHash('mobile');
        var mobile_number = $cookies.get(mobile);

        if(mobile_number){
            $scope.order_confirmation();
        }
        else {
            $scope.login_modal();
        }
        
    }

    $scope.login_modal = function(i){
        if(i == 1){
            $scope.isloginmodal = true;
        }

        $scope.set_mobile_cookie();

        $scope.modal = {
            title : 'PLEASE LOGIN',
            close : 'GO BACK SHOPPING',
        };

        $scope.dialog = ngDialog.openConfirm({
            template: 'GenericModal',
            className: 'ngdialog-theme-plain custom-width',
            scope: $scope,
            showClose: false
        })
        .then(function(value){
            
            //console.log('resolved:' + value);
        }, function(value){
            //console.log('else');

        });
    }

    $scope.register = function(){
        var error=0;
        for(var i in $scope.registration){
            if($scope.registration[i].replace(/\s/g,'') == ""){
                error++;
            }
        }

        if(error > 0){
            $scope.registermsg = "Please complete the Registration form.";

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.registermsg = "";
            }, 5000);
        }
        else if($scope.registration.password != $scope.registration.repeat_password){
            $scope.registermsg = 'Password and Repeat Password does not match.';

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.registermsg = "";
            }, 5000);
        }
        else {
            var filter = {
                mobile_number : $scope.registration.mobile,
                name : $scope.registration.preferred_name,
                email_address : $scope.registration.email_address,
                location : $scope.registration.location,
                password : $scope.registration.password
            }

            var promise = UserFactory.register(filter);
            promise.then(function(data){
                
            })
            .then(null, function(data){
                $scope.registermsg = "An error occured while saving your profile. Please try again.";

                var to = $timeout(function() {
                    $timeout.cancel(to);
                    $scope.registermsg = "";
                }, 5000);
            });
        }
    }

    $scope.login = function(){
        $scope.set_mobile_cookie();

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
                $scope.user.mobile = data.data.result[0].mobile_number;
                $scope.set_mobile_cookie();

                ngDialog.close($scope.dialog);

                if(!$scope.isloginmodal){
                    $scope.order_confirmation();
                }
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

    $scope.order_confirmation = function(){
        var delivery_time="";
        for(var i in $scope.cart.list){
            if(delivery_time == ""){
                delivery_time = $scope.cart.list[i].delivery_time;
            }
            else {
                if($scope.cart.list[i].delivery_time > delivery_time){
                    delivery_time = $scope.cart.list[i].delivery_time;
                }    
            }
        }

        var t = delivery_time.split(':');

        var new_delivery_time = "";
        if(parseInt(t[0]) > 0){
            new_delivery_time += t[0] + " HR";
        }

        if(parseInt(t[1]) > 0){
            if(new_delivery_time){
                new_delivery_time += " and " + t[1] + " MINS"
            }
            else {
                new_delivery_time += t[1] + " MINS"   
            }
        }

        if(parseInt(t[2]) > 0){
            if(new_delivery_time){
                new_delivery_time += " and " + t[2] + " SECS"
            }
            else {
                new_delivery_time += t[2] + " SECS";
            }
        }

        $scope.checkout_msg.delivery_time = new_delivery_time;

        var now = new Date()
        var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
        $cookies.put('shoppingcart', JSON.stringify($scope.cart), { expires : exp });

        //OPEN MODAL
        $scope.modal = {
            title : '',
            confirm : 'CONFIRM AND CHECKOUT',
            close : 'GO BACK SHOPPING'
        };

        $scope.dialog = ngDialog.openConfirm({
            template: 'CheckoutModal',
            className: 'ngdialog-theme-plain custom-width',
            scope: $scope,
            showClose: false
        })
        .then(function(value){
            //cancelled
        }, function(value){
            $scope.finish_transaction();            
        });
    }

    $scope.finish_transaction = function(){
        $scope.set_mobile_cookie();
        
        var hash = md5.createHash('mobile');
        var mobile_number = $cookies.get(hash);
        
        var new_date = '';
        if($scope.modal.another_delivery_date_checkbox){
            new_date = $('#pickerBothDates').val();
        }

        var data = {
            mobile_number : mobile_number,
            new_date : new_date,
            order : JSON.stringify($scope.cart.list)
        };
        
        var promise = StoreFactory.checkout(data);
        promise.then(function(data){
            $scope.modal = {
                title : '',
                close : 'CLOSE',
                msg : 'Thank you for patronizing GOSARI: A sari-sari store at your doorstep.'
            };

            $scope.dialog = ngDialog.openConfirm({
                template: 'CheckoutConfirmation',
                className: 'ngdialog-theme-plain custom-width',
                scope: $scope,
                showClose: false
            })
            .then(function(value){
                //cancelled
            });
        });
    }
});