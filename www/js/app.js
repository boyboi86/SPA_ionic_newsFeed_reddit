(function() {

  var app = angular.module('myReddit', ['ionic', 'angularMoment'])

  app.controller('redditCtrl', ['$scope', '$http', function($scope, $http){

    $scope.stories = []
    url = "https://www.reddit.com/r/Android/new/.json";

      function loadStories(params, callback){
        $http.get(url, {params: params})
        .success(function(res){
          var stories = []
          angular.forEach(res.data.children, function(child){
            if(!child.data.thumbnail || !child.data.thumbnail.includes("http")){
              child.data.thumbnail = "https://www.redditstatic.com/icon.png";
            }
            stories.push(child.data);
          })
          callback(stories);
        })
        .error(function(err){
          console.log(err);
        })
      }

     $scope.loadOlderStories = function(){
      var params = {};
      if($scope.stories.length > 0){
        params['after'] = $scope.stories[$scope.stories.length -1].name;
      }
      loadStories(params, function(olderStories){
        $scope.stories = $scope.stories.concat(olderStories);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    $scope.loadNewerStories = function() {
      var params = {'before': $scope.stories[0].name };
      loadStories(params, function(newerStories){
        $scope.stories = newerStories.concat($scope.stories);
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    /*To open new tab in mobile we will have to use this method*/
    $scope.openLink = function(url){
      window.open(url, '_blank');
    }

  }])


  app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      /*Defined the cordova InAppBrowser plugin here*/
      if(window.cordova && window.cordova.InAppBrowser){
        window.open = window.cordova.InAppBrowser.open;
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });
}())
