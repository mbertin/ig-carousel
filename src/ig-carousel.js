/**
 * Created by Mathieu Bertin on 10/02/2015.
 */

//Require use for browserify
require('../vendor/jquery-css-transform.js');
require('../vendor/jquery-animate-css-rotate-scale.js');


angular.module('ig-carousel', [])
	.directive('igCarousel', require('./directives/ig-carousel'))
	.run(['$rootScope', function($rootScope) {
        console.log('Module ig-carousel runnning');
    }]);
