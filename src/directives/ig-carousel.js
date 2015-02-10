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