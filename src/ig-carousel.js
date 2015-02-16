/**
 * Created by Mathieu Bertin (iGraal) on 10/02/2015.
 * Version 1.0.0
 */

//Require use for browserify
require('../bower_components/velocity/velocity.js');

angular.module('ig-carousel', [])
	.directive('igCarousel', require('./directives/ig-carousel'))
	.service('IGCarouselService', require('./services/IGCarouselService'))
	.run(['$rootScope', function($rootScope) {
        console.log('Module ig-carousel runnning');
    }]);
