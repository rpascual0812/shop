app.controller('Home', function(
									$scope,
                                    StoreFactory,
                                    $routeParams,
                                    ShoppingCart,
                                    md5,
                                    $cookies
								){

    $scope.user = {};
    $scope.user.mobile = null;

    $scope.cart = [];
    $scope.category = {};
    $scope.categories = [];
    $scope.items = [];

    $scope.set_mobile_cookie = function(){
        if($scope.user.mobile){
            var now = new Date()
            var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);

            var mobile = md5.createHash('mobile');
            $cookies.put(mobile, $scope.user.mobile, { expires : exp });    
        }
    }

    init();

    function init(){
        $scope.set_mobile_cookie();
        if($routeParams.category_id){
            getcategory();
            getitemspercategory();
        }
        else {            
            getcategories();    
        }
    }

    function getcategories(){
        var filter = {
            classifications_pk: ($routeParams.classification_id==undefined)?1:$routeParams.classification_id,
            archived : false
        };

        var promise = StoreFactory.getcategories(filter);
        promise.then(function(data){
            $scope.categories = data.data.result;            
        })
        .then(null, function(data){
            
        });
    }

    function getcategory(){
        var filter = {
            pk: $routeParams.category_id
        };

        var promise = StoreFactory.getcategory(filter);
        promise.then(function(data){
            $scope.category = data.data.result[0];
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
        $scope.set_mobile_cookie();
        ShoppingCart.setItems($scope.items[k]);
    }
});