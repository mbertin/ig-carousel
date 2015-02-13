(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = ['$timeout', '$interval', '$compile', function($timeout, $interval, $compile) {

        var containerElement = null,
            itemsElements = [],
            itemsToDisplay = [],
            indexToDisplay = 0,
            deltaX = 100,
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

        var rtlTmp = true; //TODO init with attr

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

        function computeTransition(item, withLeft) {
            if(rtlTmp) {
                $(item).animate({
                        opacity: 0,
                        left: "-100px"
                    },
                    defaultOptions.transitionDuration,
                    function() {

                    }
                );
            }
            else {

            }
        }

        function computeItemExit(item) {
            if(rtl) {
                $(item).animate({
                        opacity: 0,
                        left: "-100px"
                    },
                    defaultOptions.transitionDuration,
                    function() {

                    }
                );
            }
            else {
                $(item).animate({
                        opacity: 0,
                        right: "-100px",
                    },
                    defaultOptions.transitionDuration,
                    function() {

                    }
                );
            }
        }

        function computeItemEntrance(item) {
            if(rtl) {
                item.style.right = item.
                $(item).animate({
                    opacity: 1,
                    right: 0,
                    transform: "scale(0.85)", // TODO
                    'z-index': 1
                },
                speed, function() {

                });
            }
            else {

            }
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

                if(itemsToDisplay.indexOf(item.id) === -1){
                    item.style.display = "none";
                    item.style.position = "absolute";
                    item.style.left = $(containerElement).width/2 + "px";
                    item.style['z-index'] = 0;
                    item.style.transform = "scale(0.2)";
                }
                else {

                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    item.style.position = "absolute";
                    item.style.left = (itemIndex * deltaX) + "px";
                    item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
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

                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    console.log("Already show: " + index);

                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    var halfDuration = duration/2;
                    var leftPos = (itemIndex * deltaX);
                    var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));
                    var halfNewScale = newScale - deltaScale/2;
                    var halfLeftPos = (leftPos + ((deltaX/2)/ halfNewScale));

                   /* if(itemIndex === centerIndex || itemIndex === centerIndex-1) {
                        $(item).animate({
                                left: halfLeftPos + "px",
                                scale: halfNewScale,
                            },
                            halfDuration,
                            function() {
                                item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
                                $(item).animate({
                                    left: leftPos + "px",
                                    scale: newScale,
                                },
                                halfDuration,
                                function() {});
                            }
                        );
                    }
                    else {*/
                        item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));

                        $(item).animate({
                                left: leftPos,
                                scale: newScale,
                            },
                            duration,
                            function() {
                            }
                        );
                  //  }

                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance
                    console.log("Entrance : " + index);

                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale))

                    item.style.display = "block";
                    item.style.transform = "scale(0.2)";
                    item.style.opacity = 0;
                    item.style['z-index']  = - 1;

                    $(item).animate({
                            left: (itemIndex * deltaX) + "px",
                            scale: (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)),
                            opacity: 1
                        },
                        duration,
                        function() {
                            item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
                        }
                    );
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    console.log("Exit : " + index);

                    item.style['z-index'] = item.style['z-index'] - 1;

                    $(item).animate({
                            left: ($(containerElement).width()/2) + "px",
                            opacity: 0,
                            scale: 0.2
                        },
                        duration,
                        function() {
                            item.style.display = "none";
                        }
                    );
                }
            });
        }

        function moveLeft(duration) {

            indexToDisplay = ((indexToDisplay - 1) < 0) ? itemsElements.length - 1 : indexToDisplay - 1;;

            selectItemsToDisplay(indexToDisplay);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

             $.each(itemsElements, function(index, item) {
                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    var halfDuration = duration/2;
                    var leftPos = (itemIndex * deltaX);
                    var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));
                    var halfNewScale = newScale - deltaScale/2;
                    var halfLeftPos = (leftPos - ((deltaX/2)* halfNewScale));

             /*       if(itemIndex === centerIndex || itemIndex === centerIndex + 1) {
                        $(item).animate({
                                left: halfLeftPos + "px",
                                scale: halfNewScale,
                            },
                            halfDuration,
                            function() {
                                item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
                                $(item).animate({
                                    left: leftPos + "px",
                                    scale: newScale,
                                },
                                halfDuration,
                                function() {});
                            }
                        );
                    }
                    else {*/
                        item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
                        $(item).animate({
                                left: leftPos,
                                scale: newScale,
                            },
                            duration,
                            function() {}
                        );
                    // }
                }
                else if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) === -1) { //item entrance
                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    var newScale = (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale))

                    item.style.transform = "scale(0.2)";
                    item.style.display = "block";
                    item.style.opacity = 0;
                    item.style['z-index']  = - 1;

                    $(item).animate({
                            left: (itemIndex * deltaX) + "px",
                            scale: (0.8 + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)),
                            opacity: 1
                        },
                        duration,
                        function() {
                            item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex));
                        }
                    );
                }
                else if(itemsToDisplay.indexOf(item.id) === -1 && lastItems.indexOf(item.id) > -1) { //item exitance

                    item.style['z-index']  = - 1;

                    $(item).animate({
                            left: ($(containerElement).width()/4) + "px",
                            opacity: 0,
                            scale: 0.2
                        },
                        duration,
                        function() {
                            item.style.display = "none";
                        }
                    );
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

                addStyleOnContainer(tElement[0]);

                return function(scope, element, attr) {

                    console.log("Link");
                    console.log("rtl : " + attr.rtl);
                    var rtl = angular.isDefined(attr.rtl) ?  attr.rtl === "true" : true;
                    var auto = angular.isDefined(attr.autoSlide) ?  attr.autoSlide === "true" : true;
                    defaultOptions = {
                        autoSlide: auto,
                        rtl: rtl,
                        transitionDuration: parseInt(attr.animationDuration, 10) || 500, //in ms
                        slideDuration: parseInt(attr.slideDuration, 10) || 3, //in sec
                        itemDisplayed: parseInt(attr.itemDisplayed, 10) || 5, //item displayed in the same time
                    };

                    scope.carouselIndex = 0;
                    indexToDisplay = 0;

                    scope.changeIndex = function (index) {
                        if(index !== indexToDisplay) {
                            if(angular.isDefined(interval)) {
                                $interval.cancel(interval);
                            }
                            move(index);
                        }
                    }

                    //Timeout needed in order to force digest so generate ng-repeat elements
                    $timeout(function (){
                        itemsElements = $(element).children();
                        initItems(scope);
                        selectItemsToDisplay(scope.carouselIndex, defaultOptions.itemDisplayed);
                        initItemsStyle();

                        moveRight(10);
                        $timeout(function() {
                            moveLeft(10);
                        }, 10);

                        if(defaultOptions.autoSlide) {
                            interval = runInterval();
                        }
                    },0);
                };
            }
        }
    }];
},{}],2:[function(require,module,exports){
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

},{"../vendor/jquery-animate-css-rotate-scale.js":3,"../vendor/jquery-css-transform.js":4,"./directives/ig-carousel":1}],3:[function(require,module,exports){
/*!
/**
 * Monkey patch jQuery 1.3.1+ to add support for setting or animating CSS
 * scale and rotation independently.
 * https://github.com/zachstronaut/jquery-animate-css-rotate-scale
 * Released under dual MIT/GPL license just like jQuery.
 * 2009-2012 Zachary Johnson www.zachstronaut.com
 */
(function ($) {
    // Updated 2010.11.06
    // Updated 2012.10.13 - Firefox 16 transform style returns a matrix rather than a string of transform functions.  This broke the features of this jQuery patch in Firefox 16.  It should be possible to parse the matrix for both scale and rotate (especially when scale is the same for both the X and Y axis), however the matrix does have disadvantages such as using its own units and also 45deg being indistinguishable from 45+360deg.  To get around these issues, this patch tracks internally the scale, rotation, and rotation units for any elements that are .scale()'ed, .rotate()'ed, or animated.  The major consequences of this are that 1. the scaled/rotated element will blow away any other transform rules applied to the same element (such as skew or translate), and 2. the scaled/rotated element is unaware of any preset scale or rotation initally set by page CSS rules.  You will have to explicitly set the starting scale/rotation value.

    function initData($el) {
        var _ARS_data = $el.data('_ARS_data');
        if (!_ARS_data) {
            _ARS_data = {
                rotateUnits: 'deg',
                scale: 1,
                rotate: 0
            };

            $el.data('_ARS_data', _ARS_data);
        }

        return _ARS_data;
    }

    function setTransform($el, data) {
        $el.css('transform', 'rotate(' + data.rotate + data.rotateUnits + ') scale(' + data.scale + ',' + data.scale + ')');
    }

    $.fn.rotate = function (val) {
        var $self = $(this), m, data = initData($self);

        if (typeof val == 'undefined') {
            return data.rotate + data.rotateUnits;
        }

        m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m) {
            if (m[3]) {
                data.rotateUnits = m[3];
            }

            data.rotate = m[1];

            setTransform($self, data);
        }

        return this;
    };

    // Note that scale is unitless.
    $.fn.scale = function (val) {
        var $self = $(this), data = initData($self);

        if (typeof val == 'undefined') {
            return data.scale;
        }

        data.scale = val;

        setTransform($self, data);

        return this;
    };

    // fx.cur() must be monkey patched because otherwise it would always
    // return 0 for current rotate and scale values
    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function () {
        if (this.prop == 'rotate') {
            return parseFloat($(this.elem).rotate());

        } else if (this.prop == 'scale') {
            return parseFloat($(this.elem).scale());
        }

        return curProxied.apply(this, arguments);
    };

    $.fx.step.rotate = function (fx) {
        var data = initData($(fx.elem));
        $(fx.elem).rotate(fx.now + data.rotateUnits);
    };

    $.fx.step.scale = function (fx) {
        $(fx.elem).scale(fx.now);
    };

    /*

    Starting on line 3905 of jquery-1.3.2.js we have this code:

    // We need to compute starting value
    if ( unit != "px" ) {
        self.style[ name ] = (end || 1) + unit;
        start = ((end || 1) / e.cur(true)) * start;
        self.style[ name ] = start + unit;
    }

    This creates a problem where we cannot give units to our custom animation
    because if we do then this code will execute and because self.style[name]
    does not exist where name is our custom animation's name then e.cur(true)
    will likely return zero and create a divide by zero bug which will set
    start to NaN.

    The following monkey patch for animate() gets around this by storing the
    units used in the rotation definition and then stripping the units off.

    */

    var animateProxied = $.fn.animate;
    $.fn.animate = function (prop) {
        if (typeof prop['rotate'] != 'undefined') {
            var $self, data, m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5]) {
                $self = $(this);
                data = initData($self);
                data.rotateUnits = m[5];
            }

            prop['rotate'] = m[1];
        }

        return animateProxied.apply(this, arguments);
    };
})(jQuery);
},{}],4:[function(require,module,exports){
(function ($) {
    // Monkey patch jQuery 1.3.1+ css() method to support CSS 'transform'
    // property uniformly across Safari/Chrome/Webkit, Firefox 3.5+, IE 9+, and Opera 11+.
    // 2009-2011 Zachary Johnson www.zachstronaut.com
    // Updated 2011.05.04 (May the fourth be with you!)
    function getTransformProperty(element)
    {
        // Try transform first for forward compatibility
        // In some versions of IE9, it is critical for msTransform to be in
        // this list before MozTranform.
        var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
        var p;
        while (p = properties.shift())
        {
            if (typeof element.style[p] != 'undefined')
            {
                return p;
            }
        }

        // Default to transform also
        return 'transform';
    }

    var _propsObj = null;

    var proxied = $.fn.css;
    $.fn.css = function (arg, val)
    {
        // Temporary solution for current 1.6.x incompatibility, while
        // preserving 1.3.x compatibility, until I can rewrite using CSS Hooks
        if (_propsObj === null)
        {
            if (typeof $.cssProps != 'undefined')
            {
                _propsObj = $.cssProps;
            }
            else if (typeof $.props != 'undefined')
            {
                _propsObj = $.props;
            }
            else
            {
                _propsObj = {}
            }
        }

        // Find the correct browser specific property and setup the mapping using
        // $.props which is used internally by jQuery.attr() when setting CSS
        // properties via either the css(name, value) or css(properties) method.
        // The problem with doing this once outside of css() method is that you
        // need a DOM node to find the right CSS property, and there is some risk
        // that somebody would call the css() method before body has loaded or any
        // DOM-is-ready events have fired.
        if
        (
            typeof _propsObj['transform'] == 'undefined'
            &&
            (
                arg == 'transform'
                ||
                (
                    typeof arg == 'object'
                    && typeof arg['transform'] != 'undefined'
                )
            )
        )
        {
            _propsObj['transform'] = getTransformProperty(this.get(0));
        }

        // We force the property mapping here because jQuery.attr() does
        // property mapping with jQuery.props when setting a CSS property,
        // but curCSS() does *not* do property mapping when *getting* a
        // CSS property.  (It probably should since it manually does it
        // for 'float' now anyway... but that'd require more testing.)
        //
        // But, only do the forced mapping if the correct CSS property
        // is not 'transform' and is something else.
        if (_propsObj['transform'] != 'transform')
        {
            // Call in form of css('transform' ...)
            if (arg == 'transform')
            {
                arg = _propsObj['transform'];

                // User wants to GET the transform CSS, and in jQuery 1.4.3
                // calls to css() for transforms return a matrix rather than
                // the actual string specified by the user... avoid that
                // behavior and return the string by calling jQuery.style()
                // directly
                if (typeof val == 'undefined' && jQuery.style)
                {
                    return jQuery.style(this.get(0), arg);
                }
            }

            // Call in form of css({'transform': ...})
            else if
            (
                typeof arg == 'object'
                && typeof arg['transform'] != 'undefined'
            )
            {
                arg[_propsObj['transform']] = arg['transform'];
                delete arg['transform'];
            }
        }

        return proxied.apply(this, arguments);
    };
})(jQuery);
},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21hdGhpZXUvRGV2L0dpdGh1Yi9pZy1jYXJvdXNlbC9zcmMvZGlyZWN0aXZlcy9pZy1jYXJvdXNlbC5qcyIsIi9Vc2Vycy9tYXRoaWV1L0Rldi9HaXRodWIvaWctY2Fyb3VzZWwvc3JjL2Zha2VfMWFhMDA1MmEuanMiLCIvVXNlcnMvbWF0aGlldS9EZXYvR2l0aHViL2lnLWNhcm91c2VsL3ZlbmRvci9qcXVlcnktYW5pbWF0ZS1jc3Mtcm90YXRlLXNjYWxlLmpzIiwiL1VzZXJzL21hdGhpZXUvRGV2L0dpdGh1Yi9pZy1jYXJvdXNlbC92ZW5kb3IvanF1ZXJ5LWNzcy10cmFuc2Zvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckY29tcGlsZScsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkaW50ZXJ2YWwsICRjb21waWxlKSB7XG5cbiAgICAgICAgdmFyIGNvbnRhaW5lckVsZW1lbnQgPSBudWxsLFxuICAgICAgICAgICAgaXRlbXNFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkgPSBbXSxcbiAgICAgICAgICAgIGluZGV4VG9EaXNwbGF5ID0gMCxcbiAgICAgICAgICAgIGRlbHRhWCA9IDEwMCxcbiAgICAgICAgICAgIGRlbHRhU2NhbGUgPSAwLjE7XG4gICAgICAgICAgICBsYXN0SXRlbXMgPSBbXSxcbiAgICAgICAgICAgIGludGVydmFsID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGF1dG9TbGlkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogMTAwMCwgLy9pbiBtc1xuICAgICAgICAgICAgc2xpZGVEdXJhdGlvbjogMywgLy9pbiBzZWNcbiAgICAgICAgICAgIGl0ZW1EaXNwbGF5ZWQ6IDUsIC8vaXRlbSBkaXNwbGF5ZWQgaW4gdGhlIHNhbWUgdGltZVxuICAgICAgICAgICAgcnRsOiB0cnVlLC8vcmlnaHQgdG8gbGVmdFxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBydGxUbXAgPSB0cnVlOyAvL1RPRE8gaW5pdCB3aXRoIGF0dHJcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBjb250YWluZXIgc3R5bGUgKHVsKVxuICAgICAgICAgKiBAcGFyYW0ge1tqUWxpdGVFbGVtZW50XX0gY29udGFpbmVyRWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gYWRkU3R5bGVPbkNvbnRhaW5lcihjb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQgPSBjb250YWluZXI7XG4gICAgICAgICAgICBjb250YWluZXJFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuc3R5bGUubWFyZ2luID0gJzAgYXV0byc7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogW3NlbGVjdEl0ZW1zVG9EaXNwbGF5IGRlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW1zVG9EaXNwbGF5KGluZGV4KXtcbiAgICAgICAgICAgIGlmKGRlZmF1bHRPcHRpb25zLml0ZW1EaXNwbGF5ZWQgJSAyID09IDApIHsgLy9uYiBlbGVtZW50IHRvIGRpc3BsYXkgaGF2ZSB0byBiZSBldmVuXG4gICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMuaXRlbURpc3BsYXllZC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0SXRlbXMgPSBhbmd1bGFyLmNvcHkoaXRlbXNUb0Rpc3BsYXkpO1xuICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkgPSBbXTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBpdGVtcyB0byBiZSBkaXNwbGF5ZWRcbiAgICAgICAgICAgIHZhciBlbmQgPSAoZGVmYXVsdE9wdGlvbnMuaXRlbURpc3BsYXllZC0xKSAvIDI7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSAwIC0gZW5kO1xuICAgICAgICAgICAgdmFyIG5iRWxlbXMgPSBpdGVtc0VsZW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gc3RhcnQ7IGkgPD0gZW5kOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdG1wSW5kZXggPSBpbmRleCArIGkgO1xuICAgICAgICAgICAgICAgIGlmKHRtcEluZGV4ID49IDAgJiYgdG1wSW5kZXggPCBuYkVsZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9EaXNwbGF5LnB1c2goaXRlbXNFbGVtZW50c1t0bXBJbmRleF0uaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRtcEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtc1RvRGlzcGxheS5wdXNoKGl0ZW1zRWxlbWVudHNbdG1wSW5kZXggKyBuYkVsZW1zXS5pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYodG1wSW5kZXggPj0gaXRlbXNFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkucHVzaChpdGVtc0VsZW1lbnRzW3RtcEluZGV4IC0gbmJFbGVtc10uaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGluaXRpYWxpemUgdGhlIGl0ZW1zXG4gICAgICAgICAqIGFkZCBuZyBjbGljayBvbiBpdGVtc1xuICAgICAgICAgKiBAcGFyYW1zIHNjb3BlLCBuZWVkZWQgZm9yIGNvbXBpbGVkIGh0bWwgYW5kIG1ha2UgbmctY2xpY2sgZWZmZWN0aXZlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0SXRlbXMoc2NvcGUpIHtcbiAgICAgICAgICAgICQuZWFjaChpdGVtc0VsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICAgIGl0ZW0uaWQgPSBcIml0ZW0tXCIgKyBpbmRleDtcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgICAgICQoaXRlbSkuYXR0cihcImluZGV4XCIsIGluZGV4KTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICQodGhpcykuYXR0cihcImluZGV4XCIpIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0RlZmluZWQoaW50ZXJ2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBtb3ZlKGluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY29tcHV0ZVRyYW5zaXRpb24oaXRlbSwgd2l0aExlZnQpIHtcbiAgICAgICAgICAgIGlmKHJ0bFRtcCkge1xuICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogXCItMTAwcHhcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0T3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNvbXB1dGVJdGVtRXhpdChpdGVtKSB7XG4gICAgICAgICAgICBpZihydGwpIHtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IFwiLTEwMHB4XCJcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdE9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IFwiLTEwMHB4XCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjb21wdXRlSXRlbUVudHJhbmNlKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmKHJ0bCkge1xuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucmlnaHQgPSBpdGVtLlxuICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwic2NhbGUoMC44NSlcIiwgLy8gVE9ET1xuICAgICAgICAgICAgICAgICAgICAnei1pbmRleCc6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNwZWVkLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseSBuZXcgc3R5bGVcbiAgICAgICAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBpbml0SXRlbXNTdHlsZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjZW50ZXJJbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV0uaWQpO1xuICAgICAgICAgICAgdmFyIGl0ZW1EaXNwbGF5ZWQgPSBpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XTtcbiAgICAgICAgICAgIGRlbHRhWCA9ICgkKGNvbnRhaW5lckVsZW1lbnQpLndpZHRoKCkgLSAkKGl0ZW1EaXNwbGF5ZWQpLndpZHRoKCkpIC8gKGl0ZW1zVG9EaXNwbGF5Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgZGVsdGFTY2FsZSA9IDAuMiAvICgoaXRlbXNUb0Rpc3BsYXkubGVuZ3RoIC0gMSkvMik7XG5cbiAgICAgICAgICAgICQuZWFjaChpdGVtc0VsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuXG4gICAgICAgICAgICAgICAgJChpdGVtKS5tb3VzZW92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzRGVmaW5lZChpbnRlcnZhbCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLm1vdXNlbGVhdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZihkZWZhdWx0T3B0aW9ucy5hdXRvU2xpZGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoYW5ndWxhci5pc0RlZmluZWQoaW50ZXJ2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHJ1bkludGVydmFsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICQoY29udGFpbmVyRWxlbWVudCkud2lkdGgvMiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDAuMilcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IChpdGVtSW5kZXggKiBkZWx0YVgpICsgXCJweFwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlWyd6LWluZGV4J10gPSAoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUoXCIgKyAoMC44ICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSkgKyBcIilcIjtcblxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRNaW5EaWZmKG5ld0luZGV4LCBvbGRJbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgbGVmdEN1cnNvciA9IG9sZEluZGV4LFxuICAgICAgICAgICAgICAgIHJpZ2h0Q3Vyc29yID0gb2xkSW5kZXhcbiAgICAgICAgICAgICAgICBkaWZmID0gMDtcblxuICAgICAgICAgICAgZm9yIChkaWZmOyBsZWZ0Q3Vyc29yICE9PSBuZXdJbmRleCAmJiByaWdodEN1cnNvciAhPT0gbmV3SW5kZXg7IGRpZmYrKykge1xuICAgICAgICAgICAgICAgIGxlZnRDdXJzb3IgPSAoKGxlZnRDdXJzb3IgLSAxKSA8IDApID8gaXRlbXNFbGVtZW50cy5sZW5ndGggLSAxIDogbGVmdEN1cnNvciAtIDE7XG4gICAgICAgICAgICAgICAgcmlnaHRDdXJzb3IgPSAoKHJpZ2h0Q3Vyc29yICsgMSkgPj0gaXRlbXNFbGVtZW50cy5sZW5ndGgpID8gMCA6IHJpZ2h0Q3Vyc29yICsgMTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmKGxlZnRDdXJzb3IgPT09IG5ld0luZGV4KSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9IGRpZmYgKiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGRpZmY7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGZ1bmN0aW9uIG1vdmUobmV3SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBkaWZmSW5kZXggPSBnZXRNaW5EaWZmKG5ld0luZGV4LCBpbmRleFRvRGlzcGxheSksXG4gICAgICAgICAgICAgICAgbmJTdGVwID0gTWF0aC5hYnMoZGlmZkluZGV4KTtcblxuICAgICAgICAgICAgdG1wUnRsID0gZGlmZkluZGV4ID4gMDtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IGRlZmF1bHRPcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiAgLSAobmJTdGVwICogMzApO1xuICAgICAgICAgICAgdmFyIHRpbWVvdXREZWxheSA9IDA7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDAgOyBpIDwgbmJTdGVwIDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgaWYodG1wUnRsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1vdmUgUmlnaHRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlUmlnaHQoZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJNb3ZlIExlZnRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3ZlTGVmdChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihkZWZhdWx0T3B0aW9ucy5hdXRvU2xpZGUgJiYgKGluZGV4VG9EaXNwbGF5ID09PSBuZXdJbmRleCkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKGludGVydmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBydW5JbnRlcnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LCB0aW1lb3V0RGVsYXkpO1xuXG4gICAgICAgICAgICAgICAgdGltZW91dERlbGF5ID0gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBkZWZhdWx0T3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gIC0gKChuYlN0ZXAgLSBpKSAqIDMwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9pbmRleFRvRGlzcGxheSA9IG5ld0luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW92ZVJpZ2h0KGR1cmF0aW9uKSB7XG5cbiAgICAgICAgICAgIGluZGV4VG9EaXNwbGF5ID0gaW5kZXhUb0Rpc3BsYXkgKyAxID49IGl0ZW1zRWxlbWVudHMubGVuZ3RoID8gMCA6IGluZGV4VG9EaXNwbGF5ICsgMTtcblxuICAgICAgICAgICAgc2VsZWN0SXRlbXNUb0Rpc3BsYXkoaW5kZXhUb0Rpc3BsYXkpO1xuICAgICAgICAgICAgdmFyIGNlbnRlckluZGV4ID0gaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XS5pZCk7XG4gICAgICAgICAgICB2YXIgaXRlbURpc3BsYXllZCA9IGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldO1xuXG4gICAgICAgICAgICAkLmVhY2goaXRlbXNFbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFscmVhZHkgc2hvdzogXCIgKyBpbmRleCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1JbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYWxmRHVyYXRpb24gPSBkdXJhdGlvbi8yO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdFBvcyA9IChpdGVtSW5kZXggKiBkZWx0YVgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAoMC44ICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYWxmTmV3U2NhbGUgPSBuZXdTY2FsZSAtIGRlbHRhU2NhbGUvMjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbGZMZWZ0UG9zID0gKGxlZnRQb3MgKyAoKGRlbHRhWC8yKS8gaGFsZk5ld1NjYWxlKSk7XG5cbiAgICAgICAgICAgICAgICAgICAvKiBpZihpdGVtSW5kZXggPT09IGNlbnRlckluZGV4IHx8IGl0ZW1JbmRleCA9PT0gY2VudGVySW5kZXgtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaGFsZkxlZnRQb3MgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBoYWxmTmV3U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0UG9zICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IG5ld1NjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYWxmRHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7Ki9cbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBuZXdTY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAvLyAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKSA+IC0xICYmIGxhc3RJdGVtcy5pbmRleE9mKGl0ZW0uaWQpID09PSAtMSkgeyAvL2l0ZW0gZW50cmFuY2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFbnRyYW5jZSA6IFwiICsgaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAoMC44ICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSlcblxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgwLjIpXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSAgPSAtIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoaXRlbUluZGV4ICogZGVsdGFYKSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogKDAuOCArICgoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFTY2FsZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEgJiYgbGFzdEl0ZW1zLmluZGV4T2YoaXRlbS5pZCkgPiAtMSkgeyAvL2l0ZW0gZXhpdGFuY2VcblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkV4aXQgOiBcIiArIGluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlWyd6LWluZGV4J10gPSBpdGVtLnN0eWxlWyd6LWluZGV4J10gLSAxO1xuXG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogKCQoY29udGFpbmVyRWxlbWVudCkud2lkdGgoKS8yKSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW92ZUxlZnQoZHVyYXRpb24pIHtcblxuICAgICAgICAgICAgaW5kZXhUb0Rpc3BsYXkgPSAoKGluZGV4VG9EaXNwbGF5IC0gMSkgPCAwKSA/IGl0ZW1zRWxlbWVudHMubGVuZ3RoIC0gMSA6IGluZGV4VG9EaXNwbGF5IC0gMTs7XG5cbiAgICAgICAgICAgIHNlbGVjdEl0ZW1zVG9EaXNwbGF5KGluZGV4VG9EaXNwbGF5KTtcbiAgICAgICAgICAgIHZhciBjZW50ZXJJbmRleCA9IGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV0uaWQpO1xuICAgICAgICAgICAgdmFyIGl0ZW1EaXNwbGF5ZWQgPSBpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XTtcblxuICAgICAgICAgICAgICQuZWFjaChpdGVtc0VsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUluZGV4ID0gaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbGZEdXJhdGlvbiA9IGR1cmF0aW9uLzI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsZWZ0UG9zID0gKGl0ZW1JbmRleCAqIGRlbHRhWCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdTY2FsZSA9ICgwLjggKyAoKGNlbnRlckluZGV4IC0gTWF0aC5hYnMoaXRlbUluZGV4IC0gY2VudGVySW5kZXgpKSAqIGRlbHRhU2NhbGUpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhhbGZOZXdTY2FsZSA9IG5ld1NjYWxlIC0gZGVsdGFTY2FsZS8yO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGFsZkxlZnRQb3MgPSAobGVmdFBvcyAtICgoZGVsdGFYLzIpKiBoYWxmTmV3U2NhbGUpKTtcblxuICAgICAgICAgICAgIC8qICAgICAgIGlmKGl0ZW1JbmRleCA9PT0gY2VudGVySW5kZXggfHwgaXRlbUluZGV4ID09PSBjZW50ZXJJbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGhhbGZMZWZ0UG9zICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogaGFsZk5ld1NjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZkR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlWyd6LWluZGV4J10gPSAoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdFBvcyArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBuZXdTY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFsZkR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgeyovXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlWyd6LWluZGV4J10gPSAoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogbGVmdFBvcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IG5ld1NjYWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEpIHsgLy9pdGVtIGVudHJhbmNlXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAoMC44ICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSlcblxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUoMC4yKVwiO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSAgPSAtIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoaXRlbUluZGV4ICogZGVsdGFYKSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogKDAuOCArICgoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFTY2FsZSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYoaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKSA9PT0gLTEgJiYgbGFzdEl0ZW1zLmluZGV4T2YoaXRlbS5pZCkgPiAtMSkgeyAvL2l0ZW0gZXhpdGFuY2VcblxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlWyd6LWluZGV4J10gID0gLSAxO1xuXG4gICAgICAgICAgICAgICAgICAgICQoaXRlbSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogKCQoY29udGFpbmVyRWxlbWVudCkud2lkdGgoKS80KSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcnVuSW50ZXJ2YWwoKXtcbiAgICAgICAgICAgIHJldHVybiAkaW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYoZGVmYXVsdE9wdGlvbnMucnRsKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVSaWdodChkZWZhdWx0T3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZUxlZnQoZGVmYXVsdE9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBkZWZhdWx0T3B0aW9ucy5zbGlkZUR1cmF0aW9uICogMTAwMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiQVwiLFxuICAgICAgICAgICAgc2NvcGU6IHRydWUsXG4gICAgICAgICAgICBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJpYnV0ZXMpIHtcblxuICAgICAgICAgICAgICAgIGFkZFN0eWxlT25Db250YWluZXIodEVsZW1lbnRbMF0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMaW5rXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ0bCA6IFwiICsgYXR0ci5ydGwpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcnRsID0gYW5ndWxhci5pc0RlZmluZWQoYXR0ci5ydGwpID8gIGF0dHIucnRsID09PSBcInRydWVcIiA6IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRvID0gYW5ndWxhci5pc0RlZmluZWQoYXR0ci5hdXRvU2xpZGUpID8gIGF0dHIuYXV0b1NsaWRlID09PSBcInRydWVcIiA6IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXV0b1NsaWRlOiBhdXRvLFxuICAgICAgICAgICAgICAgICAgICAgICAgcnRsOiBydGwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IHBhcnNlSW50KGF0dHIuYW5pbWF0aW9uRHVyYXRpb24sIDEwKSB8fCA1MDAsIC8vaW4gbXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlRHVyYXRpb246IHBhcnNlSW50KGF0dHIuc2xpZGVEdXJhdGlvbiwgMTApIHx8IDMsIC8vaW4gc2VjXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtRGlzcGxheWVkOiBwYXJzZUludChhdHRyLml0ZW1EaXNwbGF5ZWQsIDEwKSB8fCA1LCAvL2l0ZW0gZGlzcGxheWVkIGluIHRoZSBzYW1lIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYXJvdXNlbEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUb0Rpc3BsYXkgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNoYW5nZUluZGV4ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpbmRleCAhPT0gaW5kZXhUb0Rpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzRGVmaW5lZChpbnRlcnZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmUoaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy9UaW1lb3V0IG5lZWRlZCBpbiBvcmRlciB0byBmb3JjZSBkaWdlc3Qgc28gZ2VuZXJhdGUgbmctcmVwZWF0IGVsZW1lbnRzXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXNFbGVtZW50cyA9ICQoZWxlbWVudCkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRJdGVtcyhzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RJdGVtc1RvRGlzcGxheShzY29wZS5jYXJvdXNlbEluZGV4LCBkZWZhdWx0T3B0aW9ucy5pdGVtRGlzcGxheWVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRJdGVtc1N0eWxlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVSaWdodCgxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3ZlTGVmdCgxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRlZmF1bHRPcHRpb25zLmF1dG9TbGlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwwKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfV07IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IE1hdGhpZXUgQmVydGluIG9uIDEwLzAyLzIwMTUuXG4gKi9cblxuLy9SZXF1aXJlIHVzZSBmb3IgYnJvd3NlcmlmeVxucmVxdWlyZSgnLi4vdmVuZG9yL2pxdWVyeS1jc3MtdHJhbnNmb3JtLmpzJyk7XG5yZXF1aXJlKCcuLi92ZW5kb3IvanF1ZXJ5LWFuaW1hdGUtY3NzLXJvdGF0ZS1zY2FsZS5qcycpO1xuXG5cbmFuZ3VsYXIubW9kdWxlKCdpZy1jYXJvdXNlbCcsIFtdKVxuXHQuZGlyZWN0aXZlKCdpZ0Nhcm91c2VsJywgcmVxdWlyZSgnLi9kaXJlY3RpdmVzL2lnLWNhcm91c2VsJykpXG5cdC5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnTW9kdWxlIGlnLWNhcm91c2VsIHJ1bm5uaW5nJyk7XG4gICAgfV0pO1xuIiwiLyohXG4vKipcbiAqIE1vbmtleSBwYXRjaCBqUXVlcnkgMS4zLjErIHRvIGFkZCBzdXBwb3J0IGZvciBzZXR0aW5nIG9yIGFuaW1hdGluZyBDU1NcbiAqIHNjYWxlIGFuZCByb3RhdGlvbiBpbmRlcGVuZGVudGx5LlxuICogaHR0cHM6Ly9naXRodWIuY29tL3phY2hzdHJvbmF1dC9qcXVlcnktYW5pbWF0ZS1jc3Mtcm90YXRlLXNjYWxlXG4gKiBSZWxlYXNlZCB1bmRlciBkdWFsIE1JVC9HUEwgbGljZW5zZSBqdXN0IGxpa2UgalF1ZXJ5LlxuICogMjAwOS0yMDEyIFphY2hhcnkgSm9obnNvbiB3d3cuemFjaHN0cm9uYXV0LmNvbVxuICovXG4oZnVuY3Rpb24gKCQpIHtcbiAgICAvLyBVcGRhdGVkIDIwMTAuMTEuMDZcbiAgICAvLyBVcGRhdGVkIDIwMTIuMTAuMTMgLSBGaXJlZm94IDE2IHRyYW5zZm9ybSBzdHlsZSByZXR1cm5zIGEgbWF0cml4IHJhdGhlciB0aGFuIGEgc3RyaW5nIG9mIHRyYW5zZm9ybSBmdW5jdGlvbnMuICBUaGlzIGJyb2tlIHRoZSBmZWF0dXJlcyBvZiB0aGlzIGpRdWVyeSBwYXRjaCBpbiBGaXJlZm94IDE2LiAgSXQgc2hvdWxkIGJlIHBvc3NpYmxlIHRvIHBhcnNlIHRoZSBtYXRyaXggZm9yIGJvdGggc2NhbGUgYW5kIHJvdGF0ZSAoZXNwZWNpYWxseSB3aGVuIHNjYWxlIGlzIHRoZSBzYW1lIGZvciBib3RoIHRoZSBYIGFuZCBZIGF4aXMpLCBob3dldmVyIHRoZSBtYXRyaXggZG9lcyBoYXZlIGRpc2FkdmFudGFnZXMgc3VjaCBhcyB1c2luZyBpdHMgb3duIHVuaXRzIGFuZCBhbHNvIDQ1ZGVnIGJlaW5nIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gNDUrMzYwZGVnLiAgVG8gZ2V0IGFyb3VuZCB0aGVzZSBpc3N1ZXMsIHRoaXMgcGF0Y2ggdHJhY2tzIGludGVybmFsbHkgdGhlIHNjYWxlLCByb3RhdGlvbiwgYW5kIHJvdGF0aW9uIHVuaXRzIGZvciBhbnkgZWxlbWVudHMgdGhhdCBhcmUgLnNjYWxlKCknZWQsIC5yb3RhdGUoKSdlZCwgb3IgYW5pbWF0ZWQuICBUaGUgbWFqb3IgY29uc2VxdWVuY2VzIG9mIHRoaXMgYXJlIHRoYXQgMS4gdGhlIHNjYWxlZC9yb3RhdGVkIGVsZW1lbnQgd2lsbCBibG93IGF3YXkgYW55IG90aGVyIHRyYW5zZm9ybSBydWxlcyBhcHBsaWVkIHRvIHRoZSBzYW1lIGVsZW1lbnQgKHN1Y2ggYXMgc2tldyBvciB0cmFuc2xhdGUpLCBhbmQgMi4gdGhlIHNjYWxlZC9yb3RhdGVkIGVsZW1lbnQgaXMgdW5hd2FyZSBvZiBhbnkgcHJlc2V0IHNjYWxlIG9yIHJvdGF0aW9uIGluaXRhbGx5IHNldCBieSBwYWdlIENTUyBydWxlcy4gIFlvdSB3aWxsIGhhdmUgdG8gZXhwbGljaXRseSBzZXQgdGhlIHN0YXJ0aW5nIHNjYWxlL3JvdGF0aW9uIHZhbHVlLlxuXG4gICAgZnVuY3Rpb24gaW5pdERhdGEoJGVsKSB7XG4gICAgICAgIHZhciBfQVJTX2RhdGEgPSAkZWwuZGF0YSgnX0FSU19kYXRhJyk7XG4gICAgICAgIGlmICghX0FSU19kYXRhKSB7XG4gICAgICAgICAgICBfQVJTX2RhdGEgPSB7XG4gICAgICAgICAgICAgICAgcm90YXRlVW5pdHM6ICdkZWcnLFxuICAgICAgICAgICAgICAgIHNjYWxlOiAxLFxuICAgICAgICAgICAgICAgIHJvdGF0ZTogMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGVsLmRhdGEoJ19BUlNfZGF0YScsIF9BUlNfZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX0FSU19kYXRhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRyYW5zZm9ybSgkZWwsIGRhdGEpIHtcbiAgICAgICAgJGVsLmNzcygndHJhbnNmb3JtJywgJ3JvdGF0ZSgnICsgZGF0YS5yb3RhdGUgKyBkYXRhLnJvdGF0ZVVuaXRzICsgJykgc2NhbGUoJyArIGRhdGEuc2NhbGUgKyAnLCcgKyBkYXRhLnNjYWxlICsgJyknKTtcbiAgICB9XG5cbiAgICAkLmZuLnJvdGF0ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgdmFyICRzZWxmID0gJCh0aGlzKSwgbSwgZGF0YSA9IGluaXREYXRhKCRzZWxmKTtcblxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEucm90YXRlICsgZGF0YS5yb3RhdGVVbml0cztcbiAgICAgICAgfVxuXG4gICAgICAgIG0gPSB2YWwudG9TdHJpbmcoKS5tYXRjaCgvXigtP1xcZCsoXFwuXFxkKyk/KSguKyk/JC8pO1xuICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgaWYgKG1bM10pIHtcbiAgICAgICAgICAgICAgICBkYXRhLnJvdGF0ZVVuaXRzID0gbVszXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YS5yb3RhdGUgPSBtWzFdO1xuXG4gICAgICAgICAgICBzZXRUcmFuc2Zvcm0oJHNlbGYsIGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8vIE5vdGUgdGhhdCBzY2FsZSBpcyB1bml0bGVzcy5cbiAgICAkLmZuLnNjYWxlID0gZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICB2YXIgJHNlbGYgPSAkKHRoaXMpLCBkYXRhID0gaW5pdERhdGEoJHNlbGYpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEuc2NhbGUgPSB2YWw7XG5cbiAgICAgICAgc2V0VHJhbnNmb3JtKCRzZWxmLCBkYXRhKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLy8gZnguY3VyKCkgbXVzdCBiZSBtb25rZXkgcGF0Y2hlZCBiZWNhdXNlIG90aGVyd2lzZSBpdCB3b3VsZCBhbHdheXNcbiAgICAvLyByZXR1cm4gMCBmb3IgY3VycmVudCByb3RhdGUgYW5kIHNjYWxlIHZhbHVlc1xuICAgIHZhciBjdXJQcm94aWVkID0gJC5meC5wcm90b3R5cGUuY3VyO1xuICAgICQuZngucHJvdG90eXBlLmN1ciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcCA9PSAncm90YXRlJykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoJCh0aGlzLmVsZW0pLnJvdGF0ZSgpKTtcblxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcCA9PSAnc2NhbGUnKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdCgkKHRoaXMuZWxlbSkuc2NhbGUoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3VyUHJveGllZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICAkLmZ4LnN0ZXAucm90YXRlID0gZnVuY3Rpb24gKGZ4KSB7XG4gICAgICAgIHZhciBkYXRhID0gaW5pdERhdGEoJChmeC5lbGVtKSk7XG4gICAgICAgICQoZnguZWxlbSkucm90YXRlKGZ4Lm5vdyArIGRhdGEucm90YXRlVW5pdHMpO1xuICAgIH07XG5cbiAgICAkLmZ4LnN0ZXAuc2NhbGUgPSBmdW5jdGlvbiAoZngpIHtcbiAgICAgICAgJChmeC5lbGVtKS5zY2FsZShmeC5ub3cpO1xuICAgIH07XG5cbiAgICAvKlxuXG4gICAgU3RhcnRpbmcgb24gbGluZSAzOTA1IG9mIGpxdWVyeS0xLjMuMi5qcyB3ZSBoYXZlIHRoaXMgY29kZTpcblxuICAgIC8vIFdlIG5lZWQgdG8gY29tcHV0ZSBzdGFydGluZyB2YWx1ZVxuICAgIGlmICggdW5pdCAhPSBcInB4XCIgKSB7XG4gICAgICAgIHNlbGYuc3R5bGVbIG5hbWUgXSA9IChlbmQgfHwgMSkgKyB1bml0O1xuICAgICAgICBzdGFydCA9ICgoZW5kIHx8IDEpIC8gZS5jdXIodHJ1ZSkpICogc3RhcnQ7XG4gICAgICAgIHNlbGYuc3R5bGVbIG5hbWUgXSA9IHN0YXJ0ICsgdW5pdDtcbiAgICB9XG5cbiAgICBUaGlzIGNyZWF0ZXMgYSBwcm9ibGVtIHdoZXJlIHdlIGNhbm5vdCBnaXZlIHVuaXRzIHRvIG91ciBjdXN0b20gYW5pbWF0aW9uXG4gICAgYmVjYXVzZSBpZiB3ZSBkbyB0aGVuIHRoaXMgY29kZSB3aWxsIGV4ZWN1dGUgYW5kIGJlY2F1c2Ugc2VsZi5zdHlsZVtuYW1lXVxuICAgIGRvZXMgbm90IGV4aXN0IHdoZXJlIG5hbWUgaXMgb3VyIGN1c3RvbSBhbmltYXRpb24ncyBuYW1lIHRoZW4gZS5jdXIodHJ1ZSlcbiAgICB3aWxsIGxpa2VseSByZXR1cm4gemVybyBhbmQgY3JlYXRlIGEgZGl2aWRlIGJ5IHplcm8gYnVnIHdoaWNoIHdpbGwgc2V0XG4gICAgc3RhcnQgdG8gTmFOLlxuXG4gICAgVGhlIGZvbGxvd2luZyBtb25rZXkgcGF0Y2ggZm9yIGFuaW1hdGUoKSBnZXRzIGFyb3VuZCB0aGlzIGJ5IHN0b3JpbmcgdGhlXG4gICAgdW5pdHMgdXNlZCBpbiB0aGUgcm90YXRpb24gZGVmaW5pdGlvbiBhbmQgdGhlbiBzdHJpcHBpbmcgdGhlIHVuaXRzIG9mZi5cblxuICAgICovXG5cbiAgICB2YXIgYW5pbWF0ZVByb3hpZWQgPSAkLmZuLmFuaW1hdGU7XG4gICAgJC5mbi5hbmltYXRlID0gZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wWydyb3RhdGUnXSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFyICRzZWxmLCBkYXRhLCBtID0gcHJvcFsncm90YXRlJ10udG9TdHJpbmcoKS5tYXRjaCgvXigoWystXT0pPygtP1xcZCsoXFwuXFxkKyk/KSkoLispPyQvKTtcbiAgICAgICAgICAgIGlmIChtICYmIG1bNV0pIHtcbiAgICAgICAgICAgICAgICAkc2VsZiA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGluaXREYXRhKCRzZWxmKTtcbiAgICAgICAgICAgICAgICBkYXRhLnJvdGF0ZVVuaXRzID0gbVs1XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJvcFsncm90YXRlJ10gPSBtWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFuaW1hdGVQcm94aWVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn0pKGpRdWVyeSk7IiwiKGZ1bmN0aW9uICgkKSB7XG4gICAgLy8gTW9ua2V5IHBhdGNoIGpRdWVyeSAxLjMuMSsgY3NzKCkgbWV0aG9kIHRvIHN1cHBvcnQgQ1NTICd0cmFuc2Zvcm0nXG4gICAgLy8gcHJvcGVydHkgdW5pZm9ybWx5IGFjcm9zcyBTYWZhcmkvQ2hyb21lL1dlYmtpdCwgRmlyZWZveCAzLjUrLCBJRSA5KywgYW5kIE9wZXJhIDExKy5cbiAgICAvLyAyMDA5LTIwMTEgWmFjaGFyeSBKb2huc29uIHd3dy56YWNoc3Ryb25hdXQuY29tXG4gICAgLy8gVXBkYXRlZCAyMDExLjA1LjA0IChNYXkgdGhlIGZvdXJ0aCBiZSB3aXRoIHlvdSEpXG4gICAgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtUHJvcGVydHkoZWxlbWVudClcbiAgICB7XG4gICAgICAgIC8vIFRyeSB0cmFuc2Zvcm0gZmlyc3QgZm9yIGZvcndhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICAvLyBJbiBzb21lIHZlcnNpb25zIG9mIElFOSwgaXQgaXMgY3JpdGljYWwgZm9yIG1zVHJhbnNmb3JtIHRvIGJlIGluXG4gICAgICAgIC8vIHRoaXMgbGlzdCBiZWZvcmUgTW96VHJhbmZvcm0uXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gWyd0cmFuc2Zvcm0nLCAnV2Via2l0VHJhbnNmb3JtJywgJ21zVHJhbnNmb3JtJywgJ01velRyYW5zZm9ybScsICdPVHJhbnNmb3JtJ107XG4gICAgICAgIHZhciBwO1xuICAgICAgICB3aGlsZSAocCA9IHByb3BlcnRpZXMuc2hpZnQoKSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LnN0eWxlW3BdICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byB0cmFuc2Zvcm0gYWxzb1xuICAgICAgICByZXR1cm4gJ3RyYW5zZm9ybSc7XG4gICAgfVxuXG4gICAgdmFyIF9wcm9wc09iaiA9IG51bGw7XG5cbiAgICB2YXIgcHJveGllZCA9ICQuZm4uY3NzO1xuICAgICQuZm4uY3NzID0gZnVuY3Rpb24gKGFyZywgdmFsKVxuICAgIHtcbiAgICAgICAgLy8gVGVtcG9yYXJ5IHNvbHV0aW9uIGZvciBjdXJyZW50IDEuNi54IGluY29tcGF0aWJpbGl0eSwgd2hpbGVcbiAgICAgICAgLy8gcHJlc2VydmluZyAxLjMueCBjb21wYXRpYmlsaXR5LCB1bnRpbCBJIGNhbiByZXdyaXRlIHVzaW5nIENTUyBIb29rc1xuICAgICAgICBpZiAoX3Byb3BzT2JqID09PSBudWxsKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICQuY3NzUHJvcHMgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3Byb3BzT2JqID0gJC5jc3NQcm9wcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiAkLnByb3BzICE9ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9wcm9wc09iaiA9ICQucHJvcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3Byb3BzT2JqID0ge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGNvcnJlY3QgYnJvd3NlciBzcGVjaWZpYyBwcm9wZXJ0eSBhbmQgc2V0dXAgdGhlIG1hcHBpbmcgdXNpbmdcbiAgICAgICAgLy8gJC5wcm9wcyB3aGljaCBpcyB1c2VkIGludGVybmFsbHkgYnkgalF1ZXJ5LmF0dHIoKSB3aGVuIHNldHRpbmcgQ1NTXG4gICAgICAgIC8vIHByb3BlcnRpZXMgdmlhIGVpdGhlciB0aGUgY3NzKG5hbWUsIHZhbHVlKSBvciBjc3MocHJvcGVydGllcykgbWV0aG9kLlxuICAgICAgICAvLyBUaGUgcHJvYmxlbSB3aXRoIGRvaW5nIHRoaXMgb25jZSBvdXRzaWRlIG9mIGNzcygpIG1ldGhvZCBpcyB0aGF0IHlvdVxuICAgICAgICAvLyBuZWVkIGEgRE9NIG5vZGUgdG8gZmluZCB0aGUgcmlnaHQgQ1NTIHByb3BlcnR5LCBhbmQgdGhlcmUgaXMgc29tZSByaXNrXG4gICAgICAgIC8vIHRoYXQgc29tZWJvZHkgd291bGQgY2FsbCB0aGUgY3NzKCkgbWV0aG9kIGJlZm9yZSBib2R5IGhhcyBsb2FkZWQgb3IgYW55XG4gICAgICAgIC8vIERPTS1pcy1yZWFkeSBldmVudHMgaGF2ZSBmaXJlZC5cbiAgICAgICAgaWZcbiAgICAgICAgKFxuICAgICAgICAgICAgdHlwZW9mIF9wcm9wc09ialsndHJhbnNmb3JtJ10gPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgYXJnID09ICd0cmFuc2Zvcm0nXG4gICAgICAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBhcmcgPT0gJ29iamVjdCdcbiAgICAgICAgICAgICAgICAgICAgJiYgdHlwZW9mIGFyZ1sndHJhbnNmb3JtJ10gIT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3Byb3BzT2JqWyd0cmFuc2Zvcm0nXSA9IGdldFRyYW5zZm9ybVByb3BlcnR5KHRoaXMuZ2V0KDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGZvcmNlIHRoZSBwcm9wZXJ0eSBtYXBwaW5nIGhlcmUgYmVjYXVzZSBqUXVlcnkuYXR0cigpIGRvZXNcbiAgICAgICAgLy8gcHJvcGVydHkgbWFwcGluZyB3aXRoIGpRdWVyeS5wcm9wcyB3aGVuIHNldHRpbmcgYSBDU1MgcHJvcGVydHksXG4gICAgICAgIC8vIGJ1dCBjdXJDU1MoKSBkb2VzICpub3QqIGRvIHByb3BlcnR5IG1hcHBpbmcgd2hlbiAqZ2V0dGluZyogYVxuICAgICAgICAvLyBDU1MgcHJvcGVydHkuICAoSXQgcHJvYmFibHkgc2hvdWxkIHNpbmNlIGl0IG1hbnVhbGx5IGRvZXMgaXRcbiAgICAgICAgLy8gZm9yICdmbG9hdCcgbm93IGFueXdheS4uLiBidXQgdGhhdCdkIHJlcXVpcmUgbW9yZSB0ZXN0aW5nLilcbiAgICAgICAgLy9cbiAgICAgICAgLy8gQnV0LCBvbmx5IGRvIHRoZSBmb3JjZWQgbWFwcGluZyBpZiB0aGUgY29ycmVjdCBDU1MgcHJvcGVydHlcbiAgICAgICAgLy8gaXMgbm90ICd0cmFuc2Zvcm0nIGFuZCBpcyBzb21ldGhpbmcgZWxzZS5cbiAgICAgICAgaWYgKF9wcm9wc09ialsndHJhbnNmb3JtJ10gIT0gJ3RyYW5zZm9ybScpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIENhbGwgaW4gZm9ybSBvZiBjc3MoJ3RyYW5zZm9ybScgLi4uKVxuICAgICAgICAgICAgaWYgKGFyZyA9PSAndHJhbnNmb3JtJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhcmcgPSBfcHJvcHNPYmpbJ3RyYW5zZm9ybSddO1xuXG4gICAgICAgICAgICAgICAgLy8gVXNlciB3YW50cyB0byBHRVQgdGhlIHRyYW5zZm9ybSBDU1MsIGFuZCBpbiBqUXVlcnkgMS40LjNcbiAgICAgICAgICAgICAgICAvLyBjYWxscyB0byBjc3MoKSBmb3IgdHJhbnNmb3JtcyByZXR1cm4gYSBtYXRyaXggcmF0aGVyIHRoYW5cbiAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHN0cmluZyBzcGVjaWZpZWQgYnkgdGhlIHVzZXIuLi4gYXZvaWQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGJlaGF2aW9yIGFuZCByZXR1cm4gdGhlIHN0cmluZyBieSBjYWxsaW5nIGpRdWVyeS5zdHlsZSgpXG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0bHlcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PSAndW5kZWZpbmVkJyAmJiBqUXVlcnkuc3R5bGUpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4galF1ZXJ5LnN0eWxlKHRoaXMuZ2V0KDApLCBhcmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2FsbCBpbiBmb3JtIG9mIGNzcyh7J3RyYW5zZm9ybSc6IC4uLn0pXG4gICAgICAgICAgICBlbHNlIGlmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIGFyZyA9PSAnb2JqZWN0J1xuICAgICAgICAgICAgICAgICYmIHR5cGVvZiBhcmdbJ3RyYW5zZm9ybSddICE9ICd1bmRlZmluZWQnXG4gICAgICAgICAgICApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYXJnW19wcm9wc09ialsndHJhbnNmb3JtJ11dID0gYXJnWyd0cmFuc2Zvcm0nXTtcbiAgICAgICAgICAgICAgICBkZWxldGUgYXJnWyd0cmFuc2Zvcm0nXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm94aWVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn0pKGpRdWVyeSk7Il19
