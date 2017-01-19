app.directive("slider", function () {
    return {
        restrict: "AECM",
        replace: true,
        templateUrl: 'partials/slider.html',
        controller: function ($scope) {
            $scope.bannerClicked = function () {
                alert('clicked');
            };
        },
        link: function () {}
    }
});