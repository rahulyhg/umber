myApp.directive('hsPasswordVerifier', function ($compile, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            var password = attr.hsPasswordVerifier;
            var confirmPassword = attr.ngModel;

            console.log(attr.hsPasswordVerifier, attr.ngModel);
            scope.$watch('[password, ngModel]', function (value) {
                console.log("checking password: ", scope[password], scope[confirmPassword]);
                ctrl.$setValidity('hsPasswordVerifier', scope[password] === scope[confirmPassword]);
            });

            scope.$watch("ngModel", function (newVal, oldVal) {
                console.log(newVal, oldVal);
            })
        }
    }
})