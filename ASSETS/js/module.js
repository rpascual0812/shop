var app = angular.module('onload', [
                                    'ngRoute',
                                    'ngCookies',
                                    'angular-md5',
                                    'ngDialog',
                                    'datePicker'
                                ]);

app.config(function($routeProvider){
    $routeProvider
    .when('/profile',
    {
        controller: 'Profile',
        templateUrl: 'PARTIALS/profile/index.html'
    })
    .when('/purchases',
    {
        controller: 'Purchases',
        templateUrl: 'PARTIALS/purchases/index.html'
    })
    
    .when('/about',
    {
        controller: 'Profile',
        templateUrl: 'PARTIALS/profile/index.html'
    })
    .when('/services',
    {
        controller: 'Profile',
        templateUrl: 'PARTIALS/profile/index.html'
    })
    .when('/contact',
    {
        controller: 'Profile',
        templateUrl: 'PARTIALS/profile/index.html'
    })
    .when('/',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/home.html'
    })
    .when('/:classification_id',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/home.html'
    })
    .when('/category/:category_id',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/store/items.html'
    })
    .otherwise(
    {
        redirectTo: '/'
    })
})
.service('ShoppingCart', function ($cookies) {
    var items = {};

    items.list = [];
    items.count = 0;
    items.total = 0;

    return {
        getItems: function () {
            var cookie = $cookies.get('shoppingcart');

            if(cookie === undefined){
                //skip
            }
            else {
                cookie = JSON.parse(cookie);

                if(cookie.list.length > 0){
                    items.list = cookie.list;
                    items.count = cookie.count;
                    items.total = cookie.total;
                }
            }

            return items;
        },
        setItems: function(value) {
            var item_exists = false;
            for(var i in items.list){
                if(items.list[i].items_pk == value.pk){
                    items.list[i].item = value.item;
                    items.list[i].count = parseInt(items.list[i].count) + parseInt(value.count);
                    items.list[i].price = parseFloat(items.list[i].price); //parseFloat(items.list[i].price) + (parseFloat(value.price) * parseFloat(value.count));
                    items.list[i].delivery_time = items.list[i].delivery_time;
                    item_exists = true;
                }
            }

            if(item_exists == false){
                items.list.push({
                    items_pk : value.pk,
                    item : value.item,
                    price : parseFloat(value.price), // * parseFloat(value.count),
                    count : value.count,
                    delivery_time : value.delivery_time
                });
            }

            items.count = 0;
            for(var i in items.list){
                items.count += parseInt(items.list[i].count);
            }

            items.total = 0;
            for(var i in items.list){
                items.total += parseInt(items.list[i].count) * parseFloat(items.list[i].price);
            }

            var now = new Date()
            var exp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);

            $cookies.put('shoppingcart', JSON.stringify(items), { expires : exp });

            var shoppingcart = $cookies.get('shoppingcart');
        }
    };
})
.service('User', function ($cookies, md5) {
    var profile = {};

    profile.mobile = '';
    profile.status = false;

    return {
        get: function () {
            var mobile = $cookies.get(md5.createHash('mobile'));

            if(mobile === undefined){
                //skip
            }
            else {
                profile.status = true;
                profile.mobile = mobile;
            }

            return profile;
        },
        get_mobile: function(){
            var mobile = $cookies.get(md5.createHash('mobile'));            

            if(mobile === undefined){
                //skip
            }
            else {
                return mobile;
            }
        }
    };
});