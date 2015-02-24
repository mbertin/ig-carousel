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

                    item.style['z-index'] = 0;
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
                    item.style['z-index'] = (1+centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;

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
                                item.style['z-index'] = zIndex;
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
                                item.style['z-index'] = zIndex;
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
                                item.style['z-index'] = 0;
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
                                item.style['z-index'] = zIndex;
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
                                    item.style['z-index'] = zIndex;
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
                                item.style['z-index'] = 0;
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