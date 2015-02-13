module.exports = ['$timeout', '$interval', '$compile', function($timeout, $interval, $compile) {

        var containerElement = null,
            itemsElements = [],
            itemsToDisplay = [],
            indexToDisplay = 0,
            deltaX = 100,
            deltaZ = 100,
            deltaScale = 0.1;
            lastItems = [],
            interval = undefined;

        var defaultOptions = {
            autoSlide: true,
            transitionDuration: 1000, //in ms
            slideDuration: 3, //in sec
            itemDisplayed: 5, //item displayed in the same time
            rtl: true,//right to left
        };

        var rtlTmp = true;

        /**
         * Init container style (ul)
         * @param {[jQliteElement]} containerElement
         */
        function addStyleOnContainer(container) {
            containerElement = container;
            containerElement.style.position = 'relative';
            containerElement.style.overflow = 'hidden';
            containerElement.style.margin = '0 auto';
        }

        /**
         * [selectItemsToDisplay description]
         * @return {[type]} [description]
         */
        function selectItemsToDisplay(index){
            if(defaultOptions.itemDisplayed % 2 == 0) { //nb element to display have to be even
                defaultOptions.itemDisplayed--;
            }

            lastItems = angular.copy(itemsToDisplay);
            itemsToDisplay = [];

            // Get the items to be displayed
            var end = (defaultOptions.itemDisplayed-1) / 2;
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
         * add ng click on items
         * @params scope, needed for compiled html and make ng-click effective
         */
        function initItems(scope) {
            $.each(itemsElements, function(index, item) {
                item.id = "item-" + index;
                item.style.display = "hidden";
                $(item).attr("index", index);
                $(item).click(function(event) {
                    var index = $(this).attr("index") | 0;
                    if(angular.isDefined(interval)) {
                        $interval.cancel(interval);
                    }
                    move(index);
                });
            });
        }

        /**
         * Apply new style
         * @return {[type]} [description]
         */
        function initItemsStyle () {

            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];
            deltaX = ($(containerElement).width() - $(itemDisplayed).width()) / (itemsToDisplay.length - 1);
            deltaScale = 0.2 / ((itemsToDisplay.length - 1)/2);

            $.each(itemsElements, function(index, item) {

                $(item).mouseover(function () {
                    if(angular.isDefined(interval)){
                        $interval.cancel(interval);
                    }
                });
                $(item).mouseleave(function () {
                    if(defaultOptions.autoSlide){
                        if(angular.isDefined(interval)) {
                            $interval.cancel(interval);
                        }
                        interval = runInterval();
                    }
                });
                item.style.position = "absolute";

                if(itemsToDisplay.indexOf(item.id) === -1){
                    item.style.display = "none";
                    item.style.left = ($(containerElement).width()/4) + "px";
                    item.style['z-index'] = -1;
                    item.style.transform = "scale(0.8)";
                }
                else {
                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    item.style.left = (itemIndex * deltaX) + "px";
                    item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;
                    item.style.transform = "scale(" + (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)) + ")";
                    item.style.display = "block";
                }
            });
        }

        function getMinDiff(newIndex, oldIndex) {

            var leftCursor = oldIndex,
                rightCursor = oldIndex
                diff = 0;

            for (diff; leftCursor !== newIndex && rightCursor !== newIndex; diff++) {
                leftCursor = ((leftCursor - 1) < 0) ? itemsElements.length - 1 : leftCursor - 1;
                rightCursor = ((rightCursor + 1) >= itemsElements.length) ? 0 : rightCursor + 1;
            };

            if(leftCursor === newIndex) {
                diff = diff * -1;
            }

            return diff;
        }


        function move(newIndex) {
            var diffIndex = getMinDiff(newIndex, indexToDisplay),
                nbStep = Math.abs(diffIndex);

            tmpRtl = diffIndex > 0;
            var duration = defaultOptions.transitionDuration  - (nbStep * 30);
            var timeoutDelay = 0;

            for(var i = 0 ; i < nbStep ; i++) {

                $timeout(function (){
                    if(tmpRtl) {
                        console.log("Move Right");
                        moveRight(duration);
                    }
                    else {
                        console.log("Move Left");
                        moveLeft(duration);
                    }

                    if(defaultOptions.autoSlide && (indexToDisplay === newIndex) ){
                        if(angular.isDefined(interval)) {
                            $interval.cancel(interval);
                        }
                        interval = runInterval();
                    }

                }, timeoutDelay);

                timeoutDelay = duration;
                duration = defaultOptions.transitionDuration  - ((nbStep - i) * 30);
            }

            //indexToDisplay = newIndex;
        }

        function moveRight(duration) {

            indexToDisplay = indexToDisplay + 1 >= itemsElements.length ? 0 : indexToDisplay + 1;

            selectItemsToDisplay(indexToDisplay);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

            $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var leftPos = (itemIndex * deltaX);
                var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));
                var zIndex = (centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;
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
                                console.log("Change z-index");
                                item.style['z-index'] = zIndex;
                                changedZIndex = true;
                            }
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance

                    item.style.transform = "scale(0.2)";
                    item.style.opacity = 0;
                    item.style['z-index']  = - 1;
                    item.style.display = "block";

                    $(item).velocity({
                        left: leftPos + "px",
                        opacity: 1,
                        scale: newScale
                    },
                    {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                console.log("Change z-index");
                                item.style.display = "block";
                                item.style['z-index'] = zIndex;
                                changedZIndex = true;
                            }
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    $(item).velocity({
                        left: ($(containerElement).width()/4) + "px",
                        opacity: 0,
                        scale: 0.7
                    }, {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                console.log("Change z-index");
                                item.style['z-index'] = -1;
                                changedZIndex = true;
                            }
                        },
                        complete: function(elements) {
                            item.style.display = "none";
                        }
                    });
                }
            });
        }

        function moveLeft(duration) {

            indexToDisplay = ((indexToDisplay - 1) < 0) ? itemsElements.length - 1 : indexToDisplay - 1;

            selectItemsToDisplay(indexToDisplay);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

             $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var zIndex = (centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;
                var changedZIndex = false;
                var leftPos = (itemIndex * deltaX);
                var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));

                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    $(item).velocity({
                        left: leftPos,
                        scale: newScale,
                    }, {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                console.log("Change z-index");
                                item.style['z-index'] = zIndex;
                                changedZIndex = true;
                            }
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance

                    item.style.transform = "scale(0.2)";
                    item.style.display = "block";
                    item.style.opacity = 0;
                    item.style['z-index']  = - 1;

                    $(item).velocity({
                            left: (itemIndex * deltaX) + "px",
                            scale: (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)),
                            opacity: 1,
                        },{
                             /* Wait 100ms before alternating back. */
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
                                console.log("Change z-index");
                                item.style['z-index'] = zIndex;
                                changedZIndex = true;
                            }
                        }
                    });
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    item.style['z-index']  = - 1;

                    $(item).velocity({
                            left: ($(containerElement).width()/4) + "px",
                            opacity: 0,
                        },{
                             /* Wait 100ms before alternating back. */
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            console.log((complete * 100) + "%");
                            if(complete * 100 > 50 && !changedZIndex) {
                                console.log("Change z-index");
                                item.style['z-index'] = -1;
                                changedZIndex = true;
                            }
                        },
                        complete: function(elements) {
                            item.style.display = "none";
                        }
                    });
                }
            });
        }

        function runInterval(){
            return $interval(function() {
                if(defaultOptions.rtl) {
                    moveRight(defaultOptions.transitionDuration);
                }
                else {
                    moveLeft(defaultOptions.transitionDuration);
                }
            }, defaultOptions.slideDuration * 1000);
        }

        return {
            restrict: "A",
            scope: true,
            compile: function(tElement, tAttributes) {


                return function(scope, element, attr) {
                    //init
                    addStyleOnContainer(element[0]);

                    var rtl = angular.isDefined(attr.rtl) ?  attr.rtl === "true" : true;
                    var auto = angular.isDefined(attr.autoSlide) ?  attr.autoSlide === "true" : true;

                    //set options TODO rename in options and see defaults ooptions object
                    defaultOptions = {
                        autoSlide: auto,
                        rtl: rtl,
                        transitionDuration: parseInt(attr.animationDuration, 10) || 500, //in ms
                        slideDuration: parseInt(attr.slideDuration, 10) || 3, //in sec
                        itemDisplayed: parseInt(attr.itemDisplayed, 10) || 5, //item displayed in the same time
                    };

                    scope.carouselIndex = 0;
                    indexToDisplay = 0;
/*
                    scope.changeIndex = function (index) {
                        if(index !== indexToDisplay) {
                            if(angular.isDefined(interval)) {
                                $interval.cancel(interval);
                            }
                            move(index);
                        }
                    }*/

                    //Timeout needed in order to force digest so generate ng-repeat elements
                    $timeout(function (){
                        itemsElements = $(element).children();
                        initItems(scope);
                        selectItemsToDisplay(scope.carouselIndex, defaultOptions.itemDisplayed);
                        initItemsStyle();

                        containerElement.style.display = "none";


                        //
                        for(var i = 0 ; i < itemsElements.length ; i ++ ) {
                            $timeout(moveRight(0), 0);
                        }

                        $timeout(function() {
                            containerElement.style.display = "block";
                        }, 200);

                        //
                        if(defaultOptions.autoSlide) {
                            interval = runInterval();
                        }
                    },0);
                };
            }
        }
    }];