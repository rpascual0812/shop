app.controller('Profile', function(
									$scope,
                                    $cookies,
                                    User,
                                    UserFactory,
                                    $timeout,
                                    md5
								){

    $scope.profile = {};
    $scope.profile.status = false;

    $scope.passwords = {};
    $scope.passwords.data = {
        old : '',
        new : '',
        repeat : ''
    };

    $scope.getprofile = function(mobile){
        var filter = {
            mobile : mobile
        };

        var promise = UserFactory.getprofile(filter);
        promise.then(function(data){
            $scope.profile.list = data.data.result[0];
        })
        .then(null, function(data){
            
        });
    }

    init();

    function init(){
        var profile = User.get();

        if(profile.status == false){
            window.location = '#/';
        }

        $scope.getprofile(profile.mobile);
    }

    $scope.$watch(User.get_mobile, function(newVal, oldVal) {
        if(newVal !== undefined){
            $scope.profile.status = true;
            $scope.profile.mobile = newVal;
        }
    }, true);

    $scope.reset_password = function(){
        var error=0;
        
        for(var i in $scope.passwords.data){
            if($scope.passwords.data[i].replace(/\s/g,'') == ""){
                error++;
            }
        }

        if(error>0){
            $scope.passwords.msg = 'Please complete the Reset Password form';

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.passwords.msg = "";
            }, 5000);
        }
        else if($scope.passwords.data.new != $scope.passwords.data.repeat){
            $scope.passwords.msg = 'New Password and Repeat Password does not match.';

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.passwords.msg = "";
            }, 5000);   
        }
        else if($scope.passwords.data.new == $scope.passwords.data.old){
            $scope.passwords.msg = 'You cannot use your old password to set a new password.';

            var to = $timeout(function() {
                $timeout.cancel(to);
                $scope.passwords.msg = "";
            }, 5000);   
        }
        else {
            var filter = {
                mobile : $scope.profile.mobile,
                old_password: $scope.passwords.data.old,
                new_password: $scope.passwords.data.new
            }

            var promise = UserFactory.resetpassword(filter);
            promise.then(function(data){
                $scope.profile.list = data.data.result[0];
            })
            .then(null, function(data){
                
            });
        }
    }
}); 