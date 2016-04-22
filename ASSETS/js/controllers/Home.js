app.controller('Home', function(
  										$scope,
                                        StoreFactory
  									){

    $scope.cart = {};
    $scope.categories = [];

    init();


    function init(){
        getcategories();
    }

    function getcategories(){
        var promise = StoreFactory.getcategories();
        promise.then(function(data){
            console.log(data.data);

            $scope.categories = data.data.categories;
        })
        .then(null, function(data){
            
        });
    }
});