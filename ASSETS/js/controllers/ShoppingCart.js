app.controller('ShoppingCart', function(
									$scope,
                                    StoreFactory,
                                    ShoppingCart
								){

    $scope.cart = {};

    init();

    function init(){
        $scope.cart = ShoppingCart.getItems();
    }
});