(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = ['$rootScope','$timeout', '$interval', '$compile', 'ig-service', function($rootScope, $timeout, $interval, $compile, IGCarouselService) {

        // Constants
        var defaultOptions = {
            autoSlide: true,
            transitionDuration: 1000, //in ms
            slideDuration: 3, //in sec
            itemDisplayed: 5, //item displayed in the same time
            rtl: true //right to left
        };

        var deltaZ = 100,
            minScale = 0.8;

        var scopeTmp,
            moving = false;


        //
        var containerElement = null,
            itemsElements = [],
            itemsToDisplay = [],
            indexToDisplay = 0,
            deltaX = 0,
            deltaScale = 0.0,
            lastItems = [],
            options,
            rtlTmp;

        /**
         * Init container style (ul)
         * @param {[jQliteElement]} containerElement
         */
        function addStyleOnContainer(container) {
            containerElement = container;
            containerElement.style.position = 'relative';
            containerElement.style.overflow = 'hidden';
            containerElement.style.margin = '0 auto';
            containerElement.style.padding = '0';
        }

        /**
         * Select the items to be displayed in function of the index given
         * @return {[type]} [description]
         */
        function selectItemsToDisplay(index, nbItemsToDisplay){
            if(nbItemsToDisplay % 2 === 0) { //nb element to display have to be even
                nbItemsToDisplay--;
            }

            lastItems = angular.copy(itemsToDisplay);
            itemsToDisplay = [];

            // Get the items to be displayed
            var end = (nbItemsToDisplay-1) / 2;
            var start = 0 - end;
            var nbElems = itemsElements.length;

            for(var i = start; i <= end; i++) {
                var tmpIndex = index + i ;
                if(tmpIndex >= 0 && tmpIndex < nbElems) {
                    itemsToDisplay.push(itemsElements[tmpIndex].id);
                }
                else if(tmpIndex < 0) {
                    itemsToDisplay.push(itemsElements[tmpIndex + nbElems].id);
                }
                else if(tmpIndex >= itemsElements.length) {
                    itemsToDisplay.push(itemsElements[tmpIndex - nbElems].id);
                }
            }

        }

        /**
         * initialize the items
         * Add index to all items, and add listener onClick event
         * @params scope, needed for compiled html and make ng-click effective
         */
        function initItems(scope) {
            $.each(itemsElements, function(index, item) {
                item.id = "item-" + index;
                item.style.display = "hidden";
                $(item).attr("index", index);
                $(item).click(function(event) {
                    var index = $(this).attr("index") | 0;
                    if(index !== indexToDisplay && !moving) {
                        event.preventDefault(); // Avoid click on child element, only authorize clic when item is displayed (index === indexToDisplay)
                        if(angular.isDefined($rootScope.IGInterval)) {
                            $interval.cancel($rootScope.IGInterval);
                        }
                        move(index);
                        return false;
                    }
                });
            });
        }

        /**
         * Apply new style
         */
        function initItemsStyle () {

            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];
            deltaX = ($(containerElement).width() - $(itemDisplayed).width()) / (itemsToDisplay.length - 1);
            deltaScale = 0.2 / ((itemsToDisplay.length - 1)/2);

            $.each(itemsElements, function(index, item) {

                $(item).mouseenter(function () {
                    if(angular.isDefined($rootScope.IGInterval)){
                        $interval.cancel($rootScope.IGInterval);
                    }
                });
                $(item).mouseleave(function () {
                    if(options.autoSlide){
                        runInterval();
                    }
                });
                item.style.position = "absolute";

                if(itemsToDisplay.indexOf(item.id) === -1){

                    $(item).css('z-index', 0);
                    $(item).velocity({
                        left: 0 + deltaX,
                        scale: (minScale),
                    },
                    {
                        duration: 10
                    });

                }
                else {
                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    $(item).css('z-index', (1+centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ ) ;

                    $(item).velocity({
                        left: (itemIndex * deltaX)  + "px",
                        scale: (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)),
                    },
                    {
                        duration: 10
                    });
                }
            });
        }

        function timeFunc (durationMove, newIndex) {
            moving = true;

            if(tmpRtl) {
                moveRTL(durationMove);
            }
            else {
                moveLTR(durationMove);
            }

            //once it finish to move we run the interval if needed
            if(options.autoSlide && (indexToDisplay === newIndex) ){
                runInterval();
            }
        };

        /**
         * Move items to the new index
         * Function called with on click function
         * @param  {[type]} newIndex [description]
         * @return {[type]}          [description]
         */
        function move(newIndex) {
            var diffIndex = IGCarouselService.getMinDiff(newIndex, indexToDisplay, itemsElements.length),
                nbStep = Math.abs(diffIndex);

            tmpRtl = diffIndex > 0;
            var duration = options.transitionDuration / nbStep < 300 ? 300 : options.transitionDuration / nbStep;
            var timeoutDelay = duration;

            timeFunc(duration, newIndex);

            //Repeat move element in function of nbStep
            var moveInterval = $interval(function() {
                if(indexToDisplay === newIndex) {
                    $interval.cancel(moveInterval);
                }
                else {
                    timeFunc(duration, newIndex);
                }
            }, timeoutDelay-50);
        }

         /**
         * Move items from Right To Left (RTL)
         * @param  integer duration the animation duration in ms
         */
        function moveRTL(duration) {

            indexToDisplay = indexToDisplay + 1 >= itemsElements.length ? 0 : indexToDisplay + 1;
            tmpScope.carouselIndex = indexToDisplay;

            selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

            $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var leftPos = (itemIndex * deltaX);
                var newScale = (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));
                var zIndex = (centerIndex - Math.abs(itemIndex - centerIndex) + 1) * deltaZ;
                var changedZIndex = false;

                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    $(item).velocity({
                        left: leftPos + "px",
                        scale: newScale,
                    },
                    {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                $(item).css('z-index', zIndex);
                                changedZIndex = true;
                            }
                        },
                        complete: function () {
                            moving = false;
                        }

                    });
                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance

                    $(item).velocity({
                        left: leftPos + "px",
                    },
                    {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                $(item).css('z-index', zIndex);
                                changedZIndex = true;
                            }
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    $(item).velocity({
                        left: deltaX * centerIndex + "px",
                    }, {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                $(item).css('z-index', 0);
                                changedZIndex = true;
                            }
                        },
                        complete: function(elements) {
                        }
                    });
                }
            });
        }

        /**
         * Move items from Left To Right (LTR)
         * @param  integer duration the animation duration in ms
         */
        function moveLTR(duration) {

            indexToDisplay = ((indexToDisplay - 1) < 0) ? itemsElements.length - 1 : indexToDisplay - 1;
            tmpScope.carouselIndex = indexToDisplay

            selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

             $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var zIndex = (centerIndex - Math.abs(itemIndex - centerIndex) + 1) * deltaZ;
                var changedZIndex = false;
                var leftPos = (itemIndex * deltaX);
                var newScale = (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));

                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    $(item).velocity({
                        left: leftPos,
                        scale: newScale,
                    },
                    {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                $(item).css('z-index', zIndex);
                                changedZIndex = true;
                            }
                        },
                        complete: function () {
                            moving = false;
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance

                    $(item).velocity({
                            left: (itemIndex * deltaX) + "px",
                            scale: minScale,
                        },
                        {
                            duration: duration,
                            progress: function(elements, complete, remaining, start, tweenValue) {
                                if(complete * 100 > 50 && !changedZIndex) {
                                    $(item).css('z-index', zIndex);
                                    changedZIndex = true;
                                }
                            }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    $(item).velocity({
                            left: deltaX * centerIndex + "px",
                        },{
                             /* Wait 100ms before alternating back. */
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                $(item).css('z-index', 0);
                                changedZIndex = true;
                            }
                        },
                        complete: function(elements) {
                        }
                    });
                }
            });
        }

        /**
         * Run interval in order to auto slide
         */
        function runInterval(){

            if(angular.isDefined($rootScope.IGInterval)) {
                $interval.cancel($rootScope.IGInterval);
            }

            $rootScope.IGInterval =  $interval(function() {
                                        if(options.rtl) {
                                            moveRTL(options.transitionDuration);
                                        }
                                        else {
                                            moveLTR(options.transitionDuration);
                                        }
                                    }, options.slideDuration * 1000 + options.transitionDuration);
        }

        return {
            restrict: "A",
            scope: true,
            link: function(scope, element, attr) {
                //initialize directive container
                addStyleOnContainer(element[0]);

                //Initialize carousel options
                var rtl = angular.isDefined(attr.rtl) ?  attr.rtl === "true" : defaultOptions.rtl;
                var auto = angular.isDefined(attr.autoSlide) ?  attr.autoSlide === "true" : defaultOptions.auto;
                options = {
                    autoSlide: auto,
                    rtl: rtl,
                    transitionDuration: parseInt(attr.animationDuration, 10) || defaultOptions.transitionDuration,
                    slideDuration: parseInt(attr.slideDuration, 10) || defaultOptions.slideDuration,
                    itemDisplayed: parseInt(attr.itemDisplayed, 10) || defaultOptions.itemDisplayed,
                };

                //TODO ?? Put a starting index value
                //indexToDisplay = attr.startingIndex || 0;
                scope.carouselIndex = 0;
                tmpScope = scope;

                //Timeout needed in order to force digest so generate ng-repeat elements
                $timeout(function (){
                    itemsElements = $(element).children();
                    initItems(scope);
                    selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
                    initItemsStyle();

                    // Run auto slide if needed
                    if(options.autoSlide) {
                        runInterval();
                    }
                },0);
            }
        };
    }];
},{}],2:[function(require,module,exports){
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

},{"./directives/ig-carousel":1,"./services/ig-service":3}],3:[function(require,module,exports){
/**
 * Service that will give the image url corresponding to a category identified by his ID
 */
module.exports = [function () {

    var IGCarouselService = function() {};

    /**
     * Get the min diff in a array for going from an index to another in a array with a specified length
     * @param newIndex, the new index to go
     * @param oldIndex, the old index that indicate the start
     * @param arrayLength, the size of the given array
     * @returns object containing style property
     */
    IGCarouselService.getMinDiff = function (newIndex, oldIndex, arrayLength) {

        var leftCursor = oldIndex,
            rightCursor = oldIndex,
            diff = 0;

        for (diff; leftCursor !== newIndex && rightCursor !== newIndex; diff++) {
            leftCursor = ((leftCursor - 1) < 0) ? arrayLength - 1 : leftCursor - 1;
            rightCursor = ((rightCursor + 1) >= arrayLength) ? 0 : rightCursor + 1;
        }

        if(leftCursor === newIndex && rightCursor !== newIndex) {
            diff = diff * -1;
        }

        return diff;
    };

    return IGCarouselService;
}];
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21hdGhpZXUvRGV2L0dpdGh1Yi9pZy1jYXJvdXNlbC9zcmMvZGlyZWN0aXZlcy9pZy1jYXJvdXNlbC5qcyIsIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvc3JjL2Zha2VfYTMyZDQxYTcuanMiLCIvVXNlcnMvbWF0aGlldS9EZXYvR2l0aHViL2lnLWNhcm91c2VsL3NyYy9zZXJ2aWNlcy9pZy1zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gWyckcm9vdFNjb3BlJywnJHRpbWVvdXQnLCAnJGludGVydmFsJywgJyRjb21waWxlJywgJ2lnLXNlcnZpY2UnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkdGltZW91dCwgJGludGVydmFsLCAkY29tcGlsZSwgSUdDYXJvdXNlbFNlcnZpY2UpIHtcblxuICAgICAgICAvLyBDb25zdGFudHNcbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgYXV0b1NsaWRlOiB0cnVlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiAxMDAwLCAvL2luIG1zXG4gICAgICAgICAgICBzbGlkZUR1cmF0aW9uOiAzLCAvL2luIHNlY1xuICAgICAgICAgICAgaXRlbURpc3BsYXllZDogNSwgLy9pdGVtIGRpc3BsYXllZCBpbiB0aGUgc2FtZSB0aW1lXG4gICAgICAgICAgICBydGw6IHRydWUgLy9yaWdodCB0byBsZWZ0XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGRlbHRhWiA9IDEwMCxcbiAgICAgICAgICAgIG1pblNjYWxlID0gMC44O1xuXG4gICAgICAgIHZhciBzY29wZVRtcCxcbiAgICAgICAgICAgIG1vdmluZyA9IGZhbHNlO1xuXG5cbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGNvbnRhaW5lckVsZW1lbnQgPSBudWxsLFxuICAgICAgICAgICAgaXRlbXNFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkgPSBbXSxcbiAgICAgICAgICAgIGluZGV4VG9EaXNwbGF5ID0gMCxcbiAgICAgICAgICAgIGRlbHRhWCA9IDAsXG4gICAgICAgICAgICBkZWx0YVNjYWxlID0gMC4wLFxuICAgICAgICAgICAgbGFzdEl0ZW1zID0gW10sXG4gICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgcnRsVG1wO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IGNvbnRhaW5lciBzdHlsZSAodWwpXG4gICAgICAgICAqIEBwYXJhbSB7W2pRbGl0ZUVsZW1lbnRdfSBjb250YWluZXJFbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBhZGRTdHlsZU9uQ29udGFpbmVyKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyRWxlbWVudCA9IGNvbnRhaW5lcjtcbiAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICAgICAgY29udGFpbmVyRWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgY29udGFpbmVyRWxlbWVudC5zdHlsZS5tYXJnaW4gPSAnMCBhdXRvJztcbiAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuc3R5bGUucGFkZGluZyA9ICcwJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZWxlY3QgdGhlIGl0ZW1zIHRvIGJlIGRpc3BsYXllZCBpbiBmdW5jdGlvbiBvZiB0aGUgaW5kZXggZ2l2ZW5cbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBzZWxlY3RJdGVtc1RvRGlzcGxheShpbmRleCwgbmJJdGVtc1RvRGlzcGxheSl7XG4gICAgICAgICAgICBpZihuYkl0ZW1zVG9EaXNwbGF5ICUgMiA9PT0gMCkgeyAvL25iIGVsZW1lbnQgdG8gZGlzcGxheSBoYXZlIHRvIGJlIGV2ZW5cbiAgICAgICAgICAgICAgICBuYkl0ZW1zVG9EaXNwbGF5LS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3RJdGVtcyA9IGFuZ3VsYXIuY29weShpdGVtc1RvRGlzcGxheSk7XG4gICAgICAgICAgICBpdGVtc1RvRGlzcGxheSA9IFtdO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGl0ZW1zIHRvIGJlIGRpc3BsYXllZFxuICAgICAgICAgICAgdmFyIGVuZCA9IChuYkl0ZW1zVG9EaXNwbGF5LTEpIC8gMjtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IDAgLSBlbmQ7XG4gICAgICAgICAgICB2YXIgbmJFbGVtcyA9IGl0ZW1zRWxlbWVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0bXBJbmRleCA9IGluZGV4ICsgaSA7XG4gICAgICAgICAgICAgICAgaWYodG1wSW5kZXggPj0gMCAmJiB0bXBJbmRleCA8IG5iRWxlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkucHVzaChpdGVtc0VsZW1lbnRzW3RtcEluZGV4XS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodG1wSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9EaXNwbGF5LnB1c2goaXRlbXNFbGVtZW50c1t0bXBJbmRleCArIG5iRWxlbXNdLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0bXBJbmRleCA+PSBpdGVtc0VsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtc1RvRGlzcGxheS5wdXNoKGl0ZW1zRWxlbWVudHNbdG1wSW5kZXggLSBuYkVsZW1zXS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogaW5pdGlhbGl6ZSB0aGUgaXRlbXNcbiAgICAgICAgICogQWRkIGluZGV4IHRvIGFsbCBpdGVtcywgYW5kIGFkZCBsaXN0ZW5lciBvbkNsaWNrIGV2ZW50XG4gICAgICAgICAqIEBwYXJhbXMgc2NvcGUsIG5lZWRlZCBmb3IgY29tcGlsZWQgaHRtbCBhbmQgbWFrZSBuZy1jbGljayBlZmZlY3RpdmVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXRJdGVtcyhzY29wZSkge1xuICAgICAgICAgICAgJC5lYWNoKGl0ZW1zRWxlbWVudHMsIGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5pZCA9IFwiaXRlbS1cIiArIGluZGV4O1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAgICAgJChpdGVtKS5hdHRyKFwiaW5kZXhcIiwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICQoaXRlbSkuY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5hdHRyKFwiaW5kZXhcIikgfCAwO1xuICAgICAgICAgICAgICAgICAgICBpZihpbmRleCAhPT0gaW5kZXhUb0Rpc3BsYXkgJiYgIW1vdmluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gQXZvaWQgY2xpY2sgb24gY2hpbGQgZWxlbWVudCwgb25seSBhdXRob3JpemUgY2xpYyB3aGVuIGl0ZW0gaXMgZGlzcGxheWVkIChpbmRleCA9PT0gaW5kZXhUb0Rpc3BsYXkpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzRGVmaW5lZCgkcm9vdFNjb3BlLklHSW50ZXJ2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbCgkcm9vdFNjb3BlLklHSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZShpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFwcGx5IG5ldyBzdHlsZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdEl0ZW1zU3R5bGUgKCkge1xuXG4gICAgICAgICAgICB2YXIgY2VudGVySW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldLmlkKTtcbiAgICAgICAgICAgIHZhciBpdGVtRGlzcGxheWVkID0gaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV07XG4gICAgICAgICAgICBkZWx0YVggPSAoJChjb250YWluZXJFbGVtZW50KS53aWR0aCgpIC0gJChpdGVtRGlzcGxheWVkKS53aWR0aCgpKSAvIChpdGVtc1RvRGlzcGxheS5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIGRlbHRhU2NhbGUgPSAwLjIgLyAoKGl0ZW1zVG9EaXNwbGF5Lmxlbmd0aCAtIDEpLzIpO1xuXG4gICAgICAgICAgICAkLmVhY2goaXRlbXNFbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgICQoaXRlbSkubW91c2VlbnRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKCRyb290U2NvcGUuSUdJbnRlcnZhbCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbCgkcm9vdFNjb3BlLklHSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJChpdGVtKS5tb3VzZWxlYXZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy5hdXRvU2xpZGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cbiAgICAgICAgICAgICAgICBpZihpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpID09PSAtMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5jc3MoJ3otaW5kZXgnLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS52ZWxvY2l0eSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwICsgZGVsdGFYLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IChtaW5TY2FsZSksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkuY3NzKCd6LWluZGV4JywgKDErY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFaICkgO1xuXG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkudmVsb2NpdHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogKGl0ZW1JbmRleCAqIGRlbHRhWCkgICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IChtaW5TY2FsZSArICgoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFTY2FsZSkpLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0aW1lRnVuYyAoZHVyYXRpb25Nb3ZlLCBuZXdJbmRleCkge1xuICAgICAgICAgICAgbW92aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYodG1wUnRsKSB7XG4gICAgICAgICAgICAgICAgbW92ZVJUTChkdXJhdGlvbk1vdmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbW92ZUxUUihkdXJhdGlvbk1vdmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL29uY2UgaXQgZmluaXNoIHRvIG1vdmUgd2UgcnVuIHRoZSBpbnRlcnZhbCBpZiBuZWVkZWRcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuYXV0b1NsaWRlICYmIChpbmRleFRvRGlzcGxheSA9PT0gbmV3SW5kZXgpICl7XG4gICAgICAgICAgICAgICAgcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZSBpdGVtcyB0byB0aGUgbmV3IGluZGV4XG4gICAgICAgICAqIEZ1bmN0aW9uIGNhbGxlZCB3aXRoIG9uIGNsaWNrIGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmV3SW5kZXggW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmUobmV3SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBkaWZmSW5kZXggPSBJR0Nhcm91c2VsU2VydmljZS5nZXRNaW5EaWZmKG5ld0luZGV4LCBpbmRleFRvRGlzcGxheSwgaXRlbXNFbGVtZW50cy5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIG5iU3RlcCA9IE1hdGguYWJzKGRpZmZJbmRleCk7XG5cbiAgICAgICAgICAgIHRtcFJ0bCA9IGRpZmZJbmRleCA+IDA7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiAvIG5iU3RlcCA8IDMwMCA/IDMwMCA6IG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uIC8gbmJTdGVwO1xuICAgICAgICAgICAgdmFyIHRpbWVvdXREZWxheSA9IGR1cmF0aW9uO1xuXG4gICAgICAgICAgICB0aW1lRnVuYyhkdXJhdGlvbiwgbmV3SW5kZXgpO1xuXG4gICAgICAgICAgICAvL1JlcGVhdCBtb3ZlIGVsZW1lbnQgaW4gZnVuY3Rpb24gb2YgbmJTdGVwXG4gICAgICAgICAgICB2YXIgbW92ZUludGVydmFsID0gJGludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmKGluZGV4VG9EaXNwbGF5ID09PSBuZXdJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKG1vdmVJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aW1lRnVuYyhkdXJhdGlvbiwgbmV3SW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRpbWVvdXREZWxheS01MCk7XG4gICAgICAgIH1cblxuICAgICAgICAgLyoqXG4gICAgICAgICAqIE1vdmUgaXRlbXMgZnJvbSBSaWdodCBUbyBMZWZ0IChSVEwpXG4gICAgICAgICAqIEBwYXJhbSAgaW50ZWdlciBkdXJhdGlvbiB0aGUgYW5pbWF0aW9uIGR1cmF0aW9uIGluIG1zXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBtb3ZlUlRMKGR1cmF0aW9uKSB7XG5cbiAgICAgICAgICAgIGluZGV4VG9EaXNwbGF5ID0gaW5kZXhUb0Rpc3BsYXkgKyAxID49IGl0ZW1zRWxlbWVudHMubGVuZ3RoID8gMCA6IGluZGV4VG9EaXNwbGF5ICsgMTtcbiAgICAgICAgICAgIHRtcFNjb3BlLmNhcm91c2VsSW5kZXggPSBpbmRleFRvRGlzcGxheTtcblxuICAgICAgICAgICAgc2VsZWN0SXRlbXNUb0Rpc3BsYXkoaW5kZXhUb0Rpc3BsYXksIG9wdGlvbnMuaXRlbURpc3BsYXllZCk7XG4gICAgICAgICAgICB2YXIgY2VudGVySW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldLmlkKTtcbiAgICAgICAgICAgIHZhciBpdGVtRGlzcGxheWVkID0gaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV07XG5cbiAgICAgICAgICAgICQuZWFjaChpdGVtc0VsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRQb3MgPSAoaXRlbUluZGV4ICogZGVsdGFYKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAobWluU2NhbGUgKyAoKGNlbnRlckluZGV4IC0gTWF0aC5hYnMoaXRlbUluZGV4IC0gY2VudGVySW5kZXgpKSAqIGRlbHRhU2NhbGUpKTtcbiAgICAgICAgICAgICAgICB2YXIgekluZGV4ID0gKGNlbnRlckluZGV4IC0gTWF0aC5hYnMoaXRlbUluZGV4IC0gY2VudGVySW5kZXgpICsgMSkgKiBkZWx0YVo7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZWRaSW5kZXggPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogbmV3U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuY3NzKCd6LWluZGV4JywgekluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKSA+IC0xICYmIGxhc3RJdGVtcy5pbmRleE9mKGl0ZW0uaWQpID09PSAtMSkgeyAvL2l0ZW0gZW50cmFuY2VcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuY3NzKCd6LWluZGV4JywgekluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpID09PSAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vaXRlbSBleGl0YW5jZVxuXG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkudmVsb2NpdHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogZGVsdGFYICogY2VudGVySW5kZXggKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuY3NzKCd6LWluZGV4JywgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRaSW5kZXggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZSBpdGVtcyBmcm9tIExlZnQgVG8gUmlnaHQgKExUUilcbiAgICAgICAgICogQHBhcmFtICBpbnRlZ2VyIGR1cmF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVMVFIoZHVyYXRpb24pIHtcblxuICAgICAgICAgICAgaW5kZXhUb0Rpc3BsYXkgPSAoKGluZGV4VG9EaXNwbGF5IC0gMSkgPCAwKSA/IGl0ZW1zRWxlbWVudHMubGVuZ3RoIC0gMSA6IGluZGV4VG9EaXNwbGF5IC0gMTtcbiAgICAgICAgICAgIHRtcFNjb3BlLmNhcm91c2VsSW5kZXggPSBpbmRleFRvRGlzcGxheVxuXG4gICAgICAgICAgICBzZWxlY3RJdGVtc1RvRGlzcGxheShpbmRleFRvRGlzcGxheSwgb3B0aW9ucy5pdGVtRGlzcGxheWVkKTtcbiAgICAgICAgICAgIHZhciBjZW50ZXJJbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV0uaWQpO1xuICAgICAgICAgICAgdmFyIGl0ZW1EaXNwbGF5ZWQgPSBpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XTtcblxuICAgICAgICAgICAgICQuZWFjaChpdGVtc0VsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgdmFyIHpJbmRleCA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSArIDEpICogZGVsdGFaO1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkWkluZGV4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRQb3MgPSAoaXRlbUluZGV4ICogZGVsdGFYKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAobWluU2NhbGUgKyAoKGNlbnRlckluZGV4IC0gTWF0aC5hYnMoaXRlbUluZGV4IC0gY2VudGVySW5kZXgpKSAqIGRlbHRhU2NhbGUpKTtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogbmV3U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuY3NzKCd6LWluZGV4JywgekluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEpIHsgLy9pdGVtIGVudHJhbmNlXG5cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS52ZWxvY2l0eSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogKGl0ZW1JbmRleCAqIGRlbHRhWCkgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IG1pblNjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGVsZW1lbnRzLCBjb21wbGV0ZSwgcmVtYWluaW5nLCBzdGFydCwgdHdlZW5WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLmNzcygnei1pbmRleCcsIHpJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkWkluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEgJiYgbGFzdEl0ZW1zLmluZGV4T2YoaXRlbS5pZCkgPiAtMSkgeyAvL2l0ZW0gZXhpdGFuY2VcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBkZWx0YVggKiBjZW50ZXJJbmRleCArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXYWl0IDEwMG1zIGJlZm9yZSBhbHRlcm5hdGluZyBiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGVsZW1lbnRzLCBjb21wbGV0ZSwgcmVtYWluaW5nLCBzdGFydCwgdHdlZW5WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbXBsZXRlICogMTAwID4gNTAgJiYgIWNoYW5nZWRaSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5jc3MoJ3otaW5kZXgnLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbihlbGVtZW50cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSdW4gaW50ZXJ2YWwgaW4gb3JkZXIgdG8gYXV0byBzbGlkZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcnVuSW50ZXJ2YWwoKXtcblxuICAgICAgICAgICAgaWYoYW5ndWxhci5pc0RlZmluZWQoJHJvb3RTY29wZS5JR0ludGVydmFsKSkge1xuICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoJHJvb3RTY29wZS5JR0ludGVydmFsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHJvb3RTY29wZS5JR0ludGVydmFsID0gICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLnJ0bCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlUlRMKG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVMVFIob3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuc2xpZGVEdXJhdGlvbiAqIDEwMDAgKyBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiQVwiLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICAgICAgICAgIC8vaW5pdGlhbGl6ZSBkaXJlY3RpdmUgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgYWRkU3R5bGVPbkNvbnRhaW5lcihlbGVtZW50WzBdKTtcblxuICAgICAgICAgICAgICAgIC8vSW5pdGlhbGl6ZSBjYXJvdXNlbCBvcHRpb25zXG4gICAgICAgICAgICAgICAgdmFyIHJ0bCA9IGFuZ3VsYXIuaXNEZWZpbmVkKGF0dHIucnRsKSA/ICBhdHRyLnJ0bCA9PT0gXCJ0cnVlXCIgOiBkZWZhdWx0T3B0aW9ucy5ydGw7XG4gICAgICAgICAgICAgICAgdmFyIGF1dG8gPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRyLmF1dG9TbGlkZSkgPyAgYXR0ci5hdXRvU2xpZGUgPT09IFwidHJ1ZVwiIDogZGVmYXVsdE9wdGlvbnMuYXV0bztcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBhdXRvU2xpZGU6IGF1dG8sXG4gICAgICAgICAgICAgICAgICAgIHJ0bDogcnRsLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IHBhcnNlSW50KGF0dHIuYW5pbWF0aW9uRHVyYXRpb24sIDEwKSB8fCBkZWZhdWx0T3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlRHVyYXRpb246IHBhcnNlSW50KGF0dHIuc2xpZGVEdXJhdGlvbiwgMTApIHx8IGRlZmF1bHRPcHRpb25zLnNsaWRlRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1EaXNwbGF5ZWQ6IHBhcnNlSW50KGF0dHIuaXRlbURpc3BsYXllZCwgMTApIHx8IGRlZmF1bHRPcHRpb25zLml0ZW1EaXNwbGF5ZWQsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8vVE9ETyA/PyBQdXQgYSBzdGFydGluZyBpbmRleCB2YWx1ZVxuICAgICAgICAgICAgICAgIC8vaW5kZXhUb0Rpc3BsYXkgPSBhdHRyLnN0YXJ0aW5nSW5kZXggfHwgMDtcbiAgICAgICAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICB0bXBTY29wZSA9IHNjb3BlO1xuXG4gICAgICAgICAgICAgICAgLy9UaW1lb3V0IG5lZWRlZCBpbiBvcmRlciB0byBmb3JjZSBkaWdlc3Qgc28gZ2VuZXJhdGUgbmctcmVwZWF0IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zRWxlbWVudHMgPSAkKGVsZW1lbnQpLmNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGluaXRJdGVtcyhzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdEl0ZW1zVG9EaXNwbGF5KGluZGV4VG9EaXNwbGF5LCBvcHRpb25zLml0ZW1EaXNwbGF5ZWQpO1xuICAgICAgICAgICAgICAgICAgICBpbml0SXRlbXNTdHlsZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJ1biBhdXRvIHNsaWRlIGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLmF1dG9TbGlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV07IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IE1hdGhpZXUgQmVydGluIChpR3JhYWwpIG9uIDEwLzAyLzIwMTUuXG4gKiBWZXJzaW9uIDEuMC4wXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCdpZy1jYXJvdXNlbCcsIFtdKVxuXHQuc2VydmljZSgnaWctc2VydmljZScsIHJlcXVpcmUoJy4vc2VydmljZXMvaWctc2VydmljZScpKVxuXHQuZGlyZWN0aXZlKCdpZ0Nhcm91c2VsJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2lnLWNhcm91c2VsJykpXG5cdC5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnTW9kdWxlIGlnLWNhcm91c2VsIHJ1bm5uaW5nJyk7XG4gICAgfV0pO1xuIiwiLyoqXG4gKiBTZXJ2aWNlIHRoYXQgd2lsbCBnaXZlIHRoZSBpbWFnZSB1cmwgY29ycmVzcG9uZGluZyB0byBhIGNhdGVnb3J5IGlkZW50aWZpZWQgYnkgaGlzIElEXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gW2Z1bmN0aW9uICgpIHtcblxuICAgIHZhciBJR0Nhcm91c2VsU2VydmljZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIG1pbiBkaWZmIGluIGEgYXJyYXkgZm9yIGdvaW5nIGZyb20gYW4gaW5kZXggdG8gYW5vdGhlciBpbiBhIGFycmF5IHdpdGggYSBzcGVjaWZpZWQgbGVuZ3RoXG4gICAgICogQHBhcmFtIG5ld0luZGV4LCB0aGUgbmV3IGluZGV4IHRvIGdvXG4gICAgICogQHBhcmFtIG9sZEluZGV4LCB0aGUgb2xkIGluZGV4IHRoYXQgaW5kaWNhdGUgdGhlIHN0YXJ0XG4gICAgICogQHBhcmFtIGFycmF5TGVuZ3RoLCB0aGUgc2l6ZSBvZiB0aGUgZ2l2ZW4gYXJyYXlcbiAgICAgKiBAcmV0dXJucyBvYmplY3QgY29udGFpbmluZyBzdHlsZSBwcm9wZXJ0eVxuICAgICAqL1xuICAgIElHQ2Fyb3VzZWxTZXJ2aWNlLmdldE1pbkRpZmYgPSBmdW5jdGlvbiAobmV3SW5kZXgsIG9sZEluZGV4LCBhcnJheUxlbmd0aCkge1xuXG4gICAgICAgIHZhciBsZWZ0Q3Vyc29yID0gb2xkSW5kZXgsXG4gICAgICAgICAgICByaWdodEN1cnNvciA9IG9sZEluZGV4LFxuICAgICAgICAgICAgZGlmZiA9IDA7XG5cbiAgICAgICAgZm9yIChkaWZmOyBsZWZ0Q3Vyc29yICE9PSBuZXdJbmRleCAmJiByaWdodEN1cnNvciAhPT0gbmV3SW5kZXg7IGRpZmYrKykge1xuICAgICAgICAgICAgbGVmdEN1cnNvciA9ICgobGVmdEN1cnNvciAtIDEpIDwgMCkgPyBhcnJheUxlbmd0aCAtIDEgOiBsZWZ0Q3Vyc29yIC0gMTtcbiAgICAgICAgICAgIHJpZ2h0Q3Vyc29yID0gKChyaWdodEN1cnNvciArIDEpID49IGFycmF5TGVuZ3RoKSA/IDAgOiByaWdodEN1cnNvciArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZihsZWZ0Q3Vyc29yID09PSBuZXdJbmRleCAmJiByaWdodEN1cnNvciAhPT0gbmV3SW5kZXgpIHtcbiAgICAgICAgICAgIGRpZmYgPSBkaWZmICogLTE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlmZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIElHQ2Fyb3VzZWxTZXJ2aWNlO1xufV07Il19
