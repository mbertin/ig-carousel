/**
 * Created by Mathieu Bertin on 10/02/2015.
 */

//Require use for browserify


angular.module('ig-carousel', ['ngAnimate'])
	.directive('ig-carousel', require('./directives/ig-carousel'))
	.run(['$rootScope', function($rootScope) {
        console.log('Module ig-carousel runnning');
    }]);
