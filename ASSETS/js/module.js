var app = angular.module('onload', [
                                    'ngRoute',
                                    'ngCookies',
                                    'angular-md5'
                                ]);

app.config(function($routeProvider){
    $routeProvider
    .when('/',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/home.html'
    })
    .when('/category/:category_id',
    {
        controller: 'Home',
        templateUrl: 'PARTIALS/store/items.html'
    })
    .when('/cart',
    {
        controller: 'ShoppingCart',
        templateUrl: 'PARTIALS/store/cart.html'
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
            return items;
        },
        setItems: function(value) {
            var item_exists = false;
            for(var i in items.list){
                if(items.list[i].items_pk == value.pk){
                    items.list[i].item = value.item;
                    items.list[i].count = parseInt(items.list[i].count) + parseInt(value.count);
                    items.list[i].price = parseFloat(items.list[i].price); //parseFloat(items.list[i].price) + (parseFloat(value.price) * parseFloat(value.count));
                    item_exists = true;
                }
            }

            if(item_exists == false){
                items.list.push({
                    items_pk : value.pk,
                    item : value.item,
                    price : parseFloat(value.price), // * parseFloat(value.count),
                    count : value.count
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

            $cookies.put('shoppingcart', JSON.stringify(items));

            var shoppingcart = $cookies.get('shoppingcart');

            console.log(JSON.parse(shoppingcart));
        }
    };
});


/*


            
*/