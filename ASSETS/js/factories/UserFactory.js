app.factory('UserFactory', function($http, $location){
    var factory = {};
    
    factory.auth = function(data){
        var promise = $http({
            url:'./FUNCTIONS/users/auth.php',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data : data
        })

        return promise;
    };

    return factory;
})
