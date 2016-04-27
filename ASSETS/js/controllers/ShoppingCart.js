app.controller('ShoppingCart', function(
									$scope,
                                    StoreFactory,
                                    ShoppingCart,
                                    $cookies
								){

    $scope.cart = {};

    init();

    function init(){
        $scope.cart = ShoppingCart.getItems();
    }

    $scope.shoppingcartchanged = function(){
		var total = 0;
		for(var i in $scope.cart.list){
			total += parseFloat($scope.cart.list[i].price) * parseInt($scope.cart.list[i].count);
		}

		$scope.cart.total = total;

        $cookies.put('shoppingcart', JSON.stringify($scope.cart));
    }

    $scope.remove_item = function(k){
		$scope.cart.list.splice(k, 1);

		$scope.shoppingcartchanged();
    }
});