myApp.directive('hsPasswordVerifier', function ($compile, $parse) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {

            console.log(attr.hsPasswordVerifier, attr.ngModel);
            scope.$watchGroup([attr.hsPasswordVerifier, attr.ngModel], function (newValues) {
                // Match password with confirm password
                ctrl.$setValidity('hsPswdMatch', newValues[0] === newValues[1]);
            }, true);

            // scope.$watch(attr.ngModel, function (newVal, oldVal) {
            //     console.log("Watch: ", newVal, oldVal);
            //     console.log(scope[attr.hsPasswordVerifier]);
            // })
        }
    }
})