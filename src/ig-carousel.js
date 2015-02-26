/**
 * Created by Mathieu Bertin (iGraal) on 10/02/2015.
 * Version 1.0.0
 */
angular.module('ig-carousel', [])
	.service('ig-service', require('./services/ig-service'))
	.directive('igCarousel', require('./directives/ig-carousel'))
	.run(['$rootScope', function($rootScope) {
        console.log('Module ig-carousel runnning');
    }]);
