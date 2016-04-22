app.factory('StoreFactory', function($http, $location){
    var factory = {};
    
    factory.getcategories = function(){
        var promise = $http({
            url:'./FUNCTIONS/categories/list.php',
            method: 'GET'
        })

        return promise;
    };

    return factory;
})
