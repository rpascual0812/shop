app.controller('Home', function(
									$scope,
                                    StoreFactory,
                                    $routeParams,
                                    ShoppingCart,
                                    $cookies
								){

    $scope.cart = [];
    $scope.categories = [];
    $scope.items = [];

    init();


    function init(){
        if($routeParams.category_id){
            getitemspercategory();
        }
        else {
            getcategories();    
        }
    }

    function getcategories(){
        var filter = {
            archived : false
        };

        var promise = StoreFactory.getcategories(filter);
        promise.then(function(data){
            $scope.categories = data.data.result;            
        })
        .then(null, function(data){
            
        });
    }

    function getitemspercategory(){
        var filter = {
            categories_pk : $routeParams.category_id,
            archived : false
        };

        var promise = StoreFactory.getitemspercategory(filter);
        promise.then(function(data){
            $scope.items = data.data.result;
        })
        .then(null, function(data){
            
        });   
    }

    $scope.add_to_cart = function(k){
        ShoppingCart.setItems($scope.items[k]);
    }
});