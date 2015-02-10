(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = ['', function() {

		var itemsElements = [];

		return {
			restrict: "A",
			scope: true,
			compile: function(tElement, tAttributes) {
				tElement.style = "position:relative; overflow:hidden";
				console.log("Compile")
			},
			link: function(scope, element, attr) {

                scope.carouselIndex = 0;

 				var defaultOptions = {
                    transitionDuration: parseInt(attr.animationDuration, 10) || 300,
                    isSequential: true,
                    autoSlideDuration: 3,
                    bufferSize: 5,
                    /* in container % how much we need to drag to trigger the slide change */
                    moveTreshold: 0.1
                }; 
			}
		}
	}];
},{}],2:[function(require,module,exports){
/**
 * Created by Mathieu Bertin on 10/02/2015.
 */

//Require use for browserify


angular.module('ig-carousel', ['ngAnimate'])
	.directive('ig-carousel', require('./directives/ig-carousel'))
	.run(['$rootScope', function($rootScope) {
        console.log('Module ig-carousel runnning');
    }]);

},{"./directives/ig-carousel":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21hdGhpZXUvRGV2L0dpdGh1Yi9pZy1jYXJvdXNlbC9zcmMvZGlyZWN0aXZlcy9pZy1jYXJvdXNlbC5qcyIsIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvc3JjL2Zha2VfMmViODRmZGMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IFsnJywgZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgaXRlbXNFbGVtZW50cyA9IFtdO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiBcIkFcIixcblx0XHRcdHNjb3BlOiB0cnVlLFxuXHRcdFx0Y29tcGlsZTogZnVuY3Rpb24odEVsZW1lbnQsIHRBdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdHRFbGVtZW50LnN0eWxlID0gXCJwb3NpdGlvbjpyZWxhdGl2ZTsgb3ZlcmZsb3c6aGlkZGVuXCI7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiQ29tcGlsZVwiKVxuXHRcdFx0fSxcblx0XHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG5cbiAgICAgICAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcblxuIFx0XHRcdFx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IHBhcnNlSW50KGF0dHIuYW5pbWF0aW9uRHVyYXRpb24sIDEwKSB8fCAzMDAsXG4gICAgICAgICAgICAgICAgICAgIGlzU2VxdWVudGlhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYXV0b1NsaWRlRHVyYXRpb246IDMsXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlclNpemU6IDUsXG4gICAgICAgICAgICAgICAgICAgIC8qIGluIGNvbnRhaW5lciAlIGhvdyBtdWNoIHdlIG5lZWQgdG8gZHJhZyB0byB0cmlnZ2VyIHRoZSBzbGlkZSBjaGFuZ2UgKi9cbiAgICAgICAgICAgICAgICAgICAgbW92ZVRyZXNob2xkOiAwLjFcbiAgICAgICAgICAgICAgICB9OyBcblx0XHRcdH1cblx0XHR9XG5cdH1dOyIsIi8qKlxuICogQ3JlYXRlZCBieSBNYXRoaWV1IEJlcnRpbiBvbiAxMC8wMi8yMDE1LlxuICovXG5cbi8vUmVxdWlyZSB1c2UgZm9yIGJyb3dzZXJpZnlcblxuXG5hbmd1bGFyLm1vZHVsZSgnaWctY2Fyb3VzZWwnLCBbJ25nQW5pbWF0ZSddKVxuXHQuZGlyZWN0aXZlKCdpZy1jYXJvdXNlbCcsIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9pZy1jYXJvdXNlbCcpKVxuXHQucnVuKFsnJHJvb3RTY29wZScsIGZ1bmN0aW9uKCRyb290U2NvcGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ01vZHVsZSBpZy1jYXJvdXNlbCBydW5ubmluZycpO1xuICAgIH1dKTtcbiJdfQ==
