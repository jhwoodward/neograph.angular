(function() {

  angular.module('neograph.routes', [])
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
          .state('admin', { 
            url:'/admin',
            views: {
              '@': {
                templateUrl:'app/partials/admin.html',
                controller: 'AdminCtrl as vm'
              }, 
              'search@admin':{
                templateUrl:'app/search/search.html',
                controller:'SearchCtrl as vm'
              }, 
              'map@admin':{
                templateUrl:'app/map/map.html',
                controller:'MapCtrl as vm'
              }
            }
          });

      $urlRouterProvider.otherwise('/admin');
    })
    .controller('AdminCtrl', function($scope, $state, nodeService) {
      var vm = this;
      vm.panelVisible = true;
      vm.node = undefined;
      
      vm.togglePanel = function() {
        vm.panelVisible = !vm.panelVisible;
      }

      $scope.$on('nodeLoaded', onNodeLoaded);

      function onNodeLoaded(event) {
        var node = event.targetScope.node;
        vm.node = node;
      }

    });

})();