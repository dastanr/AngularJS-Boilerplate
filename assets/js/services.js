app.factory('Api', function ($http, $q, ApiEndPoint) {

    var postData = function (data, url) {
        var q = $q.defer();
        return $http.post(ApiEndPoint.url + url, {
                params: data
            })
            .then(function (data) {
                q.resolve(data);
                return q.promise;
            }, function (error) {
                console.log('Had an error')
                q.reject(error);
                return q.promise;
            })
    }

    var getData = function (url) {
        var q = $q.defer();
        return $http.get(ApiEndPoint.url + url)
            .then(function (data) {
                q.resolve(data);
                return q.promise;
            }, function (error) {
                console.log('Had an error')
                q.reject(error);
                return q.promise;
            });
    }


    var getExternalData = function (url) {
        var q = $q.defer();
        return $http.get(url)
            .then(function (data) {
                q.resolve(data);
                return q.promise;
            }, function (error) {
                console.log('Had an error')
                q.reject(error);
                return q.promise;
            })
    }

    return {
        postData: postData,
        getData: getData,
        getExternalData: getExternalData
    }
})


app.factory('localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);