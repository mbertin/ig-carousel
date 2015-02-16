(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! VelocityJS.org (1.2.1). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the browser-specific property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Velocity option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 2, patch: 1 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                } else if (/^(table)$/i.test(tagName)) {
                    return "table";
                } else if (/^(tbody)$/i.test(tagName)) {
                    return "table-row-group";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                    if (property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties || arguments[0].p;
            options = arguments[0].options || arguments[0].o;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop and finish actions do not accept animation options, and are therefore excluded from this check. */
        if (!/^(stop|finish)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "finish":
            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                               clear calls associated with the relevant queue. */
                            /* Call stopping logic works as follows:
                               - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                               - options === undefined --> stop current queue:"" call and all queue:false calls.
                               - options === false --> stop only queue:false calls.
                               - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                            var queueName = (options === undefined) ? "" : options;

                            if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {                                
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. */
                                    if (options === true || Type.isString(options)) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, Type.isString(options) ? options : "", []);
                                    }

                                    if (propertiesMap === "stop") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                           changed to reflect the final value that the elements were actually tweened to. */
                                        /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                           object. Also, queue:false animations can't be reversed. */
                                        if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                            $.each(Data(element).tweensContainer, function(m, activeTween) {
                                                activeTween.endValue = activeTween.currentValue;
                                            });
                                        }

                                        callsToStop.push(i);
                                    } else if (propertiesMap === "finish") {
                                        /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                        they finish upon the next rAf tick then proceed with normal call completion logic. */
                                        activeCall[2].duration = 1;
                                    }
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                if (propertiesMap === "stop") {
                    $.each(callsToStop, function(i, j) {
                        completeCall(j, true);
                    });

                    if (promiseData.promise) {
                        /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                        promiseData.resolver(elements);
                    }
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            var callsLength = Velocity.State.calls.length;

            /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
               when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
               has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
            if (callsLength > 10000) {
                Velocity.State.calls = compactSparseArray(Velocity.State.calls);
            }

            /* Iterate through each active call. */
            for (var i = 0; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart,
                    tweenDummyValue = null;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                var tweenDelta = tween.endValue - tween.startValue;
                                currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                               it can be passed into the progress callback. */ 
                            if (property === "tween") {
                                tweenDummyValue = currentValue;
                            } else {
                                /******************
                                   Hooks: Part I
                                ******************/

                                /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                   for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                   rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                   updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                   subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                if (CSS.Hooks.registered[property]) {
                                    var hookRoot = CSS.Hooks.getRoot(property),
                                        rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                    if (rootPropertyValueCache) {
                                        tween.rootPropertyValue = rootPropertyValueCache;
                                    }
                                }

                                /*****************
                                    DOM Update
                                *****************/

                                /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                           property,
                                                                           tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                           tween.rootPropertyValue,
                                                                           tween.scrollData);

                                /*******************
                                   Hooks: Part II
                                *******************/

                                /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                if (CSS.Hooks.registered[property]) {
                                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                    if (CSS.Normalizations.registered[hookRoot]) {
                                        Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                    } else {
                                        Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                    }
                                }

                                /***************
                                   Transforms
                                ***************/

                                /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                if (adjustedSetData[0] === "transform") {
                                    transformPropertyExists = true;
                                }

                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }

                /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart,
                                       tweenDummyValue);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }

                    if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 100;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
},{}],2:[function(require,module,exports){
module.exports = ['$timeout', '$interval', '$compile', 'IGCarouselService', function($timeout, $interval, $compile, IGCarouselService) {

        // Constants
        var defaultOptions = {
            autoSlide: true,
            transitionDuration: 1000, //in ms
            slideDuration: 3, //in sec
            itemDisplayed: 5, //item displayed in the same time
            rtl: true,//right to left
        };

        var deltaZ = 100,
            minScale = 0.8;

        //
        var containerElement = null,
            itemsElements = [],
            itemsToDisplay = [],
            indexToDisplay = 0,
            deltaX = 0,
            deltaScale = 0.0,
            lastItems = [],
            interval,
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
                    if(angular.isDefined(interval)) {
                        $interval.cancel(interval);
                    }
                    move(index);
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

                $(item).mouseover(function () {
                    if(angular.isDefined(interval)){
                        $interval.cancel(interval);
                    }
                });
                $(item).mouseleave(function () {
                    if(options.autoSlide){
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
                    item.style.transform = "scale(minScale)";
                }
                else {
                    var itemIndex = itemsToDisplay.indexOf(item.id);
                    item.style.left = (itemIndex * deltaX) + "px";
                    item.style['z-index'] = (centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;
                    item.style.transform = "scale(" + (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)) + ")";
                    item.style.display = "block";
                }
            });
        }



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
            var duration = options.transitionDuration  - (nbStep * 30);
            var timeoutDelay = 0;

            var timeFunc = function () {
                if(tmpRtl) {
                    moveRTL(duration);
                }
                else {
                    moveLTR(duration);
                }

                if(options.autoSlide && (indexToDisplay === newIndex) ){
                    if(angular.isDefined(interval)) {
                        $interval.cancel(interval);
                    }
                    interval = runInterval();
                }
            };

            //Repeat move element in function of nbStep
            for(var i = 0 ; i < nbStep ; i++) {
                $timeout(timeFunc, timeoutDelay);
                timeoutDelay = duration;
                duration = options.transitionDuration  - ((nbStep - i) * 30);
            }

        }

         /**
         * Move items from Right To Left (RTL)
         * @param  integer duration the animation duration in ms
         */
        function moveRTL(duration) {

            indexToDisplay = indexToDisplay + 1 >= itemsElements.length ? 0 : indexToDisplay + 1;

            selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

            $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var leftPos = (itemIndex * deltaX);
                var newScale = (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));
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

        /**
         * Move items from Left To Right (LTR)
         * @param  integer duration the animation duration in ms
         */
        function moveLTR(duration) {

            indexToDisplay = ((indexToDisplay - 1) < 0) ? itemsElements.length - 1 : indexToDisplay - 1;

            selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
            var centerIndex = itemsToDisplay.indexOf(itemsElements[indexToDisplay].id);
            var itemDisplayed = itemsElements[indexToDisplay];

             $.each(itemsElements, function(index, item) {

                var itemIndex = itemsToDisplay.indexOf(item.id);
                var zIndex = (centerIndex - Math.abs(itemIndex - centerIndex)) * deltaZ;
                var changedZIndex = false;
                var leftPos = (itemIndex * deltaX);
                var newScale = (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale));

                if(itemsToDisplay.indexOf(item.id) > -1 && lastItems.indexOf(item.id) > -1) { // Was displayed before and still displayed

                    $(item).velocity({
                        left: leftPos,
                        scale: newScale,
                    }, {
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
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
                            scale: (minScale + ((centerIndex - Math.abs(itemIndex - centerIndex)) * deltaScale)),
                            opacity: 1,
                        },{
                             /* Wait 100ms before alternating back. */
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

                    item.style['z-index']  = - 1;

                    $(item).velocity({
                            left: ($(containerElement).width()/4) + "px",
                            opacity: 0,
                        },{
                             /* Wait 100ms before alternating back. */
                        duration: duration,
                        progress: function(elements, complete, remaining, start, tweenValue) {
                            if(complete * 100 > 50 && !changedZIndex) {
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

        /**
         * Run interval in order to auto slide
         */
        function runInterval(){
            return $interval(function() {
                if(options.rtl) {
                    moveRTL(options.transitionDuration);
                }
                else {
                    moveLTR(options.transitionDuration);
                }
            }, options.slideDuration * 1000);
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

                //Timeout needed in order to force digest so generate ng-repeat elements
                $timeout(function (){
                    itemsElements = $(element).children();
                    initItems(scope);
                    selectItemsToDisplay(indexToDisplay, options.itemDisplayed);
                    initItemsStyle();

                    //Call in order to avoid UI bug on first call.
                    containerElement.style.display = "none";
                    for(var i = 0 ; i < itemsElements.length ; i ++ ) {
                        $timeout(moveRTL(0), 0);
                    }
                    $timeout(function() {
                        containerElement.style.display = "block";
                    }, 200);

                    // Run auto slide if needed
                    if(options.autoSlide) {
                        interval = runInterval();
                    }
                },0);
            }
        };
    }];
},{}],3:[function(require,module,exports){
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

},{"../bower_components/velocity/velocity.js":1,"./directives/ig-carousel":2,"./services/IGCarouselService":4}],4:[function(require,module,exports){
/**
 * Service that will give the image url corresponding to a category identified by his ID
 */
module.exports = [function () {

    var IGCarouselService = function() {};

    /**
     * Define the style of the category item if it's selected by setting the associated background define in category.color
     * @param category, the category to style
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

        if(leftCursor === newIndex) {
            diff = diff * -1;
        }

        return diff;
    };

    return IGCarouselService;
}];
},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9NYXR0L0Rldi9pZy1jYXJvdXNlbC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvTWF0dC9EZXYvaWctY2Fyb3VzZWwvYm93ZXJfY29tcG9uZW50cy92ZWxvY2l0eS92ZWxvY2l0eS5qcyIsIi9Vc2Vycy9NYXR0L0Rldi9pZy1jYXJvdXNlbC9zcmMvZGlyZWN0aXZlcy9pZy1jYXJvdXNlbC5qcyIsIi9Vc2Vycy9NYXR0L0Rldi9pZy1jYXJvdXNlbC9zcmMvZmFrZV82NzA4MzIwLmpzIiwiL1VzZXJzL01hdHQvRGV2L2lnLWNhcm91c2VsL3NyYy9zZXJ2aWNlcy9JR0Nhcm91c2VsU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohIFZlbG9jaXR5SlMub3JnICgxLjIuMSkuIChDKSAyMDE0IEp1bGlhbiBTaGFwaXJvLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICBWZWxvY2l0eSBqUXVlcnkgU2hpbVxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuLyohIFZlbG9jaXR5SlMub3JnIGpRdWVyeSBTaGltICgxLjAuMSkuIChDKSAyMDE0IFRoZSBqUXVlcnkgRm91bmRhdGlvbi4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UuICovXHJcblxyXG4vKiBUaGlzIGZpbGUgY29udGFpbnMgdGhlIGpRdWVyeSBmdW5jdGlvbnMgdGhhdCBWZWxvY2l0eSByZWxpZXMgb24sIHRoZXJlYnkgcmVtb3ZpbmcgVmVsb2NpdHkncyBkZXBlbmRlbmN5IG9uIGEgZnVsbCBjb3B5IG9mIGpRdWVyeSwgYW5kIGFsbG93aW5nIGl0IHRvIHdvcmsgaW4gYW55IGVudmlyb25tZW50LiAqL1xyXG4vKiBUaGVzZSBzaGltbWVkIGZ1bmN0aW9ucyBhcmUgb25seSB1c2VkIGlmIGpRdWVyeSBpc24ndCBwcmVzZW50LiBJZiBib3RoIHRoaXMgc2hpbSBhbmQgalF1ZXJ5IGFyZSBsb2FkZWQsIFZlbG9jaXR5IGRlZmF1bHRzIHRvIGpRdWVyeSBwcm9wZXIuICovXHJcbi8qIEJyb3dzZXIgc3VwcG9ydDogVXNpbmcgdGhpcyBzaGltIGluc3RlYWQgb2YgalF1ZXJ5IHByb3BlciByZW1vdmVzIHN1cHBvcnQgZm9yIElFOC4gKi9cclxuXHJcbjsoZnVuY3Rpb24gKHdpbmRvdykge1xyXG4gICAgLyoqKioqKioqKioqKioqKlxyXG4gICAgICAgICBTZXR1cFxyXG4gICAgKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIElmIGpRdWVyeSBpcyBhbHJlYWR5IGxvYWRlZCwgdGhlcmUncyBubyBwb2ludCBpbiBsb2FkaW5nIHRoaXMgc2hpbS4gKi9cclxuICAgIGlmICh3aW5kb3cualF1ZXJ5KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qIGpRdWVyeSBiYXNlLiAqL1xyXG4gICAgdmFyICQgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm4gbmV3ICQuZm4uaW5pdChzZWxlY3RvciwgY29udGV4dCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgUHJpdmF0ZSBNZXRob2RzXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBqUXVlcnkgKi9cclxuICAgICQuaXNXaW5kb3cgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cclxuICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIGpRdWVyeSAqL1xyXG4gICAgJC50eXBlID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIGlmIChvYmogPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqICsgXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XHJcbiAgICAgICAgICAgIGNsYXNzMnR5cGVbdG9TdHJpbmcuY2FsbChvYmopXSB8fCBcIm9iamVjdFwiIDpcclxuICAgICAgICAgICAgdHlwZW9mIG9iajtcclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICAkLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICByZXR1cm4gJC50eXBlKG9iaikgPT09IFwiYXJyYXlcIjtcclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICBmdW5jdGlvbiBpc0FycmF5bGlrZSAob2JqKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGgsXHJcbiAgICAgICAgICAgIHR5cGUgPSAkLnR5cGUob2JqKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fCAkLmlzV2luZG93KG9iaikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iai5ub2RlVHlwZSA9PT0gMSAmJiBsZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHlwZSA9PT0gXCJhcnJheVwiIHx8IGxlbmd0aCA9PT0gMCB8fCB0eXBlb2YgbGVuZ3RoID09PSBcIm51bWJlclwiICYmIGxlbmd0aCA+IDAgJiYgKGxlbmd0aCAtIDEpIGluIG9iajtcclxuICAgIH1cclxuXHJcbiAgICAvKioqKioqKioqKioqKioqXHJcbiAgICAgICAkIE1ldGhvZHNcclxuICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBqUXVlcnk6IFN1cHBvcnQgcmVtb3ZlZCBmb3IgSUU8OS4gKi9cclxuICAgICQuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICB2YXIga2V5O1xyXG5cclxuICAgICAgICBpZiAoIW9iaiB8fCAkLnR5cGUob2JqKSAhPT0gXCJvYmplY3RcIiB8fCBvYmoubm9kZVR5cGUgfHwgJC5pc1dpbmRvdyhvYmopKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChvYmouY29uc3RydWN0b3IgJiZcclxuICAgICAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmosIFwiY29uc3RydWN0b3JcIikgJiZcclxuICAgICAgICAgICAgICAgICFoYXNPd24uY2FsbChvYmouY29uc3RydWN0b3IucHJvdG90eXBlLCBcImlzUHJvdG90eXBlT2ZcIikpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7fVxyXG5cclxuICAgICAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgaGFzT3duLmNhbGwob2JqLCBrZXkpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBqUXVlcnkgKi9cclxuICAgICQuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgY2FsbGJhY2ssIGFyZ3MpIHtcclxuICAgICAgICB2YXIgdmFsdWUsXHJcbiAgICAgICAgICAgIGkgPSAwLFxyXG4gICAgICAgICAgICBsZW5ndGggPSBvYmoubGVuZ3RoLFxyXG4gICAgICAgICAgICBpc0FycmF5ID0gaXNBcnJheWxpa2Uob2JqKTtcclxuXHJcbiAgICAgICAgaWYgKGFyZ3MpIHtcclxuICAgICAgICAgICAgaWYgKGlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KG9ialtpXSwgYXJncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2suYXBwbHkob2JqW2ldLCBhcmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH07XHJcblxyXG4gICAgLyogQ3VzdG9tICovXHJcbiAgICAkLmRhdGEgPSBmdW5jdGlvbiAobm9kZSwga2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIC8qICQuZ2V0RGF0YSgpICovXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gbm9kZVskLmV4cGFuZG9dLFxyXG4gICAgICAgICAgICAgICAgc3RvcmUgPSBpZCAmJiBjYWNoZVtpZF07XHJcblxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSBpbiBzdG9yZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgLyogJC5zZXREYXRhKCkgKi9cclxuICAgICAgICB9IGVsc2UgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSB8fCAobm9kZVskLmV4cGFuZG9dID0gKyskLnV1aWQpO1xyXG5cclxuICAgICAgICAgICAgY2FjaGVbaWRdID0gY2FjaGVbaWRdIHx8IHt9O1xyXG4gICAgICAgICAgICBjYWNoZVtpZF1ba2V5XSA9IHZhbHVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyogQ3VzdG9tICovXHJcbiAgICAkLnJlbW92ZURhdGEgPSBmdW5jdGlvbiAobm9kZSwga2V5cykge1xyXG4gICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSxcclxuICAgICAgICAgICAgc3RvcmUgPSBpZCAmJiBjYWNoZVtpZF07XHJcblxyXG4gICAgICAgIGlmIChzdG9yZSkge1xyXG4gICAgICAgICAgICAkLmVhY2goa2V5cywgZnVuY3Rpb24oXywga2V5KSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3RvcmVba2V5XTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKiBqUXVlcnkgKi9cclxuICAgICQuZXh0ZW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzcmMsIGNvcHlJc0FycmF5LCBjb3B5LCBuYW1lLCBvcHRpb25zLCBjbG9uZSxcclxuICAgICAgICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LFxyXG4gICAgICAgICAgICBpID0gMSxcclxuICAgICAgICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgZGVlcCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgICAgICAgZGVlcCA9IHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXSB8fCB7fTtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09IFwib2JqZWN0XCIgJiYgJC50eXBlKHRhcmdldCkgIT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0YXJnZXQgPSB7fTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpID09PSBsZW5ndGgpIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICAgICAgaS0tO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoKG9wdGlvbnMgPSBhcmd1bWVudHNbaV0pICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjID0gdGFyZ2V0W25hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zW25hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBjb3B5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXAgJiYgY29weSAmJiAoJC5pc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9ICQuaXNBcnJheShjb3B5KSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3B5SXNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmICQuaXNBcnJheShzcmMpID8gc3JjIDogW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgJC5pc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gJC5leHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5IDEuNC4zICovXHJcbiAgICAkLnF1ZXVlID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGRhdGEpIHtcclxuICAgICAgICBmdW5jdGlvbiAkbWFrZUFycmF5IChhcnIsIHJlc3VsdHMpIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IHJlc3VsdHMgfHwgW107XHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5bGlrZShPYmplY3QoYXJyKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiAkLm1lcmdlICovXHJcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gZmlyc3QubGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbaisrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiAhPT0gbGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc2Vjb25kW2pdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpcnN0Lmxlbmd0aCA9IGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkocmV0LCB0eXBlb2YgYXJyID09PSBcInN0cmluZ1wiID8gW2Fycl0gOiBhcnIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBbXS5wdXNoLmNhbGwocmV0LCBhcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFlbGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHR5cGUgPSAodHlwZSB8fCBcImZ4XCIpICsgXCJxdWV1ZVwiO1xyXG5cclxuICAgICAgICB2YXIgcSA9ICQuZGF0YShlbGVtLCB0eXBlKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBxIHx8IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFxIHx8ICQuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgICAgICBxID0gJC5kYXRhKGVsZW0sIHR5cGUsICRtYWtlQXJyYXkoZGF0YSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHEucHVzaChkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBqUXVlcnkgMS40LjMgKi9cclxuICAgICQuZGVxdWV1ZSA9IGZ1bmN0aW9uIChlbGVtcywgdHlwZSkge1xyXG4gICAgICAgIC8qIEN1c3RvbTogRW1iZWQgZWxlbWVudCBpdGVyYXRpb24uICovXHJcbiAgICAgICAgJC5lYWNoKGVsZW1zLm5vZGVUeXBlID8gWyBlbGVtcyBdIDogZWxlbXMsIGZ1bmN0aW9uKGksIGVsZW0pIHtcclxuICAgICAgICAgICAgdHlwZSA9IHR5cGUgfHwgXCJmeFwiO1xyXG5cclxuICAgICAgICAgICAgdmFyIHF1ZXVlID0gJC5xdWV1ZShlbGVtLCB0eXBlKSxcclxuICAgICAgICAgICAgICAgIGZuID0gcXVldWUuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChmbiA9PT0gXCJpbnByb2dyZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIGZuID0gcXVldWUuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJmeFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVldWUudW5zaGlmdChcImlucHJvZ3Jlc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm4uY2FsbChlbGVtLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAkLmZuIE1ldGhvZHNcclxuICAgICoqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBqUXVlcnkgKi9cclxuICAgICQuZm4gPSAkLnByb3RvdHlwZSA9IHtcclxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcclxuICAgICAgICAgICAgLyogSnVzdCByZXR1cm4gdGhlIGVsZW1lbnQgd3JhcHBlZCBpbnNpZGUgYW4gYXJyYXk7IGRvbid0IHByb2NlZWQgd2l0aCB0aGUgYWN0dWFsIGpRdWVyeSBub2RlIHdyYXBwaW5nIHByb2Nlc3MuICovXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3Rvci5ub2RlVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1swXSA9IHNlbGVjdG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgRE9NIG5vZGUuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb2Zmc2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qIGpRdWVyeSBhbHRlcmVkIGNvZGU6IERyb3BwZWQgZGlzY29ubmVjdGVkIERPTSBub2RlIGNoZWNraW5nLiAqL1xyXG4gICAgICAgICAgICB2YXIgYm94ID0gdGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPyB0aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogeyB0b3A6IDAsIGxlZnQ6IDAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IGJveC50b3AgKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LnNjcm9sbFRvcCAgfHwgMCkgIC0gKGRvY3VtZW50LmNsaWVudFRvcCAgfHwgMCksXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiBib3gubGVmdCArICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuc2Nyb2xsTGVmdCAgfHwgMCkgLSAoZG9jdW1lbnQuY2xpZW50TGVmdCB8fCAwKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8qIGpRdWVyeSAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvZmZzZXRQYXJlbnQoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0UGFyZW50ID0gdGhpcy5vZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG9mZnNldFBhcmVudCAmJiAoIW9mZnNldFBhcmVudC5ub2RlVHlwZS50b0xvd2VyQ2FzZSA9PT0gXCJodG1sXCIgJiYgb2Zmc2V0UGFyZW50LnN0eWxlLnBvc2l0aW9uID09PSBcInN0YXRpY1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldFBhcmVudCB8fCBkb2N1bWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogWmVwdG8gKi9cclxuICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzWzBdLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50LmFwcGx5KGVsZW0pLFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5vZmZzZXQoKSxcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldCA9IC9eKD86Ym9keXxodG1sKSQvaS50ZXN0KG9mZnNldFBhcmVudC5ub2RlTmFtZSkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogJChvZmZzZXRQYXJlbnQpLm9mZnNldCgpXHJcblxyXG4gICAgICAgICAgICBvZmZzZXQudG9wIC09IHBhcnNlRmxvYXQoZWxlbS5zdHlsZS5tYXJnaW5Ub3ApIHx8IDA7XHJcbiAgICAgICAgICAgIG9mZnNldC5sZWZ0IC09IHBhcnNlRmxvYXQoZWxlbS5zdHlsZS5tYXJnaW5MZWZ0KSB8fCAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9mZnNldFBhcmVudC5zdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50T2Zmc2V0LnRvcCArPSBwYXJzZUZsb2F0KG9mZnNldFBhcmVudC5zdHlsZS5ib3JkZXJUb3BXaWR0aCkgfHwgMFxyXG4gICAgICAgICAgICAgICAgcGFyZW50T2Zmc2V0LmxlZnQgKz0gcGFyc2VGbG9hdChvZmZzZXRQYXJlbnQuc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSB8fCAwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IG9mZnNldC50b3AgLSBwYXJlbnRPZmZzZXQudG9wLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgIFByaXZhdGUgVmFyaWFibGVzXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIEZvciAkLmRhdGEoKSAqL1xyXG4gICAgdmFyIGNhY2hlID0ge307XHJcbiAgICAkLmV4cGFuZG8gPSBcInZlbG9jaXR5XCIgKyAobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG4gICAgJC51dWlkID0gMDtcclxuXHJcbiAgICAvKiBGb3IgJC5xdWV1ZSgpICovXHJcbiAgICB2YXIgY2xhc3MydHlwZSA9IHt9LFxyXG4gICAgICAgIGhhc093biA9IGNsYXNzMnR5cGUuaGFzT3duUHJvcGVydHksXHJcbiAgICAgICAgdG9TdHJpbmcgPSBjbGFzczJ0eXBlLnRvU3RyaW5nO1xyXG5cclxuICAgIHZhciB0eXBlcyA9IFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjbGFzczJ0eXBlW1wiW29iamVjdCBcIiArIHR5cGVzW2ldICsgXCJdXCJdID0gdHlwZXNbaV0udG9Mb3dlckNhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBNYWtlcyAkKG5vZGUpIHBvc3NpYmxlLCB3aXRob3V0IGhhdmluZyB0byBjYWxsIGluaXQuICovXHJcbiAgICAkLmZuLmluaXQucHJvdG90eXBlID0gJC5mbjtcclxuXHJcbiAgICAvKiBHbG9iYWxpemUgVmVsb2NpdHkgb250byB0aGUgd2luZG93LCBhbmQgYXNzaWduIGl0cyBVdGlsaXRpZXMgcHJvcGVydHkuICovXHJcbiAgICB3aW5kb3cuVmVsb2NpdHkgPSB7IFV0aWxpdGllczogJCB9O1xyXG59KSh3aW5kb3cpO1xuXG4vKioqKioqKioqKioqKioqKioqXG4gICAgVmVsb2NpdHkuanNcbioqKioqKioqKioqKioqKioqKi9cblxuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIC8qIENvbW1vbkpTIG1vZHVsZS4gKi9cbiAgICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgLyogQU1EIG1vZHVsZS4gKi9cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcbiAgICAvKiBCcm93c2VyIGdsb2JhbHMuICovXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeSgpO1xuICAgIH1cbn0oZnVuY3Rpb24oKSB7XG5yZXR1cm4gZnVuY3Rpb24gKGdsb2JhbCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cbiAgICAvKioqKioqKioqKioqKioqXG4gICAgICAgIFN1bW1hcnlcbiAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAvKlxuICAgIC0gQ1NTOiBDU1Mgc3RhY2sgdGhhdCB3b3JrcyBpbmRlcGVuZGVudGx5IGZyb20gdGhlIHJlc3Qgb2YgVmVsb2NpdHkuXG4gICAgLSBhbmltYXRlKCk6IENvcmUgYW5pbWF0aW9uIG1ldGhvZCB0aGF0IGl0ZXJhdGVzIG92ZXIgdGhlIHRhcmdldGVkIGVsZW1lbnRzIGFuZCBxdWV1ZXMgdGhlIGluY29taW5nIGNhbGwgb250byBlYWNoIGVsZW1lbnQgaW5kaXZpZHVhbGx5LlxuICAgICAgLSBQcmUtUXVldWVpbmc6IFByZXBhcmUgdGhlIGVsZW1lbnQgZm9yIGFuaW1hdGlvbiBieSBpbnN0YW50aWF0aW5nIGl0cyBkYXRhIGNhY2hlIGFuZCBwcm9jZXNzaW5nIHRoZSBjYWxsJ3Mgb3B0aW9ucy5cbiAgICAgIC0gUXVldWVpbmc6IFRoZSBsb2dpYyB0aGF0IHJ1bnMgb25jZSB0aGUgY2FsbCBoYXMgcmVhY2hlZCBpdHMgcG9pbnQgb2YgZXhlY3V0aW9uIGluIHRoZSBlbGVtZW50J3MgJC5xdWV1ZSgpIHN0YWNrLlxuICAgICAgICAgICAgICAgICAgTW9zdCBsb2dpYyBpcyBwbGFjZWQgaGVyZSB0byBhdm9pZCByaXNraW5nIGl0IGJlY29taW5nIHN0YWxlIChpZiB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMgaGF2ZSBjaGFuZ2VkKS5cbiAgICAgIC0gUHVzaGluZzogQ29uc29saWRhdGlvbiBvZiB0aGUgdHdlZW4gZGF0YSBmb2xsb3dlZCBieSBpdHMgcHVzaCBvbnRvIHRoZSBnbG9iYWwgaW4tcHJvZ3Jlc3MgY2FsbHMgY29udGFpbmVyLlxuICAgIC0gdGljaygpOiBUaGUgc2luZ2xlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wIHJlc3BvbnNpYmxlIGZvciB0d2VlbmluZyBhbGwgaW4tcHJvZ3Jlc3MgY2FsbHMuXG4gICAgLSBjb21wbGV0ZUNhbGwoKTogSGFuZGxlcyB0aGUgY2xlYW51cCBwcm9jZXNzIGZvciBlYWNoIFZlbG9jaXR5IGNhbGwuXG4gICAgKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICBIZWxwZXIgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogSUUgZGV0ZWN0aW9uLiBHaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qdWxpYW5zaGFwaXJvLzkwOTg2MDkgKi9cbiAgICB2YXIgSUUgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudE1vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gNzsgaSA+IDQ7IGktLSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICAgICAgZGl2LmlubmVySFRNTCA9IFwiPCEtLVtpZiBJRSBcIiArIGkgKyBcIl0+PHNwYW4+PC9zcGFuPjwhW2VuZGlmXS0tPlwiO1xuXG4gICAgICAgICAgICAgICAgaWYgKGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdiA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9KSgpO1xuXG4gICAgLyogckFGIHNoaW0uIEdpc3Q6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2p1bGlhbnNoYXBpcm8vOTQ5NzUxMyAqL1xuICAgIHZhciByQUZTaGltID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdGltZUxhc3QgPSAwO1xuXG4gICAgICAgIHJldHVybiB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciB0aW1lQ3VycmVudCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgdGltZURlbHRhO1xuXG4gICAgICAgICAgICAvKiBEeW5hbWljYWxseSBzZXQgZGVsYXkgb24gYSBwZXItdGljayBiYXNpcyB0byBtYXRjaCA2MGZwcy4gKi9cbiAgICAgICAgICAgIC8qIFRlY2huaXF1ZSBieSBFcmlrIE1vbGxlci4gTUlUIGxpY2Vuc2U6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxICovXG4gICAgICAgICAgICB0aW1lRGVsdGEgPSBNYXRoLm1heCgwLCAxNiAtICh0aW1lQ3VycmVudCAtIHRpbWVMYXN0KSk7XG4gICAgICAgICAgICB0aW1lTGFzdCA9IHRpbWVDdXJyZW50ICsgdGltZURlbHRhO1xuXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodGltZUN1cnJlbnQgKyB0aW1lRGVsdGEpOyB9LCB0aW1lRGVsdGEpO1xuICAgICAgICB9O1xuICAgIH0pKCk7XG5cbiAgICAvKiBBcnJheSBjb21wYWN0aW5nLiBDb3B5cmlnaHQgTG8tRGFzaC4gTUlUIExpY2Vuc2U6IGh0dHBzOi8vZ2l0aHViLmNvbS9sb2Rhc2gvbG9kYXNoL2Jsb2IvbWFzdGVyL0xJQ0VOU0UudHh0ICovXG4gICAgZnVuY3Rpb24gY29tcGFjdFNwYXJzZUFycmF5IChhcnJheSkge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2FuaXRpemVFbGVtZW50cyAoZWxlbWVudHMpIHtcbiAgICAgICAgLyogVW53cmFwIGpRdWVyeS9aZXB0byBvYmplY3RzLiAqL1xuICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQoZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBlbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZWxlbWVudHMpO1xuICAgICAgICAvKiBXcmFwIGEgc2luZ2xlIGVsZW1lbnQgaW4gYW4gYXJyYXkgc28gdGhhdCAkLmVhY2goKSBjYW4gaXRlcmF0ZSB3aXRoIHRoZSBlbGVtZW50IGluc3RlYWQgb2YgaXRzIG5vZGUncyBjaGlsZHJlbi4gKi9cbiAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzTm9kZShlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIH1cblxuICAgIHZhciBUeXBlID0ge1xuICAgICAgICBpc1N0cmluZzogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiB2YXJpYWJsZSA9PT0gXCJzdHJpbmdcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICAgICAgICB9LFxuICAgICAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGlzTm9kZTogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFyaWFibGUgJiYgdmFyaWFibGUubm9kZVR5cGU7XG4gICAgICAgIH0sXG4gICAgICAgIC8qIENvcHlyaWdodCBNYXJ0aW4gQm9obS4gTUlUIExpY2Vuc2U6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL1RvbWFsYWsvODE4YTc4YTIyNmEwNzM4ZWFhZGUgKi9cbiAgICAgICAgaXNOb2RlTGlzdDogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhcmlhYmxlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgL15cXFtvYmplY3QgKEhUTUxDb2xsZWN0aW9ufE5vZGVMaXN0fE9iamVjdClcXF0kLy50ZXN0KE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkpICYmXG4gICAgICAgICAgICAgICAgdmFyaWFibGUubGVuZ3RoICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICAgICAodmFyaWFibGUubGVuZ3RoID09PSAwIHx8ICh0eXBlb2YgdmFyaWFibGVbMF0gPT09IFwib2JqZWN0XCIgJiYgdmFyaWFibGVbMF0ubm9kZVR5cGUgPiAwKSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qIERldGVybWluZSBpZiB2YXJpYWJsZSBpcyBhIHdyYXBwZWQgalF1ZXJ5IG9yIFplcHRvIGVsZW1lbnQuICovXG4gICAgICAgIGlzV3JhcHBlZDogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFyaWFibGUgJiYgKHZhcmlhYmxlLmpxdWVyeSB8fCAod2luZG93LlplcHRvICYmIHdpbmRvdy5aZXB0by56ZXB0by5pc1oodmFyaWFibGUpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzU1ZHOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuU1ZHRWxlbWVudCAmJiAodmFyaWFibGUgaW5zdGFuY2VvZiB3aW5kb3cuU1ZHRWxlbWVudCk7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB2YXJpYWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgRGVwZW5kZW5jaWVzXG4gICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgJCxcbiAgICAgICAgaXNKUXVlcnkgPSBmYWxzZTtcblxuICAgIGlmIChnbG9iYWwuZm4gJiYgZ2xvYmFsLmZuLmpxdWVyeSkge1xuICAgICAgICAkID0gZ2xvYmFsO1xuICAgICAgICBpc0pRdWVyeSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCA9IHdpbmRvdy5WZWxvY2l0eS5VdGlsaXRpZXM7XG4gICAgfVxuXG4gICAgaWYgKElFIDw9IDggJiYgIWlzSlF1ZXJ5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZlbG9jaXR5OiBJRTggYW5kIGJlbG93IHJlcXVpcmUgalF1ZXJ5IHRvIGJlIGxvYWRlZCBiZWZvcmUgVmVsb2NpdHkuXCIpO1xuICAgIH0gZWxzZSBpZiAoSUUgPD0gNykge1xuICAgICAgICAvKiBSZXZlcnQgdG8galF1ZXJ5J3MgJC5hbmltYXRlKCksIGFuZCBsb3NlIFZlbG9jaXR5J3MgZXh0cmEgZmVhdHVyZXMuICovXG4gICAgICAgIGpRdWVyeS5mbi52ZWxvY2l0eSA9IGpRdWVyeS5mbi5hbmltYXRlO1xuXG4gICAgICAgIC8qIE5vdyB0aGF0ICQuZm4udmVsb2NpdHkgaXMgYWxpYXNlZCwgYWJvcnQgdGhpcyBWZWxvY2l0eSBkZWNsYXJhdGlvbi4gKi9cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBEVVJBVElPTl9ERUZBVUxUID0gNDAwLFxuICAgICAgICBFQVNJTkdfREVGQVVMVCA9IFwic3dpbmdcIjtcblxuICAgIC8qKioqKioqKioqKioqXG4gICAgICAgIFN0YXRlXG4gICAgKioqKioqKioqKioqKi9cblxuICAgIHZhciBWZWxvY2l0eSA9IHtcbiAgICAgICAgLyogQ29udGFpbmVyIGZvciBwYWdlLXdpZGUgVmVsb2NpdHkgc3RhdGUgZGF0YS4gKi9cbiAgICAgICAgU3RhdGU6IHtcbiAgICAgICAgICAgIC8qIERldGVjdCBtb2JpbGUgZGV2aWNlcyB0byBkZXRlcm1pbmUgaWYgbW9iaWxlSEEgc2hvdWxkIGJlIHR1cm5lZCBvbi4gKi9cbiAgICAgICAgICAgIGlzTW9iaWxlOiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICAgICAgICAvKiBUaGUgbW9iaWxlSEEgb3B0aW9uJ3MgYmVoYXZpb3IgY2hhbmdlcyBvbiBvbGRlciBBbmRyb2lkIGRldmljZXMgKEdpbmdlcmJyZWFkLCB2ZXJzaW9ucyAyLjMuMy0yLjMuNykuICovXG4gICAgICAgICAgICBpc0FuZHJvaWQ6IC9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgIGlzR2luZ2VyYnJlYWQ6IC9BbmRyb2lkIDJcXC4zXFwuWzMtN10vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNDaHJvbWU6IHdpbmRvdy5jaHJvbWUsXG4gICAgICAgICAgICBpc0ZpcmVmb3g6IC9GaXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgIC8qIENyZWF0ZSBhIGNhY2hlZCBlbGVtZW50IGZvciByZS11c2Ugd2hlbiBjaGVja2luZyBmb3IgQ1NTIHByb3BlcnR5IHByZWZpeGVzLiAqL1xuICAgICAgICAgICAgcHJlZml4RWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSxcbiAgICAgICAgICAgIC8qIENhY2hlIGV2ZXJ5IHByZWZpeCBtYXRjaCB0byBhdm9pZCByZXBlYXRpbmcgbG9va3Vwcy4gKi9cbiAgICAgICAgICAgIHByZWZpeE1hdGNoZXM6IHt9LFxuICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGFuY2hvciB1c2VkIGZvciBhbmltYXRpbmcgd2luZG93IHNjcm9sbGluZy4gKi9cbiAgICAgICAgICAgIHNjcm9sbEFuY2hvcjogbnVsbCxcbiAgICAgICAgICAgIC8qIENhY2hlIHRoZSBicm93c2VyLXNwZWNpZmljIHByb3BlcnR5IG5hbWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2Nyb2xsIGFuY2hvci4gKi9cbiAgICAgICAgICAgIHNjcm9sbFByb3BlcnR5TGVmdDogbnVsbCxcbiAgICAgICAgICAgIHNjcm9sbFByb3BlcnR5VG9wOiBudWxsLFxuICAgICAgICAgICAgLyogS2VlcCB0cmFjayBvZiB3aGV0aGVyIG91ciBSQUYgdGljayBpcyBydW5uaW5nLiAqL1xuICAgICAgICAgICAgaXNUaWNraW5nOiBmYWxzZSxcbiAgICAgICAgICAgIC8qIENvbnRhaW5lciBmb3IgZXZlcnkgaW4tcHJvZ3Jlc3MgY2FsbCB0byBWZWxvY2l0eS4gKi9cbiAgICAgICAgICAgIGNhbGxzOiBbXVxuICAgICAgICB9LFxuICAgICAgICAvKiBWZWxvY2l0eSdzIGN1c3RvbSBDU1Mgc3RhY2suIE1hZGUgZ2xvYmFsIGZvciB1bml0IHRlc3RpbmcuICovXG4gICAgICAgIENTUzogeyAvKiBEZWZpbmVkIGJlbG93LiAqLyB9LFxuICAgICAgICAvKiBBIHNoaW0gb2YgdGhlIGpRdWVyeSB1dGlsaXR5IGZ1bmN0aW9ucyB1c2VkIGJ5IFZlbG9jaXR5IC0tIHByb3ZpZGVkIGJ5IFZlbG9jaXR5J3Mgb3B0aW9uYWwgalF1ZXJ5IHNoaW0uICovXG4gICAgICAgIFV0aWxpdGllczogJCxcbiAgICAgICAgLyogQ29udGFpbmVyIGZvciB0aGUgdXNlcidzIGN1c3RvbSBhbmltYXRpb24gcmVkaXJlY3RzIHRoYXQgYXJlIHJlZmVyZW5jZWQgYnkgbmFtZSBpbiBwbGFjZSBvZiB0aGUgcHJvcGVydGllcyBtYXAgYXJndW1lbnQuICovXG4gICAgICAgIFJlZGlyZWN0czogeyAvKiBNYW51YWxseSByZWdpc3RlcmVkIGJ5IHRoZSB1c2VyLiAqLyB9LFxuICAgICAgICBFYXNpbmdzOiB7IC8qIERlZmluZWQgYmVsb3cuICovIH0sXG4gICAgICAgIC8qIEF0dGVtcHQgdG8gdXNlIEVTNiBQcm9taXNlcyBieSBkZWZhdWx0LiBVc2VycyBjYW4gb3ZlcnJpZGUgdGhpcyB3aXRoIGEgdGhpcmQtcGFydHkgcHJvbWlzZXMgbGlicmFyeS4gKi9cbiAgICAgICAgUHJvbWlzZTogd2luZG93LlByb21pc2UsXG4gICAgICAgIC8qIFZlbG9jaXR5IG9wdGlvbiBkZWZhdWx0cywgd2hpY2ggY2FuIGJlIG92ZXJyaWRlbiBieSB0aGUgdXNlci4gKi9cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIHF1ZXVlOiBcIlwiLFxuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OX0RFRkFVTFQsXG4gICAgICAgICAgICBlYXNpbmc6IEVBU0lOR19ERUZBVUxULFxuICAgICAgICAgICAgYmVnaW46IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGNvbXBsZXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwcm9ncmVzczogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGlzcGxheTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdmlzaWJpbGl0eTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICBkZWxheTogZmFsc2UsXG4gICAgICAgICAgICBtb2JpbGVIQTogdHJ1ZSxcbiAgICAgICAgICAgIC8qIEFkdmFuY2VkOiBTZXQgdG8gZmFsc2UgdG8gcHJldmVudCBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSBiZWluZyBjYWNoZWQgYmV0d2VlbiBjb25zZWN1dGl2ZSBWZWxvY2l0eS1pbml0aWF0ZWQgY2hhaW4gY2FsbHMuICovXG4gICAgICAgICAgICBfY2FjaGVWYWx1ZXM6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgLyogQSBkZXNpZ24gZ29hbCBvZiBWZWxvY2l0eSBpcyB0byBjYWNoZSBkYXRhIHdoZXJldmVyIHBvc3NpYmxlIGluIG9yZGVyIHRvIGF2b2lkIERPTSByZXF1ZXJ5aW5nLiBBY2NvcmRpbmdseSwgZWFjaCBlbGVtZW50IGhhcyBhIGRhdGEgY2FjaGUuICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAkLmRhdGEoZWxlbWVudCwgXCJ2ZWxvY2l0eVwiLCB7XG4gICAgICAgICAgICAgICAgLyogU3RvcmUgd2hldGhlciB0aGlzIGlzIGFuIFNWRyBlbGVtZW50LCBzaW5jZSBpdHMgcHJvcGVydGllcyBhcmUgcmV0cmlldmVkIGFuZCB1cGRhdGVkIGRpZmZlcmVudGx5IHRoYW4gc3RhbmRhcmQgSFRNTCBlbGVtZW50cy4gKi9cbiAgICAgICAgICAgICAgICBpc1NWRzogVHlwZS5pc1NWRyhlbGVtZW50KSxcbiAgICAgICAgICAgICAgICAvKiBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgY3VycmVudGx5IGJlaW5nIGFuaW1hdGVkIGJ5IFZlbG9jaXR5LlxuICAgICAgICAgICAgICAgICAgIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCBwcm9wZXJ0eSB2YWx1ZXMgYXJlIG5vdCB0cmFuc2ZlcnJlZCBiZXR3ZWVuIG5vbi1jb25zZWN1dGl2ZSAoc3RhbGUpIGNhbGxzLiAqL1xuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAvKiBBIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCdzIGxpdmUgY29tcHV0ZWRTdHlsZSBvYmplY3QuIExlYXJuIG1vcmUgaGVyZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlICovXG4gICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZTogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiBUd2VlbiBkYXRhIGlzIGNhY2hlZCBmb3IgZWFjaCBhbmltYXRpb24gb24gdGhlIGVsZW1lbnQgc28gdGhhdCBkYXRhIGNhbiBiZSBwYXNzZWQgYWNyb3NzIGNhbGxzIC0tXG4gICAgICAgICAgICAgICAgICAgaW4gcGFydGljdWxhciwgZW5kIHZhbHVlcyBhcmUgdXNlZCBhcyBzdWJzZXF1ZW50IHN0YXJ0IHZhbHVlcyBpbiBjb25zZWN1dGl2ZSBWZWxvY2l0eSBjYWxscy4gKi9cbiAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXI6IG51bGwsXG4gICAgICAgICAgICAgICAgLyogVGhlIGZ1bGwgcm9vdCBwcm9wZXJ0eSB2YWx1ZXMgb2YgZWFjaCBDU1MgaG9vayBiZWluZyBhbmltYXRlZCBvbiB0aGlzIGVsZW1lbnQgYXJlIGNhY2hlZCBzbyB0aGF0OlxuICAgICAgICAgICAgICAgICAgIDEpIENvbmN1cnJlbnRseS1hbmltYXRpbmcgaG9va3Mgc2hhcmluZyB0aGUgc2FtZSByb290IGNhbiBoYXZlIHRoZWlyIHJvb3QgdmFsdWVzJyBtZXJnZWQgaW50byBvbmUgd2hpbGUgdHdlZW5pbmcuXG4gICAgICAgICAgICAgICAgICAgMikgUG9zdC1ob29rLWluamVjdGlvbiByb290IHZhbHVlcyBjYW4gYmUgdHJhbnNmZXJyZWQgb3ZlciB0byBjb25zZWN1dGl2ZWx5IGNoYWluZWQgVmVsb2NpdHkgY2FsbHMgYXMgc3RhcnRpbmcgcm9vdCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVDYWNoZToge30sXG4gICAgICAgICAgICAgICAgLyogQSBjYWNoZSBmb3IgdHJhbnNmb3JtIHVwZGF0ZXMsIHdoaWNoIG11c3QgYmUgbWFudWFsbHkgZmx1c2hlZCB2aWEgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoKS4gKi9cbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1DYWNoZToge31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvKiBBIHBhcmFsbGVsIHRvIGpRdWVyeSdzICQuY3NzKCksIHVzZWQgZm9yIGdldHRpbmcvc2V0dGluZyBWZWxvY2l0eSdzIGhvb2tlZCBDU1MgcHJvcGVydGllcy4gKi9cbiAgICAgICAgaG9vazogbnVsbCwgLyogRGVmaW5lZCBiZWxvdy4gKi9cbiAgICAgICAgLyogVmVsb2NpdHktd2lkZSBhbmltYXRpb24gdGltZSByZW1hcHBpbmcgZm9yIHRlc3RpbmcgcHVycG9zZXMuICovXG4gICAgICAgIG1vY2s6IGZhbHNlLFxuICAgICAgICB2ZXJzaW9uOiB7IG1ham9yOiAxLCBtaW5vcjogMiwgcGF0Y2g6IDEgfSxcbiAgICAgICAgLyogU2V0IHRvIDEgb3IgMiAobW9zdCB2ZXJib3NlKSB0byBvdXRwdXQgZGVidWcgaW5mbyB0byBjb25zb2xlLiAqL1xuICAgICAgICBkZWJ1ZzogZmFsc2VcbiAgICB9O1xuXG4gICAgLyogUmV0cmlldmUgdGhlIGFwcHJvcHJpYXRlIHNjcm9sbCBhbmNob3IgYW5kIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBicm93c2VyOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93LnNjcm9sbFkgKi9cbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yID0gd2luZG93O1xuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQgPSBcInBhZ2VYT2Zmc2V0XCI7XG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wID0gXCJwYWdlWU9mZnNldFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbEFuY2hvciA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keTtcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlMZWZ0ID0gXCJzY3JvbGxMZWZ0XCI7XG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5VG9wID0gXCJzY3JvbGxUb3BcIjtcbiAgICB9XG5cbiAgICAvKiBTaG9ydGhhbmQgYWxpYXMgZm9yIGpRdWVyeSdzICQuZGF0YSgpIHV0aWxpdHkuICovXG4gICAgZnVuY3Rpb24gRGF0YSAoZWxlbWVudCkge1xuICAgICAgICAvKiBIYXJkY29kZSBhIHJlZmVyZW5jZSB0byB0aGUgcGx1Z2luIG5hbWUuICovXG4gICAgICAgIHZhciByZXNwb25zZSA9ICQuZGF0YShlbGVtZW50LCBcInZlbG9jaXR5XCIpO1xuXG4gICAgICAgIC8qIGpRdWVyeSA8PTEuNC4yIHJldHVybnMgbnVsbCBpbnN0ZWFkIG9mIHVuZGVmaW5lZCB3aGVuIG5vIG1hdGNoIGlzIGZvdW5kLiBXZSBub3JtYWxpemUgdGhpcyBiZWhhdmlvci4gKi9cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlID09PSBudWxsID8gdW5kZWZpbmVkIDogcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKlxuICAgICAgICBFYXNpbmdcbiAgICAqKioqKioqKioqKioqKi9cblxuICAgIC8qIFN0ZXAgZWFzaW5nIGdlbmVyYXRvci4gKi9cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVN0ZXAgKHN0ZXBzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocCAqIHN0ZXBzKSAqICgxIC8gc3RlcHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qIEJlemllciBjdXJ2ZSBmdW5jdGlvbiBnZW5lcmF0b3IuIENvcHlyaWdodCBHYWV0YW4gUmVuYXVkZWF1LiBNSVQgTGljZW5zZTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlQmV6aWVyIChtWDEsIG1ZMSwgbVgyLCBtWTIpIHtcbiAgICAgICAgdmFyIE5FV1RPTl9JVEVSQVRJT05TID0gNCxcbiAgICAgICAgICAgIE5FV1RPTl9NSU5fU0xPUEUgPSAwLjAwMSxcbiAgICAgICAgICAgIFNVQkRJVklTSU9OX1BSRUNJU0lPTiA9IDAuMDAwMDAwMSxcbiAgICAgICAgICAgIFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TID0gMTAsXG4gICAgICAgICAgICBrU3BsaW5lVGFibGVTaXplID0gMTEsXG4gICAgICAgICAgICBrU2FtcGxlU3RlcFNpemUgPSAxLjAgLyAoa1NwbGluZVRhYmxlU2l6ZSAtIDEuMCksXG4gICAgICAgICAgICBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPSBcIkZsb2F0MzJBcnJheVwiIGluIHdpbmRvdztcblxuICAgICAgICAvKiBNdXN0IGNvbnRhaW4gZm91ciBhcmd1bWVudHMuICovXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBBcmd1bWVudHMgbXVzdCBiZSBudW1iZXJzLiAqL1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7ICsraSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gIT09IFwibnVtYmVyXCIgfHwgaXNOYU4oYXJndW1lbnRzW2ldKSB8fCAhaXNGaW5pdGUoYXJndW1lbnRzW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFggdmFsdWVzIG11c3QgYmUgaW4gdGhlIFswLCAxXSByYW5nZS4gKi9cbiAgICAgICAgbVgxID0gTWF0aC5taW4obVgxLCAxKTtcbiAgICAgICAgbVgyID0gTWF0aC5taW4obVgyLCAxKTtcbiAgICAgICAgbVgxID0gTWF0aC5tYXgobVgxLCAwKTtcbiAgICAgICAgbVgyID0gTWF0aC5tYXgobVgyLCAwKTtcblxuICAgICAgICB2YXIgbVNhbXBsZVZhbHVlcyA9IGZsb2F0MzJBcnJheVN1cHBvcnRlZCA/IG5ldyBGbG9hdDMyQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSkgOiBuZXcgQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gQSAoYUExLCBhQTIpIHsgcmV0dXJuIDEuMCAtIDMuMCAqIGFBMiArIDMuMCAqIGFBMTsgfVxuICAgICAgICBmdW5jdGlvbiBCIChhQTEsIGFBMikgeyByZXR1cm4gMy4wICogYUEyIC0gNi4wICogYUExOyB9XG4gICAgICAgIGZ1bmN0aW9uIEMgKGFBMSkgICAgICB7IHJldHVybiAzLjAgKiBhQTE7IH1cblxuICAgICAgICBmdW5jdGlvbiBjYWxjQmV6aWVyIChhVCwgYUExLCBhQTIpIHtcbiAgICAgICAgICAgIHJldHVybiAoKEEoYUExLCBhQTIpKmFUICsgQihhQTEsIGFBMikpKmFUICsgQyhhQTEpKSphVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNsb3BlIChhVCwgYUExLCBhQTIpIHtcbiAgICAgICAgICAgIHJldHVybiAzLjAgKiBBKGFBMSwgYUEyKSphVCphVCArIDIuMCAqIEIoYUExLCBhQTIpICogYVQgKyBDKGFBMSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBuZXd0b25SYXBoc29uSXRlcmF0ZSAoYVgsIGFHdWVzc1QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgTkVXVE9OX0lURVJBVElPTlM7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50U2xvcGUgPSBnZXRTbG9wZShhR3Vlc3NULCBtWDEsIG1YMik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNsb3BlID09PSAwLjApIHJldHVybiBhR3Vlc3NUO1xuXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRYID0gY2FsY0JlemllcihhR3Vlc3NULCBtWDEsIG1YMikgLSBhWDtcbiAgICAgICAgICAgICAgICBhR3Vlc3NUIC09IGN1cnJlbnRYIC8gY3VycmVudFNsb3BlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gYUd1ZXNzVDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNTYW1wbGVWYWx1ZXMgKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrU3BsaW5lVGFibGVTaXplOyArK2kpIHtcbiAgICAgICAgICAgICAgICBtU2FtcGxlVmFsdWVzW2ldID0gY2FsY0JlemllcihpICoga1NhbXBsZVN0ZXBTaXplLCBtWDEsIG1YMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBiaW5hcnlTdWJkaXZpZGUgKGFYLCBhQSwgYUIpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50WCwgY3VycmVudFQsIGkgPSAwO1xuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgY3VycmVudFQgPSBhQSArIChhQiAtIGFBKSAvIDIuMDtcbiAgICAgICAgICAgICAgICBjdXJyZW50WCA9IGNhbGNCZXppZXIoY3VycmVudFQsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50WCA+IDAuMCkge1xuICAgICAgICAgICAgICAgICAgYUIgPSBjdXJyZW50VDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYUEgPSBjdXJyZW50VDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChNYXRoLmFicyhjdXJyZW50WCkgPiBTVUJESVZJU0lPTl9QUkVDSVNJT04gJiYgKytpIDwgU1VCRElWSVNJT05fTUFYX0lURVJBVElPTlMpO1xuXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRURm9yWCAoYVgpIHtcbiAgICAgICAgICAgIHZhciBpbnRlcnZhbFN0YXJ0ID0gMC4wLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRTYW1wbGUgPSAxLFxuICAgICAgICAgICAgICAgIGxhc3RTYW1wbGUgPSBrU3BsaW5lVGFibGVTaXplIC0gMTtcblxuICAgICAgICAgICAgZm9yICg7IGN1cnJlbnRTYW1wbGUgIT0gbGFzdFNhbXBsZSAmJiBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdIDw9IGFYOyArK2N1cnJlbnRTYW1wbGUpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFN0YXJ0ICs9IGtTYW1wbGVTdGVwU2l6ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLS1jdXJyZW50U2FtcGxlO1xuXG4gICAgICAgICAgICB2YXIgZGlzdCA9IChhWCAtIG1TYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pIC8gKG1TYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZSsxXSAtIG1TYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0pLFxuICAgICAgICAgICAgICAgIGd1ZXNzRm9yVCA9IGludGVydmFsU3RhcnQgKyBkaXN0ICoga1NhbXBsZVN0ZXBTaXplLFxuICAgICAgICAgICAgICAgIGluaXRpYWxTbG9wZSA9IGdldFNsb3BlKGd1ZXNzRm9yVCwgbVgxLCBtWDIpO1xuXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFNsb3BlID49IE5FV1RPTl9NSU5fU0xPUEUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3dG9uUmFwaHNvbkl0ZXJhdGUoYVgsIGd1ZXNzRm9yVCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluaXRpYWxTbG9wZSA9PSAwLjApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3Vlc3NGb3JUO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmluYXJ5U3ViZGl2aWRlKGFYLCBpbnRlcnZhbFN0YXJ0LCBpbnRlcnZhbFN0YXJ0ICsga1NhbXBsZVN0ZXBTaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfcHJlY29tcHV0ZWQgPSBmYWxzZTtcblxuICAgICAgICBmdW5jdGlvbiBwcmVjb21wdXRlKCkge1xuICAgICAgICAgICAgX3ByZWNvbXB1dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChtWDEgIT0gbVkxIHx8IG1YMiAhPSBtWTIpIGNhbGNTYW1wbGVWYWx1ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmID0gZnVuY3Rpb24gKGFYKSB7XG4gICAgICAgICAgICBpZiAoIV9wcmVjb21wdXRlZCkgcHJlY29tcHV0ZSgpO1xuICAgICAgICAgICAgaWYgKG1YMSA9PT0gbVkxICYmIG1YMiA9PT0gbVkyKSByZXR1cm4gYVg7XG4gICAgICAgICAgICBpZiAoYVggPT09IDApIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKGFYID09PSAxKSByZXR1cm4gMTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhbGNCZXppZXIoZ2V0VEZvclgoYVgpLCBtWTEsIG1ZMik7XG4gICAgICAgIH07XG5cbiAgICAgICAgZi5nZXRDb250cm9sUG9pbnRzID0gZnVuY3Rpb24oKSB7IHJldHVybiBbeyB4OiBtWDEsIHk6IG1ZMSB9LCB7IHg6IG1YMiwgeTogbVkyIH1dOyB9O1xuXG4gICAgICAgIHZhciBzdHIgPSBcImdlbmVyYXRlQmV6aWVyKFwiICsgW21YMSwgbVkxLCBtWDIsIG1ZMl0gKyBcIilcIjtcbiAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHN0cjsgfTtcblxuICAgICAgICByZXR1cm4gZjtcbiAgICB9XG5cbiAgICAvKiBSdW5nZS1LdXR0YSBzcHJpbmcgcGh5c2ljcyBmdW5jdGlvbiBnZW5lcmF0b3IuIEFkYXB0ZWQgZnJvbSBGcmFtZXIuanMsIGNvcHlyaWdodCBLb2VuIEJvay4gTUlUIExpY2Vuc2U6IGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cbiAgICAvKiBHaXZlbiBhIHRlbnNpb24sIGZyaWN0aW9uLCBhbmQgZHVyYXRpb24sIGEgc2ltdWxhdGlvbiBhdCA2MEZQUyB3aWxsIGZpcnN0IHJ1biB3aXRob3V0IGEgZGVmaW5lZCBkdXJhdGlvbiBpbiBvcmRlciB0byBjYWxjdWxhdGUgdGhlIGZ1bGwgcGF0aC4gQSBzZWNvbmQgcGFzc1xuICAgICAgIHRoZW4gYWRqdXN0cyB0aGUgdGltZSBkZWx0YSAtLSB1c2luZyB0aGUgcmVsYXRpb24gYmV0d2VlbiBhY3R1YWwgdGltZSBhbmQgZHVyYXRpb24gLS0gdG8gY2FsY3VsYXRlIHRoZSBwYXRoIGZvciB0aGUgZHVyYXRpb24tY29uc3RyYWluZWQgYW5pbWF0aW9uLiAqL1xuICAgIHZhciBnZW5lcmF0ZVNwcmluZ1JLNCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlIChzdGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuICgtc3RhdGUudGVuc2lvbiAqIHN0YXRlLngpIC0gKHN0YXRlLmZyaWN0aW9uICogc3RhdGUudik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzcHJpbmdFdmFsdWF0ZVN0YXRlV2l0aERlcml2YXRpdmUgKGluaXRpYWxTdGF0ZSwgZHQsIGRlcml2YXRpdmUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICB4OiBpbml0aWFsU3RhdGUueCArIGRlcml2YXRpdmUuZHggKiBkdCxcbiAgICAgICAgICAgICAgICB2OiBpbml0aWFsU3RhdGUudiArIGRlcml2YXRpdmUuZHYgKiBkdCxcbiAgICAgICAgICAgICAgICB0ZW5zaW9uOiBpbml0aWFsU3RhdGUudGVuc2lvbixcbiAgICAgICAgICAgICAgICBmcmljdGlvbjogaW5pdGlhbFN0YXRlLmZyaWN0aW9uXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4geyBkeDogc3RhdGUudiwgZHY6IHNwcmluZ0FjY2VsZXJhdGlvbkZvclN0YXRlKHN0YXRlKSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc3ByaW5nSW50ZWdyYXRlU3RhdGUgKHN0YXRlLCBkdCkge1xuICAgICAgICAgICAgdmFyIGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGR4OiBzdGF0ZS52LFxuICAgICAgICAgICAgICAgICAgICBkdjogc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUoc3RhdGUpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBiID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCAqIDAuNSwgYSksXG4gICAgICAgICAgICAgICAgYyA9IHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZShzdGF0ZSwgZHQgKiAwLjUsIGIpLFxuICAgICAgICAgICAgICAgIGQgPSBzcHJpbmdFdmFsdWF0ZVN0YXRlV2l0aERlcml2YXRpdmUoc3RhdGUsIGR0LCBjKSxcbiAgICAgICAgICAgICAgICBkeGR0ID0gMS4wIC8gNi4wICogKGEuZHggKyAyLjAgKiAoYi5keCArIGMuZHgpICsgZC5keCksXG4gICAgICAgICAgICAgICAgZHZkdCA9IDEuMCAvIDYuMCAqIChhLmR2ICsgMi4wICogKGIuZHYgKyBjLmR2KSArIGQuZHYpO1xuXG4gICAgICAgICAgICBzdGF0ZS54ID0gc3RhdGUueCArIGR4ZHQgKiBkdDtcbiAgICAgICAgICAgIHN0YXRlLnYgPSBzdGF0ZS52ICsgZHZkdCAqIGR0O1xuXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3ByaW5nUks0RmFjdG9yeSAodGVuc2lvbiwgZnJpY3Rpb24sIGR1cmF0aW9uKSB7XG5cbiAgICAgICAgICAgIHZhciBpbml0U3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IC0xLFxuICAgICAgICAgICAgICAgICAgICB2OiAwLFxuICAgICAgICAgICAgICAgICAgICB0ZW5zaW9uOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBmcmljdGlvbjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0aCA9IFswXSxcbiAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCA9IDAsXG4gICAgICAgICAgICAgICAgdG9sZXJhbmNlID0gMSAvIDEwMDAwLFxuICAgICAgICAgICAgICAgIERUID0gMTYgLyAxMDAwLFxuICAgICAgICAgICAgICAgIGhhdmVfZHVyYXRpb24sIGR0LCBsYXN0X3N0YXRlO1xuXG4gICAgICAgICAgICB0ZW5zaW9uID0gcGFyc2VGbG9hdCh0ZW5zaW9uKSB8fCA1MDA7XG4gICAgICAgICAgICBmcmljdGlvbiA9IHBhcnNlRmxvYXQoZnJpY3Rpb24pIHx8IDIwO1xuICAgICAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCBudWxsO1xuXG4gICAgICAgICAgICBpbml0U3RhdGUudGVuc2lvbiA9IHRlbnNpb247XG4gICAgICAgICAgICBpbml0U3RhdGUuZnJpY3Rpb24gPSBmcmljdGlvbjtcblxuICAgICAgICAgICAgaGF2ZV9kdXJhdGlvbiA9IGR1cmF0aW9uICE9PSBudWxsO1xuXG4gICAgICAgICAgICAvKiBDYWxjdWxhdGUgdGhlIGFjdHVhbCB0aW1lIGl0IHRha2VzIGZvciB0aGlzIGFuaW1hdGlvbiB0byBjb21wbGV0ZSB3aXRoIHRoZSBwcm92aWRlZCBjb25kaXRpb25zLiAqL1xuICAgICAgICAgICAgaWYgKGhhdmVfZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAvKiBSdW4gdGhlIHNpbXVsYXRpb24gd2l0aG91dCBhIGR1cmF0aW9uLiAqL1xuICAgICAgICAgICAgICAgIHRpbWVfbGFwc2VkID0gc3ByaW5nUks0RmFjdG9yeSh0ZW5zaW9uLCBmcmljdGlvbik7XG4gICAgICAgICAgICAgICAgLyogQ29tcHV0ZSB0aGUgYWRqdXN0ZWQgdGltZSBkZWx0YS4gKi9cbiAgICAgICAgICAgICAgICBkdCA9IHRpbWVfbGFwc2VkIC8gZHVyYXRpb24gKiBEVDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHQgPSBEVDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAvKiBOZXh0L3N0ZXAgZnVuY3Rpb24gLiovXG4gICAgICAgICAgICAgICAgbGFzdF9zdGF0ZSA9IHNwcmluZ0ludGVncmF0ZVN0YXRlKGxhc3Rfc3RhdGUgfHwgaW5pdFN0YXRlLCBkdCk7XG4gICAgICAgICAgICAgICAgLyogU3RvcmUgdGhlIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgIHBhdGgucHVzaCgxICsgbGFzdF9zdGF0ZS54KTtcbiAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCArPSAxNjtcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY2hhbmdlIHRocmVzaG9sZCBpcyByZWFjaGVkLCBicmVhay4gKi9cbiAgICAgICAgICAgICAgICBpZiAoIShNYXRoLmFicyhsYXN0X3N0YXRlLngpID4gdG9sZXJhbmNlICYmIE1hdGguYWJzKGxhc3Rfc3RhdGUudikgPiB0b2xlcmFuY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogSWYgZHVyYXRpb24gaXMgbm90IGRlZmluZWQsIHJldHVybiB0aGUgYWN0dWFsIHRpbWUgcmVxdWlyZWQgZm9yIGNvbXBsZXRpbmcgdGhpcyBhbmltYXRpb24uIE90aGVyd2lzZSwgcmV0dXJuIGEgY2xvc3VyZSB0aGF0IGhvbGRzIHRoZVxuICAgICAgICAgICAgICAgY29tcHV0ZWQgcGF0aCBhbmQgcmV0dXJucyBhIHNuYXBzaG90IG9mIHRoZSBwb3NpdGlvbiBhY2NvcmRpbmcgdG8gYSBnaXZlbiBwZXJjZW50Q29tcGxldGUuICovXG4gICAgICAgICAgICByZXR1cm4gIWhhdmVfZHVyYXRpb24gPyB0aW1lX2xhcHNlZCA6IGZ1bmN0aW9uKHBlcmNlbnRDb21wbGV0ZSkgeyByZXR1cm4gcGF0aFsgKHBlcmNlbnRDb21wbGV0ZSAqIChwYXRoLmxlbmd0aCAtIDEpKSB8IDAgXTsgfTtcbiAgICAgICAgfTtcbiAgICB9KCkpO1xuXG4gICAgLyogalF1ZXJ5IGVhc2luZ3MuICovXG4gICAgVmVsb2NpdHkuRWFzaW5ncyA9IHtcbiAgICAgICAgbGluZWFyOiBmdW5jdGlvbihwKSB7IHJldHVybiBwOyB9LFxuICAgICAgICBzd2luZzogZnVuY3Rpb24ocCkgeyByZXR1cm4gMC41IC0gTWF0aC5jb3MoIHAgKiBNYXRoLlBJICkgLyAyIH0sXG4gICAgICAgIC8qIEJvbnVzIFwic3ByaW5nXCIgZWFzaW5nLCB3aGljaCBpcyBhIGxlc3MgZXhhZ2dlcmF0ZWQgdmVyc2lvbiBvZiBlYXNlSW5PdXRFbGFzdGljLiAqL1xuICAgICAgICBzcHJpbmc6IGZ1bmN0aW9uKHApIHsgcmV0dXJuIDEgLSAoTWF0aC5jb3MocCAqIDQuNSAqIE1hdGguUEkpICogTWF0aC5leHAoLXAgKiA2KSk7IH1cbiAgICB9O1xuXG4gICAgLyogQ1NTMyBhbmQgUm9iZXJ0IFBlbm5lciBlYXNpbmdzLiAqL1xuICAgICQuZWFjaChcbiAgICAgICAgW1xuICAgICAgICAgICAgWyBcImVhc2VcIiwgWyAwLjI1LCAwLjEsIDAuMjUsIDEuMCBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZS1pblwiLCBbIDAuNDIsIDAuMCwgMS4wMCwgMS4wIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlLW91dFwiLCBbIDAuMDAsIDAuMCwgMC41OCwgMS4wIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlLWluLW91dFwiLCBbIDAuNDIsIDAuMCwgMC41OCwgMS4wIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5TaW5lXCIsIFsgMC40NywgMCwgMC43NDUsIDAuNzE1IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0U2luZVwiLCBbIDAuMzksIDAuNTc1LCAwLjU2NSwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0U2luZVwiLCBbIDAuNDQ1LCAwLjA1LCAwLjU1LCAwLjk1IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5RdWFkXCIsIFsgMC41NSwgMC4wODUsIDAuNjgsIDAuNTMgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VPdXRRdWFkXCIsIFsgMC4yNSwgMC40NiwgMC40NSwgMC45NCBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0UXVhZFwiLCBbIDAuNDU1LCAwLjAzLCAwLjUxNSwgMC45NTUgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbkN1YmljXCIsIFsgMC41NSwgMC4wNTUsIDAuNjc1LCAwLjE5IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0Q3ViaWNcIiwgWyAwLjIxNSwgMC42MSwgMC4zNTUsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbk91dEN1YmljXCIsIFsgMC42NDUsIDAuMDQ1LCAwLjM1NSwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluUXVhcnRcIiwgWyAwLjg5NSwgMC4wMywgMC42ODUsIDAuMjIgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VPdXRRdWFydFwiLCBbIDAuMTY1LCAwLjg0LCAwLjQ0LCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRRdWFydFwiLCBbIDAuNzcsIDAsIDAuMTc1LCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5RdWludFwiLCBbIDAuNzU1LCAwLjA1LCAwLjg1NSwgMC4wNiBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZU91dFF1aW50XCIsIFsgMC4yMywgMSwgMC4zMiwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0UXVpbnRcIiwgWyAwLjg2LCAwLCAwLjA3LCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5FeHBvXCIsIFsgMC45NSwgMC4wNSwgMC43OTUsIDAuMDM1IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0RXhwb1wiLCBbIDAuMTksIDEsIDAuMjIsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbk91dEV4cG9cIiwgWyAxLCAwLCAwLCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5DaXJjXCIsIFsgMC42LCAwLjA0LCAwLjk4LCAwLjMzNSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZU91dENpcmNcIiwgWyAwLjA3NSwgMC44MiwgMC4xNjUsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbk91dENpcmNcIiwgWyAwLjc4NSwgMC4xMzUsIDAuMTUsIDAuODYgXSBdXG4gICAgICAgIF0sIGZ1bmN0aW9uKGksIGVhc2luZ0FycmF5KSB7XG4gICAgICAgICAgICBWZWxvY2l0eS5FYXNpbmdzW2Vhc2luZ0FycmF5WzBdXSA9IGdlbmVyYXRlQmV6aWVyLmFwcGx5KG51bGwsIGVhc2luZ0FycmF5WzFdKTtcbiAgICAgICAgfSk7XG5cbiAgICAvKiBEZXRlcm1pbmUgdGhlIGFwcHJvcHJpYXRlIGVhc2luZyB0eXBlIGdpdmVuIGFuIGVhc2luZyBpbnB1dC4gKi9cbiAgICBmdW5jdGlvbiBnZXRFYXNpbmcodmFsdWUsIGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBlYXNpbmcgPSB2YWx1ZTtcblxuICAgICAgICAvKiBUaGUgZWFzaW5nIG9wdGlvbiBjYW4gZWl0aGVyIGJlIGEgc3RyaW5nIHRoYXQgcmVmZXJlbmNlcyBhIHByZS1yZWdpc3RlcmVkIGVhc2luZyxcbiAgICAgICAgICAgb3IgaXQgY2FuIGJlIGEgdHdvLS9mb3VyLWl0ZW0gYXJyYXkgb2YgaW50ZWdlcnMgdG8gYmUgY29udmVydGVkIGludG8gYSBiZXppZXIvc3ByaW5nIGZ1bmN0aW9uLiAqL1xuICAgICAgICBpZiAoVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8qIEVuc3VyZSB0aGF0IHRoZSBlYXNpbmcgaGFzIGJlZW4gYXNzaWduZWQgdG8galF1ZXJ5J3MgVmVsb2NpdHkuRWFzaW5ncyBvYmplY3QuICovXG4gICAgICAgICAgICBpZiAoIVZlbG9jaXR5LkVhc2luZ3NbdmFsdWVdKSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlU3RlcC5hcHBseShudWxsLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIC8qIHNwcmluZ1JLNCBtdXN0IGJlIHBhc3NlZCB0aGUgYW5pbWF0aW9uJ3MgZHVyYXRpb24uICovXG4gICAgICAgICAgICAvKiBOb3RlOiBJZiB0aGUgc3ByaW5nUks0IGFycmF5IGNvbnRhaW5zIG5vbi1udW1iZXJzLCBnZW5lcmF0ZVNwcmluZ1JLNCgpIHJldHVybnMgYW4gZWFzaW5nXG4gICAgICAgICAgICAgICBmdW5jdGlvbiBnZW5lcmF0ZWQgd2l0aCBkZWZhdWx0IHRlbnNpb24gYW5kIGZyaWN0aW9uIHZhbHVlcy4gKi9cbiAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlU3ByaW5nUks0LmFwcGx5KG51bGwsIHZhbHVlLmNvbmNhdChbIGR1cmF0aW9uIF0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgLyogTm90ZTogSWYgdGhlIGJlemllciBhcnJheSBjb250YWlucyBub24tbnVtYmVycywgZ2VuZXJhdGVCZXppZXIoKSByZXR1cm5zIGZhbHNlLiAqL1xuICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVCZXppZXIuYXBwbHkobnVsbCwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWFzaW5nID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBSZXZlcnQgdG8gdGhlIFZlbG9jaXR5LXdpZGUgZGVmYXVsdCBlYXNpbmcgdHlwZSwgb3IgZmFsbCBiYWNrIHRvIFwic3dpbmdcIiAod2hpY2ggaXMgYWxzbyBqUXVlcnkncyBkZWZhdWx0KVxuICAgICAgICAgICBpZiB0aGUgVmVsb2NpdHktd2lkZSBkZWZhdWx0IGhhcyBiZWVuIGluY29ycmVjdGx5IG1vZGlmaWVkLiAqL1xuICAgICAgICBpZiAoZWFzaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKFZlbG9jaXR5LkVhc2luZ3NbVmVsb2NpdHkuZGVmYXVsdHMuZWFzaW5nXSkge1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IFZlbG9jaXR5LmRlZmF1bHRzLmVhc2luZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gRUFTSU5HX0RFRkFVTFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWFzaW5nO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICBDU1MgU3RhY2tcbiAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIFRoZSBDU1Mgb2JqZWN0IGlzIGEgaGlnaGx5IGNvbmRlbnNlZCBhbmQgcGVyZm9ybWFudCBDU1Mgc3RhY2sgdGhhdCBmdWxseSByZXBsYWNlcyBqUXVlcnkncy5cbiAgICAgICBJdCBoYW5kbGVzIHRoZSB2YWxpZGF0aW9uLCBnZXR0aW5nLCBhbmQgc2V0dGluZyBvZiBib3RoIHN0YW5kYXJkIENTUyBwcm9wZXJ0aWVzIGFuZCBDU1MgcHJvcGVydHkgaG9va3MuICovXG4gICAgLyogTm90ZTogQSBcIkNTU1wiIHNob3J0aGFuZCBpcyBhbGlhc2VkIHNvIHRoYXQgb3VyIGNvZGUgaXMgZWFzaWVyIHRvIHJlYWQuICovXG4gICAgdmFyIENTUyA9IFZlbG9jaXR5LkNTUyA9IHtcblxuICAgICAgICAvKioqKioqKioqKioqKlxuICAgICAgICAgICAgUmVnRXhcbiAgICAgICAgKioqKioqKioqKioqKi9cblxuICAgICAgICBSZWdFeDoge1xuICAgICAgICAgICAgaXNIZXg6IC9eIyhbQS1mXFxkXXszfSl7MSwyfSQvaSxcbiAgICAgICAgICAgIC8qIFVud3JhcCBhIHByb3BlcnR5IHZhbHVlJ3Mgc3Vycm91bmRpbmcgdGV4dCwgZS5nLiBcInJnYmEoNCwgMywgMiwgMSlcIiA9PT4gXCI0LCAzLCAyLCAxXCIgYW5kIFwicmVjdCg0cHggM3B4IDJweCAxcHgpXCIgPT0+IFwiNHB4IDNweCAycHggMXB4XCIuICovXG4gICAgICAgICAgICB2YWx1ZVVud3JhcDogL15bQS16XStcXCgoLiopXFwpJC9pLFxuICAgICAgICAgICAgd3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZDogL1swLTkuXSsgWzAtOS5dKyBbMC05Ll0rKCBbMC05Ll0rKT8vLFxuICAgICAgICAgICAgLyogU3BsaXQgYSBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBpbnRvIGFuIGFycmF5IG9mIHN1YnZhbHVlcywgZS5nLiBcInJnYmEoNCwgMywgMiwgMSkgNHB4IDNweCAycHggMXB4XCIgPT0+IFsgXCJyZ2JhKDQsIDMsIDIsIDEpXCIsIFwiNHB4XCIsIFwiM3B4XCIsIFwiMnB4XCIsIFwiMXB4XCIgXS4gKi9cbiAgICAgICAgICAgIHZhbHVlU3BsaXQ6IC8oW0Etel0rXFwoLitcXCkpfCgoW0EtejAtOSMtLl0rPykoPz1cXHN8JCkpL2lnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqKioqKioqKioqKlxuICAgICAgICAgICAgTGlzdHNcbiAgICAgICAgKioqKioqKioqKioqL1xuXG4gICAgICAgIExpc3RzOiB7XG4gICAgICAgICAgICBjb2xvcnM6IFsgXCJmaWxsXCIsIFwic3Ryb2tlXCIsIFwic3RvcENvbG9yXCIsIFwiY29sb3JcIiwgXCJiYWNrZ3JvdW5kQ29sb3JcIiwgXCJib3JkZXJDb2xvclwiLCBcImJvcmRlclRvcENvbG9yXCIsIFwiYm9yZGVyUmlnaHRDb2xvclwiLCBcImJvcmRlckJvdHRvbUNvbG9yXCIsIFwiYm9yZGVyTGVmdENvbG9yXCIsIFwib3V0bGluZUNvbG9yXCIgXSxcbiAgICAgICAgICAgIHRyYW5zZm9ybXNCYXNlOiBbIFwidHJhbnNsYXRlWFwiLCBcInRyYW5zbGF0ZVlcIiwgXCJzY2FsZVwiLCBcInNjYWxlWFwiLCBcInNjYWxlWVwiLCBcInNrZXdYXCIsIFwic2tld1lcIiwgXCJyb3RhdGVaXCIgXSxcbiAgICAgICAgICAgIHRyYW5zZm9ybXMzRDogWyBcInRyYW5zZm9ybVBlcnNwZWN0aXZlXCIsIFwidHJhbnNsYXRlWlwiLCBcInNjYWxlWlwiLCBcInJvdGF0ZVhcIiwgXCJyb3RhdGVZXCIgXVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKioqKioqKioqKipcbiAgICAgICAgICAgIEhvb2tzXG4gICAgICAgICoqKioqKioqKioqKi9cblxuICAgICAgICAvKiBIb29rcyBhbGxvdyBhIHN1YnByb3BlcnR5IChlLmcuIFwiYm94U2hhZG93Qmx1clwiKSBvZiBhIGNvbXBvdW5kLXZhbHVlIENTUyBwcm9wZXJ0eVxuICAgICAgICAgICAoZS5nLiBcImJveFNoYWRvdzogWCBZIEJsdXIgU3ByZWFkIENvbG9yXCIpIHRvIGJlIGFuaW1hdGVkIGFzIGlmIGl0IHdlcmUgYSBkaXNjcmV0ZSBwcm9wZXJ0eS4gKi9cbiAgICAgICAgLyogTm90ZTogQmV5b25kIGVuYWJsaW5nIGZpbmUtZ3JhaW5lZCBwcm9wZXJ0eSBhbmltYXRpb24sIGhvb2tpbmcgaXMgbmVjZXNzYXJ5IHNpbmNlIFZlbG9jaXR5IG9ubHlcbiAgICAgICAgICAgdHdlZW5zIHByb3BlcnRpZXMgd2l0aCBzaW5nbGUgbnVtZXJpYyB2YWx1ZXM7IHVubGlrZSBDU1MgdHJhbnNpdGlvbnMsIFZlbG9jaXR5IGRvZXMgbm90IGludGVycG9sYXRlIGNvbXBvdW5kLXZhbHVlcy4gKi9cbiAgICAgICAgSG9va3M6IHtcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgIFJlZ2lzdHJhdGlvblxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFRlbXBsYXRlcyBhcmUgYSBjb25jaXNlIHdheSBvZiBpbmRpY2F0aW5nIHdoaWNoIHN1YnByb3BlcnRpZXMgbXVzdCBiZSBpbmRpdmlkdWFsbHkgcmVnaXN0ZXJlZCBmb3IgZWFjaCBjb21wb3VuZC12YWx1ZSBDU1MgcHJvcGVydHkuICovXG4gICAgICAgICAgICAvKiBFYWNoIHRlbXBsYXRlIGNvbnNpc3RzIG9mIHRoZSBjb21wb3VuZC12YWx1ZSdzIGJhc2UgbmFtZSwgaXRzIGNvbnN0aXR1ZW50IHN1YnByb3BlcnR5IG5hbWVzLCBhbmQgdGhvc2Ugc3VicHJvcGVydGllcycgZGVmYXVsdCB2YWx1ZXMuICovXG4gICAgICAgICAgICB0ZW1wbGF0ZXM6IHtcbiAgICAgICAgICAgICAgICBcInRleHRTaGFkb3dcIjogWyBcIkNvbG9yIFggWSBCbHVyXCIsIFwiYmxhY2sgMHB4IDBweCAwcHhcIiBdLFxuICAgICAgICAgICAgICAgIFwiYm94U2hhZG93XCI6IFsgXCJDb2xvciBYIFkgQmx1ciBTcHJlYWRcIiwgXCJibGFjayAwcHggMHB4IDBweCAwcHhcIiBdLFxuICAgICAgICAgICAgICAgIFwiY2xpcFwiOiBbIFwiVG9wIFJpZ2h0IEJvdHRvbSBMZWZ0XCIsIFwiMHB4IDBweCAwcHggMHB4XCIgXSxcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmRQb3NpdGlvblwiOiBbIFwiWCBZXCIsIFwiMCUgMCVcIiBdLFxuICAgICAgICAgICAgICAgIFwidHJhbnNmb3JtT3JpZ2luXCI6IFsgXCJYIFkgWlwiLCBcIjUwJSA1MCUgMHB4XCIgXSxcbiAgICAgICAgICAgICAgICBcInBlcnNwZWN0aXZlT3JpZ2luXCI6IFsgXCJYIFlcIiwgXCI1MCUgNTAlXCIgXVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyogQSBcInJlZ2lzdGVyZWRcIiBob29rIGlzIG9uZSB0aGF0IGhhcyBiZWVuIGNvbnZlcnRlZCBmcm9tIGl0cyB0ZW1wbGF0ZSBmb3JtIGludG8gYSBsaXZlLFxuICAgICAgICAgICAgICAgdHdlZW5hYmxlIHByb3BlcnR5LiBJdCBjb250YWlucyBkYXRhIHRvIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyByb290IHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgcmVnaXN0ZXJlZDoge1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IEEgcmVnaXN0ZXJlZCBob29rIGxvb2tzIGxpa2UgdGhpcyA9PT4gdGV4dFNoYWRvd0JsdXI6IFsgXCJ0ZXh0U2hhZG93XCIsIDMgXSxcbiAgICAgICAgICAgICAgICAgICB3aGljaCBjb25zaXN0cyBvZiB0aGUgc3VicHJvcGVydHkncyBuYW1lLCB0aGUgYXNzb2NpYXRlZCByb290IHByb3BlcnR5J3MgbmFtZSxcbiAgICAgICAgICAgICAgICAgICBhbmQgdGhlIHN1YnByb3BlcnR5J3MgcG9zaXRpb24gaW4gdGhlIHJvb3QncyB2YWx1ZS4gKi9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBDb252ZXJ0IHRoZSB0ZW1wbGF0ZXMgaW50byBpbmRpdmlkdWFsIGhvb2tzIHRoZW4gYXBwZW5kIHRoZW0gdG8gdGhlIHJlZ2lzdGVyZWQgb2JqZWN0IGFib3ZlLiAqL1xuICAgICAgICAgICAgcmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvKiBDb2xvciBob29rcyByZWdpc3RyYXRpb246IENvbG9ycyBhcmUgZGVmYXVsdGVkIHRvIHdoaXRlIC0tIGFzIG9wcG9zZWQgdG8gYmxhY2sgLS0gc2luY2UgY29sb3JzIHRoYXQgYXJlXG4gICAgICAgICAgICAgICAgICAgY3VycmVudGx5IHNldCB0byBcInRyYW5zcGFyZW50XCIgZGVmYXVsdCB0byB0aGVpciByZXNwZWN0aXZlIHRlbXBsYXRlIGJlbG93IHdoZW4gY29sb3ItYW5pbWF0ZWQsXG4gICAgICAgICAgICAgICAgICAgYW5kIHdoaXRlIGlzIHR5cGljYWxseSBhIGNsb3NlciBtYXRjaCB0byB0cmFuc3BhcmVudCB0aGFuIGJsYWNrIGlzLiBBbiBleGNlcHRpb24gaXMgbWFkZSBmb3IgdGV4dCAoXCJjb2xvclwiKSxcbiAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBhbG1vc3QgYWx3YXlzIHNldCBjbG9zZXIgdG8gYmxhY2sgdGhhbiB3aGl0ZS4gKi9cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJnYkNvbXBvbmVudHMgPSAoQ1NTLkxpc3RzLmNvbG9yc1tpXSA9PT0gXCJjb2xvclwiKSA/IFwiMCAwIDAgMVwiIDogXCIyNTUgMjU1IDI1NSAxXCI7XG4gICAgICAgICAgICAgICAgICAgIENTUy5Ib29rcy50ZW1wbGF0ZXNbQ1NTLkxpc3RzLmNvbG9yc1tpXV0gPSBbIFwiUmVkIEdyZWVuIEJsdWUgQWxwaGFcIiwgcmdiQ29tcG9uZW50cyBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciByb290UHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzO1xuXG4gICAgICAgICAgICAgICAgLyogSW4gSUUsIGNvbG9yIHZhbHVlcyBpbnNpZGUgY29tcG91bmQtdmFsdWUgcHJvcGVydGllcyBhcmUgcG9zaXRpb25lZCBhdCB0aGUgZW5kIHRoZSB2YWx1ZSBpbnN0ZWFkIG9mIGF0IHRoZSBiZWdpbm5pbmcuXG4gICAgICAgICAgICAgICAgICAgVGh1cywgd2UgcmUtYXJyYW5nZSB0aGUgdGVtcGxhdGVzIGFjY29yZGluZ2x5LiAqL1xuICAgICAgICAgICAgICAgIGlmIChJRSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHJvb3RQcm9wZXJ0eSBpbiBDU1MuSG9va3MudGVtcGxhdGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rVGVtcGxhdGUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMgPSBob29rVGVtcGxhdGVbMF0uc3BsaXQoXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlcyA9IGhvb2tUZW1wbGF0ZVsxXS5tYXRjaChDU1MuUmVnRXgudmFsdWVTcGxpdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob29rTmFtZXNbMF0gPT09IFwiQ29sb3JcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlcG9zaXRpb24gYm90aCB0aGUgaG9vaydzIG5hbWUgYW5kIGl0cyBkZWZhdWx0IHZhbHVlIHRvIHRoZSBlbmQgb2YgdGhlaXIgcmVzcGVjdGl2ZSBzdHJpbmdzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcy5wdXNoKGhvb2tOYW1lcy5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWVzLnB1c2goZGVmYXVsdFZhbHVlcy5zaGlmdCgpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlcGxhY2UgdGhlIGV4aXN0aW5nIHRlbXBsYXRlIGZvciB0aGUgaG9vaydzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldID0gWyBob29rTmFtZXMuam9pbihcIiBcIiksIGRlZmF1bHRWYWx1ZXMuam9pbihcIiBcIikgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIEhvb2sgcmVnaXN0cmF0aW9uLiAqL1xuICAgICAgICAgICAgICAgIGZvciAocm9vdFByb3BlcnR5IGluIENTUy5Ib29rcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaG9va1RlbXBsYXRlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMgPSBob29rVGVtcGxhdGVbMF0uc3BsaXQoXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaG9va05hbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVsbEhvb2tOYW1lID0gcm9vdFByb3BlcnR5ICsgaG9va05hbWVzW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tQb3NpdGlvbiA9IGk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBlYWNoIGhvb2ssIHJlZ2lzdGVyIGl0cyBmdWxsIG5hbWUgKGUuZy4gdGV4dFNoYWRvd0JsdXIpIHdpdGggaXRzIHJvb3QgcHJvcGVydHkgKGUuZy4gdGV4dFNoYWRvdylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgaG9vaydzIHBvc2l0aW9uIGluIGl0cyB0ZW1wbGF0ZSdzIGRlZmF1bHQgdmFsdWUgc3RyaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbZnVsbEhvb2tOYW1lXSA9IFsgcm9vdFByb3BlcnR5LCBob29rUG9zaXRpb24gXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgSW5qZWN0aW9uIGFuZCBFeHRyYWN0aW9uXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogTG9vayB1cCB0aGUgcm9vdCBwcm9wZXJ0eSBhc3NvY2lhdGVkIHdpdGggdGhlIGhvb2sgKGUuZy4gcmV0dXJuIFwidGV4dFNoYWRvd1wiIGZvciBcInRleHRTaGFkb3dCbHVyXCIpLiAqL1xuICAgICAgICAgICAgLyogU2luY2UgYSBob29rIGNhbm5vdCBiZSBzZXQgZGlyZWN0bHkgKHRoZSBicm93c2VyIHdvbid0IHJlY29nbml6ZSBpdCksIHN0eWxlIHVwZGF0aW5nIGZvciBob29rcyBpcyByb3V0ZWQgdGhyb3VnaCB0aGUgaG9vaydzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICBnZXRSb290OiBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgaG9va0RhdGEgPSBDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaG9va0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhvb2tEYXRhWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZXJlIHdhcyBubyBob29rIG1hdGNoLCByZXR1cm4gdGhlIHByb3BlcnR5IG5hbWUgdW50b3VjaGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIENvbnZlcnQgYW55IHJvb3RQcm9wZXJ0eVZhbHVlLCBudWxsIG9yIG90aGVyd2lzZSwgaW50byBhIHNwYWNlLWRlbGltaXRlZCBsaXN0IG9mIGhvb2sgdmFsdWVzIHNvIHRoYXRcbiAgICAgICAgICAgICAgIHRoZSB0YXJnZXRlZCBob29rIGNhbiBiZSBpbmplY3RlZCBvciBleHRyYWN0ZWQgYXQgaXRzIHN0YW5kYXJkIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgY2xlYW5Sb290UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24ocm9vdFByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIC8qIElmIHRoZSByb290UHJvcGVydHlWYWx1ZSBpcyB3cmFwcGVkIHdpdGggXCJyZ2IoKVwiLCBcImNsaXAoKVwiLCBldGMuLCByZW1vdmUgdGhlIHdyYXBwaW5nIHRvIG5vcm1hbGl6ZSB0aGUgdmFsdWUgYmVmb3JlIG1hbmlwdWxhdGlvbi4gKi9cbiAgICAgICAgICAgICAgICBpZiAoQ1NTLlJlZ0V4LnZhbHVlVW53cmFwLnRlc3Qocm9vdFByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWUubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlVW53cmFwKVsxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiByb290UHJvcGVydHlWYWx1ZSBpcyBhIENTUyBudWxsLXZhbHVlIChmcm9tIHdoaWNoIHRoZXJlJ3MgaW5oZXJlbnRseSBubyBob29rIHZhbHVlIHRvIGV4dHJhY3QpLFxuICAgICAgICAgICAgICAgICAgIGRlZmF1bHQgdG8gdGhlIHJvb3QncyBkZWZhdWx0IHZhbHVlIGFzIGRlZmluZWQgaW4gQ1NTLkhvb2tzLnRlbXBsYXRlcy4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBDU1MgbnVsbC12YWx1ZXMgaW5jbHVkZSBcIm5vbmVcIiwgXCJhdXRvXCIsIGFuZCBcInRyYW5zcGFyZW50XCIuIFRoZXkgbXVzdCBiZSBjb252ZXJ0ZWQgaW50byB0aGVpclxuICAgICAgICAgICAgICAgICAgIHplcm8tdmFsdWVzIChlLmcuIHRleHRTaGFkb3c6IFwibm9uZVwiID09PiB0ZXh0U2hhZG93OiBcIjBweCAwcHggMHB4IGJsYWNrXCIpIGZvciBob29rIG1hbmlwdWxhdGlvbiB0byBwcm9jZWVkLiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKHJvb3RQcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XVsxXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogRXh0cmFjdGVkIHRoZSBob29rJ3MgdmFsdWUgZnJvbSBpdHMgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiBUaGlzIGlzIHVzZWQgdG8gZ2V0IHRoZSBzdGFydGluZyB2YWx1ZSBvZiBhbiBhbmltYXRpbmcgaG9vay4gKi9cbiAgICAgICAgICAgIGV4dHJhY3RWYWx1ZTogZnVuY3Rpb24gKGZ1bGxIb29rTmFtZSwgcm9vdFByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaG9va0RhdGEgPSBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdO1xuXG4gICAgICAgICAgICAgICAgaWYgKGhvb2tEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBob29rUm9vdCA9IGhvb2tEYXRhWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Bvc2l0aW9uID0gaG9va0RhdGFbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShob29rUm9vdCwgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFNwbGl0IHJvb3RQcm9wZXJ0eVZhbHVlIGludG8gaXRzIGNvbnN0aXR1ZW50IGhvb2sgdmFsdWVzIHRoZW4gZ3JhYiB0aGUgZGVzaXJlZCBob29rIGF0IGl0cyBzdGFuZGFyZCBwb3NpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlU3BsaXQpW2hvb2tQb3NpdGlvbl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHByb3ZpZGVkIGZ1bGxIb29rTmFtZSBpc24ndCBhIHJlZ2lzdGVyZWQgaG9vaywgcmV0dXJuIHRoZSByb290UHJvcGVydHlWYWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogSW5qZWN0IHRoZSBob29rJ3MgdmFsdWUgaW50byBpdHMgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiBUaGlzIGlzIHVzZWQgdG8gcGllY2UgYmFjayB0b2dldGhlciB0aGUgcm9vdCBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgb25jZSBWZWxvY2l0eSBoYXMgdXBkYXRlZCBvbmUgb2YgaXRzIGluZGl2aWR1YWxseSBob29rZWQgdmFsdWVzIHRocm91Z2ggdHdlZW5pbmcuICovXG4gICAgICAgICAgICBpbmplY3RWYWx1ZTogZnVuY3Rpb24gKGZ1bGxIb29rTmFtZSwgaG9va1ZhbHVlLCByb290UHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW2Z1bGxIb29rTmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaG9va0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gaG9va0RhdGFbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBob29rRGF0YVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMsXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShob29rUm9vdCwgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFNwbGl0IHJvb3RQcm9wZXJ0eVZhbHVlIGludG8gaXRzIGluZGl2aWR1YWwgaG9vayB2YWx1ZXMsIHJlcGxhY2UgdGhlIHRhcmdldGVkIHZhbHVlIHdpdGggaG9va1ZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHJlY29uc3RydWN0IHRoZSByb290UHJvcGVydHlWYWx1ZSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMgPSByb290UHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVNwbGl0KTtcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVQYXJ0c1tob29rUG9zaXRpb25dID0gaG9va1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQgPSByb290UHJvcGVydHlWYWx1ZVBhcnRzLmpvaW4oXCIgXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHByb3ZpZGVkIGZ1bGxIb29rTmFtZSBpc24ndCBhIHJlZ2lzdGVyZWQgaG9vaywgcmV0dXJuIHRoZSByb290UHJvcGVydHlWYWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgTm9ybWFsaXphdGlvbnNcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBOb3JtYWxpemF0aW9ucyBzdGFuZGFyZGl6ZSBDU1MgcHJvcGVydHkgbWFuaXB1bGF0aW9uIGJ5IHBvbGx5ZmlsbGluZyBicm93c2VyLXNwZWNpZmljIGltcGxlbWVudGF0aW9ucyAoZS5nLiBvcGFjaXR5KVxuICAgICAgICAgICBhbmQgcmVmb3JtYXR0aW5nIHNwZWNpYWwgcHJvcGVydGllcyAoZS5nLiBjbGlwLCByZ2JhKSB0byBsb29rIGxpa2Ugc3RhbmRhcmQgb25lcy4gKi9cbiAgICAgICAgTm9ybWFsaXphdGlvbnM6IHtcbiAgICAgICAgICAgIC8qIE5vcm1hbGl6YXRpb25zIGFyZSBwYXNzZWQgYSBub3JtYWxpemF0aW9uIHRhcmdldCAoZWl0aGVyIHRoZSBwcm9wZXJ0eSdzIG5hbWUsIGl0cyBleHRyYWN0ZWQgdmFsdWUsIG9yIGl0cyBpbmplY3RlZCB2YWx1ZSksXG4gICAgICAgICAgICAgICB0aGUgdGFyZ2V0ZWQgZWxlbWVudCAod2hpY2ggbWF5IG5lZWQgdG8gYmUgcXVlcmllZCksIGFuZCB0aGUgdGFyZ2V0ZWQgcHJvcGVydHkgdmFsdWUuICovXG4gICAgICAgICAgICByZWdpc3RlcmVkOiB7XG4gICAgICAgICAgICAgICAgY2xpcDogZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImNsaXBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsaXAgbmVlZHMgdG8gYmUgdW53cmFwcGVkIGFuZCBzdHJpcHBlZCBvZiBpdHMgY29tbWFzIGR1cmluZyBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgVmVsb2NpdHkgYWxzbyBleHRyYWN0ZWQgdGhpcyB2YWx1ZSwgc2tpcCBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHRoZSBcInJlY3QoKVwiIHdyYXBwZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0cmlwIG9mZiBjb21tYXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IGV4dHJhY3RlZCA/IGV4dHJhY3RlZFsxXS5yZXBsYWNlKC8sKFxccyspPy9nLCBcIiBcIikgOiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGlwIG5lZWRzIHRvIGJlIHJlLXdyYXBwZWQgZHVyaW5nIGluamVjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJyZWN0KFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGJsdXI6IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBWZWxvY2l0eS5TdGF0ZS5pc0ZpcmVmb3ggPyBcImZpbHRlclwiIDogXCItd2Via2l0LWZpbHRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkID0gcGFyc2VGbG9hdChwcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGV4dHJhY3RlZCBpcyBOYU4sIG1lYW5pbmcgdGhlIHZhbHVlIGlzbid0IGFscmVhZHkgZXh0cmFjdGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKGV4dHJhY3RlZCB8fCBleHRyYWN0ZWQgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibHVyQ29tcG9uZW50ID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKC9ibHVyXFwoKFswLTldK1tBLXpdKylcXCkvaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGZpbHRlciBzdHJpbmcgaGFkIGEgYmx1ciBjb21wb25lbnQsIHJldHVybiBqdXN0IHRoZSBibHVyIHZhbHVlIGFuZCB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibHVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBibHVyQ29tcG9uZW50WzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY29tcG9uZW50IGRvZXNuJ3QgZXhpc3QsIGRlZmF1bHQgYmx1ciB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBCbHVyIG5lZWRzIHRvIGJlIHJlLXdyYXBwZWQgZHVyaW5nIGluamVjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgdGhlIGJsdXIgZWZmZWN0IHRvIGJlIGZ1bGx5IGRlLWFwcGxpZWQsIGl0IG5lZWRzIHRvIGJlIHNldCB0byBcIm5vbmVcIiBpbnN0ZWFkIG9mIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJibHVyKFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAvKiA8PUlFOCBkbyBub3Qgc3VwcG9ydCB0aGUgc3RhbmRhcmQgb3BhY2l0eSBwcm9wZXJ0eS4gVGhleSB1c2UgZmlsdGVyOmFscGhhKG9wYWNpdHk9SU5UKSBpbnN0ZWFkLiAqL1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJmaWx0ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiA8PUlFOCByZXR1cm4gYSBcImZpbHRlclwiIHZhbHVlIG9mIFwiYWxwaGEob3BhY2l0eT1cXGR7MSwzfSlcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRXh0cmFjdCB0aGUgdmFsdWUgYW5kIGNvbnZlcnQgaXQgdG8gYSBkZWNpbWFsIHZhbHVlIHRvIG1hdGNoIHRoZSBzdGFuZGFyZCBDU1Mgb3BhY2l0eSBwcm9wZXJ0eSdzIGZvcm1hdHRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQgPSBwcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goL2FscGhhXFwob3BhY2l0eT0oLiopXFwpL2kpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHRyYWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgdG8gZGVjaW1hbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBleHRyYWN0ZWRbMV0gLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIGV4dHJhY3Rpbmcgb3BhY2l0eSwgZGVmYXVsdCB0byAxIHNpbmNlIGEgbnVsbCB2YWx1ZSBtZWFucyBvcGFjaXR5IGhhc24ndCBiZWVuIHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPcGFjaWZpZWQgZWxlbWVudHMgYXJlIHJlcXVpcmVkIHRvIGhhdmUgdGhlaXIgem9vbSBwcm9wZXJ0eSBzZXQgdG8gYSBub24temVybyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56b29tID0gMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXR0aW5nIHRoZSBmaWx0ZXIgcHJvcGVydHkgb24gZWxlbWVudHMgd2l0aCBjZXJ0YWluIGZvbnQgcHJvcGVydHkgY29tYmluYXRpb25zIGNhbiByZXN1bHQgaW4gYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobHkgdW5hcHBlYWxpbmcgdWx0cmEtYm9sZGluZyBlZmZlY3QuIFRoZXJlJ3Mgbm8gd2F5IHRvIHJlbWVkeSB0aGlzIHRocm91Z2hvdXQgYSB0d2VlbiwgYnV0IGRyb3BwaW5nIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSBhbHRvZ2V0aGVyICh3aGVuIG9wYWNpdHkgaGl0cyAxKSBhdCBsZWFzdHMgZW5zdXJlcyB0aGF0IHRoZSBnbGl0Y2ggaXMgZ29uZSBwb3N0LXR3ZWVuaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChwcm9wZXJ0eVZhbHVlKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBcyBwZXIgdGhlIGZpbHRlciBwcm9wZXJ0eSdzIHNwZWMsIGNvbnZlcnQgdGhlIGRlY2ltYWwgdmFsdWUgdG8gYSB3aG9sZSBudW1iZXIgYW5kIHdyYXAgdGhlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImFscGhhKG9wYWNpdHk9XCIgKyBwYXJzZUludChwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpICogMTAwLCAxMCkgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBXaXRoIGFsbCBvdGhlciBicm93c2Vycywgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWQ7IHJldHVybiB0aGUgc2FtZSB2YWx1ZXMgdGhhdCB3ZXJlIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm9wYWNpdHlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgQmF0Y2hlZCBSZWdpc3RyYXRpb25zXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogTm90ZTogQmF0Y2hlZCBub3JtYWxpemF0aW9ucyBleHRlbmQgdGhlIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkIG9iamVjdC4gKi9cbiAgICAgICAgICAgIHJlZ2lzdGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgVHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtcyBhcmUgdGhlIHN1YnByb3BlcnRpZXMgY29udGFpbmVkIGJ5IHRoZSBDU1MgXCJ0cmFuc2Zvcm1cIiBwcm9wZXJ0eS4gVHJhbnNmb3JtcyBtdXN0IHVuZGVyZ28gbm9ybWFsaXphdGlvblxuICAgICAgICAgICAgICAgICAgIHNvIHRoYXQgdGhleSBjYW4gYmUgcmVmZXJlbmNlZCBpbiBhIHByb3BlcnRpZXMgbWFwIGJ5IHRoZWlyIGluZGl2aWR1YWwgbmFtZXMuICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogV2hlbiB0cmFuc2Zvcm1zIGFyZSBcInNldFwiLCB0aGV5IGFyZSBhY3R1YWxseSBhc3NpZ25lZCB0byBhIHBlci1lbGVtZW50IHRyYW5zZm9ybUNhY2hlLiBXaGVuIGFsbCB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICAgICBzZXR0aW5nIGlzIGNvbXBsZXRlIGNvbXBsZXRlLCBDU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZSgpIG11c3QgYmUgbWFudWFsbHkgY2FsbGVkIHRvIGZsdXNoIHRoZSB2YWx1ZXMgdG8gdGhlIERPTS5cbiAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm0gc2V0dGluZyBpcyBiYXRjaGVkIGluIHRoaXMgd2F5IHRvIGltcHJvdmUgcGVyZm9ybWFuY2U6IHRoZSB0cmFuc2Zvcm0gc3R5bGUgb25seSBuZWVkcyB0byBiZSB1cGRhdGVkXG4gICAgICAgICAgICAgICAgICAgb25jZSB3aGVuIG11bHRpcGxlIHRyYW5zZm9ybSBzdWJwcm9wZXJ0aWVzIGFyZSBiZWluZyBhbmltYXRlZCBzaW11bHRhbmVvdXNseS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTkgYW5kIEFuZHJvaWQgR2luZ2VyYnJlYWQgaGF2ZSBzdXBwb3J0IGZvciAyRCAtLSBidXQgbm90IDNEIC0tIHRyYW5zZm9ybXMuIFNpbmNlIGFuaW1hdGluZyB1bnN1cHBvcnRlZFxuICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIHJlc3VsdHMgaW4gdGhlIGJyb3dzZXIgaWdub3JpbmcgdGhlICplbnRpcmUqIHRyYW5zZm9ybSBzdHJpbmcsIHdlIHByZXZlbnQgdGhlc2UgM0QgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgZnJvbSBiZWluZyBub3JtYWxpemVkIGZvciB0aGVzZSBicm93c2VycyBzbyB0aGF0IHR3ZWVuaW5nIHNraXBzIHRoZXNlIHByb3BlcnRpZXMgYWx0b2dldGhlclxuICAgICAgICAgICAgICAgICAgIChzaW5jZSBpdCB3aWxsIGlnbm9yZSB0aGVtIGFzIGJlaW5nIHVuc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLikgKi9cbiAgICAgICAgICAgICAgICBpZiAoIShJRSA8PSA5KSAmJiAhVmVsb2NpdHkuU3RhdGUuaXNHaW5nZXJicmVhZCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTaW5jZSB0aGUgc3RhbmRhbG9uZSBDU1MgXCJwZXJzcGVjdGl2ZVwiIHByb3BlcnR5IGFuZCB0aGUgQ1NTIHRyYW5zZm9ybSBcInBlcnNwZWN0aXZlXCIgc3VicHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgc2hhcmUgdGhlIHNhbWUgbmFtZSwgdGhlIGxhdHRlciBpcyBnaXZlbiBhIHVuaXF1ZSB0b2tlbiB3aXRoaW4gVmVsb2NpdHk6IFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIi4gKi9cbiAgICAgICAgICAgICAgICAgICAgQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlID0gQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmNvbmNhdChDU1MuTGlzdHMudHJhbnNmb3JtczNEKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvKiBXcmFwIHRoZSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgbm9ybWFsaXphdGlvbiBmdW5jdGlvbiBpbiBhIG5ldyBzY29wZSBzbyB0aGF0IHRyYW5zZm9ybU5hbWUncyB2YWx1ZSBpc1xuICAgICAgICAgICAgICAgICAgICBwYWlyZWQgd2l0aCBpdHMgcmVzcGVjdGl2ZSBmdW5jdGlvbi4gKE90aGVyd2lzZSwgYWxsIGZ1bmN0aW9ucyB3b3VsZCB0YWtlIHRoZSBmaW5hbCBmb3IgbG9vcCdzIHRyYW5zZm9ybU5hbWUuKSAqL1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtTmFtZSA9IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZVtpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbdHJhbnNmb3JtTmFtZV0gPSBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgbm9ybWFsaXplZCBwcm9wZXJ0eSBuYW1lIGlzIHRoZSBwYXJlbnQgXCJ0cmFuc2Zvcm1cIiBwcm9wZXJ0eSAtLSB0aGUgcHJvcGVydHkgdGhhdCBpcyBhY3R1YWxseSBzZXQgaW4gQ1NTLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSB2YWx1ZXMgYXJlIGNhY2hlZCBvbnRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyB0cmFuc2Zvcm0gaGFzIHlldCB0byBiZSBhc3NpZ25lZCBhIHZhbHVlLCByZXR1cm4gaXRzIG51bGwgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkIHx8IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNjYWxlIENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZSBkZWZhdWx0IHRvIDEgd2hlcmVhcyBhbGwgb3RoZXIgdHJhbnNmb3JtIHByb3BlcnRpZXMgZGVmYXVsdCB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvXnNjYWxlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiB0cmFuc2Zvcm0gdmFsdWVzIGFyZSBzZXQsIHRoZXkgYXJlIHdyYXBwZWQgaW4gcGFyZW50aGVzZXMgYXMgcGVyIHRoZSBDU1Mgc3BlYy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdoZW4gZXh0cmFjdGluZyB0aGVpciB2YWx1ZXMgKGZvciB0d2VlbiBjYWxjdWxhdGlvbnMpLCB3ZSBzdHJpcCBvZmYgdGhlIHBhcmVudGhlc2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXS5yZXBsYWNlKC9bKCldL2csIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW52YWxpZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbiBpbmRpdmlkdWFsIHRyYW5zZm9ybSBwcm9wZXJ0eSBjb250YWlucyBhbiB1bnN1cHBvcnRlZCB1bml0IHR5cGUsIHRoZSBicm93c2VyIGlnbm9yZXMgdGhlICplbnRpcmUqIHRyYW5zZm9ybSBwcm9wZXJ0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRodXMsIHByb3RlY3QgdXNlcnMgZnJvbSB0aGVtc2VsdmVzIGJ5IHNraXBwaW5nIHNldHRpbmcgZm9yIHRyYW5zZm9ybSB2YWx1ZXMgc3VwcGxpZWQgd2l0aCBpbnZhbGlkIHVuaXQgdHlwZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTd2l0Y2ggb24gdGhlIGJhc2UgdHJhbnNmb3JtIHR5cGU7IGlnbm9yZSB0aGUgYXhpcyBieSByZW1vdmluZyB0aGUgbGFzdCBsZXR0ZXIgZnJvbSB0aGUgdHJhbnNmb3JtJ3MgbmFtZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJhbnNmb3JtTmFtZS5zdWJzdHIoMCwgdHJhbnNmb3JtTmFtZS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoaXRlbGlzdCB1bml0IHR5cGVzIGZvciBlYWNoIHRyYW5zZm9ybS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNsYXRlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyglfHB4fGVtfHJlbXx2d3x2aHxcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIGFuIGF4aXMtZnJlZSBcInNjYWxlXCIgcHJvcGVydHkgaXMgc3VwcG9ydGVkIGFzIHdlbGwsIGEgbGl0dGxlIGhhY2sgaXMgdXNlZCBoZXJlIHRvIGRldGVjdCBpdCBieSBjaG9wcGluZyBvZmYgaXRzIGxhc3QgbGV0dGVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjYWxlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENocm9tZSBvbiBBbmRyb2lkIGhhcyBhIGJ1ZyBpbiB3aGljaCBzY2FsZWQgZWxlbWVudHMgYmx1ciBpZiB0aGVpciBpbml0aWFsIHNjYWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIGlzIGJlbG93IDEgKHdoaWNoIGNhbiBoYXBwZW4gd2l0aCBmb3JjZWZlZWRpbmcpLiBUaHVzLCB3ZSBkZXRlY3QgYSB5ZXQtdW5zZXQgc2NhbGUgcHJvcGVydHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIGVuc3VyZSB0aGF0IGl0cyBmaXJzdCB2YWx1ZSBpcyBhbHdheXMgMS4gTW9yZSBpbmZvOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNDE3ODkwL2NzczMtYW5pbWF0aW9ucy13aXRoLXRyYW5zZm9ybS1jYXVzZXMtYmx1cnJlZC1lbGVtZW50cy1vbi13ZWJraXQvMTA0MTc5NjIjMTA0MTc5NjIgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzQW5kcm9pZCAmJiBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdID09PSB1bmRlZmluZWQgJiYgcHJvcGVydHlWYWx1ZSA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNrZXdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKGRlZ3xcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyb3RhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKGRlZ3xcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWludmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBcyBwZXIgdGhlIENTUyBzcGVjLCB3cmFwIHRoZSB2YWx1ZSBpbiBwYXJlbnRoZXNlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdID0gXCIoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsdGhvdWdoIHRoZSB2YWx1ZSBpcyBzZXQgb24gdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdCwgcmV0dXJuIHRoZSBuZXdseS11cGRhdGVkIHZhbHVlIGZvciB0aGUgY2FsbGluZyBjb2RlIHRvIHByb2Nlc3MgYXMgbm9ybWFsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICBDb2xvcnNcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogU2luY2UgVmVsb2NpdHkgb25seSBhbmltYXRlcyBhIHNpbmdsZSBudW1lcmljIHZhbHVlIHBlciBwcm9wZXJ0eSwgY29sb3IgYW5pbWF0aW9uIGlzIGFjaGlldmVkIGJ5IGhvb2tpbmcgdGhlIGluZGl2aWR1YWwgUkdCQSBjb21wb25lbnRzIG9mIENTUyBjb2xvciBwcm9wZXJ0aWVzLlxuICAgICAgICAgICAgICAgICAgIEFjY29yZGluZ2x5LCBjb2xvciB2YWx1ZXMgbXVzdCBiZSBub3JtYWxpemVkIChlLmcuIFwiI2ZmMDAwMFwiLCBcInJlZFwiLCBhbmQgXCJyZ2IoMjU1LCAwLCAwKVwiID09PiBcIjI1NSAwIDAgMVwiKSBzbyB0aGF0IHRoZWlyIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkL2V4dHJhY3RlZCBieSBDU1MuSG9va3MgbG9naWMuICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDU1MuTGlzdHMuY29sb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFdyYXAgdGhlIGR5bmFtaWNhbGx5IGdlbmVyYXRlZCBub3JtYWxpemF0aW9uIGZ1bmN0aW9uIGluIGEgbmV3IHNjb3BlIHNvIHRoYXQgY29sb3JOYW1lJ3MgdmFsdWUgaXMgcGFpcmVkIHdpdGggaXRzIHJlc3BlY3RpdmUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGFsbCBmdW5jdGlvbnMgd291bGQgdGFrZSB0aGUgZmluYWwgZm9yIGxvb3AncyBjb2xvck5hbWUuKSAqL1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yTmFtZSA9IENTUy5MaXN0cy5jb2xvcnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluIElFPD04LCB3aGljaCBzdXBwb3J0IHJnYiBidXQgbm90IHJnYmEsIGNvbG9yIHByb3BlcnRpZXMgYXJlIHJldmVydGVkIHRvIHJnYiBieSBzdHJpcHBpbmcgb2ZmIHRoZSBhbHBoYSBjb21wb25lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtjb2xvck5hbWVdID0gZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yTmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCBhbGwgY29sb3IgdmFsdWVzIGludG8gdGhlIHJnYiBmb3JtYXQuIChPbGQgSUUgY2FuIHJldHVybiBoZXggdmFsdWVzIGFuZCBjb2xvciBuYW1lcyBpbnN0ZWFkIG9mIHJnYi9yZ2JhLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb2xvciBpcyBhbHJlYWR5IGluIGl0cyBob29rYWJsZSBmb3JtIChlLmcuIFwiMjU1IDI1NSAyNTUgMVwiKSBkdWUgdG8gaGF2aW5nIGJlZW4gcHJldmlvdXNseSBleHRyYWN0ZWQsIHNraXAgZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXgud3JhcHBlZFZhbHVlQWxyZWFkeUV4dHJhY3RlZC50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JOYW1lcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYWNrOiBcInJnYigwLCAwLCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmx1ZTogXCJyZ2IoMCwgMCwgMjU1KVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JheTogXCJyZ2IoMTI4LCAxMjgsIDEyOClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZWVuOiBcInJnYigwLCAxMjgsIDApXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWQ6IFwicmdiKDI1NSwgMCwgMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlOiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGNvbG9yIG5hbWVzIHRvIHJnYi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL15bQS16XSskL2kudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3JOYW1lc1twcm9wZXJ0eVZhbHVlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzW3Byb3BlcnR5VmFsdWVdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbiB1bm1hdGNoZWQgY29sb3IgbmFtZSBpcyBwcm92aWRlZCwgZGVmYXVsdCB0byBibGFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXMuYmxhY2s7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGhleCB2YWx1ZXMgdG8gcmdiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQ1NTLlJlZ0V4LmlzSGV4LnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVkID0gXCJyZ2IoXCIgKyBDU1MuVmFsdWVzLmhleFRvUmdiKHByb3BlcnR5VmFsdWUpLmpvaW4oXCIgXCIpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHByb3ZpZGVkIGNvbG9yIGRvZXNuJ3QgbWF0Y2ggYW55IG9mIHRoZSBhY2NlcHRlZCBjb2xvciBmb3JtYXRzLCBkZWZhdWx0IHRvIGJsYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoISgvXnJnYmE/XFwoL2kudGVzdChwcm9wZXJ0eVZhbHVlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVkID0gY29sb3JOYW1lcy5ibGFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIHN1cnJvdW5kaW5nIFwicmdiL3JnYmEoKVwiIHN0cmluZyB0aGVuIHJlcGxhY2UgY29tbWFzIHdpdGggc3BhY2VzIGFuZCBzdHJpcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdGVkIHNwYWNlcyAoaW4gY2FzZSB0aGUgdmFsdWUgaW5jbHVkZWQgc3BhY2VzIHRvIGJlZ2luIHdpdGgpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IChjb252ZXJ0ZWQgfHwgcHJvcGVydHlWYWx1ZSkudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csIFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU28gbG9uZyBhcyB0aGlzIGlzbid0IDw9SUU4LCBhZGQgYSBmb3VydGggKGFscGhhKSBjb21wb25lbnQgaWYgaXQncyBtaXNzaW5nIGFuZCBkZWZhdWx0IGl0IHRvIDEgKHZpc2libGUpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoSUUgPD0gOCkgJiYgZXh0cmFjdGVkLnNwbGl0KFwiIFwiKS5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgKz0gXCIgMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmFjdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGlzIElFPD04IGFuZCBhbiBhbHBoYSBjb21wb25lbnQgZXhpc3RzLCBzdHJpcCBpdCBvZmYuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVZhbHVlLnNwbGl0KFwiIFwiKS5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5VmFsdWUuc3BsaXQoL1xccysvKS5zbGljZSgwLCAzKS5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGFkZCBhIGZvdXJ0aCAoYWxwaGEpIGNvbXBvbmVudCBpZiBpdCdzIG1pc3NpbmcgYW5kIGRlZmF1bHQgaXQgdG8gMSAodmlzaWJsZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5VmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgKz0gXCIgMVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZS1pbnNlcnQgdGhlIGJyb3dzZXItYXBwcm9wcmlhdGUgd3JhcHBlcihcInJnYi9yZ2JhKClcIiksIGluc2VydCBjb21tYXMsIGFuZCBzdHJpcCBvZmYgZGVjaW1hbCB1bml0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYWxsIHZhbHVlcyBidXQgdGhlIGZvdXJ0aCAoUiwgRywgYW5kIEIgb25seSBhY2NlcHQgd2hvbGUgbnVtYmVycykuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKElFIDw9IDggPyBcInJnYlwiIDogXCJyZ2JhXCIpICsgXCIoXCIgKyBwcm9wZXJ0eVZhbHVlLnJlcGxhY2UoL1xccysvZywgXCIsXCIpLnJlcGxhY2UoL1xcLihcXGQpKyg/PSwpL2csIFwiXCIpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBDU1MgUHJvcGVydHkgTmFtZXNcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIE5hbWVzOiB7XG4gICAgICAgICAgICAvKiBDYW1lbGNhc2UgYSBwcm9wZXJ0eSBuYW1lIGludG8gaXRzIEphdmFTY3JpcHQgbm90YXRpb24gKGUuZy4gXCJiYWNrZ3JvdW5kLWNvbG9yXCIgPT0+IFwiYmFja2dyb3VuZENvbG9yXCIpLlxuICAgICAgICAgICAgICAgQ2FtZWxjYXNpbmcgaXMgdXNlZCB0byBub3JtYWxpemUgcHJvcGVydHkgbmFtZXMgYmV0d2VlbiBhbmQgYWNyb3NzIGNhbGxzLiAqL1xuICAgICAgICAgICAgY2FtZWxDYXNlOiBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uIChtYXRjaCwgc3ViTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Yk1hdGNoLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiBGb3IgU1ZHIGVsZW1lbnRzLCBzb21lIHByb3BlcnRpZXMgKG5hbWVseSwgZGltZW5zaW9uYWwgb25lcykgYXJlIEdFVC9TRVQgdmlhIHRoZSBlbGVtZW50J3MgSFRNTCBhdHRyaWJ1dGVzIChpbnN0ZWFkIG9mIHZpYSBDU1Mgc3R5bGVzKS4gKi9cbiAgICAgICAgICAgIFNWR0F0dHJpYnV0ZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgdmFyIFNWR0F0dHJpYnV0ZXMgPSBcIndpZHRofGhlaWdodHx4fHl8Y3h8Y3l8cnxyeHxyeXx4MXx4Mnx5MXx5MlwiO1xuXG4gICAgICAgICAgICAgICAgLyogQ2VydGFpbiBicm93c2VycyByZXF1aXJlIGFuIFNWRyB0cmFuc2Zvcm0gdG8gYmUgYXBwbGllZCBhcyBhbiBhdHRyaWJ1dGUuIChPdGhlcndpc2UsIGFwcGxpY2F0aW9uIHZpYSBDU1MgaXMgcHJlZmVyYWJsZSBkdWUgdG8gM0Qgc3VwcG9ydC4pICovXG4gICAgICAgICAgICAgICAgaWYgKElFIHx8IChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgIVZlbG9jaXR5LlN0YXRlLmlzQ2hyb21lKSkge1xuICAgICAgICAgICAgICAgICAgICBTVkdBdHRyaWJ1dGVzICs9IFwifHRyYW5zZm9ybVwiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXihcIiArIFNWR0F0dHJpYnV0ZXMgKyBcIikkXCIsIFwiaVwiKS50ZXN0KHByb3BlcnR5KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qIERldGVybWluZSB3aGV0aGVyIGEgcHJvcGVydHkgc2hvdWxkIGJlIHNldCB3aXRoIGEgdmVuZG9yIHByZWZpeC4gKi9cbiAgICAgICAgICAgIC8qIElmIGEgcHJlZml4ZWQgdmVyc2lvbiBvZiB0aGUgcHJvcGVydHkgZXhpc3RzLCByZXR1cm4gaXQuIE90aGVyd2lzZSwgcmV0dXJuIHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lLlxuICAgICAgICAgICAgICAgSWYgdGhlIHByb3BlcnR5IGlzIG5vdCBhdCBhbGwgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCByZXR1cm4gYSBmYWxzZSBmbGFnLiAqL1xuICAgICAgICAgICAgcHJlZml4Q2hlY2s6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgcHJvcGVydHkgaGFzIGFscmVhZHkgYmVlbiBjaGVja2VkLCByZXR1cm4gdGhlIGNhY2hlZCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0sIHRydWUgXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmVuZG9ycyA9IFsgXCJcIiwgXCJXZWJraXRcIiwgXCJNb3pcIiwgXCJtc1wiLCBcIk9cIiBdO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCB2ZW5kb3JzTGVuZ3RoID0gdmVuZG9ycy5sZW5ndGg7IGkgPCB2ZW5kb3JzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVByZWZpeGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FwaXRhbGl6ZSB0aGUgZmlyc3QgbGV0dGVyIG9mIHRoZSBwcm9wZXJ0eSB0byBjb25mb3JtIHRvIEphdmFTY3JpcHQgdmVuZG9yIHByZWZpeCBub3RhdGlvbiAoZS5nLiB3ZWJraXRGaWx0ZXIpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSB2ZW5kb3JzW2ldICsgcHJvcGVydHkucmVwbGFjZSgvXlxcdy8sIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiBtYXRjaC50b1VwcGVyQ2FzZSgpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhpcyBwcm9wZXJ0eSBhcyBwcmVmaXhlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKFZlbG9jaXR5LlN0YXRlLnByZWZpeEVsZW1lbnQuc3R5bGVbcHJvcGVydHlQcmVmaXhlZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIG1hdGNoLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnByZWZpeE1hdGNoZXNbcHJvcGVydHldID0gcHJvcGVydHlQcmVmaXhlZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbIHByb3BlcnR5UHJlZml4ZWQsIHRydWUgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHByb3BlcnR5IGluIGFueSBmb3JtLCBpbmNsdWRlIGEgZmFsc2UgZmxhZyBzbyB0aGF0IHRoZSBjYWxsZXIgY2FuIGRlY2lkZSBob3cgdG8gcHJvY2VlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgcHJvcGVydHksIGZhbHNlIF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgQ1NTIFByb3BlcnR5IFZhbHVlc1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgVmFsdWVzOiB7XG4gICAgICAgICAgICAvKiBIZXggdG8gUkdCIGNvbnZlcnNpb24uIENvcHlyaWdodCBUaW0gRG93bjogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NjIzODM4L3JnYi10by1oZXgtYW5kLWhleC10by1yZ2IgKi9cbiAgICAgICAgICAgIGhleFRvUmdiOiBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3J0Zm9ybVJlZ2V4ID0gL14jPyhbYS1mXFxkXSkoW2EtZlxcZF0pKFthLWZcXGRdKSQvaSxcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2Zvcm1SZWdleCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2ksXG4gICAgICAgICAgICAgICAgICAgIHJnYlBhcnRzO1xuXG4gICAgICAgICAgICAgICAgaGV4ID0gaGV4LnJlcGxhY2Uoc2hvcnRmb3JtUmVnZXgsIGZ1bmN0aW9uIChtLCByLCBnLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZ2JQYXJ0cyA9IGxvbmdmb3JtUmVnZXguZXhlYyhoZXgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJnYlBhcnRzID8gWyBwYXJzZUludChyZ2JQYXJ0c1sxXSwgMTYpLCBwYXJzZUludChyZ2JQYXJ0c1syXSwgMTYpLCBwYXJzZUludChyZ2JQYXJ0c1szXSwgMTYpIF0gOiBbIDAsIDAsIDAgXTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGlzQ1NTTnVsbFZhbHVlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvKiBUaGUgYnJvd3NlciBkZWZhdWx0cyBDU1MgdmFsdWVzIHRoYXQgaGF2ZSBub3QgYmVlbiBzZXQgdG8gZWl0aGVyIDAgb3Igb25lIG9mIHNldmVyYWwgcG9zc2libGUgbnVsbC12YWx1ZSBzdHJpbmdzLlxuICAgICAgICAgICAgICAgICAgIFRodXMsIHdlIGNoZWNrIGZvciBib3RoIGZhbHNpbmVzcyBhbmQgdGhlc2Ugc3BlY2lhbCBzdHJpbmdzLiAqL1xuICAgICAgICAgICAgICAgIC8qIE51bGwtdmFsdWUgY2hlY2tpbmcgaXMgcGVyZm9ybWVkIHRvIGRlZmF1bHQgdGhlIHNwZWNpYWwgc3RyaW5ncyB0byAwIChmb3IgdGhlIHNha2Ugb2YgdHdlZW5pbmcpIG9yIHRoZWlyIGhvb2tcbiAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMgYXMgZGVmaW5lZCBhcyBDU1MuSG9va3MgKGZvciB0aGUgc2FrZSBvZiBob29rIGluamVjdGlvbi9leHRyYWN0aW9uKS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBDaHJvbWUgcmV0dXJucyBcInJnYmEoMCwgMCwgMCwgMClcIiBmb3IgYW4gdW5kZWZpbmVkIGNvbG9yIHdoZXJlYXMgSUUgcmV0dXJucyBcInRyYW5zcGFyZW50XCIuICovXG4gICAgICAgICAgICAgICAgcmV0dXJuICh2YWx1ZSA9PSAwIHx8IC9eKG5vbmV8YXV0b3x0cmFuc3BhcmVudHwocmdiYVxcKDAsID8wLCA/MCwgPzBcXCkpKSQvaS50ZXN0KHZhbHVlKSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiBSZXRyaWV2ZSBhIHByb3BlcnR5J3MgZGVmYXVsdCB1bml0IHR5cGUuIFVzZWQgZm9yIGFzc2lnbmluZyBhIHVuaXQgdHlwZSB3aGVuIG9uZSBpcyBub3Qgc3VwcGxpZWQgYnkgdGhlIHVzZXIuICovXG4gICAgICAgICAgICBnZXRVbml0VHlwZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKC9eKHJvdGF0ZXxza2V3KS9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImRlZ1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoLyheKHNjYWxlfHNjYWxlWHxzY2FsZVl8c2NhbGVafGFscGhhfGZsZXhHcm93fGZsZXhIZWlnaHR8ekluZGV4fGZvbnRXZWlnaHQpJCl8KChvcGFjaXR5fHJlZHxncmVlbnxibHVlfGFscGhhKSQpL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGFib3ZlIHByb3BlcnRpZXMgYXJlIHVuaXRsZXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIHB4IGZvciBhbGwgb3RoZXIgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiBIVE1MIGVsZW1lbnRzIGRlZmF1bHQgdG8gYW4gYXNzb2NpYXRlZCBkaXNwbGF5IHR5cGUgd2hlbiB0aGV5J3JlIG5vdCBzZXQgdG8gZGlzcGxheTpub25lLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGZvciBjb3JyZWN0bHkgc2V0dGluZyB0aGUgbm9uLVwibm9uZVwiIGRpc3BsYXkgdmFsdWUgaW4gY2VydGFpbiBWZWxvY2l0eSByZWRpcmVjdHMsIHN1Y2ggYXMgZmFkZUluL091dC4gKi9cbiAgICAgICAgICAgIGdldERpc3BsYXlUeXBlOiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHZhciB0YWdOYW1lID0gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKC9eKGJ8YmlnfGl8c21hbGx8dHR8YWJicnxhY3JvbnltfGNpdGV8Y29kZXxkZm58ZW18a2JkfHN0cm9uZ3xzYW1wfHZhcnxhfGJkb3xicnxpbWd8bWFwfG9iamVjdHxxfHNjcmlwdHxzcGFufHN1YnxzdXB8YnV0dG9ufGlucHV0fGxhYmVsfHNlbGVjdHx0ZXh0YXJlYSkkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmxpbmVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eKGxpKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImxpc3QtaXRlbVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odHIpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidGFibGUtcm93XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXih0YWJsZSkkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odGJvZHkpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidGFibGUtcm93LWdyb3VwXCI7XG4gICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBcImJsb2NrXCIgd2hlbiBubyBtYXRjaCBpcyBmb3VuZC4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qIFRoZSBjbGFzcyBhZGQvcmVtb3ZlIGZ1bmN0aW9ucyBhcmUgdXNlZCB0byB0ZW1wb3JhcmlseSBhcHBseSBhIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgY2xhc3MgdG8gZWxlbWVudHMgd2hpbGUgdGhleSdyZSBhbmltYXRpbmcuICovXG4gICAgICAgICAgICBhZGRDbGFzczogZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAoZWxlbWVudC5jbGFzc05hbWUubGVuZ3RoID8gXCIgXCIgOiBcIlwiKSArIGNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVDbGFzczogZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnRvU3RyaW5nKCkucmVwbGFjZShuZXcgUmVnRXhwKFwiKF58XFxcXHMpXCIgKyBjbGFzc05hbWUuc3BsaXQoXCIgXCIpLmpvaW4oXCJ8XCIpICsgXCIoXFxcXHN8JClcIiwgXCJnaVwiKSwgXCIgXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBTdHlsZSBHZXR0aW5nICYgU2V0dGluZ1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFRoZSBzaW5ndWxhciBnZXRQcm9wZXJ0eVZhbHVlLCB3aGljaCByb3V0ZXMgdGhlIGxvZ2ljIGZvciBhbGwgbm9ybWFsaXphdGlvbnMsIGhvb2tzLCBhbmQgc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMuICovXG4gICAgICAgIGdldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uIChlbGVtZW50LCBwcm9wZXJ0eSwgcm9vdFByb3BlcnR5VmFsdWUsIGZvcmNlU3R5bGVMb29rdXApIHtcbiAgICAgICAgICAgIC8qIEdldCBhbiBlbGVtZW50J3MgY29tcHV0ZWQgcHJvcGVydHkgdmFsdWUuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBSZXRyaWV2aW5nIHRoZSB2YWx1ZSBvZiBhIENTUyBwcm9wZXJ0eSBjYW5ub3Qgc2ltcGx5IGJlIHBlcmZvcm1lZCBieSBjaGVja2luZyBhbiBlbGVtZW50J3NcbiAgICAgICAgICAgICAgIHN0eWxlIGF0dHJpYnV0ZSAod2hpY2ggb25seSByZWZsZWN0cyB1c2VyLWRlZmluZWQgdmFsdWVzKS4gSW5zdGVhZCwgdGhlIGJyb3dzZXIgbXVzdCBiZSBxdWVyaWVkIGZvciBhIHByb3BlcnR5J3NcbiAgICAgICAgICAgICAgICpjb21wdXRlZCogdmFsdWUuIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IGdldENvbXB1dGVkU3R5bGUgaGVyZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlICovXG4gICAgICAgICAgICBmdW5jdGlvbiBjb21wdXRlUHJvcGVydHlWYWx1ZSAoZWxlbWVudCwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAvKiBXaGVuIGJveC1zaXppbmcgaXNuJ3Qgc2V0IHRvIGJvcmRlci1ib3gsIGhlaWdodCBhbmQgd2lkdGggc3R5bGUgdmFsdWVzIGFyZSBpbmNvcnJlY3RseSBjb21wdXRlZCB3aGVuIGFuXG4gICAgICAgICAgICAgICAgICAgZWxlbWVudCdzIHNjcm9sbGJhcnMgYXJlIHZpc2libGUgKHdoaWNoIGV4cGFuZHMgdGhlIGVsZW1lbnQncyBkaW1lbnNpb25zKS4gVGh1cywgd2UgZGVmZXIgdG8gdGhlIG1vcmUgYWNjdXJhdGVcbiAgICAgICAgICAgICAgICAgICBvZmZzZXRIZWlnaHQvV2lkdGggcHJvcGVydHksIHdoaWNoIGluY2x1ZGVzIHRoZSB0b3RhbCBkaW1lbnNpb25zIGZvciBpbnRlcmlvciwgYm9yZGVyLCBwYWRkaW5nLCBhbmQgc2Nyb2xsYmFyLlxuICAgICAgICAgICAgICAgICAgIFdlIHN1YnRyYWN0IGJvcmRlciBhbmQgcGFkZGluZyB0byBnZXQgdGhlIHN1bSBvZiBpbnRlcmlvciArIHNjcm9sbGJhci4gKi9cbiAgICAgICAgICAgICAgICB2YXIgY29tcHV0ZWRWYWx1ZSA9IDA7XG5cbiAgICAgICAgICAgICAgICAvKiBJRTw9OCBkb2Vzbid0IHN1cHBvcnQgd2luZG93LmdldENvbXB1dGVkU3R5bGUsIHRodXMgd2UgZGVmZXIgdG8galF1ZXJ5LCB3aGljaCBoYXMgYW4gZXh0ZW5zaXZlIGFycmF5XG4gICAgICAgICAgICAgICAgICAgb2YgaGFja3MgdG8gYWNjdXJhdGVseSByZXRyaWV2ZSBJRTggcHJvcGVydHkgdmFsdWVzLiBSZS1pbXBsZW1lbnRpbmcgdGhhdCBsb2dpYyBoZXJlIGlzIG5vdCB3b3J0aCBibG9hdGluZyB0aGVcbiAgICAgICAgICAgICAgICAgICBjb2RlYmFzZSBmb3IgYSBkeWluZyBicm93c2VyLiBUaGUgcGVyZm9ybWFuY2UgcmVwZXJjdXNzaW9ucyBvZiB1c2luZyBqUXVlcnkgaGVyZSBhcmUgbWluaW1hbCBzaW5jZVxuICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5IGlzIG9wdGltaXplZCB0byByYXJlbHkgKGFuZCBzb21ldGltZXMgbmV2ZXIpIHF1ZXJ5IHRoZSBET00uIEZ1cnRoZXIsIHRoZSAkLmNzcygpIGNvZGVwYXRoIGlzbid0IHRoYXQgc2xvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoSUUgPD0gOCkge1xuICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gJC5jc3MoZWxlbWVudCwgcHJvcGVydHkpOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAvKiBBbGwgb3RoZXIgYnJvd3NlcnMgc3VwcG9ydCBnZXRDb21wdXRlZFN0eWxlLiBUaGUgcmV0dXJuZWQgbGl2ZSBvYmplY3QgcmVmZXJlbmNlIGlzIGNhY2hlZCBvbnRvIGl0c1xuICAgICAgICAgICAgICAgICAgIGFzc29jaWF0ZWQgZWxlbWVudCBzbyB0aGF0IGl0IGRvZXMgbm90IG5lZWQgdG8gYmUgcmVmZXRjaGVkIHVwb24gZXZlcnkgR0VULiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEJyb3dzZXJzIGRvIG5vdCByZXR1cm4gaGVpZ2h0IGFuZCB3aWR0aCB2YWx1ZXMgZm9yIGVsZW1lbnRzIHRoYXQgYXJlIHNldCB0byBkaXNwbGF5Olwibm9uZVwiLiBUaHVzLCB3ZSB0ZW1wb3JhcmlseVxuICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUgZGlzcGxheSB0byB0aGUgZWxlbWVudCB0eXBlJ3MgZGVmYXVsdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvZ2dsZURpc3BsYXkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoL14od2lkdGh8aGVpZ2h0KSQvLnRlc3QocHJvcGVydHkpICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9nZ2xlRGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShlbGVtZW50KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiByZXZlcnREaXNwbGF5ICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2dnbGVEaXNwbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm9yY2VTdHlsZUxvb2t1cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImhlaWdodFwiICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSAhPT0gXCJib3JkZXItYm94XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEJveEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJUb3BXaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlckJvdHRvbVdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ1RvcFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdCb3R0b21cIikpIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50Qm94SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wZXJ0eSA9PT0gXCJ3aWR0aFwiICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSAhPT0gXCJib3JkZXItYm94XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEJveFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyTGVmdFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyUmlnaHRXaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdMZWZ0XCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ1JpZ2h0XCIpKSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudEJveFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbXB1dGVkU3R5bGU7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIGVsZW1lbnRzIHRoYXQgVmVsb2NpdHkgaGFzbid0IGJlZW4gY2FsbGVkIG9uIGRpcmVjdGx5IChlLmcuIHdoZW4gVmVsb2NpdHkgcXVlcmllcyB0aGUgRE9NIG9uIGJlaGFsZlxuICAgICAgICAgICAgICAgICAgICAgICBvZiBhIHBhcmVudCBvZiBhbiBlbGVtZW50IGl0cyBhbmltYXRpbmcpLCBwZXJmb3JtIGEgZGlyZWN0IGdldENvbXB1dGVkU3R5bGUgbG9va3VwIHNpbmNlIHRoZSBvYmplY3QgaXNuJ3QgY2FjaGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY29tcHV0ZWRTdHlsZSBvYmplY3QgaGFzIHlldCB0byBiZSBjYWNoZWQsIGRvIHNvIG5vdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiBjb21wdXRlZFN0eWxlIGlzIGNhY2hlZCwgdXNlIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZSA9IERhdGEoZWxlbWVudCkuY29tcHV0ZWRTdHlsZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElFIGFuZCBGaXJlZm94IGRvIG5vdCByZXR1cm4gYSB2YWx1ZSBmb3IgdGhlIGdlbmVyaWMgYm9yZGVyQ29sb3IgLS0gdGhleSBvbmx5IHJldHVybiBpbmRpdmlkdWFsIHZhbHVlcyBmb3IgZWFjaCBib3JkZXIgc2lkZSdzIGNvbG9yLlxuICAgICAgICAgICAgICAgICAgICAgICBBbHNvLCBpbiBhbGwgYnJvd3NlcnMsIHdoZW4gYm9yZGVyIGNvbG9ycyBhcmVuJ3QgYWxsIHRoZSBzYW1lLCBhIGNvbXBvdW5kIHZhbHVlIGlzIHJldHVybmVkIHRoYXQgVmVsb2NpdHkgaXNuJ3Qgc2V0dXAgdG8gcGFyc2UuXG4gICAgICAgICAgICAgICAgICAgICAgIFNvLCBhcyBhIHBvbHlmaWxsIGZvciBxdWVyeWluZyBpbmRpdmlkdWFsIGJvcmRlciBzaWRlIGNvbG9ycywgd2UganVzdCByZXR1cm4gdGhlIHRvcCBib3JkZXIncyBjb2xvciBhbmQgYW5pbWF0ZSBhbGwgYm9yZGVycyBmcm9tIHRoYXQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJib3JkZXJDb2xvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwiYm9yZGVyVG9wQ29sb3JcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIElFOSBoYXMgYSBidWcgaW4gd2hpY2ggdGhlIFwiZmlsdGVyXCIgcHJvcGVydHkgbXVzdCBiZSBhY2Nlc3NlZCBmcm9tIGNvbXB1dGVkU3R5bGUgdXNpbmcgdGhlIGdldFByb3BlcnR5VmFsdWUgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgICAgIGluc3RlYWQgb2YgYSBkaXJlY3QgcHJvcGVydHkgbG9va3VwLiBUaGUgZ2V0UHJvcGVydHlWYWx1ZSBtZXRob2QgaXMgc2xvd2VyIHRoYW4gYSBkaXJlY3QgbG9va3VwLCB3aGljaCBpcyB3aHkgd2UgYXZvaWQgaXQgYnkgZGVmYXVsdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKElFID09PSA5ICYmIHByb3BlcnR5ID09PSBcImZpbHRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gY29tcHV0ZWRTdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBGYWxsIGJhY2sgdG8gdGhlIHByb3BlcnR5J3Mgc3R5bGUgdmFsdWUgKGlmIGRlZmluZWQpIHdoZW4gY29tcHV0ZWRWYWx1ZSByZXR1cm5zIG5vdGhpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIGNhbiBoYXBwZW4gd2hlbiB0aGUgZWxlbWVudCBoYXNuJ3QgYmVlbiBwYWludGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcHV0ZWRWYWx1ZSA9PT0gXCJcIiB8fCBjb21wdXRlZFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogRm9yIHRvcCwgcmlnaHQsIGJvdHRvbSwgYW5kIGxlZnQgKFRSQkwpIHZhbHVlcyB0aGF0IGFyZSBzZXQgdG8gXCJhdXRvXCIgb24gZWxlbWVudHMgb2YgXCJmaXhlZFwiIG9yIFwiYWJzb2x1dGVcIiBwb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICBkZWZlciB0byBqUXVlcnkgZm9yIGNvbnZlcnRpbmcgXCJhdXRvXCIgdG8gYSBudW1lcmljIHZhbHVlLiAoRm9yIGVsZW1lbnRzIHdpdGggYSBcInN0YXRpY1wiIG9yIFwicmVsYXRpdmVcIiBwb3NpdGlvbiwgXCJhdXRvXCIgaGFzIHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgICAgZWZmZWN0IGFzIGJlaW5nIHNldCB0byAwLCBzbyBubyBjb252ZXJzaW9uIGlzIG5lY2Vzc2FyeS4pICovXG4gICAgICAgICAgICAgICAgLyogQW4gZXhhbXBsZSBvZiB3aHkgbnVtZXJpYyBjb252ZXJzaW9uIGlzIG5lY2Vzc2FyeTogV2hlbiBhbiBlbGVtZW50IHdpdGggXCJwb3NpdGlvbjphYnNvbHV0ZVwiIGhhcyBhbiB1bnRvdWNoZWQgXCJsZWZ0XCJcbiAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSwgd2hpY2ggcmV2ZXJ0cyB0byBcImF1dG9cIiwgbGVmdCdzIHZhbHVlIGlzIDAgcmVsYXRpdmUgdG8gaXRzIHBhcmVudCBlbGVtZW50LCBidXQgaXMgb2Z0ZW4gbm9uLXplcm8gcmVsYXRpdmVcbiAgICAgICAgICAgICAgICAgICB0byBpdHMgKmNvbnRhaW5pbmcqIChub3QgcGFyZW50KSBlbGVtZW50LCB3aGljaCBpcyB0aGUgbmVhcmVzdCBcInBvc2l0aW9uOnJlbGF0aXZlXCIgYW5jZXN0b3Igb3IgdGhlIHZpZXdwb3J0IChhbmQgYWx3YXlzIHRoZSB2aWV3cG9ydCBpbiB0aGUgY2FzZSBvZiBcInBvc2l0aW9uOmZpeGVkXCIpLiAqL1xuICAgICAgICAgICAgICAgIGlmIChjb21wdXRlZFZhbHVlID09PSBcImF1dG9cIiAmJiAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicG9zaXRpb25cIik7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBhYnNvbHV0ZSBwb3NpdGlvbmluZywgalF1ZXJ5J3MgJC5wb3NpdGlvbigpIG9ubHkgcmV0dXJucyB2YWx1ZXMgZm9yIHRvcCBhbmQgbGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQgYW5kIGJvdHRvbSB3aWxsIGhhdmUgdGhlaXIgXCJhdXRvXCIgdmFsdWUgcmV2ZXJ0ZWQgdG8gMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogQSBqUXVlcnkgb2JqZWN0IG11c3QgYmUgY3JlYXRlZCBoZXJlIHNpbmNlIGpRdWVyeSBkb2Vzbid0IGhhdmUgYSBsb3ctbGV2ZWwgYWxpYXMgZm9yICQucG9zaXRpb24oKS5cbiAgICAgICAgICAgICAgICAgICAgICAgTm90IGEgYmlnIGRlYWwgc2luY2Ugd2UncmUgY3VycmVudGx5IGluIGEgR0VUIGJhdGNoIGFueXdheS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvc2l0aW9uID09PSBcImZpeGVkXCIgfHwgKHBvc2l0aW9uID09PSBcImFic29sdXRlXCIgJiYgL3RvcHxsZWZ0L2kudGVzdChwcm9wZXJ0eSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBqUXVlcnkgc3RyaXBzIHRoZSBwaXhlbCB1bml0IGZyb20gaXRzIHJldHVybmVkIHZhbHVlczsgd2UgcmUtYWRkIGl0IGhlcmUgdG8gY29uZm9ybSB3aXRoIGNvbXB1dGVQcm9wZXJ0eVZhbHVlJ3MgYmVoYXZpb3IuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gJChlbGVtZW50KS5wb3NpdGlvbigpW3Byb3BlcnR5XSArIFwicHhcIjsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWU7XG5cbiAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgYSBob29rZWQgcHJvcGVydHkgKGUuZy4gXCJjbGlwTGVmdFwiIGluc3RlYWQgb2YgdGhlIHJvb3QgcHJvcGVydHkgb2YgXCJjbGlwXCIpLFxuICAgICAgICAgICAgICAgZXh0cmFjdCB0aGUgaG9vaydzIHZhbHVlIGZyb20gYSBub3JtYWxpemVkIHJvb3RQcm9wZXJ0eVZhbHVlIHVzaW5nIENTUy5Ib29rcy5leHRyYWN0VmFsdWUoKS4gKi9cbiAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgaG9vayA9IHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICBob29rUm9vdCA9IENTUy5Ib29rcy5nZXRSb290KGhvb2spO1xuXG4gICAgICAgICAgICAgICAgLyogSWYgYSBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUgd2Fzbid0IHBhc3NlZCBpbiAod2hpY2ggVmVsb2NpdHkgYWx3YXlzIGF0dGVtcHRzIHRvIGRvIGluIG9yZGVyIHRvIGF2b2lkIHJlcXVlcnlpbmcgdGhlIERPTSksXG4gICAgICAgICAgICAgICAgICAgcXVlcnkgdGhlIERPTSBmb3IgdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAocm9vdFByb3BlcnR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgYnJvd3NlciBpcyBub3cgYmVpbmcgZGlyZWN0bHkgcXVlcmllZCwgdXNlIHRoZSBvZmZpY2lhbCBwb3N0LXByZWZpeGluZyBwcm9wZXJ0eSBuYW1lIGZvciB0aGlzIGxvb2t1cC4gKi9cbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2soaG9va1Jvb3QpWzBdKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhpcyByb290IGhhcyBhIG5vcm1hbGl6YXRpb24gcmVnaXN0ZXJlZCwgcGVmb3JtIHRoZSBhc3NvY2lhdGVkIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKFwiZXh0cmFjdFwiLCBlbGVtZW50LCByb290UHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogRXh0cmFjdCB0aGUgaG9vaydzIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuZXh0cmFjdFZhbHVlKGhvb2ssIHJvb3RQcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgLyogSWYgdGhpcyBpcyBhIG5vcm1hbGl6ZWQgcHJvcGVydHkgKGUuZy4gXCJvcGFjaXR5XCIgYmVjb21lcyBcImZpbHRlclwiIGluIDw9SUU4KSBvciBcInRyYW5zbGF0ZVhcIiBiZWNvbWVzIFwidHJhbnNmb3JtXCIpLFxuICAgICAgICAgICAgICAgbm9ybWFsaXplIHRoZSBwcm9wZXJ0eSdzIG5hbWUgYW5kIHZhbHVlLCBhbmQgaGFuZGxlIHRoZSBzcGVjaWFsIGNhc2Ugb2YgdHJhbnNmb3Jtcy4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IE5vcm1hbGl6aW5nIGEgcHJvcGVydHkgaXMgbXV0dWFsbHkgZXhjbHVzaXZlIGZyb20gaG9va2luZyBhIHByb3BlcnR5IHNpbmNlIGhvb2stZXh0cmFjdGVkIHZhbHVlcyBhcmUgc3RyaWN0bHlcbiAgICAgICAgICAgICAgIG51bWVyaWNhbCBhbmQgdGhlcmVmb3JlIGRvIG5vdCByZXF1aXJlIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbi4gKi9cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlO1xuXG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5TmFtZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcIm5hbWVcIiwgZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gdmFsdWVzIGFyZSBjYWxjdWxhdGVkIHZpYSBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24gKHNlZSBiZWxvdyksIHdoaWNoIGNoZWNrcyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgdHJhbnNmb3JtQ2FjaGUuXG4gICAgICAgICAgICAgICAgICAgQXQgbm8gcG9pbnQgZG8gdHJhbnNmb3JtIEdFVHMgZXZlciBhY3R1YWxseSBxdWVyeSB0aGUgRE9NOyBpbml0aWFsIHN0eWxlc2hlZXQgdmFsdWVzIGFyZSBuZXZlciBwcm9jZXNzZWQuXG4gICAgICAgICAgICAgICAgICAgVGhpcyBpcyBiZWNhdXNlIHBhcnNpbmcgM0QgdHJhbnNmb3JtIG1hdHJpY2VzIGlzIG5vdCBhbHdheXMgYWNjdXJhdGUgYW5kIHdvdWxkIGJsb2F0IG91ciBjb2RlYmFzZTtcbiAgICAgICAgICAgICAgICAgICB0aHVzLCBub3JtYWxpemF0aW9uIGV4dHJhY3Rpb24gZGVmYXVsdHMgaW5pdGlhbCB0cmFuc2Zvcm0gdmFsdWVzIHRvIHRoZWlyIHplcm8tdmFsdWVzIChlLmcuIDEgZm9yIHNjYWxlWCBhbmQgMCBmb3IgdHJhbnNsYXRlWCkuICovXG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUgIT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUgPSBjb21wdXRlUHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2sobm9ybWFsaXplZFByb3BlcnR5TmFtZSlbMF0pOyAvKiBHRVQgKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgdmFsdWUgaXMgYSBDU1MgbnVsbC12YWx1ZSBhbmQgdGhpcyBwcm9wZXJ0eSBoYXMgYSBob29rIHRlbXBsYXRlLCB1c2UgdGhhdCB6ZXJvLXZhbHVlIHRlbXBsYXRlIHNvIHRoYXQgaG9va3MgY2FuIGJlIGV4dHJhY3RlZCBmcm9tIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlZhbHVlcy5pc0NTU051bGxWYWx1ZShub3JtYWxpemVkUHJvcGVydHlWYWx1ZSkgJiYgQ1NTLkhvb2tzLnRlbXBsYXRlc1twcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1twcm9wZXJ0eV1bMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwiZXh0cmFjdFwiLCBlbGVtZW50LCBub3JtYWxpemVkUHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIElmIGEgKG51bWVyaWMpIHZhbHVlIHdhc24ndCBwcm9kdWNlZCB2aWEgaG9vayBleHRyYWN0aW9uIG9yIG5vcm1hbGl6YXRpb24sIHF1ZXJ5IHRoZSBET00uICovXG4gICAgICAgICAgICBpZiAoIS9eW1xcZC1dLy50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLyogRm9yIFNWRyBlbGVtZW50cywgZGltZW5zaW9uYWwgcHJvcGVydGllcyAod2hpY2ggU1ZHQXR0cmlidXRlKCkgZGV0ZWN0cykgYXJlIHR3ZWVuZWQgdmlhXG4gICAgICAgICAgICAgICAgICAgdGhlaXIgSFRNTCBhdHRyaWJ1dGUgdmFsdWVzIGluc3RlYWQgb2YgdGhlaXIgQ1NTIHN0eWxlIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSAmJiBEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSBoZWlnaHQvd2lkdGggYXR0cmlidXRlIHZhbHVlcyBtdXN0IGJlIHNldCBtYW51YWxseSwgdGhleSBkb24ndCByZWZsZWN0IGNvbXB1dGVkIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgd2UgdXNlIHVzZSBnZXRCQm94KCkgdG8gZW5zdXJlIHdlIGFsd2F5cyBnZXQgdmFsdWVzIGZvciBlbGVtZW50cyB3aXRoIHVuZGVmaW5lZCBoZWlnaHQvd2lkdGggYXR0cmlidXRlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eKGhlaWdodHx3aWR0aCkkL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpcmVmb3ggdGhyb3dzIGFuIGVycm9yIGlmIC5nZXRCQm94KCkgaXMgY2FsbGVkIG9uIGFuIFNWRyB0aGF0IGlzbid0IGF0dGFjaGVkIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBlbGVtZW50LmdldEJCb3goKVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGFjY2VzcyB0aGUgYXR0cmlidXRlIHZhbHVlIGRpcmVjdGx5LiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBjb21wdXRlUHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2socHJvcGVydHkpWzBdKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBTaW5jZSBwcm9wZXJ0eSBsb29rdXBzIGFyZSBmb3IgYW5pbWF0aW9uIHB1cnBvc2VzICh3aGljaCBlbnRhaWxzIGNvbXB1dGluZyB0aGUgbnVtZXJpYyBkZWx0YSBiZXR3ZWVuIHN0YXJ0IGFuZCBlbmQgdmFsdWVzKSxcbiAgICAgICAgICAgICAgIGNvbnZlcnQgQ1NTIG51bGwtdmFsdWVzIHRvIGFuIGludGVnZXIgb2YgdmFsdWUgMC4gKi9cbiAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAyKSBjb25zb2xlLmxvZyhcIkdldCBcIiArIHByb3BlcnR5ICsgXCI6IFwiICsgcHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIFRoZSBzaW5ndWxhciBzZXRQcm9wZXJ0eVZhbHVlLCB3aGljaCByb3V0ZXMgdGhlIGxvZ2ljIGZvciBhbGwgbm9ybWFsaXphdGlvbnMsIGhvb2tzLCBhbmQgc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMuICovXG4gICAgICAgIHNldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uKGVsZW1lbnQsIHByb3BlcnR5LCBwcm9wZXJ0eVZhbHVlLCByb290UHJvcGVydHlWYWx1ZSwgc2Nyb2xsRGF0YSkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5O1xuXG4gICAgICAgICAgICAvKiBJbiBvcmRlciB0byBiZSBzdWJqZWN0ZWQgdG8gY2FsbCBvcHRpb25zIGFuZCBlbGVtZW50IHF1ZXVlaW5nLCBzY3JvbGwgYW5pbWF0aW9uIGlzIHJvdXRlZCB0aHJvdWdoIFZlbG9jaXR5IGFzIGlmIGl0IHdlcmUgYSBzdGFuZGFyZCBDU1MgcHJvcGVydHkuICovXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwic2Nyb2xsXCIpIHtcbiAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbnRhaW5lciBvcHRpb24gaXMgcHJlc2VudCwgc2Nyb2xsIHRoZSBjb250YWluZXIgaW5zdGVhZCBvZiB0aGUgYnJvd3NlciB3aW5kb3cuICovXG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbERhdGEuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbERhdGEuY29udGFpbmVyW1wic2Nyb2xsXCIgKyBzY3JvbGxEYXRhLmRpcmVjdGlvbl0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgVmVsb2NpdHkgZGVmYXVsdHMgdG8gc2Nyb2xsaW5nIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsRGF0YS5kaXJlY3Rpb24gPT09IFwiTGVmdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8ocHJvcGVydHlWYWx1ZSwgc2Nyb2xsRGF0YS5hbHRlcm5hdGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsRGF0YS5hbHRlcm5hdGVWYWx1ZSwgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybXMgKHRyYW5zbGF0ZVgsIHJvdGF0ZVosIGV0Yy4pIGFyZSBhcHBsaWVkIHRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LCB3aGljaCBpcyBtYW51YWxseSBmbHVzaGVkIHZpYSBmbHVzaFRyYW5zZm9ybUNhY2hlKCkuXG4gICAgICAgICAgICAgICAgICAgVGh1cywgZm9yIG5vdywgd2UgbWVyZWx5IGNhY2hlIHRyYW5zZm9ybXMgYmVpbmcgU0VULiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0gJiYgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwibmFtZVwiLCBlbGVtZW50KSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICAvKiBQZXJmb3JtIGEgbm9ybWFsaXphdGlvbiBpbmplY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBub3JtYWxpemF0aW9uIGxvZ2ljIGhhbmRsZXMgdGhlIHRyYW5zZm9ybUNhY2hlIHVwZGF0aW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJpbmplY3RcIiwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gXCJ0cmFuc2Zvcm1cIjtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEluamVjdCBob29rcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tOYW1lID0gcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Jvb3QgPSBDU1MuSG9va3MuZ2V0Um9vdChwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgY2FjaGVkIHJvb3RQcm9wZXJ0eVZhbHVlIHdhcyBub3QgcHJvdmlkZWQsIHF1ZXJ5IHRoZSBET00gZm9yIHRoZSBob29rUm9vdCdzIGN1cnJlbnQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IHJvb3RQcm9wZXJ0eVZhbHVlIHx8IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGhvb2tSb290KTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuaW5qZWN0VmFsdWUoaG9va05hbWUsIHByb3BlcnR5VmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gaG9va1Jvb3Q7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBOb3JtYWxpemUgbmFtZXMgYW5kIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImluamVjdFwiLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwibmFtZVwiLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEFzc2lnbiB0aGUgYXBwcm9wcmlhdGUgdmVuZG9yIHByZWZpeCBiZWZvcmUgcGVyZm9ybWluZyBhbiBvZmZpY2lhbCBzdHlsZSB1cGRhdGUuICovXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IENTUy5OYW1lcy5wcmVmaXhDaGVjayhwcm9wZXJ0eSlbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQSB0cnkvY2F0Y2ggaXMgdXNlZCBmb3IgSUU8PTgsIHdoaWNoIHRocm93cyBhbiBlcnJvciB3aGVuIFwiaW52YWxpZFwiIENTUyB2YWx1ZXMgYXJlIHNldCwgZS5nLiBhIG5lZ2F0aXZlIHdpZHRoLlxuICAgICAgICAgICAgICAgICAgICAgICBUcnkvY2F0Y2ggaXMgYXZvaWRlZCBmb3Igb3RoZXIgYnJvd3NlcnMgc2luY2UgaXQgaW5jdXJzIGEgcGVyZm9ybWFuY2Ugb3ZlcmhlYWQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikgeyBpZiAoVmVsb2NpdHkuZGVidWcpIGNvbnNvbGUubG9nKFwiQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFtcIiArIHByb3BlcnR5VmFsdWUgKyBcIl0gZm9yIFtcIiArIHByb3BlcnR5TmFtZSArIFwiXVwiKTsgfVxuICAgICAgICAgICAgICAgICAgICAvKiBTVkcgZWxlbWVudHMgaGF2ZSB0aGVpciBkaW1lbnNpb25hbCBwcm9wZXJ0aWVzICh3aWR0aCwgaGVpZ2h0LCB4LCB5LCBjeCwgZXRjLikgYXBwbGllZCBkaXJlY3RseSBhcyBhdHRyaWJ1dGVzIGluc3RlYWQgb2YgYXMgc3R5bGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTggZG9lcyBub3Qgc3VwcG9ydCBTVkcgZWxlbWVudHMsIHNvIGl0J3Mgb2theSB0aGF0IHdlIHNraXAgaXQgZm9yIFNWRyBhbmltYXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoRGF0YShlbGVtZW50KSAmJiBEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBGb3IgU1ZHIGF0dHJpYnV0ZXMsIHZlbmRvci1wcmVmaXhlZCBwcm9wZXJ0eSBuYW1lcyBhcmUgbmV2ZXIgdXNlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IE5vdCBhbGwgQ1NTIHByb3BlcnRpZXMgY2FuIGJlIGFuaW1hdGVkIHZpYSBhdHRyaWJ1dGVzLCBidXQgdGhlIGJyb3dzZXIgd29uJ3QgdGhyb3cgYW4gZXJyb3IgZm9yIHVuc3VwcG9ydGVkIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnID49IDIpIGNvbnNvbGUubG9nKFwiU2V0IFwiICsgcHJvcGVydHkgKyBcIiAoXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIik6IFwiICsgcHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBSZXR1cm4gdGhlIG5vcm1hbGl6ZWQgcHJvcGVydHkgbmFtZSBhbmQgdmFsdWUgaW4gY2FzZSB0aGUgY2FsbGVyIHdhbnRzIHRvIGtub3cgaG93IHRoZXNlIHZhbHVlcyB3ZXJlIG1vZGlmaWVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICByZXR1cm4gWyBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWUgXTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiBUbyBpbmNyZWFzZSBwZXJmb3JtYW5jZSBieSBiYXRjaGluZyB0cmFuc2Zvcm0gdXBkYXRlcyBpbnRvIGEgc2luZ2xlIFNFVCwgdHJhbnNmb3JtcyBhcmUgbm90IGRpcmVjdGx5IGFwcGxpZWQgdG8gYW4gZWxlbWVudCB1bnRpbCBmbHVzaFRyYW5zZm9ybUNhY2hlKCkgaXMgY2FsbGVkLiAqL1xuICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSBhcHBsaWVzIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGluIHRoZSBzYW1lIG9yZGVyIHRoYXQgdGhleSBhcmUgY2hyb25vZ2ljYWxseSBpbnRyb2R1Y2VkIHRvIHRoZSBlbGVtZW50J3MgQ1NTIHN0eWxlcy4gKi9cbiAgICAgICAgZmx1c2hUcmFuc2Zvcm1DYWNoZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIC8qIENlcnRhaW4gYnJvd3NlcnMgcmVxdWlyZSB0aGF0IFNWRyB0cmFuc2Zvcm1zIGJlIGFwcGxpZWQgYXMgYW4gYXR0cmlidXRlLiBIb3dldmVyLCB0aGUgU1ZHIHRyYW5zZm9ybSBhdHRyaWJ1dGUgdGFrZXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIENTUydzIHRyYW5zZm9ybSBzdHJpbmdcbiAgICAgICAgICAgICAgICh1bml0cyBhcmUgZHJvcHBlZCBhbmQsIGV4Y2VwdCBmb3Igc2tld1gvWSwgc3VicHJvcGVydGllcyBhcmUgbWVyZ2VkIGludG8gdGhlaXIgbWFzdGVyIHByb3BlcnR5IC0tIGUuZy4gc2NhbGVYIGFuZCBzY2FsZVkgYXJlIG1lcmdlZCBpbnRvIHNjYWxlKFggWSkuICovXG4gICAgICAgICAgICBpZiAoKElFIHx8IChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgIVZlbG9jaXR5LlN0YXRlLmlzQ2hyb21lKSkgJiYgRGF0YShlbGVtZW50KS5pc1NWRykge1xuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHN0b3JlZCBpbiB0aGVpciBwYXJlbnRoZXNlcy13cmFwcGVkIGZvcm0sIHdlIHVzZSBhIGhlbHBlciBmdW5jdGlvbiB0byBzdHJpcCBvdXQgdGhlaXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgICAgRnVydGhlciwgU1ZHIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIG9ubHkgdGFrZSB1bml0bGVzcyAocmVwcmVzZW50aW5nIHBpeGVscykgdmFsdWVzLCBzbyBpdCdzIG9rYXkgdGhhdCBwYXJzZUZsb2F0KCkgc3RyaXBzIHRoZSB1bml0IHN1ZmZpeGVkIHRvIHRoZSBmbG9hdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBnZXRUcmFuc2Zvcm1GbG9hdCAodHJhbnNmb3JtUHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgdHJhbnNmb3JtUHJvcGVydHkpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYW4gb2JqZWN0IHRvIG9yZ2FuaXplIGFsbCB0aGUgdHJhbnNmb3JtcyB0aGF0IHdlJ2xsIGFwcGx5IHRvIHRoZSBTVkcgZWxlbWVudC4gVG8ga2VlcCB0aGUgbG9naWMgc2ltcGxlLFxuICAgICAgICAgICAgICAgICAgIHdlIHByb2Nlc3MgKmFsbCogdHJhbnNmb3JtIHByb3BlcnRpZXMgLS0gZXZlbiB0aG9zZSB0aGF0IG1heSBub3QgYmUgZXhwbGljaXRseSBhcHBsaWVkIChzaW5jZSB0aGV5IGRlZmF1bHQgdG8gdGhlaXIgemVyby12YWx1ZXMgYW55d2F5KS4gKi9cbiAgICAgICAgICAgICAgICB2YXIgU1ZHVHJhbnNmb3JtcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwidHJhbnNsYXRlWFwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJ0cmFuc2xhdGVZXCIpIF0sXG4gICAgICAgICAgICAgICAgICAgIHNrZXdYOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwic2tld1hcIikgXSwgc2tld1k6IFsgZ2V0VHJhbnNmb3JtRmxvYXQoXCJza2V3WVwiKSBdLFxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgc2NhbGUgcHJvcGVydHkgaXMgc2V0IChub24tMSksIHVzZSB0aGF0IHZhbHVlIGZvciB0aGUgc2NhbGVYIGFuZCBzY2FsZVkgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzIGJlaGF2aW9yIG1pbWljcyB0aGUgcmVzdWx0IG9mIGFuaW1hdGluZyBhbGwgdGhlc2UgcHJvcGVydGllcyBhdCBvbmNlIG9uIEhUTUwgZWxlbWVudHMpLiAqL1xuICAgICAgICAgICAgICAgICAgICBzY2FsZTogZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKSAhPT0gMSA/IFsgZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVwiKSBdIDogWyBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlWFwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJzY2FsZVlcIikgXSxcbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogU1ZHJ3Mgcm90YXRlIHRyYW5zZm9ybSB0YWtlcyB0aHJlZSB2YWx1ZXM6IHJvdGF0aW9uIGRlZ3JlZXMgZm9sbG93ZWQgYnkgdGhlIFggYW5kIFkgdmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgIGRlZmluaW5nIHRoZSByb3RhdGlvbidzIG9yaWdpbiBwb2ludC4gV2UgaWdub3JlIHRoZSBvcmlnaW4gdmFsdWVzIChkZWZhdWx0IHRoZW0gdG8gMCkuICovXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0ZTogWyBnZXRUcmFuc2Zvcm1GbG9hdChcInJvdGF0ZVpcIiksIDAsIDAgXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGluIHRoZSB1c2VyLWRlZmluZWQgcHJvcGVydHkgbWFwIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgIChUaGlzIG1pbWljcyB0aGUgYmVoYXZpb3Igb2Ygbm9uLVNWRyB0cmFuc2Zvcm0gYW5pbWF0aW9uLikgKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZSwgZnVuY3Rpb24odHJhbnNmb3JtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBFeGNlcHQgZm9yIHdpdGggc2tld1gvWSwgcmV2ZXJ0IHRoZSBheGlzLXNwZWNpZmljIHRyYW5zZm9ybSBzdWJwcm9wZXJ0aWVzIHRvIHRoZWlyIGF4aXMtZnJlZSBtYXN0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyBzbyB0aGF0IHRoZXkgbWF0Y2ggdXAgd2l0aCBTVkcncyBhY2NlcHRlZCB0cmFuc2Zvcm0gcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKC9edHJhbnNsYXRlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwidHJhbnNsYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15zY2FsZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU5hbWUgPSBcInNjYWxlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15yb3RhdGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJyb3RhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIHRoYXQgd2UgaGF2ZW4ndCB5ZXQgZGVsZXRlZCB0aGUgcHJvcGVydHkgZnJvbSB0aGUgU1ZHVHJhbnNmb3JtcyBjb250YWluZXIuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBcHBlbmQgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0eSBpbiB0aGUgU1ZHLXN1cHBvcnRlZCB0cmFuc2Zvcm0gZm9ybWF0LiBBcyBwZXIgdGhlIHNwZWMsIHN1cnJvdW5kIHRoZSBzcGFjZS1kZWxpbWl0ZWQgdmFsdWVzIGluIHBhcmVudGhlc2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nICs9IHRyYW5zZm9ybU5hbWUgKyBcIihcIiArIFNWR1RyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV0uam9pbihcIiBcIikgKyBcIilcIiArIFwiIFwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBZnRlciBwcm9jZXNzaW5nIGFuIFNWRyB0cmFuc2Zvcm0gcHJvcGVydHksIGRlbGV0ZSBpdCBmcm9tIHRoZSBTVkdUcmFuc2Zvcm1zIGNvbnRhaW5lciBzbyB3ZSBkb24ndFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmUtaW5zZXJ0IHRoZSBzYW1lIG1hc3RlciBwcm9wZXJ0eSBpZiB3ZSBlbmNvdW50ZXIgYW5vdGhlciBvbmUgb2YgaXRzIGF4aXMtc3BlY2lmaWMgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1WYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmU7XG5cbiAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gcHJvcGVydGllcyBhcmUgc3RvcmVkIGFzIG1lbWJlcnMgb2YgdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdC4gQ29uY2F0ZW5hdGUgYWxsIHRoZSBtZW1iZXJzIGludG8gYSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgJC5lYWNoKERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUsIGZ1bmN0aW9uKHRyYW5zZm9ybU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtVmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSdzIHBlcnNwZWN0aXZlIHN1YnByb3BlcnR5IG11c3QgYmUgc2V0IGZpcnN0IGluIG9yZGVyIHRvIHRha2UgZWZmZWN0LiBTdG9yZSBpdCB0ZW1wb3JhcmlseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybU5hbWUgPT09IFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyc3BlY3RpdmUgPSB0cmFuc2Zvcm1WYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSUU5IG9ubHkgc3VwcG9ydHMgb25lIHJvdGF0aW9uIHR5cGUsIHJvdGF0ZVosIHdoaWNoIGl0IHJlZmVycyB0byBhcyBcInJvdGF0ZVwiLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPT09IDkgJiYgdHJhbnNmb3JtTmFtZSA9PT0gXCJyb3RhdGVaXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU5hbWUgPSBcInJvdGF0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nICs9IHRyYW5zZm9ybU5hbWUgKyB0cmFuc2Zvcm1WYWx1ZSArIFwiIFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLyogSWYgcHJlc2VudCwgc2V0IHRoZSBwZXJzcGVjdGl2ZSBzdWJwcm9wZXJ0eSBmaXJzdC4gKi9cbiAgICAgICAgICAgICAgICBpZiAocGVyc3BlY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gXCJwZXJzcGVjdGl2ZVwiICsgcGVyc3BlY3RpdmUgKyBcIiBcIiArIHRyYW5zZm9ybVN0cmluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwidHJhbnNmb3JtXCIsIHRyYW5zZm9ybVN0cmluZyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyogUmVnaXN0ZXIgaG9va3MgYW5kIG5vcm1hbGl6YXRpb25zLiAqL1xuICAgIENTUy5Ib29rcy5yZWdpc3RlcigpO1xuICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcigpO1xuXG4gICAgLyogQWxsb3cgaG9vayBzZXR0aW5nIGluIHRoZSBzYW1lIGZhc2hpb24gYXMgalF1ZXJ5J3MgJC5jc3MoKS4gKi9cbiAgICBWZWxvY2l0eS5ob29rID0gZnVuY3Rpb24gKGVsZW1lbnRzLCBhcmcyLCBhcmczKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBlbGVtZW50cyA9IHNhbml0aXplRWxlbWVudHMoZWxlbWVudHMpO1xuXG4gICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICAgICAgLyogSW5pdGlhbGl6ZSBWZWxvY2l0eSdzIHBlci1lbGVtZW50IGRhdGEgY2FjaGUgaWYgdGhpcyBlbGVtZW50IGhhc24ndCBwcmV2aW91c2x5IGJlZW4gYW5pbWF0ZWQuICovXG4gICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogR2V0IHByb3BlcnR5IHZhbHVlLiBJZiBhbiBlbGVtZW50IHNldCB3YXMgcGFzc2VkIGluLCBvbmx5IHJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgaWYgKGFyZzMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gVmVsb2NpdHkuQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgYXJnMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogU2V0IHByb3BlcnR5IHZhbHVlLiAqL1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKiBzUFYgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgbm9ybWFsaXplZCBwcm9wZXJ0eU5hbWUvcHJvcGVydHlWYWx1ZSBwYWlyIHVzZWQgdG8gdXBkYXRlIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkU2V0ID0gVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgYXJnMiwgYXJnMyk7XG5cbiAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0gcHJvcGVydGllcyBkb24ndCBhdXRvbWF0aWNhbGx5IHNldC4gVGhleSBoYXZlIHRvIGJlIGZsdXNoZWQgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoYWRqdXN0ZWRTZXRbMF0gPT09IFwidHJhbnNmb3JtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhZGp1c3RlZFNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgQW5pbWF0aW9uXG4gICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgIENhbGwgQ2hhaW5cbiAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIExvZ2ljIGZvciBkZXRlcm1pbmluZyB3aGF0IHRvIHJldHVybiB0byB0aGUgY2FsbCBzdGFjayB3aGVuIGV4aXRpbmcgb3V0IG9mIFZlbG9jaXR5LiAqL1xuICAgICAgICBmdW5jdGlvbiBnZXRDaGFpbiAoKSB7XG4gICAgICAgICAgICAvKiBJZiB3ZSBhcmUgdXNpbmcgdGhlIHV0aWxpdHkgZnVuY3Rpb24sIGF0dGVtcHQgdG8gcmV0dXJuIHRoaXMgY2FsbCdzIHByb21pc2UuIElmIG5vIHByb21pc2UgbGlicmFyeSB3YXMgZGV0ZWN0ZWQsXG4gICAgICAgICAgICAgICBkZWZhdWx0IHRvIG51bGwgaW5zdGVhZCBvZiByZXR1cm5pbmcgdGhlIHRhcmdldGVkIGVsZW1lbnRzIHNvIHRoYXQgdXRpbGl0eSBmdW5jdGlvbidzIHJldHVybiB2YWx1ZSBpcyBzdGFuZGFyZGl6ZWQuICovXG4gICAgICAgICAgICBpZiAoaXNVdGlsaXR5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2VEYXRhLnByb21pc2UgfHwgbnVsbDtcbiAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgaWYgd2UncmUgdXNpbmcgJC5mbiwgcmV0dXJuIHRoZSBqUXVlcnktL1plcHRvLXdyYXBwZWQgZWxlbWVudCBzZXQuICovXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50c1dyYXBwZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBBcmd1bWVudHMgQXNzaWdubWVudFxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFRvIGFsbG93IGZvciBleHByZXNzaXZlIENvZmZlZVNjcmlwdCBjb2RlLCBWZWxvY2l0eSBzdXBwb3J0cyBhbiBhbHRlcm5hdGl2ZSBzeW50YXggaW4gd2hpY2ggXCJlbGVtZW50c1wiIChvciBcImVcIiksIFwicHJvcGVydGllc1wiIChvciBcInBcIiksIGFuZCBcIm9wdGlvbnNcIiAob3IgXCJvXCIpXG4gICAgICAgICAgIG9iamVjdHMgYXJlIGRlZmluZWQgb24gYSBjb250YWluZXIgb2JqZWN0IHRoYXQncyBwYXNzZWQgaW4gYXMgVmVsb2NpdHkncyBzb2xlIGFyZ3VtZW50LiAqL1xuICAgICAgICAvKiBOb3RlOiBTb21lIGJyb3dzZXJzIGF1dG9tYXRpY2FsbHkgcG9wdWxhdGUgYXJndW1lbnRzIHdpdGggYSBcInByb3BlcnRpZXNcIiBvYmplY3QuIFdlIGRldGVjdCBpdCBieSBjaGVja2luZyBmb3IgaXRzIGRlZmF1bHQgXCJuYW1lc1wiIHByb3BlcnR5LiAqL1xuICAgICAgICB2YXIgc3ludGFjdGljU3VnYXIgPSAoYXJndW1lbnRzWzBdICYmIChhcmd1bWVudHNbMF0ucCB8fCAoKCQuaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0ucHJvcGVydGllcykgJiYgIWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzLm5hbWVzKSB8fCBUeXBlLmlzU3RyaW5nKGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSkpKSxcbiAgICAgICAgICAgIC8qIFdoZXRoZXIgVmVsb2NpdHkgd2FzIGNhbGxlZCB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24gKGFzIG9wcG9zZWQgdG8gb24gYSBqUXVlcnkvWmVwdG8gb2JqZWN0KS4gKi9cbiAgICAgICAgICAgIGlzVXRpbGl0eSxcbiAgICAgICAgICAgIC8qIFdoZW4gVmVsb2NpdHkgaXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoJC5WZWxvY2l0eSgpL1ZlbG9jaXR5KCkpLCBlbGVtZW50cyBhcmUgZXhwbGljaXRseVxuICAgICAgICAgICAgICAgcGFzc2VkIGluIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIuIFRodXMsIGFyZ3VtZW50IHBvc2l0aW9uaW5nIHZhcmllcy4gV2Ugbm9ybWFsaXplIHRoZW0gaGVyZS4gKi9cbiAgICAgICAgICAgIGVsZW1lbnRzV3JhcHBlZCxcbiAgICAgICAgICAgIGFyZ3VtZW50SW5kZXg7XG5cbiAgICAgICAgdmFyIGVsZW1lbnRzLFxuICAgICAgICAgICAgcHJvcGVydGllc01hcCxcbiAgICAgICAgICAgIG9wdGlvbnM7XG5cbiAgICAgICAgLyogRGV0ZWN0IGpRdWVyeS9aZXB0byBlbGVtZW50cyBiZWluZyBhbmltYXRlZCB2aWEgdGhlICQuZm4gbWV0aG9kLiAqL1xuICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQodGhpcykpIHtcbiAgICAgICAgICAgIGlzVXRpbGl0eSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBhcmd1bWVudEluZGV4ID0gMDtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gdGhpcztcbiAgICAgICAgICAgIGVsZW1lbnRzV3JhcHBlZCA9IHRoaXM7XG4gICAgICAgIC8qIE90aGVyd2lzZSwgcmF3IGVsZW1lbnRzIGFyZSBiZWluZyBhbmltYXRlZCB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24uICovXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc1V0aWxpdHkgPSB0cnVlO1xuXG4gICAgICAgICAgICBhcmd1bWVudEluZGV4ID0gMTtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gc3ludGFjdGljU3VnYXIgPyAoYXJndW1lbnRzWzBdLmVsZW1lbnRzIHx8IGFyZ3VtZW50c1swXS5lKSA6IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnRzID0gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cyk7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN5bnRhY3RpY1N1Z2FyKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzTWFwID0gYXJndW1lbnRzWzBdLnByb3BlcnRpZXMgfHwgYXJndW1lbnRzWzBdLnA7XG4gICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzWzBdLm9wdGlvbnMgfHwgYXJndW1lbnRzWzBdLm87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzTWFwID0gYXJndW1lbnRzW2FyZ3VtZW50SW5kZXhdO1xuICAgICAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1thcmd1bWVudEluZGV4ICsgMV07XG4gICAgICAgIH1cblxuICAgICAgICAvKiBUaGUgbGVuZ3RoIG9mIHRoZSBlbGVtZW50IHNldCAoaW4gdGhlIGZvcm0gb2YgYSBub2RlTGlzdCBvciBhbiBhcnJheSBvZiBlbGVtZW50cykgaXMgZGVmYXVsdGVkIHRvIDEgaW4gY2FzZSBhXG4gICAgICAgICAgIHNpbmdsZSByYXcgRE9NIGVsZW1lbnQgaXMgcGFzc2VkIGluICh3aGljaCBkb2Vzbid0IGNvbnRhaW4gYSBsZW5ndGggcHJvcGVydHkpLiAqL1xuICAgICAgICB2YXIgZWxlbWVudHNMZW5ndGggPSBlbGVtZW50cy5sZW5ndGgsXG4gICAgICAgICAgICBlbGVtZW50c0luZGV4ID0gMDtcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICBBcmd1bWVudCBPdmVybG9hZGluZ1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogU3VwcG9ydCBpcyBpbmNsdWRlZCBmb3IgalF1ZXJ5J3MgYXJndW1lbnQgb3ZlcmxvYWRpbmc6ICQuYW5pbWF0ZShwcm9wZXJ0eU1hcCBbLCBkdXJhdGlvbl0gWywgZWFzaW5nXSBbLCBjb21wbGV0ZV0pLlxuICAgICAgICAgICBPdmVybG9hZGluZyBpcyBkZXRlY3RlZCBieSBjaGVja2luZyBmb3IgdGhlIGFic2VuY2Ugb2YgYW4gb2JqZWN0IGJlaW5nIHBhc3NlZCBpbnRvIG9wdGlvbnMuICovXG4gICAgICAgIC8qIE5vdGU6IFRoZSBzdG9wIGFuZCBmaW5pc2ggYWN0aW9ucyBkbyBub3QgYWNjZXB0IGFuaW1hdGlvbiBvcHRpb25zLCBhbmQgYXJlIHRoZXJlZm9yZSBleGNsdWRlZCBmcm9tIHRoaXMgY2hlY2suICovXG4gICAgICAgIGlmICghL14oc3RvcHxmaW5pc2gpJC9pLnRlc3QocHJvcGVydGllc01hcCkgJiYgISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgICAgICAgLyogVGhlIHV0aWxpdHkgZnVuY3Rpb24gc2hpZnRzIGFsbCBhcmd1bWVudHMgb25lIHBvc2l0aW9uIHRvIHRoZSByaWdodCwgc28gd2UgYWRqdXN0IGZvciB0aGF0IG9mZnNldC4gKi9cbiAgICAgICAgICAgIHZhciBzdGFydGluZ0FyZ3VtZW50UG9zaXRpb24gPSBhcmd1bWVudEluZGV4ICsgMTtcblxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggYWxsIG9wdGlvbnMgYXJndW1lbnRzICovXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRpbmdBcmd1bWVudFBvc2l0aW9uOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLyogVHJlYXQgYSBudW1iZXIgYXMgYSBkdXJhdGlvbi4gUGFyc2UgaXQgb3V0LiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBmb2xsb3dpbmcgUmVnRXggd2lsbCByZXR1cm4gdHJ1ZSBpZiBwYXNzZWQgYW4gYXJyYXkgd2l0aCBhIG51bWJlciBhcyBpdHMgZmlyc3QgaXRlbS5cbiAgICAgICAgICAgICAgICAgICBUaHVzLCBhcnJheXMgYXJlIHNraXBwZWQgZnJvbSB0aGlzIGNoZWNrLiAqL1xuICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0FycmF5KGFyZ3VtZW50c1tpXSkgJiYgKC9eKGZhc3R8bm9ybWFsfHNsb3cpJC9pLnRlc3QoYXJndW1lbnRzW2ldKSB8fCAvXlxcZC8udGVzdChhcmd1bWVudHNbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmR1cmF0aW9uID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIC8qIFRyZWF0IHN0cmluZ3MgYW5kIGFycmF5cyBhcyBlYXNpbmdzLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc1N0cmluZyhhcmd1bWVudHNbaV0pIHx8IFR5cGUuaXNBcnJheShhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFzaW5nID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgZnVuY3Rpb24gYXMgYSBjb21wbGV0ZSBjYWxsYmFjay4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNGdW5jdGlvbihhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29tcGxldGUgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgUHJvbWlzZXNcbiAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciBwcm9taXNlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlc29sdmVyOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdGVyOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8qIElmIHRoaXMgY2FsbCB3YXMgbWFkZSB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24gKHdoaWNoIGlzIHRoZSBkZWZhdWx0IG1ldGhvZCBvZiBpbnZvY2F0aW9uIHdoZW4galF1ZXJ5L1plcHRvIGFyZSBub3QgYmVpbmcgdXNlZCksIGFuZCBpZlxuICAgICAgICAgICBwcm9taXNlIHN1cHBvcnQgd2FzIGRldGVjdGVkLCBjcmVhdGUgYSBwcm9taXNlIG9iamVjdCBmb3IgdGhpcyBjYWxsIGFuZCBzdG9yZSByZWZlcmVuY2VzIHRvIGl0cyByZXNvbHZlciBhbmQgcmVqZWN0ZXIgbWV0aG9kcy4gVGhlIHJlc29sdmVcbiAgICAgICAgICAgbWV0aG9kIGlzIHVzZWQgd2hlbiBhIGNhbGwgY29tcGxldGVzIG5hdHVyYWxseSBvciBpcyBwcmVtYXR1cmVseSBzdG9wcGVkIGJ5IHRoZSB1c2VyLiBJbiBib3RoIGNhc2VzLCBjb21wbGV0ZUNhbGwoKSBoYW5kbGVzIHRoZSBhc3NvY2lhdGVkXG4gICAgICAgICAgIGNhbGwgY2xlYW51cCBhbmQgcHJvbWlzZSByZXNvbHZpbmcgbG9naWMuIFRoZSByZWplY3QgbWV0aG9kIGlzIHVzZWQgd2hlbiBhbiBpbnZhbGlkIHNldCBvZiBhcmd1bWVudHMgaXMgcGFzc2VkIGludG8gYSBWZWxvY2l0eSBjYWxsLiAqL1xuICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSBlbXBsb3lzIGEgY2FsbC1iYXNlZCBxdWV1ZWluZyBhcmNoaXRlY3R1cmUsIHdoaWNoIG1lYW5zIHRoYXQgc3RvcHBpbmcgYW4gYW5pbWF0aW5nIGVsZW1lbnQgYWN0dWFsbHkgc3RvcHMgdGhlIGZ1bGwgY2FsbCB0aGF0XG4gICAgICAgICAgIHRyaWdnZXJlZCBpdCAtLSBub3QgdGhhdCBvbmUgZWxlbWVudCBleGNsdXNpdmVseS4gU2ltaWxhcmx5LCB0aGVyZSBpcyBvbmUgcHJvbWlzZSBwZXIgY2FsbCwgYW5kIGFsbCBlbGVtZW50cyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwgYXJlXG4gICAgICAgICAgIGdyb3VwZWQgdG9nZXRoZXIgZm9yIHRoZSBwdXJwb3NlcyBvZiByZXNvbHZpbmcgYW5kIHJlamVjdGluZyBhIHByb21pc2UuICovXG4gICAgICAgIGlmIChpc1V0aWxpdHkgJiYgVmVsb2NpdHkuUHJvbWlzZSkge1xuICAgICAgICAgICAgcHJvbWlzZURhdGEucHJvbWlzZSA9IG5ldyBWZWxvY2l0eS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVqZWN0ZXIgPSByZWplY3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgQWN0aW9uIERldGVjdGlvblxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogVmVsb2NpdHkncyBiZWhhdmlvciBpcyBjYXRlZ29yaXplZCBpbnRvIFwiYWN0aW9uc1wiOiBFbGVtZW50cyBjYW4gZWl0aGVyIGJlIHNwZWNpYWxseSBzY3JvbGxlZCBpbnRvIHZpZXcsXG4gICAgICAgICAgIG9yIHRoZXkgY2FuIGJlIHN0YXJ0ZWQsIHN0b3BwZWQsIG9yIHJldmVyc2VkLiBJZiBhIGxpdGVyYWwgb3IgcmVmZXJlbmNlZCBwcm9wZXJ0aWVzIG1hcCBpcyBwYXNzZWQgaW4gYXMgVmVsb2NpdHknc1xuICAgICAgICAgICBmaXJzdCBhcmd1bWVudCwgdGhlIGFzc29jaWF0ZWQgYWN0aW9uIGlzIFwic3RhcnRcIi4gQWx0ZXJuYXRpdmVseSwgXCJzY3JvbGxcIiwgXCJyZXZlcnNlXCIsIG9yIFwic3RvcFwiIGNhbiBiZSBwYXNzZWQgaW4gaW5zdGVhZCBvZiBhIHByb3BlcnRpZXMgbWFwLiAqL1xuICAgICAgICB2YXIgYWN0aW9uO1xuXG4gICAgICAgIHN3aXRjaCAocHJvcGVydGllc01hcCkge1xuICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJyZXZlcnNlXCI6XG4gICAgICAgICAgICAgICAgYWN0aW9uID0gXCJyZXZlcnNlXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcbiAgICAgICAgICAgIGNhc2UgXCJzdG9wXCI6XG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBTdG9wXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBjdXJyZW50bHktYWN0aXZlIGRlbGF5IG9uIGVhY2ggdGFyZ2V0ZWQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgJiYgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9wIHRoZSB0aW1lciBmcm9tIHRyaWdnZXJpbmcgaXRzIGNhY2hlZCBuZXh0KCkgZnVuY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLnNldFRpbWVvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBNYW51YWxseSBjYWxsIHRoZSBuZXh0KCkgZnVuY3Rpb24gc28gdGhhdCB0aGUgc3Vic2VxdWVudCBxdWV1ZSBpdGVtcyBjYW4gcHJvZ3Jlc3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLm5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY2FsbHNUb1N0b3AgPSBbXTtcblxuICAgICAgICAgICAgICAgIC8qIFdoZW4gdGhlIHN0b3AgYWN0aW9uIGlzIHRyaWdnZXJlZCwgdGhlIGVsZW1lbnRzJyBjdXJyZW50bHkgYWN0aXZlIGNhbGwgaXMgaW1tZWRpYXRlbHkgc3RvcHBlZC4gVGhlIGFjdGl2ZSBjYWxsIG1pZ2h0IGhhdmVcbiAgICAgICAgICAgICAgICAgICBiZWVuIGFwcGxpZWQgdG8gbXVsdGlwbGUgZWxlbWVudHMsIGluIHdoaWNoIGNhc2UgYWxsIG9mIHRoZSBjYWxsJ3MgZWxlbWVudHMgd2lsbCBiZSBzdG9wcGVkLiBXaGVuIGFuIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICBpcyBzdG9wcGVkLCB0aGUgbmV4dCBpdGVtIGluIGl0cyBhbmltYXRpb24gcXVldWUgaXMgaW1tZWRpYXRlbHkgdHJpZ2dlcmVkLiAqL1xuICAgICAgICAgICAgICAgIC8qIEFuIGFkZGl0aW9uYWwgYXJndW1lbnQgbWF5IGJlIHBhc3NlZCBpbiB0byBjbGVhciBhbiBlbGVtZW50J3MgcmVtYWluaW5nIHF1ZXVlZCBjYWxscy4gRWl0aGVyIHRydWUgKHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBcImZ4XCIgcXVldWUpXG4gICAgICAgICAgICAgICAgICAgb3IgYSBjdXN0b20gcXVldWUgc3RyaW5nIGNhbiBiZSBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgY29tbWFuZCBydW5zIHByaW9yIHRvIFZlbG9jaXR5J3MgUXVldWVpbmcgcGhhc2Ugc2luY2UgaXRzIGJlaGF2aW9yIGlzIGludGVuZGVkIHRvIHRha2UgZWZmZWN0ICppbW1lZGlhdGVseSosXG4gICAgICAgICAgICAgICAgICAgcmVnYXJkbGVzcyBvZiB0aGUgZWxlbWVudCdzIGN1cnJlbnQgcXVldWUgc3RhdGUuICovXG5cbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggZXZlcnkgYWN0aXZlIGNhbGwuICovXG4gICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEluYWN0aXZlIGNhbGxzIGFyZSBzZXQgdG8gZmFsc2UgYnkgdGhlIGxvZ2ljIGluc2lkZSBjb21wbGV0ZUNhbGwoKS4gU2tpcCB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBhY3RpdmUgY2FsbCdzIHRhcmdldGVkIGVsZW1lbnRzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUNhbGxbMV0sIGZ1bmN0aW9uKGssIGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0cnVlIHdhcyBwYXNzZWQgaW4gYXMgYSBzZWNvbmRhcnkgYXJndW1lbnQsIGNsZWFyIGFic29sdXRlbHkgYWxsIGNhbGxzIG9uIHRoaXMgZWxlbWVudC4gT3RoZXJ3aXNlLCBvbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXIgY2FsbHMgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWxldmFudCBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYWxsIHN0b3BwaW5nIGxvZ2ljIHdvcmtzIGFzIGZvbGxvd3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBvcHRpb25zID09PSB0cnVlIC0tPiBzdG9wIGN1cnJlbnQgZGVmYXVsdCBxdWV1ZSBjYWxscyAoYW5kIHF1ZXVlOmZhbHNlIGNhbGxzKSwgaW5jbHVkaW5nIHJlbWFpbmluZyBxdWV1ZWQgb25lcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IHVuZGVmaW5lZCAtLT4gc3RvcCBjdXJyZW50IHF1ZXVlOlwiXCIgY2FsbCBhbmQgYWxsIHF1ZXVlOmZhbHNlIGNhbGxzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gZmFsc2UgLS0+IHN0b3Agb25seSBxdWV1ZTpmYWxzZSBjYWxscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IFwiY3VzdG9tXCIgLS0+IHN0b3AgY3VycmVudCBxdWV1ZTpcImN1c3RvbVwiIGNhbGwsIGluY2x1ZGluZyByZW1haW5pbmcgcXVldWVkIG9uZXMgKHRoZXJlIGlzIG5vIGZ1bmN0aW9uYWxpdHkgdG8gb25seSBjbGVhciB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcXVldWU6XCJjdXN0b21cIiBjYWxsKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVldWVOYW1lID0gKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogb3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZU5hbWUgIT09IHRydWUgJiYgKGFjdGl2ZUNhbGxbMl0ucXVldWUgIT09IHF1ZXVlTmFtZSkgJiYgIShvcHRpb25zID09PSB1bmRlZmluZWQgJiYgYWN0aXZlQ2FsbFsyXS5xdWV1ZSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgdGFyZ2V0ZWQgYnkgdGhlIHN0b3AgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGwsIGVsZW1lbnQpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0aGF0IHRoaXMgY2FsbCB3YXMgYXBwbGllZCB0byB0aGUgdGFyZ2V0IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPcHRpb25hbGx5IGNsZWFyIHRoZSByZW1haW5pbmcgcXVldWVkIGNhbGxzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IHRydWUgfHwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgaXRlbXMgaW4gdGhlIGVsZW1lbnQncyBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIpLCBmdW5jdGlvbihfLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBxdWV1ZSBhcnJheSBjYW4gY29udGFpbiBhbiBcImlucHJvZ3Jlc3NcIiBzdHJpbmcsIHdoaWNoIHdlIHNraXAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhc3MgdGhlIGl0ZW0ncyBjYWxsYmFjayBhIGZsYWcgaW5kaWNhdGluZyB0aGF0IHdlIHdhbnQgdG8gYWJvcnQgZnJvbSB0aGUgcXVldWUgY2FsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChTcGVjaWZpY2FsbHksIHRoZSBxdWV1ZSB3aWxsIHJlc29sdmUgdGhlIGNhbGwncyBhc3NvY2lhdGVkIHByb21pc2UgdGhlbiBhYm9ydC4pICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbShudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwic3RvcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgXCJyZXZlcnNlXCIgdXNlcyBjYWNoZWQgc3RhcnQgdmFsdWVzICh0aGUgcHJldmlvdXMgY2FsbCdzIGVuZFZhbHVlcyksIHRoZXNlIHZhbHVlcyBtdXN0IGJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCB0byByZWZsZWN0IHRoZSBmaW5hbCB2YWx1ZSB0aGF0IHRoZSBlbGVtZW50cyB3ZXJlIGFjdHVhbGx5IHR3ZWVuZWQgdG8uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSWYgb25seSBxdWV1ZTpmYWxzZSBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgcnVubmluZyBvbiBhbiBlbGVtZW50LCBpdCB3b24ndCBoYXZlIGEgdHdlZW5zQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LiBBbHNvLCBxdWV1ZTpmYWxzZSBhbmltYXRpb25zIGNhbid0IGJlIHJldmVyc2VkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyICYmIHF1ZXVlTmFtZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyLCBmdW5jdGlvbihtLCBhY3RpdmVUd2Vlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVHdlZW4uZW5kVmFsdWUgPSBhY3RpdmVUd2Vlbi5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxzVG9TdG9wLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwiZmluaXNoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUbyBnZXQgYWN0aXZlIHR3ZWVucyB0byBmaW5pc2ggaW1tZWRpYXRlbHksIHdlIGZvcmNlZnVsbHkgc2hvcnRlbiB0aGVpciBkdXJhdGlvbnMgdG8gMW1zIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGV5IGZpbmlzaCB1cG9uIHRoZSBuZXh0IHJBZiB0aWNrIHRoZW4gcHJvY2VlZCB3aXRoIG5vcm1hbCBjYWxsIGNvbXBsZXRpb24gbG9naWMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ2FsbFsyXS5kdXJhdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKiBQcmVtYXR1cmVseSBjYWxsIGNvbXBsZXRlQ2FsbCgpIG9uIGVhY2ggbWF0Y2hlZCBhY3RpdmUgY2FsbC4gUGFzcyBhbiBhZGRpdGlvbmFsIGZsYWcgZm9yIFwic3RvcFwiIHRvIGluZGljYXRlXG4gICAgICAgICAgICAgICAgICAgdGhhdCB0aGUgY29tcGxldGUgY2FsbGJhY2sgYW5kIGRpc3BsYXk6bm9uZSBzZXR0aW5nIHNob3VsZCBiZSBza2lwcGVkIHNpbmNlIHdlJ3JlIGNvbXBsZXRpbmcgcHJlbWF0dXJlbHkuICovXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwic3RvcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChjYWxsc1RvU3RvcCwgZnVuY3Rpb24oaSwgaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsKGosIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW1tZWRpYXRlbHkgcmVzb2x2ZSB0aGUgcHJvbWlzZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdG9wIGNhbGwgc2luY2Ugc3RvcCBydW5zIHN5bmNocm9ub3VzbHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBTaW5jZSB3ZSdyZSBzdG9wcGluZywgYW5kIG5vdCBwcm9jZWVkaW5nIHdpdGggcXVldWVpbmcsIGV4aXQgb3V0IG9mIFZlbG9jaXR5LiAqL1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgbm9uLWVtcHR5IHBsYWluIG9iamVjdCBhcyBhIGxpdGVyYWwgcHJvcGVydGllcyBtYXAuICovXG4gICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdChwcm9wZXJ0aWVzTWFwKSAmJiAhVHlwZS5pc0VtcHR5T2JqZWN0KHByb3BlcnRpZXNNYXApKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IFwic3RhcnRcIjtcblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgIFJlZGlyZWN0c1xuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBDaGVjayBpZiBhIHN0cmluZyBtYXRjaGVzIGEgcmVnaXN0ZXJlZCByZWRpcmVjdCAoc2VlIFJlZGlyZWN0cyBhYm92ZSkuICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzU3RyaW5nKHByb3BlcnRpZXNNYXApICYmIFZlbG9jaXR5LlJlZGlyZWN0c1twcm9wZXJ0aWVzTWFwXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uT3JpZ2luYWwgPSBvcHRzLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlPcmlnaW5hbCA9IG9wdHMuZGVsYXkgfHwgMDtcblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgYmFja3dhcmRzIG9wdGlvbiB3YXMgcGFzc2VkIGluLCByZXZlcnNlIHRoZSBlbGVtZW50IHNldCBzbyB0aGF0IGVsZW1lbnRzIGFuaW1hdGUgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3QuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmJhY2t3YXJkcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMgPSAkLmV4dGVuZCh0cnVlLCBbXSwgZWxlbWVudHMpLnJldmVyc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEluZGl2aWR1YWxseSB0cmlnZ2VyIHRoZSByZWRpcmVjdCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBzZXQgdG8gcHJldmVudCB1c2VycyBmcm9tIGhhdmluZyB0byBoYW5kbGUgaXRlcmF0aW9uIGxvZ2ljIGluIHRoZWlyIHJlZGlyZWN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnRJbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHN0YWdnZXIgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHN1Y2Nlc3NpdmVseSBkZWxheSBlYWNoIGVsZW1lbnQgYnkgdGhlIHN0YWdnZXIgdmFsdWUgKGluIG1zKS4gUmV0YWluIHRoZSBvcmlnaW5hbCBkZWxheSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG9wdHMuc3RhZ2dlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ID0gZGVsYXlPcmlnaW5hbCArIChwYXJzZUZsb2F0KG9wdHMuc3RhZ2dlcikgKiBlbGVtZW50SW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzRnVuY3Rpb24ob3B0cy5zdGFnZ2VyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZGVsYXkgPSBkZWxheU9yaWdpbmFsICsgb3B0cy5zdGFnZ2VyLmNhbGwoZWxlbWVudCwgZWxlbWVudEluZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBkcmFnIG9wdGlvbiB3YXMgcGFzc2VkIGluLCBzdWNjZXNzaXZlbHkgaW5jcmVhc2UvZGVjcmVhc2UgKGRlcGVuZGluZyBvbiB0aGUgcHJlc2Vuc2Ugb2Ygb3B0cy5iYWNrd2FyZHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgZHVyYXRpb24gb2YgZWFjaCBlbGVtZW50J3MgYW5pbWF0aW9uLCB1c2luZyBmbG9vcnMgdG8gcHJldmVudCBwcm9kdWNpbmcgdmVyeSBzaG9ydCBkdXJhdGlvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kcmFnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0aGUgZHVyYXRpb24gb2YgVUkgcGFjayBlZmZlY3RzIChjYWxsb3V0cyBhbmQgdHJhbnNpdGlvbnMpIHRvIDEwMDBtcyBpbnN0ZWFkIG9mIHRoZSB1c3VhbCBkZWZhdWx0IGR1cmF0aW9uIG9mIDQwMG1zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBwYXJzZUZsb2F0KGR1cmF0aW9uT3JpZ2luYWwpIHx8ICgvXihjYWxsb3V0fHRyYW5zaXRpb24pLy50ZXN0KHByb3BlcnRpZXNNYXApID8gMTAwMCA6IERVUkFUSU9OX0RFRkFVTFQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIGVhY2ggZWxlbWVudCwgdGFrZSB0aGUgZ3JlYXRlciBkdXJhdGlvbiBvZjogQSkgYW5pbWF0aW9uIGNvbXBsZXRpb24gcGVyY2VudGFnZSByZWxhdGl2ZSB0byB0aGUgb3JpZ2luYWwgZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQikgNzUlIG9mIHRoZSBvcmlnaW5hbCBkdXJhdGlvbiwgb3IgQykgYSAyMDBtcyBmYWxsYmFjayAoaW4gY2FzZSBkdXJhdGlvbiBpcyBhbHJlYWR5IHNldCB0byBhIGxvdyB2YWx1ZSkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGVuZCByZXN1bHQgaXMgYSBiYXNlbGluZSBvZiA3NSUgb2YgdGhlIHJlZGlyZWN0J3MgZHVyYXRpb24gdGhhdCBpbmNyZWFzZXMvZGVjcmVhc2VzIGFzIHRoZSBlbmQgb2YgdGhlIGVsZW1lbnQgc2V0IGlzIGFwcHJvYWNoZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IE1hdGgubWF4KG9wdHMuZHVyYXRpb24gKiAob3B0cy5iYWNrd2FyZHMgPyAxIC0gZWxlbWVudEluZGV4L2VsZW1lbnRzTGVuZ3RoIDogKGVsZW1lbnRJbmRleCArIDEpIC8gZWxlbWVudHNMZW5ndGgpLCBvcHRzLmR1cmF0aW9uICogMC43NSwgMjAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFzcyBpbiB0aGUgY2FsbCdzIG9wdHMgb2JqZWN0IHNvIHRoYXQgdGhlIHJlZGlyZWN0IGNhbiBvcHRpb25hbGx5IGV4dGVuZCBpdC4gSXQgZGVmYXVsdHMgdG8gYW4gZW1wdHkgb2JqZWN0IGluc3RlYWQgb2YgbnVsbCB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkdWNlIHRoZSBvcHRzIGNoZWNraW5nIGxvZ2ljIHJlcXVpcmVkIGluc2lkZSB0aGUgcmVkaXJlY3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbcHJvcGVydGllc01hcF0uY2FsbChlbGVtZW50LCBlbGVtZW50LCBvcHRzIHx8IHt9LCBlbGVtZW50SW5kZXgsIGVsZW1lbnRzTGVuZ3RoLCBlbGVtZW50cywgcHJvbWlzZURhdGEucHJvbWlzZSA/IHByb21pc2VEYXRhIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGFuaW1hdGlvbiBsb2dpYyByZXNpZGVzIHdpdGhpbiB0aGUgcmVkaXJlY3QncyBvd24gY29kZSwgYWJvcnQgdGhlIHJlbWFpbmRlciBvZiB0aGlzIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgICAgIChUaGUgcGVyZm9ybWFuY2Ugb3ZlcmhlYWQgdXAgdG8gdGhpcyBwb2ludCBpcyB2aXJ0dWFsbHkgbm9uLWV4aXN0YW50LikgKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIGpRdWVyeSBjYWxsIGNoYWluIGlzIGtlcHQgaW50YWN0IGJ5IHJldHVybmluZyB0aGUgY29tcGxldGUgZWxlbWVudCBzZXQuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhYm9ydEVycm9yID0gXCJWZWxvY2l0eTogRmlyc3QgYXJndW1lbnQgKFwiICsgcHJvcGVydGllc01hcCArIFwiKSB3YXMgbm90IGEgcHJvcGVydHkgbWFwLCBhIGtub3duIGFjdGlvbiwgb3IgYSByZWdpc3RlcmVkIHJlZGlyZWN0LiBBYm9ydGluZy5cIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVqZWN0ZXIobmV3IEVycm9yKGFib3J0RXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFib3J0RXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICBDYWxsLVdpZGUgVmFyaWFibGVzXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIEEgY29udGFpbmVyIGZvciBDU1MgdW5pdCBjb252ZXJzaW9uIHJhdGlvcyAoZS5nLiAlLCByZW0sIGFuZCBlbSA9PT4gcHgpIHRoYXQgaXMgdXNlZCB0byBjYWNoZSByYXRpb3MgYWNyb3NzIGFsbCBlbGVtZW50c1xuICAgICAgICAgICBiZWluZyBhbmltYXRlZCBpbiBhIHNpbmdsZSBWZWxvY2l0eSBjYWxsLiBDYWxjdWxhdGluZyB1bml0IHJhdGlvcyBuZWNlc3NpdGF0ZXMgRE9NIHF1ZXJ5aW5nIGFuZCB1cGRhdGluZywgYW5kIGlzIHRoZXJlZm9yZVxuICAgICAgICAgICBhdm9pZGVkICh2aWEgY2FjaGluZykgd2hlcmV2ZXIgcG9zc2libGUuIFRoaXMgY29udGFpbmVyIGlzIGNhbGwtd2lkZSBpbnN0ZWFkIG9mIHBhZ2Utd2lkZSB0byBhdm9pZCB0aGUgcmlzayBvZiB1c2luZyBzdGFsZVxuICAgICAgICAgICBjb252ZXJzaW9uIG1ldHJpY3MgYWNyb3NzIFZlbG9jaXR5IGFuaW1hdGlvbnMgdGhhdCBhcmUgbm90IGltbWVkaWF0ZWx5IGNvbnNlY3V0aXZlbHkgY2hhaW5lZC4gKi9cbiAgICAgICAgdmFyIGNhbGxVbml0Q29udmVyc2lvbkRhdGEgPSB7XG4gICAgICAgICAgICAgICAgbGFzdFBhcmVudDogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0UG9zaXRpb246IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdEZvbnRTaXplOiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQZXJjZW50VG9QeFdpZHRoOiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQZXJjZW50VG9QeEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0RW1Ub1B4OiBudWxsLFxuICAgICAgICAgICAgICAgIHJlbVRvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgdndUb1B4OiBudWxsLFxuICAgICAgICAgICAgICAgIHZoVG9QeDogbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAvKiBBIGNvbnRhaW5lciBmb3IgYWxsIHRoZSBlbnN1aW5nIHR3ZWVuIGRhdGEgYW5kIG1ldGFkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNhbGwuIFRoaXMgY29udGFpbmVyIGdldHMgcHVzaGVkIHRvIHRoZSBwYWdlLXdpZGVcbiAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgYXJyYXkgdGhhdCBpcyBwcm9jZXNzZWQgZHVyaW5nIGFuaW1hdGlvbiB0aWNraW5nLiAqL1xuICAgICAgICB2YXIgY2FsbCA9IFtdO1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgRWxlbWVudCBQcm9jZXNzaW5nXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBFbGVtZW50IHByb2Nlc3NpbmcgY29uc2lzdHMgb2YgdGhyZWUgcGFydHMgLS0gZGF0YSBwcm9jZXNzaW5nIHRoYXQgY2Fubm90IGdvIHN0YWxlIGFuZCBkYXRhIHByb2Nlc3NpbmcgdGhhdCAqY2FuKiBnbyBzdGFsZSAoaS5lLiB0aGlyZC1wYXJ0eSBzdHlsZSBtb2RpZmljYXRpb25zKTpcbiAgICAgICAgICAgMSkgUHJlLVF1ZXVlaW5nOiBFbGVtZW50LXdpZGUgdmFyaWFibGVzLCBpbmNsdWRpbmcgdGhlIGVsZW1lbnQncyBkYXRhIHN0b3JhZ2UsIGFyZSBpbnN0YW50aWF0ZWQuIENhbGwgb3B0aW9ucyBhcmUgcHJlcGFyZWQuIElmIHRyaWdnZXJlZCwgdGhlIFN0b3AgYWN0aW9uIGlzIGV4ZWN1dGVkLlxuICAgICAgICAgICAyKSBRdWV1ZWluZzogVGhlIGxvZ2ljIHRoYXQgcnVucyBvbmNlIHRoaXMgY2FsbCBoYXMgcmVhY2hlZCBpdHMgcG9pbnQgb2YgZXhlY3V0aW9uIGluIHRoZSBlbGVtZW50J3MgJC5xdWV1ZSgpIHN0YWNrLiBNb3N0IGxvZ2ljIGlzIHBsYWNlZCBoZXJlIHRvIGF2b2lkIHJpc2tpbmcgaXQgYmVjb21pbmcgc3RhbGUuXG4gICAgICAgICAgIDMpIFB1c2hpbmc6IENvbnNvbGlkYXRpb24gb2YgdGhlIHR3ZWVuIGRhdGEgZm9sbG93ZWQgYnkgaXRzIHB1c2ggb250byB0aGUgZ2xvYmFsIGluLXByb2dyZXNzIGNhbGxzIGNvbnRhaW5lci5cbiAgICAgICAgKi9cblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudCAoKSB7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBQYXJ0IEk6IFByZS1RdWV1ZWluZ1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgRWxlbWVudC1XaWRlIFZhcmlhYmxlc1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMsXG4gICAgICAgICAgICAgICAgLyogVGhlIHJ1bnRpbWUgb3B0cyBvYmplY3QgaXMgdGhlIGV4dGVuc2lvbiBvZiB0aGUgY3VycmVudCBjYWxsJ3Mgb3B0aW9ucyBhbmQgVmVsb2NpdHkncyBwYWdlLXdpZGUgb3B0aW9uIGRlZmF1bHRzLiAqL1xuICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgIC8qIEEgY29udGFpbmVyIGZvciB0aGUgcHJvY2Vzc2VkIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGVhY2ggcHJvcGVydHkgaW4gdGhlIHByb3BlcnR5TWFwLlxuICAgICAgICAgICAgICAgICAgIChFYWNoIHByb3BlcnR5IGluIHRoZSBtYXAgcHJvZHVjZXMgaXRzIG93biBcInR3ZWVuXCIuKSAqL1xuICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IHt9LFxuICAgICAgICAgICAgICAgIGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGE7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIEVsZW1lbnQgSW5pdFxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBEZWxheVxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBTaW5jZSBxdWV1ZTpmYWxzZSBkb2Vzbid0IHJlc3BlY3QgdGhlIGl0ZW0ncyBleGlzdGluZyBxdWV1ZSwgd2UgYXZvaWQgaW5qZWN0aW5nIGl0cyBkZWxheSBoZXJlIChpdCdzIHNldCBsYXRlciBvbikuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSByb2xscyBpdHMgb3duIGRlbGF5IGZ1bmN0aW9uIHNpbmNlIGpRdWVyeSBkb2Vzbid0IGhhdmUgYSB1dGlsaXR5IGFsaWFzIGZvciAkLmZuLmRlbGF5KClcbiAgICAgICAgICAgICAgIChhbmQgdGh1cyByZXF1aXJlcyBqUXVlcnkgZWxlbWVudCBjcmVhdGlvbiwgd2hpY2ggd2UgYXZvaWQgc2luY2UgaXRzIG92ZXJoZWFkIGluY2x1ZGVzIERPTSBxdWVyeWluZykuICovXG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdChvcHRzLmRlbGF5KSAmJiBvcHRzLnF1ZXVlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICQucXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSwgZnVuY3Rpb24obmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGlzIGEgZmxhZyB1c2VkIHRvIGluZGljYXRlIHRvIHRoZSB1cGNvbWluZyBjb21wbGV0ZUNhbGwoKSBmdW5jdGlvbiB0aGF0IHRoaXMgcXVldWUgZW50cnkgd2FzIGluaXRpYXRlZCBieSBWZWxvY2l0eS4gU2VlIGNvbXBsZXRlQ2FsbCgpIGZvciBmdXJ0aGVyIGRldGFpbHMuICovXG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBlbnN1aW5nIHF1ZXVlIGl0ZW0gKHdoaWNoIGlzIGFzc2lnbmVkIHRvIHRoZSBcIm5leHRcIiBhcmd1bWVudCB0aGF0ICQucXVldWUoKSBhdXRvbWF0aWNhbGx5IHBhc3NlcyBpbikgd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgYSBzZXRUaW1lb3V0IGRlbGF5LlxuICAgICAgICAgICAgICAgICAgICAgICBUaGUgc2V0VGltZW91dCBpcyBzdG9yZWQgc28gdGhhdCBpdCBjYW4gYmUgc3ViamVjdGVkIHRvIGNsZWFyVGltZW91dCgpIGlmIHRoaXMgYW5pbWF0aW9uIGlzIHByZW1hdHVyZWx5IHN0b3BwZWQgdmlhIFZlbG9jaXR5J3MgXCJzdG9wXCIgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dDogc2V0VGltZW91dChuZXh0LCBwYXJzZUZsb2F0KG9wdHMuZGVsYXkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IG5leHRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBEdXJhdGlvblxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBTdXBwb3J0IGZvciBqUXVlcnkncyBuYW1lZCBkdXJhdGlvbnMuICovXG4gICAgICAgICAgICBzd2l0Y2ggKG9wdHMuZHVyYXRpb24udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImZhc3RcIjpcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IDIwMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwibm9ybWFsXCI6XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBEVVJBVElPTl9ERUZBVUxUO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJzbG93XCI6XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSA2MDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHRoZSBwb3RlbnRpYWwgXCJtc1wiIHN1ZmZpeCBhbmQgZGVmYXVsdCB0byAxIGlmIHRoZSB1c2VyIGlzIGF0dGVtcHRpbmcgdG8gc2V0IGEgZHVyYXRpb24gb2YgMCAoaW4gb3JkZXIgdG8gcHJvZHVjZSBhbiBpbW1lZGlhdGUgc3R5bGUgY2hhbmdlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IHBhcnNlRmxvYXQob3B0cy5kdXJhdGlvbikgfHwgMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgR2xvYmFsIE9wdGlvbjogTW9ja1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBpZiAoVmVsb2NpdHkubW9jayAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAvKiBJbiBtb2NrIG1vZGUsIGFsbCBhbmltYXRpb25zIGFyZSBmb3JjZWQgdG8gMW1zIHNvIHRoYXQgdGhleSBvY2N1ciBpbW1lZGlhdGVseSB1cG9uIHRoZSBuZXh0IHJBRiB0aWNrLlxuICAgICAgICAgICAgICAgICAgIEFsdGVybmF0aXZlbHksIGEgbXVsdGlwbGllciBjYW4gYmUgcGFzc2VkIGluIHRvIHRpbWUgcmVtYXAgYWxsIGRlbGF5cyBhbmQgZHVyYXRpb25zLiAqL1xuICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5tb2NrID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBvcHRzLmRlbGF5ID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uICo9IHBhcnNlRmxvYXQoVmVsb2NpdHkubW9jaykgfHwgMTtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSAqPSBwYXJzZUZsb2F0KFZlbG9jaXR5Lm1vY2spIHx8IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBFYXNpbmdcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIG9wdHMuZWFzaW5nID0gZ2V0RWFzaW5nKG9wdHMuZWFzaW5nLCBvcHRzLmR1cmF0aW9uKTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIE9wdGlvbjogQ2FsbGJhY2tzXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBDYWxsYmFja3MgbXVzdCBmdW5jdGlvbnMuIE90aGVyd2lzZSwgZGVmYXVsdCB0byBudWxsLiAqL1xuICAgICAgICAgICAgaWYgKG9wdHMuYmVnaW4gJiYgIVR5cGUuaXNGdW5jdGlvbihvcHRzLmJlZ2luKSkge1xuICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0cy5wcm9ncmVzcyAmJiAhVHlwZS5pc0Z1bmN0aW9uKG9wdHMucHJvZ3Jlc3MpKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5wcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRzLmNvbXBsZXRlICYmICFUeXBlLmlzRnVuY3Rpb24ob3B0cy5jb21wbGV0ZSkpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBEaXNwbGF5ICYgVmlzaWJpbGl0eVxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBSZWZlciB0byBWZWxvY2l0eSdzIGRvY3VtZW50YXRpb24gKFZlbG9jaXR5SlMub3JnLyNkaXNwbGF5QW5kVmlzaWJpbGl0eSkgZm9yIGEgZGVzY3JpcHRpb24gb2YgdGhlIGRpc3BsYXkgYW5kIHZpc2liaWxpdHkgb3B0aW9ucycgYmVoYXZpb3IuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBXZSBzdHJpY3RseSBjaGVjayBmb3IgdW5kZWZpbmVkIGluc3RlYWQgb2YgZmFsc2luZXNzIGJlY2F1c2UgZGlzcGxheSBhY2NlcHRzIGFuIGVtcHR5IHN0cmluZyB2YWx1ZS4gKi9cbiAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSBvcHRzLmRpc3BsYXkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICAgICAgLyogVXNlcnMgY2FuIHBhc3MgaW4gYSBzcGVjaWFsIFwiYXV0b1wiIHZhbHVlIHRvIGluc3RydWN0IFZlbG9jaXR5IHRvIHNldCB0aGUgZWxlbWVudCB0byBpdHMgZGVmYXVsdCBkaXNwbGF5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IFZlbG9jaXR5LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgb3B0cy52aXNpYmlsaXR5ID0gb3B0cy52aXNpYmlsaXR5LnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIE9wdGlvbjogbW9iaWxlSEFcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFdoZW4gc2V0IHRvIHRydWUsIGFuZCBpZiB0aGlzIGlzIGEgbW9iaWxlIGRldmljZSwgbW9iaWxlSEEgYXV0b21hdGljYWxseSBlbmFibGVzIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiAodmlhIGEgbnVsbCB0cmFuc2Zvcm0gaGFjaylcbiAgICAgICAgICAgICAgIG9uIGFuaW1hdGluZyBlbGVtZW50cy4gSEEgaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbGVtZW50IGF0IHRoZSBjb21wbGV0aW9uIG9mIGl0cyBhbmltYXRpb24uICovXG4gICAgICAgICAgICAvKiBOb3RlOiBBbmRyb2lkIEdpbmdlcmJyZWFkIGRvZXNuJ3Qgc3VwcG9ydCBIQS4gSWYgYSBudWxsIHRyYW5zZm9ybSBoYWNrIChtb2JpbGVIQSkgaXMgaW4gZmFjdCBzZXQsIGl0IHdpbGwgcHJldmVudCBvdGhlciB0cmFuZm9ybSBzdWJwcm9wZXJ0aWVzIGZyb20gdGFraW5nIGVmZmVjdC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IHRoZSB1c2Ugb2YgbW9iaWxlSEEgaW4gVmVsb2NpdHkncyBkb2N1bWVudGF0aW9uOiBWZWxvY2l0eUpTLm9yZy8jbW9iaWxlSEEuICovXG4gICAgICAgICAgICBvcHRzLm1vYmlsZUhBID0gKG9wdHMubW9iaWxlSEEgJiYgVmVsb2NpdHkuU3RhdGUuaXNNb2JpbGUgJiYgIVZlbG9jaXR5LlN0YXRlLmlzR2luZ2VyYnJlYWQpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIFBhcnQgSUk6IFF1ZXVlaW5nXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogV2hlbiBhIHNldCBvZiBlbGVtZW50cyBpcyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwsIHRoZSBzZXQgaXMgYnJva2VuIHVwIGFuZCBlYWNoIGVsZW1lbnQgaGFzIHRoZSBjdXJyZW50IFZlbG9jaXR5IGNhbGwgaW5kaXZpZHVhbGx5IHF1ZXVlZCBvbnRvIGl0LlxuICAgICAgICAgICAgICAgSW4gdGhpcyB3YXksIGVhY2ggZWxlbWVudCdzIGV4aXN0aW5nIHF1ZXVlIGlzIHJlc3BlY3RlZDsgc29tZSBlbGVtZW50cyBtYXkgYWxyZWFkeSBiZSBhbmltYXRpbmcgYW5kIGFjY29yZGluZ2x5IHNob3VsZCBub3QgaGF2ZSB0aGlzIGN1cnJlbnQgVmVsb2NpdHkgY2FsbCB0cmlnZ2VyZWQgaW1tZWRpYXRlbHkuICovXG4gICAgICAgICAgICAvKiBJbiBlYWNoIHF1ZXVlLCB0d2VlbiBkYXRhIGlzIHByb2Nlc3NlZCBmb3IgZWFjaCBhbmltYXRpbmcgcHJvcGVydHkgdGhlbiBwdXNoZWQgb250byB0aGUgY2FsbC13aWRlIGNhbGxzIGFycmF5LiBXaGVuIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIHNldCBoYXMgaGFkIGl0cyB0d2VlbnMgcHJvY2Vzc2VkLFxuICAgICAgICAgICAgICAgdGhlIGNhbGwgYXJyYXkgaXMgcHVzaGVkIHRvIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGZvciBsaXZlIHByb2Nlc3NpbmcgYnkgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSB0aWNrLiAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gYnVpbGRRdWV1ZSAobmV4dCkge1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICBPcHRpb246IEJlZ2luXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIFRoZSBiZWdpbiBjYWxsYmFjayBpcyBmaXJlZCBvbmNlIHBlciBjYWxsIC0tIG5vdCBvbmNlIHBlciBlbGVtZW5ldCAtLSBhbmQgaXMgcGFzc2VkIHRoZSBmdWxsIHJhdyBET00gZWxlbWVudCBzZXQgYXMgYm90aCBpdHMgY29udGV4dCBhbmQgaXRzIGZpcnN0IGFyZ3VtZW50LiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmJlZ2luICYmIGVsZW1lbnRzSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLyogV2UgdGhyb3cgY2FsbGJhY2tzIGluIGEgc2V0VGltZW91dCBzbyB0aGF0IHRocm93biBlcnJvcnMgZG9uJ3QgaGFsdCB0aGUgZXhlY3V0aW9uIG9mIFZlbG9jaXR5IGl0c2VsZi4gKi9cbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZXJyb3I7IH0sIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTY3JvbGwpXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBJbiBvcmRlciB0byBiZSBzdWJqZWN0ZWQgdG8gY2hhaW5pbmcgYW5kIGFuaW1hdGlvbiBvcHRpb25zLCBzY3JvbGwncyB0d2VlbmluZyBpcyByb3V0ZWQgdGhyb3VnaCBWZWxvY2l0eSBhcyBpZiBpdCB3ZXJlIGEgc3RhbmRhcmQgQ1NTIHByb3BlcnR5IGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSBcInNjcm9sbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBzY3JvbGwgYWN0aW9uIHVuaXF1ZWx5IHRha2VzIGFuIG9wdGlvbmFsIFwib2Zmc2V0XCIgb3B0aW9uIC0tIHNwZWNpZmllZCBpbiBwaXhlbHMgLS0gdGhhdCBvZmZzZXRzIHRoZSB0YXJnZXRlZCBzY3JvbGwgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGxEaXJlY3Rpb24gPSAoL154JC9pLnRlc3Qob3B0cy5heGlzKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSBwYXJzZUZsb2F0KG9wdHMub2Zmc2V0KSB8fCAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2Nyb2xsIGFsc28gdW5pcXVlbHkgdGFrZXMgYW4gb3B0aW9uYWwgXCJjb250YWluZXJcIiBvcHRpb24sIHdoaWNoIGluZGljYXRlcyB0aGUgcGFyZW50IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc2Nyb2xsZWQgLS1cbiAgICAgICAgICAgICAgICAgICAgICAgYXMgb3Bwb3NlZCB0byB0aGUgYnJvd3NlciB3aW5kb3cgaXRzZWxmLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2Nyb2xsaW5nIHRvd2FyZCBhbiBlbGVtZW50IHRoYXQncyBpbnNpZGUgYW4gb3ZlcmZsb3dpbmcgcGFyZW50IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRW5zdXJlIHRoYXQgZWl0aGVyIGEgalF1ZXJ5IG9iamVjdCBvciBhIHJhdyBET00gZWxlbWVudCB3YXMgcGFzc2VkIGluLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNXcmFwcGVkKG9wdHMuY29udGFpbmVyKSB8fCBUeXBlLmlzTm9kZShvcHRzLmNvbnRhaW5lcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFeHRyYWN0IHRoZSByYXcgRE9NIGVsZW1lbnQgZnJvbSB0aGUgalF1ZXJ5IHdyYXBwZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250YWluZXIgPSBvcHRzLmNvbnRhaW5lclswXSB8fCBvcHRzLmNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBVbmxpa2Ugb3RoZXIgcHJvcGVydGllcyBpbiBWZWxvY2l0eSwgdGhlIGJyb3dzZXIncyBzY3JvbGwgcG9zaXRpb24gaXMgbmV2ZXIgY2FjaGVkIHNpbmNlIGl0IHNvIGZyZXF1ZW50bHkgY2hhbmdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChkdWUgdG8gdGhlIHVzZXIncyBuYXR1cmFsIGludGVyYWN0aW9uIHdpdGggdGhlIHBhZ2UpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uQ3VycmVudCA9IG9wdHMuY29udGFpbmVyW1wic2Nyb2xsXCIgKyBzY3JvbGxEaXJlY3Rpb25dOyAvKiBHRVQgKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICQucG9zaXRpb24oKSB2YWx1ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXIncyBjdXJyZW50bHkgdmlld2FibGUgYXJlYSAod2l0aG91dCB0YWtpbmcgaW50byBhY2NvdW50IHRoZSBjb250YWluZXIncyB0cnVlIGRpbWVuc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzYXksIGZvciBleGFtcGxlLCBpZiB0aGUgY29udGFpbmVyIHdhcyBub3Qgb3ZlcmZsb3dpbmcpLiBUaHVzLCB0aGUgc2Nyb2xsIGVuZCB2YWx1ZSBpcyB0aGUgc3VtIG9mIHRoZSBjaGlsZCBlbGVtZW50J3MgcG9zaXRpb24gKmFuZCpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgc2Nyb2xsIGNvbnRhaW5lcidzIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uRW5kID0gKHNjcm9sbFBvc2l0aW9uQ3VycmVudCArICQoZWxlbWVudCkucG9zaXRpb24oKVtzY3JvbGxEaXJlY3Rpb24udG9Mb3dlckNhc2UoKV0pICsgc2Nyb2xsT2Zmc2V0OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgdmFsdWUgb3RoZXIgdGhhbiBhIGpRdWVyeSBvYmplY3Qgb3IgYSByYXcgRE9NIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiwgZGVmYXVsdCB0byBudWxsIHNvIHRoYXQgdGhpcyBvcHRpb24gaXMgaWdub3JlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250YWluZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHdpbmRvdyBpdHNlbGYgaXMgYmVpbmcgc2Nyb2xsZWQgLS0gbm90IGEgY29udGFpbmluZyBlbGVtZW50IC0tIHBlcmZvcm0gYSBsaXZlIHNjcm9sbCBwb3NpdGlvbiBsb29rdXAgdXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBhcHByb3ByaWF0ZSBjYWNoZWQgcHJvcGVydHkgbmFtZXMgKHdoaWNoIGRpZmZlciBiYXNlZCBvbiBicm93c2VyIHR5cGUpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50ID0gVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yW1ZlbG9jaXR5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIiArIHNjcm9sbERpcmVjdGlvbl1dOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gc2Nyb2xsaW5nIHRoZSBicm93c2VyIHdpbmRvdywgY2FjaGUgdGhlIGFsdGVybmF0ZSBheGlzJ3MgY3VycmVudCB2YWx1ZSBzaW5jZSB3aW5kb3cuc2Nyb2xsVG8oKSBkb2Vzbid0IGxldCB1cyBjaGFuZ2Ugb25seSBvbmUgdmFsdWUgYXQgYSB0aW1lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlID0gVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yW1ZlbG9jaXR5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIiArIChzY3JvbGxEaXJlY3Rpb24gPT09IFwiTGVmdFwiID8gXCJUb3BcIiA6IFwiTGVmdFwiKV1dOyAvKiBHRVQgKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5saWtlICQucG9zaXRpb24oKSwgJC5vZmZzZXQoKSB2YWx1ZXMgYXJlIHJlbGF0aXZlIHRvIHRoZSBicm93c2VyIHdpbmRvdydzIHRydWUgZGltZW5zaW9ucyAtLSBub3QgbWVyZWx5IGl0cyBjdXJyZW50bHkgdmlld2FibGUgYXJlYSAtLVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZXJlZm9yZSBlbmQgdmFsdWVzIGRvIG5vdCBuZWVkIHRvIGJlIGNvbXBvdW5kZWQgb250byBjdXJyZW50IHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uRW5kID0gJChlbGVtZW50KS5vZmZzZXQoKVtzY3JvbGxEaXJlY3Rpb24udG9Mb3dlckNhc2UoKV0gKyBzY3JvbGxPZmZzZXQ7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlcmUncyBvbmx5IG9uZSBmb3JtYXQgdGhhdCBzY3JvbGwncyBhc3NvY2lhdGVkIHR3ZWVuc0NvbnRhaW5lciBjYW4gdGFrZSwgd2UgY3JlYXRlIGl0IG1hbnVhbGx5LiAqL1xuICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlOiBzY3JvbGxQb3NpdGlvbkVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IG9wdHMuZWFzaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbERhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBvcHRzLmNvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBzY3JvbGxEaXJlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdGVybmF0ZVZhbHVlOiBzY3JvbGxQb3NpdGlvbkN1cnJlbnRBbHRlcm5hdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJ0d2VlbnNDb250YWluZXIgKHNjcm9sbCk6IFwiLCB0d2VlbnNDb250YWluZXIuc2Nyb2xsLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENvbnN0cnVjdGlvbiAoZm9yIFJldmVyc2UpXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogUmV2ZXJzZSBhY3RzIGxpa2UgYSBcInN0YXJ0XCIgYWN0aW9uIGluIHRoYXQgYSBwcm9wZXJ0eSBtYXAgaXMgYW5pbWF0ZWQgdG93YXJkLiBUaGUgb25seSBkaWZmZXJlbmNlIGlzXG4gICAgICAgICAgICAgICAgICAgdGhhdCB0aGUgcHJvcGVydHkgbWFwIHVzZWQgZm9yIHJldmVyc2UgaXMgdGhlIGludmVyc2Ugb2YgdGhlIG1hcCB1c2VkIGluIHRoZSBwcmV2aW91cyBjYWxsLiBUaHVzLCB3ZSBtYW5pcHVsYXRlXG4gICAgICAgICAgICAgICAgICAgdGhlIHByZXZpb3VzIGNhbGwgdG8gY29uc3RydWN0IG91ciBuZXcgbWFwOiB1c2UgdGhlIHByZXZpb3VzIG1hcCdzIGVuZCB2YWx1ZXMgYXMgb3VyIG5ldyBtYXAncyBzdGFydCB2YWx1ZXMuIENvcHkgb3ZlciBhbGwgb3RoZXIgZGF0YS4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBSZXZlcnNlIGNhbiBiZSBkaXJlY3RseSBjYWxsZWQgdmlhIHRoZSBcInJldmVyc2VcIiBwYXJhbWV0ZXIsIG9yIGl0IGNhbiBiZSBpbmRpcmVjdGx5IHRyaWdnZXJlZCB2aWEgdGhlIGxvb3Agb3B0aW9uLiAoTG9vcHMgYXJlIGNvbXBvc2VkIG9mIG11bHRpcGxlIHJldmVyc2VzLikgKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBSZXZlcnNlIGNhbGxzIGRvIG5vdCBuZWVkIHRvIGJlIGNvbnNlY3V0aXZlbHkgY2hhaW5lZCBvbnRvIGEgY3VycmVudGx5LWFuaW1hdGluZyBlbGVtZW50IGluIG9yZGVyIHRvIG9wZXJhdGUgb24gY2FjaGVkIHZhbHVlcztcbiAgICAgICAgICAgICAgICAgICB0aGVyZSBpcyBubyBoYXJtIHRvIHJldmVyc2UgYmVpbmcgY2FsbGVkIG9uIGEgcG90ZW50aWFsbHkgc3RhbGUgZGF0YSBjYWNoZSBzaW5jZSByZXZlcnNlJ3MgYmVoYXZpb3IgaXMgc2ltcGx5IGRlZmluZWRcbiAgICAgICAgICAgICAgICAgICBhcyByZXZlcnRpbmcgdG8gdGhlIGVsZW1lbnQncyB2YWx1ZXMgYXMgdGhleSB3ZXJlIHByaW9yIHRvIHRoZSBwcmV2aW91cyAqVmVsb2NpdHkqIGNhbGwuICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09IFwicmV2ZXJzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEFib3J0IGlmIHRoZXJlIGlzIG5vIHByaW9yIGFuaW1hdGlvbiBkYXRhIHRvIHJldmVyc2UgdG8uICovXG4gICAgICAgICAgICAgICAgICAgIGlmICghRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlcXVldWUgdGhlIGVsZW1lbnQgc28gdGhhdCB0aGlzIHF1ZXVlIGVudHJ5IHJlbGVhc2VzIGl0c2VsZiBpbW1lZGlhdGVseSwgYWxsb3dpbmcgc3Vic2VxdWVudCBxdWV1ZSBlbnRyaWVzIHRvIHJ1bi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgT3B0aW9ucyBQYXJzaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBlbGVtZW50IHdhcyBoaWRkZW4gdmlhIHRoZSBkaXNwbGF5IG9wdGlvbiBpbiB0aGUgcHJldmlvdXMgY2FsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydCBkaXNwbGF5IHRvIFwiYXV0b1wiIHByaW9yIHRvIHJldmVyc2FsIHNvIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBhZ2Fpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLm9wdHMuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMuZGlzcGxheSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS5vcHRzLnZpc2liaWxpdHkgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgbG9vcCBvcHRpb24gd2FzIHNldCBpbiB0aGUgcHJldmlvdXMgY2FsbCwgZGlzYWJsZSBpdCBzbyB0aGF0IFwicmV2ZXJzZVwiIGNhbGxzIGFyZW4ndCByZWN1cnNpdmVseSBnZW5lcmF0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBGdXJ0aGVyLCByZW1vdmUgdGhlIHByZXZpb3VzIGNhbGwncyBjYWxsYmFjayBvcHRpb25zOyB0eXBpY2FsbHksIHVzZXJzIGRvIG5vdCB3YW50IHRoZXNlIHRvIGJlIHJlZmlyZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMubG9vcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmJlZ2luID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkub3B0cy5jb21wbGV0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHdlJ3JlIGV4dGVuZGluZyBhbiBvcHRzIG9iamVjdCB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gZXh0ZW5kZWQgd2l0aCB0aGUgZGVmYXVsdHMgb3B0aW9ucyBvYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB3ZSByZW1vdmUgbm9uLWV4cGxpY2l0bHktZGVmaW5lZCBwcm9wZXJ0aWVzIHRoYXQgYXJlIGF1dG8tYXNzaWduZWQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmVhc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9wdHMuZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBvcHRzIG9iamVjdCB1c2VkIGZvciByZXZlcnNhbCBpcyBhbiBleHRlbnNpb24gb2YgdGhlIG9wdGlvbnMgb2JqZWN0IG9wdGlvbmFsbHkgcGFzc2VkIGludG8gdGhpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZSBjYWxsIHBsdXMgdGhlIG9wdGlvbnMgdXNlZCBpbiB0aGUgcHJldmlvdXMgVmVsb2NpdHkgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgRGF0YShlbGVtZW50KS5vcHRzLCBvcHRzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFR3ZWVucyBDb250YWluZXIgUmVjb25zdHJ1Y3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBhIGRlZXB5IGNvcHkgKGluZGljYXRlZCB2aWEgdGhlIHRydWUgZmxhZykgb2YgdGhlIHByZXZpb3VzIGNhbGwncyB0d2VlbnNDb250YWluZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFR3ZWVuc0NvbnRhaW5lciA9ICQuZXh0ZW5kKHRydWUsIHt9LCBEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hbmlwdWxhdGUgdGhlIHByZXZpb3VzIHR3ZWVuc0NvbnRhaW5lciBieSByZXBsYWNpbmcgaXRzIGVuZCB2YWx1ZXMgYW5kIGN1cnJlbnRWYWx1ZXMgd2l0aCBpdHMgc3RhcnQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbGFzdFR3ZWVuIGluIGxhc3RUd2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiBhZGRpdGlvbiB0byB0d2VlbiBkYXRhLCB0d2VlbnNDb250YWluZXJzIGNvbnRhaW4gYW4gZWxlbWVudCBwcm9wZXJ0eSB0aGF0IHdlIGlnbm9yZSBoZXJlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VHdlZW4gIT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0U3RhcnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5zdGFydFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5zdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmN1cnJlbnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5lbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmVuZFZhbHVlID0gbGFzdFN0YXJ0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRWFzaW5nIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IGVtYmVkcyBpbnRvIHRoZSBpbmRpdmlkdWFsIHR3ZWVuIGRhdGEgKHNpbmNlIGl0IGNhbiBiZSBkZWZpbmVkIG9uIGEgcGVyLXByb3BlcnR5IGJhc2lzKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGV2ZXJ5IHByb3BlcnR5J3MgZWFzaW5nIHZhbHVlIG11c3QgYmUgdXBkYXRlZCB3aGVuIGFuIG9wdGlvbnMgb2JqZWN0IGlzIHBhc3NlZCBpbiB3aXRoIGEgcmV2ZXJzZSBjYWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgc2lkZSBlZmZlY3Qgb2YgdGhpcyBleHRlbnNpYmlsaXR5IGlzIHRoYXQgYWxsIHBlci1wcm9wZXJ0eSBlYXNpbmcgdmFsdWVzIGFyZSBmb3JjZWZ1bGx5IHJlc2V0IHRvIHRoZSBuZXcgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0VtcHR5T2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZWFzaW5nID0gb3B0cy5lYXNpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIGNvbnNvbGUubG9nKFwicmV2ZXJzZSB0d2VlbnNDb250YWluZXIgKFwiICsgbGFzdFR3ZWVuICsgXCIpOiBcIiArIEpTT04uc3RyaW5naWZ5KGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXSksIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyID0gbGFzdFR3ZWVuc0NvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTdGFydClcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcInN0YXJ0XCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWUgVHJhbnNmZXJyaW5nXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBxdWV1ZSBlbnRyeSBmb2xsb3dzIGEgcHJldmlvdXMgVmVsb2NpdHktaW5pdGlhdGVkIHF1ZXVlIGVudHJ5ICphbmQqIGlmIHRoaXMgZW50cnkgd2FzIGNyZWF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgdGhlIGVsZW1lbnQgd2FzIGluIHRoZSBwcm9jZXNzIG9mIGJlaW5nIGFuaW1hdGVkIGJ5IFZlbG9jaXR5LCB0aGVuIHRoaXMgY3VycmVudCBjYWxsIGlzIHNhZmUgdG8gdXNlXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbmQgdmFsdWVzIGZyb20gdGhlIHByaW9yIGNhbGwgYXMgaXRzIHN0YXJ0IHZhbHVlcy4gVmVsb2NpdHkgYXR0ZW1wdHMgdG8gcGVyZm9ybSB0aGlzIHZhbHVlIHRyYW5zZmVyXG4gICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3Mgd2hlbmV2ZXIgcG9zc2libGUgaW4gb3JkZXIgdG8gYXZvaWQgcmVxdWVyeWluZyB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB2YWx1ZXMgYXJlbid0IHRyYW5zZmVycmVkIGZyb20gYSBwcmlvciBjYWxsIGFuZCBzdGFydCB2YWx1ZXMgd2VyZSBub3QgZm9yY2VmZWQgYnkgdGhlIHVzZXIgKG1vcmUgb24gdGhpcyBiZWxvdyksXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZW4gdGhlIERPTSBpcyBxdWVyaWVkIGZvciB0aGUgZWxlbWVudCdzIGN1cnJlbnQgdmFsdWVzIGFzIGEgbGFzdCByZXNvcnQuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IENvbnZlcnNlbHksIGFuaW1hdGlvbiByZXZlcnNhbCAoYW5kIGxvb3BpbmcpICphbHdheXMqIHBlcmZvcm0gaW50ZXItY2FsbCB2YWx1ZSB0cmFuc2ZlcnM7IHRoZXkgbmV2ZXIgcmVxdWVyeSB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdFR3ZWVuc0NvbnRhaW5lcjtcblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcGVyLWVsZW1lbnQgaXNBbmltYXRpbmcgZmxhZyBpcyB1c2VkIHRvIGluZGljYXRlIHdoZXRoZXIgaXQncyBzYWZlIChpLmUuIHRoZSBkYXRhIGlzbid0IHN0YWxlKVxuICAgICAgICAgICAgICAgICAgICAgICB0byB0cmFuc2ZlciBvdmVyIGVuZCB2YWx1ZXMgdG8gdXNlIGFzIHN0YXJ0IHZhbHVlcy4gSWYgaXQncyBzZXQgdG8gdHJ1ZSBhbmQgdGhlcmUgaXMgYSBwcmV2aW91c1xuICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBjYWxsIHRvIHB1bGwgdmFsdWVzIGZyb20sIGRvIHNvLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIgJiYgRGF0YShlbGVtZW50KS5pc0FuaW1hdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lciA9IERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENhbGN1bGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGZ1bmN0aW9uIHBhcnNlcyBwcm9wZXJ0eSBkYXRhIGFuZCBkZWZhdWx0cyBlbmRWYWx1ZSwgZWFzaW5nLCBhbmQgc3RhcnRWYWx1ZSBhcyBhcHByb3ByaWF0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogUHJvcGVydHkgbWFwIHZhbHVlcyBjYW4gZWl0aGVyIHRha2UgdGhlIGZvcm0gb2YgMSkgYSBzaW5nbGUgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSBlbmQgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgIG9yIDIpIGFuIGFycmF5IGluIHRoZSBmb3JtIG9mIFsgZW5kVmFsdWUsIFssIGVhc2luZ10gWywgc3RhcnRWYWx1ZV0gXS5cbiAgICAgICAgICAgICAgICAgICAgICAgVGhlIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlciBpcyBhIGZvcmNlZmVkIHN0YXJ0VmFsdWUgdG8gYmUgdXNlZCBpbnN0ZWFkIG9mIHF1ZXJ5aW5nIHRoZSBET00gZm9yXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZS4gUmVhZCBWZWxvY2l0eSdzIGRvY21lbnRhdGlvbiB0byBsZWFybiBtb3JlIGFib3V0IGZvcmNlZmVlZGluZzogVmVsb2NpdHlKUy5vcmcvI2ZvcmNlZmVlZGluZyAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBwYXJzZVByb3BlcnR5VmFsdWUgKHZhbHVlRGF0YSwgc2tpcFJlc29sdmluZ0Vhc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVuZFZhbHVlID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgdGhlIGFycmF5IGZvcm1hdCwgd2hpY2ggY2FuIGJlIHN0cnVjdHVyZWQgYXMgb25lIG9mIHRocmVlIHBvdGVudGlhbCBvdmVybG9hZHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBBKSBbIGVuZFZhbHVlLCBlYXNpbmcsIHN0YXJ0VmFsdWUgXSwgQikgWyBlbmRWYWx1ZSwgZWFzaW5nIF0sIG9yIEMpIFsgZW5kVmFsdWUsIHN0YXJ0VmFsdWUgXSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZURhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZW5kVmFsdWUgaXMgYWx3YXlzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBhcnJheS4gRG9uJ3QgYm90aGVyIHZhbGlkYXRpbmcgZW5kVmFsdWUncyB2YWx1ZSBub3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaW5jZSB0aGUgZW5zdWluZyBwcm9wZXJ0eSBjeWNsaW5nIGxvZ2ljIGRvZXMgdGhhdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHZhbHVlRGF0YVswXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFR3by1pdGVtIGFycmF5IGZvcm1hdDogSWYgdGhlIHNlY29uZCBpdGVtIGlzIGEgbnVtYmVyLCBmdW5jdGlvbiwgb3IgaGV4IHN0cmluZywgdHJlYXQgaXQgYXMgYVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0IHZhbHVlIHNpbmNlIGVhc2luZ3MgY2FuIG9ubHkgYmUgbm9uLWhleCBzdHJpbmdzIG9yIGFycmF5cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFUeXBlLmlzQXJyYXkodmFsdWVEYXRhWzFdKSAmJiAvXltcXGQtXS8udGVzdCh2YWx1ZURhdGFbMV0pKSB8fCBUeXBlLmlzRnVuY3Rpb24odmFsdWVEYXRhWzFdKSB8fCBDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHdvIG9yIHRocmVlLWl0ZW0gYXJyYXk6IElmIHRoZSBzZWNvbmQgaXRlbSBpcyBhIG5vbi1oZXggc3RyaW5nIG9yIGFuIGFycmF5LCB0cmVhdCBpdCBhcyBhbiBlYXNpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoVHlwZS5pc1N0cmluZyh2YWx1ZURhdGFbMV0pICYmICFDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pKSB8fCBUeXBlLmlzQXJyYXkodmFsdWVEYXRhWzFdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBza2lwUmVzb2x2aW5nRWFzaW5nID8gdmFsdWVEYXRhWzFdIDogZ2V0RWFzaW5nKHZhbHVlRGF0YVsxXSwgb3B0cy5kdXJhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRG9uJ3QgYm90aGVyIHZhbGlkYXRpbmcgc3RhcnRWYWx1ZSdzIHZhbHVlIG5vdyBzaW5jZSB0aGUgZW5zdWluZyBwcm9wZXJ0eSBjeWNsaW5nIGxvZ2ljIGluaGVyZW50bHkgZG9lcyB0aGF0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVEYXRhWzJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgdGhlIHNpbmdsZS12YWx1ZSBmb3JtYXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIHRoZSBjYWxsJ3MgZWFzaW5nIGlmIGEgcGVyLXByb3BlcnR5IGVhc2luZyB0eXBlIHdhcyBub3QgZGVmaW5lZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2tpcFJlc29sdmluZ0Vhc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IGVhc2luZyB8fCBvcHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgZnVuY3Rpb25zIHdlcmUgcGFzc2VkIGluIGFzIHZhbHVlcywgcGFzcyB0aGUgZnVuY3Rpb24gdGhlIGN1cnJlbnQgZWxlbWVudCBhcyBpdHMgY29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsdXMgdGhlIGVsZW1lbnQncyBpbmRleCBhbmQgdGhlIGVsZW1lbnQgc2V0J3Mgc2l6ZSBhcyBhcmd1bWVudHMuIFRoZW4sIGFzc2lnbiB0aGUgcmV0dXJuZWQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0Z1bmN0aW9uKGVuZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gZW5kVmFsdWUuY2FsbChlbGVtZW50LCBlbGVtZW50c0luZGV4LCBlbGVtZW50c0xlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oc3RhcnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gc3RhcnRWYWx1ZS5jYWxsKGVsZW1lbnQsIGVsZW1lbnRzSW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQWxsb3cgc3RhcnRWYWx1ZSB0byBiZSBsZWZ0IGFzIHVuZGVmaW5lZCB0byBpbmRpY2F0ZSB0byB0aGUgZW5zdWluZyBjb2RlIHRoYXQgaXRzIHZhbHVlIHdhcyBub3QgZm9yY2VmZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBlbmRWYWx1ZSB8fCAwLCBlYXNpbmcsIHN0YXJ0VmFsdWUgXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEN5Y2xlIHRocm91Z2ggZWFjaCBwcm9wZXJ0eSBpbiB0aGUgbWFwLCBsb29raW5nIGZvciBzaG9ydGhhbmQgY29sb3IgcHJvcGVydGllcyAoZS5nLiBcImNvbG9yXCIgYXMgb3Bwb3NlZCB0byBcImNvbG9yUmVkXCIpLiBJbmplY3QgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgY29sb3JSZWQsIGNvbG9yR3JlZW4sIGFuZCBjb2xvckJsdWUgUkdCIGNvbXBvbmVudCB0d2VlbnMgaW50byB0aGUgcHJvcGVydGllc01hcCAod2hpY2ggVmVsb2NpdHkgdW5kZXJzdGFuZHMpIGFuZCByZW1vdmUgdGhlIHNob3J0aGFuZCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHByb3BlcnRpZXNNYXAsIGZ1bmN0aW9uKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRmluZCBzaG9ydGhhbmQgY29sb3IgcHJvcGVydGllcyB0aGF0IGhhdmUgYmVlbiBwYXNzZWQgYSBoZXggc3RyaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJlZ0V4cChcIl5cIiArIENTUy5MaXN0cy5jb2xvcnMuam9pbihcIiR8XlwiKSArIFwiJFwiKS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhcnNlIHRoZSB2YWx1ZSBkYXRhIGZvciBlYWNoIHNob3J0aGFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVEYXRhID0gcGFyc2VQcm9wZXJ0eVZhbHVlKHZhbHVlLCB0cnVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGFbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHZhbHVlRGF0YVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsyXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXguaXNIZXgudGVzdChlbmRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCB0aGUgaGV4IHN0cmluZ3MgaW50byB0aGVpciBSR0IgY29tcG9uZW50IGFycmF5cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yQ29tcG9uZW50cyA9IFsgXCJSZWRcIiwgXCJHcmVlblwiLCBcIkJsdWVcIiBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVSR0IgPSBDU1MuVmFsdWVzLmhleFRvUmdiKGVuZFZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWVSR0IgPSBzdGFydFZhbHVlID8gQ1NTLlZhbHVlcy5oZXhUb1JnYihzdGFydFZhbHVlKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbmplY3QgdGhlIFJHQiBjb21wb25lbnQgdHdlZW5zIGludG8gcHJvcGVydGllc01hcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xvckNvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhQXJyYXkgPSBbIGVuZFZhbHVlUkdCW2ldIF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlYXNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChlYXNpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZVJHQiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUFycmF5LnB1c2goc3RhcnRWYWx1ZVJHQltpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXBbcHJvcGVydHkgKyBjb2xvckNvbXBvbmVudHNbaV1dID0gZGF0YUFycmF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHRoZSBpbnRlcm1lZGlhcnkgc2hvcnRoYW5kIHByb3BlcnR5IGVudHJ5IG5vdyB0aGF0IHdlJ3ZlIHByb2Nlc3NlZCBpdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHByb3BlcnRpZXNNYXBbcHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ3JlYXRlIGEgdHdlZW4gb3V0IG9mIGVhY2ggcHJvcGVydHksIGFuZCBhcHBlbmQgaXRzIGFzc29jaWF0ZWQgZGF0YSB0byB0d2VlbnNDb250YWluZXIuICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHByb3BlcnRpZXNNYXApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBTdGFydCBWYWx1ZSBTb3VyY2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhcnNlIG91dCBlbmRWYWx1ZSwgZWFzaW5nLCBhbmQgc3RhcnRWYWx1ZSBmcm9tIHRoZSBwcm9wZXJ0eSdzIGRhdGEuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVEYXRhID0gcGFyc2VQcm9wZXJ0eVZhbHVlKHByb3BlcnRpZXNNYXBbcHJvcGVydHldKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHZhbHVlRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSB2YWx1ZURhdGFbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsyXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm93IHRoYXQgdGhlIG9yaWdpbmFsIHByb3BlcnR5IG5hbWUncyBmb3JtYXQgaGFzIGJlZW4gdXNlZCBmb3IgdGhlIHBhcnNlUHJvcGVydHlWYWx1ZSgpIGxvb2t1cCBhYm92ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlIGZvcmNlIHRoZSBwcm9wZXJ0eSB0byBpdHMgY2FtZWxDYXNlIHN0eWxpbmcgdG8gbm9ybWFsaXplIGl0IGZvciBtYW5pcHVsYXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IENTUy5OYW1lcy5jYW1lbENhc2UocHJvcGVydHkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiBjYXNlIHRoaXMgcHJvcGVydHkgaXMgYSBob29rLCB0aGVyZSBhcmUgY2lyY3Vtc3RhbmNlcyB3aGVyZSB3ZSB3aWxsIGludGVuZCB0byB3b3JrIG9uIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eSBhbmQgbm90IHRoZSBob29rZWQgc3VicHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcm9vdFByb3BlcnR5ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyIHRoYW4gZm9yIHRoZSBkdW1teSB0d2VlbiBwcm9wZXJ0eSwgcHJvcGVydGllcyB0aGF0IGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIChhbmQgZG8gbm90IGhhdmUgYW4gYXNzb2NpYXRlZCBub3JtYWxpemF0aW9uKSB3aWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpbmhlcmVudGx5IHByb2R1Y2Ugbm8gc3R5bGUgY2hhbmdlcyB3aGVuIHNldCwgc28gdGhleSBhcmUgc2tpcHBlZCBpbiBvcmRlciB0byBkZWNyZWFzZSBhbmltYXRpb24gdGljayBvdmVyaGVhZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZCB2aWEgcHJlZml4Q2hlY2soKSwgd2hpY2ggcmV0dXJucyBhIGZhbHNlIGZsYWcgd2hlbiBubyBzdXBwb3J0ZWQgaXMgZGV0ZWN0ZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTaW5jZSBTVkcgZWxlbWVudHMgaGF2ZSBzb21lIG9mIHRoZWlyIHByb3BlcnRpZXMgZGlyZWN0bHkgYXBwbGllZCBhcyBIVE1MIGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVyZSBpcyBubyB3YXkgdG8gY2hlY2sgZm9yIHRoZWlyIGV4cGxpY2l0IGJyb3dzZXIgc3VwcG9ydCwgYW5kIHNvIHdlIHNraXAgc2tpcCB0aGlzIGNoZWNrIGZvciB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIHJvb3RQcm9wZXJ0eSAhPT0gXCJ0d2VlblwiICYmIENTUy5OYW1lcy5wcmVmaXhDaGVjayhyb290UHJvcGVydHkpWzFdID09PSBmYWxzZSAmJiBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtyb290UHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIGNvbnNvbGUubG9nKFwiU2tpcHBpbmcgW1wiICsgcm9vdFByb3BlcnR5ICsgXCJdIGR1ZSB0byBhIGxhY2sgb2YgYnJvd3NlciBzdXBwb3J0LlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZGlzcGxheSBvcHRpb24gaXMgYmVpbmcgc2V0IHRvIGEgbm9uLVwibm9uZVwiIChlLmcuIFwiYmxvY2tcIikgYW5kIG9wYWNpdHkgKGZpbHRlciBvbiBJRTw9OCkgaXMgYmVpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVkIHRvIGFuIGVuZFZhbHVlIG9mIG5vbi16ZXJvLCB0aGUgdXNlcidzIGludGVudGlvbiBpcyB0byBmYWRlIGluIGZyb20gaW52aXNpYmxlLCB0aHVzIHdlIGZvcmNlZmVlZCBvcGFjaXR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhIHN0YXJ0VmFsdWUgb2YgMCBpZiBpdHMgc3RhcnRWYWx1ZSBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNvdXJjZWQgYnkgdmFsdWUgdHJhbnNmZXJyaW5nIG9yIHByaW9yIGZvcmNlZmVlZGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gbnVsbCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB8fCAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiKSkgJiYgL29wYWNpdHl8ZmlsdGVyLy50ZXN0KHByb3BlcnR5KSAmJiAhc3RhcnRWYWx1ZSAmJiBlbmRWYWx1ZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB2YWx1ZXMgaGF2ZSBiZWVuIHRyYW5zZmVycmVkIGZyb20gdGhlIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwsIGV4dHJhY3QgdGhlIGVuZFZhbHVlIGFuZCByb290UHJvcGVydHlWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGFsbCBvZiB0aGUgY3VycmVudCBjYWxsJ3MgcHJvcGVydGllcyB0aGF0IHdlcmUgKmFsc28qIGFuaW1hdGVkIGluIHRoZSBwcmV2aW91cyBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVmFsdWUgdHJhbnNmZXJyaW5nIGNhbiBvcHRpb25hbGx5IGJlIGRpc2FibGVkIGJ5IHRoZSB1c2VyIHZpYSB0aGUgX2NhY2hlVmFsdWVzIG9wdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLl9jYWNoZVZhbHVlcyAmJiBsYXN0VHdlZW5zQ29udGFpbmVyICYmIGxhc3RUd2VlbnNDb250YWluZXJbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0uZW5kVmFsdWUgKyBsYXN0VHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XS51bml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcHJldmlvdXMgY2FsbCdzIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIGV4dHJhY3RlZCBmcm9tIHRoZSBlbGVtZW50J3MgZGF0YSBjYWNoZSBzaW5jZSB0aGF0J3MgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Ugb2Ygcm9vdFByb3BlcnR5VmFsdWUgdGhhdCBnZXRzIGZyZXNobHkgdXBkYXRlZCBieSB0aGUgdHdlZW5pbmcgcHJvY2Vzcywgd2hlcmVhcyB0aGUgcm9vdFByb3BlcnR5VmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2hlZCB0byB0aGUgaW5jb21pbmcgbGFzdFR3ZWVuc0NvbnRhaW5lciBpcyBlcXVhbCB0byB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlIHByaW9yIHRvIGFueSB0d2VlbmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtyb290UHJvcGVydHldO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdmFsdWVzIHdlcmUgbm90IHRyYW5zZmVycmVkIGZyb20gYSBwcmV2aW91cyBWZWxvY2l0eSBjYWxsLCBxdWVyeSB0aGUgRE9NIGFzIG5lZWRlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIGhvb2tlZCBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHJvb3RQcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIGZvbGxvd2luZyBnZXRQcm9wZXJ0eVZhbHVlKCkgY2FsbCBkb2VzIG5vdCBhY3R1YWxseSB0cmlnZ2VyIGEgRE9NIHF1ZXJ5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZSgpIHdpbGwgZXh0cmFjdCB0aGUgaG9vayBmcm9tIHJvb3RQcm9wZXJ0eVZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHN0YXJ0VmFsdWUgaXMgYWxyZWFkeSBkZWZpbmVkIHZpYSBmb3JjZWZlZWRpbmcsIGRvIG5vdCBxdWVyeSB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqdXN0IGdyYWIgcm9vdFByb3BlcnR5J3MgemVyby12YWx1ZSB0ZW1wbGF0ZSBmcm9tIENTUy5Ib29rcy4gVGhpcyBvdmVyd3JpdGVzIHRoZSBlbGVtZW50J3MgYWN0dWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QgcHJvcGVydHkgdmFsdWUgKGlmIG9uZSBpcyBzZXQpLCBidXQgdGhpcyBpcyBhY2NlcHRhYmxlIHNpbmNlIHRoZSBwcmltYXJ5IHJlYXNvbiB1c2VycyBmb3JjZWZlZWQgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYXZvaWQgRE9NIHF1ZXJpZXMsIGFuZCB0aHVzIHdlIGxpa2V3aXNlIGF2b2lkIHF1ZXJ5aW5nIHRoZSBET00gZm9yIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoaXMgaG9vaydzIHplcm8tdmFsdWUgdGVtcGxhdGUsIGUuZy4gXCIwcHggMHB4IDBweCBibGFja1wiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV1bMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgbm9uLWhvb2tlZCBwcm9wZXJ0aWVzIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gZGVmaW5lZCB2aWEgZm9yY2VmZWVkaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBwcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZSBEYXRhIEV4dHJhY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VwYXJhdGVkVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlVW5pdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0b3IgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2VwYXJhdGVzIGEgcHJvcGVydHkgdmFsdWUgaW50byBpdHMgbnVtZXJpYyB2YWx1ZSBhbmQgaXRzIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNlcGFyYXRlVmFsdWUgKHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlID0gKHZhbHVlIHx8IFwiMFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBNYXRjaCB0aGUgdW5pdCB0eXBlIGF0IHRoZSBlbmQgb2YgdGhlIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWyVBLXpdKyQvLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogR3JhYiB0aGUgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBtYXRjaDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgdGhlIHVuaXQgdHlwZSBvZmYgb2YgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBubyB1bml0IHR5cGUgd2FzIHN1cHBsaWVkLCBhc3NpZ24gb25lIHRoYXQgaXMgYXBwcm9wcmlhdGUgZm9yIHRoaXMgcHJvcGVydHkgKGUuZy4gXCJkZWdcIiBmb3Igcm90YXRlWiBvciBcInB4XCIgZm9yIHdpZHRoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuaXRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlID0gQ1NTLlZhbHVlcy5nZXRVbml0VHlwZShwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgbnVtZXJpY1ZhbHVlLCB1bml0VHlwZSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZSBzdGFydFZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdGVkVmFsdWUgPSBzZXBhcmF0ZVZhbHVlKHByb3BlcnR5LCBzdGFydFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBzZXBhcmF0ZWRWYWx1ZVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWVVbml0VHlwZSA9IHNlcGFyYXRlZFZhbHVlWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZSBlbmRWYWx1ZSwgYW5kIGV4dHJhY3QgYSB2YWx1ZSBvcGVyYXRvciAoZS5nLiBcIis9XCIsIFwiLT1cIikgaWYgb25lIGV4aXN0cy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRlZFZhbHVlID0gc2VwYXJhdGVWYWx1ZShwcm9wZXJ0eSwgZW5kVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzZXBhcmF0ZWRWYWx1ZVswXS5yZXBsYWNlKC9eKFsrLVxcLypdKT0vLCBmdW5jdGlvbihtYXRjaCwgc3ViTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IHN1Yk1hdGNoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgdGhlIG9wZXJhdG9yIG9mZiBvZiB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzZXBhcmF0ZWRWYWx1ZVsxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2UgZmxvYXQgdmFsdWVzIGZyb20gZW5kVmFsdWUgYW5kIHN0YXJ0VmFsdWUuIERlZmF1bHQgdG8gMCBpZiBOYU4gaXMgcmV0dXJuZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gcGFyc2VGbG9hdChzdGFydFZhbHVlKSB8fCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBwYXJzZUZsb2F0KGVuZFZhbHVlKSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eS1TcGVjaWZpYyBWYWx1ZSBDb252ZXJzaW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEN1c3RvbSBzdXBwb3J0IGZvciBwcm9wZXJ0aWVzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgYWNjZXB0IHRoZSAlIHVuaXQgdHlwZSwgYnV0IHdoZXJlIHBvbGx5ZmlsbGluZyBpcyB0cml2aWFsIGFuZCByZWxhdGl2ZWx5IGZvb2xwcm9vZi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRWYWx1ZVVuaXRUeXBlID09PSBcIiVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEEgJS12YWx1ZSBmb250U2l6ZS9saW5lSGVpZ2h0IGlzIHJlbGF0aXZlIHRvIHRoZSBwYXJlbnQncyBmb250U2l6ZSAoYXMgb3Bwb3NlZCB0byB0aGUgcGFyZW50J3MgZGltZW5zaW9ucyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgaWRlbnRpY2FsIHRvIHRoZSBlbSB1bml0J3MgYmVoYXZpb3IsIHNvIHdlIHBpZ2d5YmFjayBvZmYgb2YgdGhhdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL14oZm9udFNpemV8bGluZUhlaWdodCkkLy50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0ICUgaW50byBhbiBlbSBkZWNpbWFsIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gXCJlbVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBzY2FsZVggYW5kIHNjYWxlWSwgY29udmVydCB0aGUgdmFsdWUgaW50byBpdHMgZGVjaW1hbCBmb3JtYXQgYW5kIHN0cmlwIG9mZiB0aGUgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15zY2FsZS8udGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmRWYWx1ZSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIFJHQiBjb21wb25lbnRzLCB0YWtlIHRoZSBkZWZpbmVkIHBlcmNlbnRhZ2Ugb2YgMjU1IGFuZCBzdHJpcCBvZmYgdGhlIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC8oUmVkfEdyZWVufEJsdWUpJC9pLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gKGVuZFZhbHVlIC8gMTAwKSAqIDI1NTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBVbml0IFJhdGlvIENhbGN1bGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gcXVlcmllZCwgdGhlIGJyb3dzZXIgcmV0dXJucyAobW9zdCkgQ1NTIHByb3BlcnR5IHZhbHVlcyBpbiBwaXhlbHMuIFRoZXJlZm9yZSwgaWYgYW4gZW5kVmFsdWUgd2l0aCBhIHVuaXQgdHlwZSBvZlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJSwgZW0sIG9yIHJlbSBpcyBhbmltYXRlZCB0b3dhcmQsIHN0YXJ0VmFsdWUgbXVzdCBiZSBjb252ZXJ0ZWQgZnJvbSBwaXhlbHMgaW50byB0aGUgc2FtZSB1bml0IHR5cGUgYXMgZW5kVmFsdWUgaW4gb3JkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciB2YWx1ZSBtYW5pcHVsYXRpb24gbG9naWMgKGluY3JlbWVudC9kZWNyZW1lbnQpIHRvIHByb2NlZWQuIEZ1cnRoZXIsIGlmIHRoZSBzdGFydFZhbHVlIHdhcyBmb3JjZWZlZCBvciB0cmFuc2ZlcnJlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBhIHByZXZpb3VzIGNhbGwsIHN0YXJ0VmFsdWUgbWF5IGFsc28gbm90IGJlIGluIHBpeGVscy4gVW5pdCBjb252ZXJzaW9uIGxvZ2ljIHRoZXJlZm9yZSBjb25zaXN0cyBvZiB0d28gc3RlcHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxKSBDYWxjdWxhdGluZyB0aGUgcmF0aW8gb2YgJS9lbS9yZW0vdmgvdncgcmVsYXRpdmUgdG8gcGl4ZWxzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAyKSBDb252ZXJ0aW5nIHN0YXJ0VmFsdWUgaW50byB0aGUgc2FtZSB1bml0IG9mIG1lYXN1cmVtZW50IGFzIGVuZFZhbHVlIGJhc2VkIG9uIHRoZXNlIHJhdGlvcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVuaXQgY29udmVyc2lvbiByYXRpb3MgYXJlIGNhbGN1bGF0ZWQgYnkgaW5zZXJ0aW5nIGEgc2libGluZyBub2RlIG5leHQgdG8gdGhlIHRhcmdldCBub2RlLCBjb3B5aW5nIG92ZXIgaXRzIHBvc2l0aW9uIHByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZyB2YWx1ZXMgd2l0aCB0aGUgdGFyZ2V0IHVuaXQgdHlwZSB0aGVuIGNvbXBhcmluZyB0aGUgcmV0dXJuZWQgcGl4ZWwgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBFdmVuIGlmIG9ubHkgb25lIG9mIHRoZXNlIHVuaXQgdHlwZXMgaXMgYmVpbmcgYW5pbWF0ZWQsIGFsbCB1bml0IHJhdGlvcyBhcmUgY2FsY3VsYXRlZCBhdCBvbmNlIHNpbmNlIHRoZSBvdmVyaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgYmF0Y2hpbmcgdGhlIFNFVHMgYW5kIEdFVHMgdG9nZXRoZXIgdXBmcm9udCBvdXR3ZWlnaHRzIHRoZSBwb3RlbnRpYWwgb3ZlcmhlYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGxheW91dCB0aHJhc2hpbmcgY2F1c2VkIGJ5IHJlLXF1ZXJ5aW5nIGZvciB1bmNhbGN1bGF0ZWQgcmF0aW9zIGZvciBzdWJzZXF1ZW50bHktcHJvY2Vzc2VkIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUb2RvOiBTaGlmdCB0aGlzIGxvZ2ljIGludG8gdGhlIGNhbGxzJyBmaXJzdCB0aWNrIGluc3RhbmNlIHNvIHRoYXQgaXQncyBzeW5jZWQgd2l0aCBSQUYuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVVbml0UmF0aW9zICgpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU2FtZSBSYXRpbyBDaGVja3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcHJvcGVydGllcyBiZWxvdyBhcmUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgZWxlbWVudCBkaWZmZXJzIHN1ZmZpY2llbnRseSBmcm9tIHRoaXMgY2FsbCdzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNseSBpdGVyYXRlZCBlbGVtZW50IHRvIGFsc28gZGlmZmVyIGluIGl0cyB1bml0IGNvbnZlcnNpb24gcmF0aW9zLiBJZiB0aGUgcHJvcGVydGllcyBtYXRjaCB1cCB3aXRoIHRob3NlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgdGhlIHByaW9yIGVsZW1lbnQsIHRoZSBwcmlvciBlbGVtZW50J3MgY29udmVyc2lvbiByYXRpb3MgYXJlIHVzZWQuIExpa2UgbW9zdCBvcHRpbWl6YXRpb25zIGluIFZlbG9jaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgZG9uZSB0byBtaW5pbWl6ZSBET00gcXVlcnlpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNhbWVSYXRpb0luZGljYXRvcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBteVBhcmVudDogZWxlbWVudC5wYXJlbnROb2RlIHx8IGRvY3VtZW50LmJvZHksIC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicG9zaXRpb25cIiksIC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZm9udFNpemVcIikgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERldGVybWluZSBpZiB0aGUgc2FtZSAlIHJhdGlvIGNhbiBiZSB1c2VkLiAlIGlzIGJhc2VkIG9uIHRoZSBlbGVtZW50J3MgcG9zaXRpb24gdmFsdWUgYW5kIGl0cyBwYXJlbnQncyB3aWR0aCBhbmQgaGVpZ2h0IGRpbWVuc2lvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVQZXJjZW50UmF0aW8gPSAoKHNhbWVSYXRpb0luZGljYXRvcnMucG9zaXRpb24gPT09IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBvc2l0aW9uKSAmJiAoc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudCA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGFyZW50KSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERldGVybWluZSBpZiB0aGUgc2FtZSBlbSByYXRpbyBjYW4gYmUgdXNlZC4gZW0gaXMgcmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQncyBmb250U2l6ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZUVtUmF0aW8gPSAoc2FtZVJhdGlvSW5kaWNhdG9ycy5mb250U2l6ZSA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0Rm9udFNpemUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RvcmUgdGhlc2UgcmF0aW8gaW5kaWNhdG9ycyBjYWxsLXdpZGUgZm9yIHRoZSBuZXh0IGVsZW1lbnQgdG8gY29tcGFyZSBhZ2FpbnN0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBhcmVudCA9IHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UG9zaXRpb24gPSBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEZvbnRTaXplID0gc2FtZVJhdGlvSW5kaWNhdG9ycy5mb250U2l6ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbGVtZW50LVNwZWNpZmljIFVuaXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSUU4IHJvdW5kcyB0byB0aGUgbmVhcmVzdCBwaXhlbCB3aGVuIHJldHVybmluZyBDU1MgdmFsdWVzLCB0aHVzIHdlIHBlcmZvcm0gY29udmVyc2lvbnMgdXNpbmcgYSBtZWFzdXJlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIDEwMCAoaW5zdGVhZCBvZiAxKSB0byBnaXZlIG91ciByYXRpb3MgYSBwcmVjaXNpb24gb2YgYXQgbGVhc3QgMiBkZWNpbWFsIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVhc3VyZW1lbnQgPSAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MgPSB7fTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2FtZUVtUmF0aW8gfHwgIXNhbWVQZXJjZW50UmF0aW8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGR1bW15ID0gRGF0YShlbGVtZW50KS5pc1NWRyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicmVjdFwiKSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChkdW1teSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQuYXBwZW5kQ2hpbGQoZHVtbXkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvIGFjY3VyYXRlbHkgYW5kIGNvbnNpc3RlbnRseSBjYWxjdWxhdGUgY29udmVyc2lvbiByYXRpb3MsIHRoZSBlbGVtZW50J3MgY2FzY2FkZWQgb3ZlcmZsb3cgYW5kIGJveC1zaXppbmcgYXJlIHN0cmlwcGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaW1pbGFybHksIHNpbmNlIHdpZHRoL2hlaWdodCBjYW4gYmUgYXJ0aWZpY2lhbGx5IGNvbnN0cmFpbmVkIGJ5IHRoZWlyIG1pbi0vbWF4LSBlcXVpdmFsZW50cywgdGhlc2UgYXJlIGNvbnRyb2xsZWQgZm9yIGFzIHdlbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IE92ZXJmbG93IG11c3QgYmUgYWxzbyBiZSBjb250cm9sbGVkIGZvciBwZXItYXhpcyBzaW5jZSB0aGUgb3ZlcmZsb3cgcHJvcGVydHkgb3ZlcndyaXRlcyBpdHMgcGVyLWF4aXMgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goWyBcIm92ZXJmbG93XCIsIFwib3ZlcmZsb3dYXCIsIFwib3ZlcmZsb3dZXCIgXSwgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBwcm9wZXJ0eSwgXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwb3NpdGlvblwiLCBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiZm9udFNpemVcIiwgc2FtZVJhdGlvSW5kaWNhdG9ycy5mb250U2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcImJveFNpemluZ1wiLCBcImNvbnRlbnQtYm94XCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHdpZHRoIGFuZCBoZWlnaHQgYWN0IGFzIG91ciBwcm94eSBwcm9wZXJ0aWVzIGZvciBtZWFzdXJpbmcgdGhlIGhvcml6b250YWwgYW5kIHZlcnRpY2FsICUgcmF0aW9zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goWyBcIm1pbldpZHRoXCIsIFwibWF4V2lkdGhcIiwgXCJ3aWR0aFwiLCBcIm1pbkhlaWdodFwiLCBcIm1heEhlaWdodFwiLCBcImhlaWdodFwiIF0sIGZ1bmN0aW9uKGksIHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgcHJvcGVydHksIG1lYXN1cmVtZW50ICsgXCIlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogcGFkZGluZ0xlZnQgYXJiaXRyYXJpbHkgYWN0cyBhcyBvdXIgcHJveHkgcHJvcGVydHkgZm9yIHRoZSBlbSByYXRpby4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwicGFkZGluZ0xlZnRcIiwgbWVhc3VyZW1lbnQgKyBcImVtXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERpdmlkZSB0aGUgcmV0dXJuZWQgdmFsdWUgYnkgdGhlIG1lYXN1cmVtZW50IHRvIGdldCB0aGUgcmF0aW8gYmV0d2VlbiAxJSBhbmQgMXB4LiBEZWZhdWx0IHRvIDEgc2luY2Ugd29ya2luZyB3aXRoIDAgY2FuIHByb2R1Y2UgSW5maW5pdGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhXaWR0aCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4V2lkdGggPSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJ3aWR0aFwiLCBudWxsLCB0cnVlKSkgfHwgMSkgLyBtZWFzdXJlbWVudDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhIZWlnaHQgPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeEhlaWdodCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcImhlaWdodFwiLCBudWxsLCB0cnVlKSkgfHwgMSkgLyBtZWFzdXJlbWVudDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MuZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0RW1Ub1B4ID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwicGFkZGluZ0xlZnRcIikpIHx8IDEpIC8gbWVhc3VyZW1lbnQ7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVSYXRpb0luZGljYXRvcnMubXlQYXJlbnQucmVtb3ZlQ2hpbGQoZHVtbXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MuZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0RW1Ub1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnBlcmNlbnRUb1B4V2lkdGggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnBlcmNlbnRUb1B4SGVpZ2h0ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGVyY2VudFRvUHhIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtQWdub3N0aWMgVW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVyZWFzICUgYW5kIGVtIHJhdGlvcyBhcmUgZGV0ZXJtaW5lZCBvbiBhIHBlci1lbGVtZW50IGJhc2lzLCB0aGUgcmVtIHVuaXQgb25seSBuZWVkcyB0byBiZSBjaGVja2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jZSBwZXIgY2FsbCBzaW5jZSBpdCdzIGV4Y2x1c2l2ZWx5IGRlcGVuZGFudCB1cG9uIGRvY3VtZW50LmJvZHkncyBmb250U2l6ZS4gSWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQgY2FsY3VsYXRlVW5pdFJhdGlvcygpIGlzIGJlaW5nIHJ1biBkdXJpbmcgdGhpcyBjYWxsLCByZW1Ub1B4IHdpbGwgc3RpbGwgYmUgc2V0IHRvIGl0cyBkZWZhdWx0IHZhbHVlIG9mIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gd2UgY2FsY3VsYXRlIGl0IG5vdy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5yZW1Ub1B4ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gYnJvd3NlcnMnIGRlZmF1bHQgZm9udFNpemUgb2YgMTZweCBpbiB0aGUgY2FzZSBvZiAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPSBwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGRvY3VtZW50LmJvZHksIFwiZm9udFNpemVcIikpIHx8IDE2OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW1pbGFybHksIHZpZXdwb3J0IHVuaXRzIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSB3aW5kb3cncyBpbm5lciBkaW1lbnNpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZ3VG9QeCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZ3VG9QeCA9IHBhcnNlRmxvYXQod2luZG93LmlubmVyV2lkdGgpIC8gMTAwOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52aFRvUHggPSBwYXJzZUZsb2F0KHdpbmRvdy5pbm5lckhlaWdodCkgLyAxMDA7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucmVtVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEucmVtVG9QeDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnZ3VG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MudmhUb1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52aFRvUHg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcgPj0gMSkgY29uc29sZS5sb2coXCJVbml0IHJhdGlvczogXCIgKyBKU09OLnN0cmluZ2lmeSh1bml0UmF0aW9zKSwgZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pdFJhdGlvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBVbml0IENvbnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgKiBhbmQgLyBvcGVyYXRvcnMsIHdoaWNoIGFyZSBub3QgcGFzc2VkIGluIHdpdGggYW4gYXNzb2NpYXRlZCB1bml0LCBpbmhlcmVudGx5IHVzZSBzdGFydFZhbHVlJ3MgdW5pdC4gU2tpcCB2YWx1ZSBhbmQgdW5pdCBjb252ZXJzaW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC9bXFwvKl0vLnRlc3Qob3BlcmF0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHN0YXJ0VmFsdWVVbml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHN0YXJ0VmFsdWUgYW5kIGVuZFZhbHVlIGRpZmZlciBpbiB1bml0IHR5cGUsIGNvbnZlcnQgc3RhcnRWYWx1ZSBpbnRvIHRoZSBzYW1lIHVuaXQgdHlwZSBhcyBlbmRWYWx1ZSBzbyB0aGF0IGlmIGVuZFZhbHVlVW5pdFR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzIGEgcmVsYXRpdmUgdW5pdCAoJSwgZW0sIHJlbSksIHRoZSB2YWx1ZXMgc2V0IGR1cmluZyB0d2VlbmluZyB3aWxsIGNvbnRpbnVlIHRvIGJlIGFjY3VyYXRlbHkgcmVsYXRpdmUgZXZlbiBpZiB0aGUgbWV0cmljcyB0aGV5IGRlcGVuZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYXJlIGR5bmFtaWNhbGx5IGNoYW5naW5nIGR1cmluZyB0aGUgY291cnNlIG9mIHRoZSBhbmltYXRpb24uIENvbnZlcnNlbHksIGlmIHdlIGFsd2F5cyBub3JtYWxpemVkIGludG8gcHggYW5kIHVzZWQgcHggZm9yIHNldHRpbmcgdmFsdWVzLCB0aGUgcHggcmF0aW9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvdWxkIGJlY29tZSBzdGFsZSBpZiB0aGUgb3JpZ2luYWwgdW5pdCBiZWluZyBhbmltYXRlZCB0b3dhcmQgd2FzIHJlbGF0aXZlIGFuZCB0aGUgdW5kZXJseWluZyBtZXRyaWNzIGNoYW5nZSBkdXJpbmcgdGhlIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIDAgaXMgMCBpbiBhbnkgdW5pdCB0eXBlLCBubyBjb252ZXJzaW9uIGlzIG5lY2Vzc2FyeSB3aGVuIHN0YXJ0VmFsdWUgaXMgMCAtLSB3ZSBqdXN0IHN0YXJ0IGF0IDAgd2l0aCBlbmRWYWx1ZVVuaXRUeXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoc3RhcnRWYWx1ZVVuaXRUeXBlICE9PSBlbmRWYWx1ZVVuaXRUeXBlKSAmJiBzdGFydFZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5pdCBjb252ZXJzaW9uIGlzIGFsc28gc2tpcHBlZCB3aGVuIGVuZFZhbHVlIGlzIDAsIGJ1dCAqc3RhcnRWYWx1ZVVuaXRUeXBlKiBtdXN0IGJlIHVzZWQgZm9yIHR3ZWVuIHZhbHVlcyB0byByZW1haW4gYWNjdXJhdGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogU2tpcHBpbmcgdW5pdCBjb252ZXJzaW9uIGhlcmUgbWVhbnMgdGhhdCBpZiBlbmRWYWx1ZVVuaXRUeXBlIHdhcyBvcmlnaW5hbGx5IGEgcmVsYXRpdmUgdW5pdCwgdGhlIGFuaW1hdGlvbiB3b24ndCByZWxhdGl2ZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggdGhlIHVuZGVybHlpbmcgbWV0cmljcyBpZiB0aGV5IGNoYW5nZSwgYnV0IHRoaXMgaXMgYWNjZXB0YWJsZSBzaW5jZSB3ZSdyZSBhbmltYXRpbmcgdG93YXJkIGludmlzaWJpbGl0eSBpbnN0ZWFkIG9mIHRvd2FyZCB2aXNpYmlsaXR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWNoIHJlbWFpbnMgcGFzdCB0aGUgcG9pbnQgb2YgdGhlIGFuaW1hdGlvbidzIGNvbXBsZXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFZhbHVlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzdGFydFZhbHVlVW5pdFR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQnkgdGhpcyBwb2ludCwgd2UgY2Fubm90IGF2b2lkIHVuaXQgY29udmVyc2lvbiAoaXQncyB1bmRlc2lyYWJsZSBzaW5jZSBpdCBjYXVzZXMgbGF5b3V0IHRocmFzaGluZykuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIHdlIGhhdmVuJ3QgYWxyZWFkeSwgd2UgdHJpZ2dlciBjYWxjdWxhdGVVbml0UmF0aW9zKCksIHdoaWNoIHJ1bnMgb25jZSBwZXIgZWxlbWVudCBwZXIgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YSA9IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEgfHwgY2FsY3VsYXRlVW5pdFJhdGlvcygpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBmb2xsb3dpbmcgUmVnRXggbWF0Y2hlcyBDU1MgcHJvcGVydGllcyB0aGF0IGhhdmUgdGhlaXIgJSB2YWx1ZXMgbWVhc3VyZWQgcmVsYXRpdmUgdG8gdGhlIHgtYXhpcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVzNDIHNwZWMgbWFuZGF0ZXMgdGhhdCBhbGwgb2YgbWFyZ2luIGFuZCBwYWRkaW5nJ3MgcHJvcGVydGllcyAoZXZlbiB0b3AgYW5kIGJvdHRvbSkgYXJlICUtcmVsYXRpdmUgdG8gdGhlICp3aWR0aCogb2YgdGhlIHBhcmVudCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXhpcyA9ICgvbWFyZ2lufHBhZGRpbmd8bGVmdHxyaWdodHx3aWR0aHx0ZXh0fHdvcmR8bGV0dGVyL2kudGVzdChwcm9wZXJ0eSkgfHwgL1gkLy50ZXN0KHByb3BlcnR5KSB8fCBwcm9wZXJ0eSA9PT0gXCJ4XCIpID8gXCJ4XCIgOiBcInlcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiBvcmRlciB0byBhdm9pZCBnZW5lcmF0aW5nIG5eMiBiZXNwb2tlIGNvbnZlcnNpb24gZnVuY3Rpb25zLCB1bml0IGNvbnZlcnNpb24gaXMgYSB0d28tc3RlcCBwcm9jZXNzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxKSBDb252ZXJ0IHN0YXJ0VmFsdWUgaW50byBwaXhlbHMuIDIpIENvbnZlcnQgdGhpcyBuZXcgcGl4ZWwgdmFsdWUgaW50byBlbmRWYWx1ZSdzIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGFydFZhbHVlVW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogdHJhbnNsYXRlWCBhbmQgdHJhbnNsYXRlWSBhcmUgdGhlIG9ubHkgcHJvcGVydGllcyB0aGF0IGFyZSAlLXJlbGF0aXZlIHRvIGFuIGVsZW1lbnQncyBvd24gZGltZW5zaW9ucyAtLSBub3QgaXRzIHBhcmVudCdzIGRpbWVuc2lvbnMuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgZG9lcyBub3QgaW5jbHVkZSBhIHNwZWNpYWwgY29udmVyc2lvbiBwcm9jZXNzIHRvIGFjY291bnQgZm9yIHRoaXMgYmVoYXZpb3IuIFRoZXJlZm9yZSwgYW5pbWF0aW5nIHRyYW5zbGF0ZVgvWSBmcm9tIGEgJSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9uLSUgdmFsdWUgd2lsbCBwcm9kdWNlIGFuIGluY29ycmVjdCBzdGFydCB2YWx1ZS4gRm9ydHVuYXRlbHksIHRoaXMgc29ydCBvZiBjcm9zcy11bml0IGNvbnZlcnNpb24gaXMgcmFyZWx5IGRvbmUgYnkgdXNlcnMgaW4gcHJhY3RpY2UuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSAoYXhpcyA9PT0gXCJ4XCIgPyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4V2lkdGggOiBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogcHggYWN0cyBhcyBvdXIgbWlkcG9pbnQgaW4gdGhlIHVuaXQgY29udmVyc2lvbiBwcm9jZXNzOyBkbyBub3RoaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YVtzdGFydFZhbHVlVW5pdFR5cGUgKyBcIlRvUHhcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJbnZlcnQgdGhlIHB4IHJhdGlvcyB0byBjb252ZXJ0IGludG8gdG8gdGhlIHRhcmdldCB1bml0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGVuZFZhbHVlVW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSAxIC8gKGF4aXMgPT09IFwieFwiID8gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YS5wZXJjZW50VG9QeFdpZHRoIDogZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YS5wZXJjZW50VG9QeEhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHN0YXJ0VmFsdWUgaXMgYWxyZWFkeSBpbiBweCwgZG8gbm90aGluZzsgd2UncmUgZG9uZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IDEgLyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhW2VuZFZhbHVlVW5pdFR5cGUgKyBcIlRvUHhcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlbGF0aXZlIFZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBPcGVyYXRvciBsb2dpYyBtdXN0IGJlIHBlcmZvcm1lZCBsYXN0IHNpbmNlIGl0IHJlcXVpcmVzIHVuaXQtbm9ybWFsaXplZCBzdGFydCBhbmQgZW5kIHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJlbGF0aXZlICpwZXJjZW50IHZhbHVlcyogZG8gbm90IGJlaGF2ZSBob3cgbW9zdCBwZW9wbGUgdGhpbms7IHdoaWxlIG9uZSB3b3VsZCBleHBlY3QgXCIrPTUwJVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBpbmNyZWFzZSB0aGUgcHJvcGVydHkgMS41eCBpdHMgY3VycmVudCB2YWx1ZSwgaXQgaW4gZmFjdCBpbmNyZWFzZXMgdGhlIHBlcmNlbnQgdW5pdHMgaW4gYWJzb2x1dGUgdGVybXM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1MCBwb2ludHMgaXMgYWRkZWQgb24gdG9wIG9mIHRoZSBjdXJyZW50ICUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIitcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlICsgZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlIC0gZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIipcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlICogZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlIC8gZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciBQdXNoXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29uc3RydWN0IHRoZSBwZXItcHJvcGVydHkgdHdlZW4gb2JqZWN0LCBhbmQgcHVzaCBpdCB0byB0aGUgZWxlbWVudCdzIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWU6IHJvb3RQcm9wZXJ0eVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHN0YXJ0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlOiBzdGFydFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlOiBlbmRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZTogZW5kVmFsdWVVbml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSBjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoXCIgKyBwcm9wZXJ0eSArIFwiKTogXCIgKyBKU09OLnN0cmluZ2lmeSh0d2VlbnNDb250YWluZXJbcHJvcGVydHldKSwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBBbG9uZyB3aXRoIGl0cyBwcm9wZXJ0eSBkYXRhLCBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCBpdHNlbGYgb250byB0d2VlbnNDb250YWluZXIuICovXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lci5lbGVtZW50ID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgQ2FsbCBQdXNoXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiB0d2VlbnNDb250YWluZXIgY2FuIGJlIGVtcHR5IGlmIGFsbCBvZiB0aGUgcHJvcGVydGllcyBpbiB0aGlzIGNhbGwncyBwcm9wZXJ0eSBtYXAgd2VyZSBza2lwcGVkIGR1ZSB0byBub3RcbiAgICAgICAgICAgICAgICAgICBiZWluZyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuIFRoZSBlbGVtZW50IHByb3BlcnR5IGlzIHVzZWQgZm9yIGNoZWNraW5nIHRoYXQgdGhlIHR3ZWVuc0NvbnRhaW5lciBoYXMgYmVlbiBhcHBlbmRlZCB0by4gKi9cbiAgICAgICAgICAgICAgICBpZiAodHdlZW5zQ29udGFpbmVyLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogQXBwbHkgdGhlIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgaW5kaWNhdG9yIGNsYXNzLiAqL1xuICAgICAgICAgICAgICAgICAgICBDU1MuVmFsdWVzLmFkZENsYXNzKGVsZW1lbnQsIFwidmVsb2NpdHktYW5pbWF0aW5nXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBjYWxsIGFycmF5IGhvdXNlcyB0aGUgdHdlZW5zQ29udGFpbmVycyBmb3IgZWFjaCBlbGVtZW50IGJlaW5nIGFuaW1hdGVkIGluIHRoZSBjdXJyZW50IGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgIGNhbGwucHVzaCh0d2VlbnNDb250YWluZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFN0b3JlIHRoZSB0d2VlbnNDb250YWluZXIgYW5kIG9wdGlvbnMgaWYgd2UncmUgd29ya2luZyBvbiB0aGUgZGVmYXVsdCBlZmZlY3RzIHF1ZXVlLCBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgYnkgdGhlIHJldmVyc2UgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMucXVldWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyID0gdHdlZW5zQ29udGFpbmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzID0gb3B0cztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIFN3aXRjaCBvbiB0aGUgZWxlbWVudCdzIGFuaW1hdGluZyBmbGFnLiAqL1xuICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBPbmNlIHRoZSBmaW5hbCBlbGVtZW50IGluIHRoaXMgY2FsbCdzIGVsZW1lbnQgc2V0IGhhcyBiZWVuIHByb2Nlc3NlZCwgcHVzaCB0aGUgY2FsbCBhcnJheSBvbnRvXG4gICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGZvciB0aGUgYW5pbWF0aW9uIHRpY2sgdG8gaW1tZWRpYXRlbHkgYmVnaW4gcHJvY2Vzc2luZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggPT09IGVsZW1lbnRzTGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogQWRkIHRoZSBjdXJyZW50IGNhbGwgcGx1cyBpdHMgYXNzb2NpYXRlZCBtZXRhZGF0YSAodGhlIGVsZW1lbnQgc2V0IGFuZCB0aGUgY2FsbCdzIG9wdGlvbnMpIG9udG8gdGhlIGdsb2JhbCBjYWxsIGNvbnRhaW5lci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEFueXRoaW5nIG9uIHRoaXMgY2FsbCBjb250YWluZXIgaXMgc3ViamVjdGVkIHRvIHRpY2soKSBwcm9jZXNzaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMucHVzaChbIGNhbGwsIGVsZW1lbnRzLCBvcHRzLCBudWxsLCBwcm9taXNlRGF0YS5yZXNvbHZlciBdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGFuaW1hdGlvbiB0aWNrIGlzbid0IHJ1bm5pbmcsIHN0YXJ0IGl0LiAoVmVsb2NpdHkgc2h1dHMgaXQgb2ZmIHdoZW4gdGhlcmUgYXJlIG5vIGFjdGl2ZSBjYWxscyB0byBwcm9jZXNzLikgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5pc1RpY2tpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuaXNUaWNraW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0YXJ0IHRoZSB0aWNrIGxvb3AuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGljaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNJbmRleCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBXaGVuIHRoZSBxdWV1ZSBvcHRpb24gaXMgc2V0IHRvIGZhbHNlLCB0aGUgY2FsbCBza2lwcyB0aGUgZWxlbWVudCdzIHF1ZXVlIGFuZCBmaXJlcyBpbW1lZGlhdGVseS4gKi9cbiAgICAgICAgICAgIGlmIChvcHRzLnF1ZXVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoaXMgYnVpbGRRdWV1ZSBjYWxsIGRvZXNuJ3QgcmVzcGVjdCB0aGUgZWxlbWVudCdzIGV4aXN0aW5nIHF1ZXVlICh3aGljaCBpcyB3aGVyZSBhIGRlbGF5IG9wdGlvbiB3b3VsZCBoYXZlIGJlZW4gYXBwZW5kZWQpLFxuICAgICAgICAgICAgICAgICAgIHdlIG1hbnVhbGx5IGluamVjdCB0aGUgZGVsYXkgcHJvcGVydHkgaGVyZSB3aXRoIGFuIGV4cGxpY2l0IHNldFRpbWVvdXQuICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGVsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChidWlsZFF1ZXVlLCBvcHRzLmRlbGF5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidWlsZFF1ZXVlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCB0aGUgY2FsbCB1bmRlcmdvZXMgZWxlbWVudCBxdWV1ZWluZyBhcyBub3JtYWwuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBUbyBpbnRlcm9wZXJhdGUgd2l0aCBqUXVlcnksIFZlbG9jaXR5IHVzZXMgalF1ZXJ5J3Mgb3duICQucXVldWUoKSBzdGFjayBmb3IgcXVldWluZyBsb2dpYy4gKi9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlLCBmdW5jdGlvbihuZXh0LCBjbGVhclF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjbGVhclF1ZXVlIGZsYWcgd2FzIHBhc3NlZCBpbiBieSB0aGUgc3RvcCBjb21tYW5kLCByZXNvbHZlIHRoaXMgY2FsbCdzIHByb21pc2UuIChQcm9taXNlcyBjYW4gb25seSBiZSByZXNvbHZlZCBvbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICBzbyBpdCdzIGZpbmUgaWYgdGhpcyBpcyByZXBlYXRlZGx5IHRyaWdnZXJlZCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBhc3NvY2lhdGVkIGNhbGwuKSAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xlYXJRdWV1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhLnByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvIG5vdCBjb250aW51ZSB3aXRoIGFuaW1hdGlvbiBxdWV1ZWluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhpcyBmbGFnIGluZGljYXRlcyB0byB0aGUgdXBjb21pbmcgY29tcGxldGVDYWxsKCkgZnVuY3Rpb24gdGhhdCB0aGlzIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHkuXG4gICAgICAgICAgICAgICAgICAgICAgIFNlZSBjb21wbGV0ZUNhbGwoKSBmb3IgZnVydGhlciBkZXRhaWxzLiAqL1xuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBidWlsZFF1ZXVlKG5leHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgQXV0by1EZXF1ZXVpbmdcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogQXMgcGVyIGpRdWVyeSdzICQucXVldWUoKSBiZWhhdmlvciwgdG8gZmlyZSB0aGUgZmlyc3Qgbm9uLWN1c3RvbS1xdWV1ZSBlbnRyeSBvbiBhbiBlbGVtZW50LCB0aGUgZWxlbWVudFxuICAgICAgICAgICAgICAgbXVzdCBiZSBkZXF1ZXVlZCBpZiBpdHMgcXVldWUgc3RhY2sgY29uc2lzdHMgKnNvbGVseSogb2YgdGhlIGN1cnJlbnQgY2FsbC4gKFRoaXMgY2FuIGJlIGRldGVybWluZWQgYnkgY2hlY2tpbmdcbiAgICAgICAgICAgICAgIGZvciB0aGUgXCJpbnByb2dyZXNzXCIgaXRlbSB0aGF0IGpRdWVyeSBwcmVwZW5kcyB0byBhY3RpdmUgcXVldWUgc3RhY2sgYXJyYXlzLikgUmVnYXJkbGVzcywgd2hlbmV2ZXIgdGhlIGVsZW1lbnQnc1xuICAgICAgICAgICAgICAgcXVldWUgaXMgZnVydGhlciBhcHBlbmRlZCB3aXRoIGFkZGl0aW9uYWwgaXRlbXMgLS0gaW5jbHVkaW5nICQuZGVsYXkoKSdzIG9yIGV2ZW4gJC5hbmltYXRlKCkgY2FsbHMsIHRoZSBxdWV1ZSdzXG4gICAgICAgICAgICAgICBmaXJzdCBlbnRyeSBpcyBhdXRvbWF0aWNhbGx5IGZpcmVkLiBUaGlzIGJlaGF2aW9yIGNvbnRyYXN0cyB0aGF0IG9mIGN1c3RvbSBxdWV1ZXMsIHdoaWNoIG5ldmVyIGF1dG8tZmlyZS4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFdoZW4gYW4gZWxlbWVudCBzZXQgaXMgYmVpbmcgc3ViamVjdGVkIHRvIGEgbm9uLXBhcmFsbGVsIFZlbG9jaXR5IGNhbGwsIHRoZSBhbmltYXRpb24gd2lsbCBub3QgYmVnaW4gdW50aWxcbiAgICAgICAgICAgICAgIGVhY2ggb25lIG9mIHRoZSBlbGVtZW50cyBpbiB0aGUgc2V0IGhhcyByZWFjaGVkIHRoZSBlbmQgb2YgaXRzIGluZGl2aWR1YWxseSBwcmUtZXhpc3RpbmcgcXVldWUgY2hhaW4uICovXG4gICAgICAgICAgICAvKiBOb3RlOiBVbmZvcnR1bmF0ZWx5LCBtb3N0IHBlb3BsZSBkb24ndCBmdWxseSBncmFzcCBqUXVlcnkncyBwb3dlcmZ1bCwgeWV0IHF1aXJreSwgJC5xdWV1ZSgpIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgTGVhbiBtb3JlIGhlcmU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1ODE1OC9jYW4tc29tZWJvZHktZXhwbGFpbi1qcXVlcnktcXVldWUtdG8tbWUgKi9cbiAgICAgICAgICAgIGlmICgob3B0cy5xdWV1ZSA9PT0gXCJcIiB8fCBvcHRzLnF1ZXVlID09PSBcImZ4XCIpICYmICQucXVldWUoZWxlbWVudClbMF0gIT09IFwiaW5wcm9ncmVzc1wiKSB7XG4gICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIEVsZW1lbnQgU2V0IEl0ZXJhdGlvblxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBJZiB0aGUgXCJub2RlVHlwZVwiIHByb3BlcnR5IGV4aXN0cyBvbiB0aGUgZWxlbWVudHMgdmFyaWFibGUsIHdlJ3JlIGFuaW1hdGluZyBhIHNpbmdsZSBlbGVtZW50LlxuICAgICAgICAgICBQbGFjZSBpdCBpbiBhbiBhcnJheSBzbyB0aGF0ICQuZWFjaCgpIGNhbiBpdGVyYXRlIG92ZXIgaXQuICovXG4gICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICAgICAgLyogRW5zdXJlIGVhY2ggZWxlbWVudCBpbiBhIHNldCBoYXMgYSBub2RlVHlwZSAoaXMgYSByZWFsIGVsZW1lbnQpIHRvIGF2b2lkIHRocm93aW5nIGVycm9ycy4gKi9cbiAgICAgICAgICAgIGlmIChUeXBlLmlzTm9kZShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3NFbGVtZW50LmNhbGwoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgT3B0aW9uOiBMb29wXG4gICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBUaGUgbG9vcCBvcHRpb24gYWNjZXB0cyBhbiBpbnRlZ2VyIGluZGljYXRpbmcgaG93IG1hbnkgdGltZXMgdGhlIGVsZW1lbnQgc2hvdWxkIGxvb3AgYmV0d2VlbiB0aGUgdmFsdWVzIGluIHRoZVxuICAgICAgICAgICBjdXJyZW50IGNhbGwncyBwcm9wZXJ0aWVzIG1hcCBhbmQgdGhlIGVsZW1lbnQncyBwcm9wZXJ0eSB2YWx1ZXMgcHJpb3IgdG8gdGhpcyBjYWxsLiAqL1xuICAgICAgICAvKiBOb3RlOiBUaGUgbG9vcCBvcHRpb24ncyBsb2dpYyBpcyBwZXJmb3JtZWQgaGVyZSAtLSBhZnRlciBlbGVtZW50IHByb2Nlc3NpbmcgLS0gYmVjYXVzZSB0aGUgY3VycmVudCBjYWxsIG5lZWRzXG4gICAgICAgICAgIHRvIHVuZGVyZ28gaXRzIHF1ZXVlIGluc2VydGlvbiBwcmlvciB0byB0aGUgbG9vcCBvcHRpb24gZ2VuZXJhdGluZyBpdHMgc2VyaWVzIG9mIGNvbnN0aXR1ZW50IFwicmV2ZXJzZVwiIGNhbGxzLFxuICAgICAgICAgICB3aGljaCBjaGFpbiBhZnRlciB0aGUgY3VycmVudCBjYWxsLiBUd28gcmV2ZXJzZSBjYWxscyAodHdvIFwiYWx0ZXJuYXRpb25zXCIpIGNvbnN0aXR1dGUgb25lIGxvb3AuICovXG4gICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIFZlbG9jaXR5LmRlZmF1bHRzLCBvcHRpb25zKSxcbiAgICAgICAgICAgIHJldmVyc2VDYWxsc0NvdW50O1xuXG4gICAgICAgIG9wdHMubG9vcCA9IHBhcnNlSW50KG9wdHMubG9vcCk7XG4gICAgICAgIHJldmVyc2VDYWxsc0NvdW50ID0gKG9wdHMubG9vcCAqIDIpIC0gMTtcblxuICAgICAgICBpZiAob3B0cy5sb29wKSB7XG4gICAgICAgICAgICAvKiBEb3VibGUgdGhlIGxvb3AgY291bnQgdG8gY29udmVydCBpdCBpbnRvIGl0cyBhcHByb3ByaWF0ZSBudW1iZXIgb2YgXCJyZXZlcnNlXCIgY2FsbHMuXG4gICAgICAgICAgICAgICBTdWJ0cmFjdCAxIGZyb20gdGhlIHJlc3VsdGluZyB2YWx1ZSBzaW5jZSB0aGUgY3VycmVudCBjYWxsIGlzIGluY2x1ZGVkIGluIHRoZSB0b3RhbCBhbHRlcm5hdGlvbiBjb3VudC4gKi9cbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcmV2ZXJzZUNhbGxzQ291bnQ7IHgrKykge1xuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSBsb2dpYyBmb3IgdGhlIHJldmVyc2UgYWN0aW9uIG9jY3VycyBpbnNpZGUgUXVldWVpbmcgYW5kIHRoZXJlZm9yZSB0aGlzIGNhbGwncyBvcHRpb25zIG9iamVjdFxuICAgICAgICAgICAgICAgICAgIGlzbid0IHBhcnNlZCB1bnRpbCB0aGVuIGFzIHdlbGwsIHRoZSBjdXJyZW50IGNhbGwncyBkZWxheSBvcHRpb24gbXVzdCBiZSBleHBsaWNpdGx5IHBhc3NlZCBpbnRvIHRoZSByZXZlcnNlXG4gICAgICAgICAgICAgICAgICAgY2FsbCBzbyB0aGF0IHRoZSBkZWxheSBsb2dpYyB0aGF0IG9jY3VycyBpbnNpZGUgKlByZS1RdWV1ZWluZyogY2FuIHByb2Nlc3MgaXQuICovXG4gICAgICAgICAgICAgICAgdmFyIHJldmVyc2VPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkZWxheTogb3B0cy5kZWxheSxcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IG9wdHMucHJvZ3Jlc3NcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyogSWYgYSBjb21wbGV0ZSBjYWxsYmFjayB3YXMgcGFzc2VkIGludG8gdGhpcyBjYWxsLCB0cmFuc2ZlciBpdCB0byB0aGUgbG9vcCByZWRpcmVjdCdzIGZpbmFsIFwicmV2ZXJzZVwiIGNhbGxcbiAgICAgICAgICAgICAgICAgICBzbyB0aGF0IGl0J3MgdHJpZ2dlcmVkIHdoZW4gdGhlIGVudGlyZSByZWRpcmVjdCBpcyBjb21wbGV0ZSAoYW5kIG5vdCB3aGVuIHRoZSB2ZXJ5IGZpcnN0IGFuaW1hdGlvbiBpcyBjb21wbGV0ZSkuICovXG4gICAgICAgICAgICAgICAgaWYgKHggPT09IHJldmVyc2VDYWxsc0NvdW50IC0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy5kaXNwbGF5ID0gb3B0cy5kaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy52aXNpYmlsaXR5ID0gb3B0cy52aXNpYmlsaXR5O1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy5jb21wbGV0ZSA9IG9wdHMuY29tcGxldGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShlbGVtZW50cywgXCJyZXZlcnNlXCIsIHJldmVyc2VPcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgICAgIENoYWluaW5nXG4gICAgICAgICoqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBSZXR1cm4gdGhlIGVsZW1lbnRzIGJhY2sgdG8gdGhlIGNhbGwgY2hhaW4sIHdpdGggd3JhcHBlZCBlbGVtZW50cyB0YWtpbmcgcHJlY2VkZW5jZSBpbiBjYXNlIFZlbG9jaXR5IHdhcyBjYWxsZWQgdmlhIHRoZSAkLmZuLiBleHRlbnNpb24uICovXG4gICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xuICAgIH07XG5cbiAgICAvKiBUdXJuIFZlbG9jaXR5IGludG8gdGhlIGFuaW1hdGlvbiBmdW5jdGlvbiwgZXh0ZW5kZWQgd2l0aCB0aGUgcHJlLWV4aXN0aW5nIFZlbG9jaXR5IG9iamVjdC4gKi9cbiAgICBWZWxvY2l0eSA9ICQuZXh0ZW5kKGFuaW1hdGUsIFZlbG9jaXR5KTtcbiAgICAvKiBGb3IgbGVnYWN5IHN1cHBvcnQsIGFsc28gZXhwb3NlIHRoZSBsaXRlcmFsIGFuaW1hdGUgbWV0aG9kLiAqL1xuICAgIFZlbG9jaXR5LmFuaW1hdGUgPSBhbmltYXRlO1xuXG4gICAgLyoqKioqKioqKioqKioqXG4gICAgICAgIFRpbWluZ1xuICAgICoqKioqKioqKioqKioqL1xuXG4gICAgLyogVGlja2VyIGZ1bmN0aW9uLiAqL1xuICAgIHZhciB0aWNrZXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJBRlNoaW07XG5cbiAgICAvKiBJbmFjdGl2ZSBicm93c2VyIHRhYnMgcGF1c2UgckFGLCB3aGljaCByZXN1bHRzIGluIGFsbCBhY3RpdmUgYW5pbWF0aW9ucyBpbW1lZGlhdGVseSBzcHJpbnRpbmcgdG8gdGhlaXIgY29tcGxldGlvbiBzdGF0ZXMgd2hlbiB0aGUgdGFiIHJlZm9jdXNlcy5cbiAgICAgICBUbyBnZXQgYXJvdW5kIHRoaXMsIHdlIGR5bmFtaWNhbGx5IHN3aXRjaCByQUYgdG8gc2V0VGltZW91dCAod2hpY2ggdGhlIGJyb3dzZXIgKmRvZXNuJ3QqIHBhdXNlKSB3aGVuIHRoZSB0YWIgbG9zZXMgZm9jdXMuIFdlIHNraXAgdGhpcyBmb3IgbW9iaWxlXG4gICAgICAgZGV2aWNlcyB0byBhdm9pZCB3YXN0aW5nIGJhdHRlcnkgcG93ZXIgb24gaW5hY3RpdmUgdGFicy4gKi9cbiAgICAvKiBOb3RlOiBUYWIgZm9jdXMgZGV0ZWN0aW9uIGRvZXNuJ3Qgd29yayBvbiBvbGRlciB2ZXJzaW9ucyBvZiBJRSwgYnV0IHRoYXQncyBva2F5IHNpbmNlIHRoZXkgZG9uJ3Qgc3VwcG9ydCByQUYgdG8gYmVnaW4gd2l0aC4gKi9cbiAgICBpZiAoIVZlbG9jaXR5LlN0YXRlLmlzTW9iaWxlICYmIGRvY3VtZW50LmhpZGRlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogUmVhc3NpZ24gdGhlIHJBRiBmdW5jdGlvbiAod2hpY2ggdGhlIGdsb2JhbCB0aWNrKCkgZnVuY3Rpb24gdXNlcykgYmFzZWQgb24gdGhlIHRhYidzIGZvY3VzIHN0YXRlLiAqL1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgICAgIHRpY2tlciA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSB0aWNrIGZ1bmN0aW9uIG5lZWRzIGEgdHJ1dGh5IGZpcnN0IGFyZ3VtZW50IGluIG9yZGVyIHRvIHBhc3MgaXRzIGludGVybmFsIHRpbWVzdGFtcCBjaGVjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKHRydWUpIH0sIDE2KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyogVGhlIHJBRiBsb29wIGhhcyBiZWVuIHBhdXNlZCBieSB0aGUgYnJvd3Nlciwgc28gd2UgbWFudWFsbHkgcmVzdGFydCB0aGUgdGljay4gKi9cbiAgICAgICAgICAgICAgICB0aWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpY2tlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgckFGU2hpbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKlxuICAgICAgICBUaWNrXG4gICAgKioqKioqKioqKioqL1xuXG4gICAgLyogTm90ZTogQWxsIGNhbGxzIHRvIFZlbG9jaXR5IGFyZSBwdXNoZWQgdG8gdGhlIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGFycmF5LCB3aGljaCBpcyBmdWxseSBpdGVyYXRlZCB0aHJvdWdoIHVwb24gZWFjaCB0aWNrLiAqL1xuICAgIGZ1bmN0aW9uIHRpY2sgKHRpbWVzdGFtcCkge1xuICAgICAgICAvKiBBbiBlbXB0eSB0aW1lc3RhbXAgYXJndW1lbnQgaW5kaWNhdGVzIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgdGljayBvY2N1cmVuY2Ugc2luY2UgdGlja2luZyB3YXMgdHVybmVkIG9uLlxuICAgICAgICAgICBXZSBsZXZlcmFnZSB0aGlzIG1ldGFkYXRhIHRvIGZ1bGx5IGlnbm9yZSB0aGUgZmlyc3QgdGljayBwYXNzIHNpbmNlIFJBRidzIGluaXRpYWwgcGFzcyBpcyBmaXJlZCB3aGVuZXZlclxuICAgICAgICAgICB0aGUgYnJvd3NlcidzIG5leHQgdGljayBzeW5jIHRpbWUgb2NjdXJzLCB3aGljaCByZXN1bHRzIGluIHRoZSBmaXJzdCBlbGVtZW50cyBzdWJqZWN0ZWQgdG8gVmVsb2NpdHlcbiAgICAgICAgICAgY2FsbHMgYmVpbmcgYW5pbWF0ZWQgb3V0IG9mIHN5bmMgd2l0aCBhbnkgZWxlbWVudHMgYW5pbWF0ZWQgaW1tZWRpYXRlbHkgdGhlcmVhZnRlci4gSW4gc2hvcnQsIHdlIGlnbm9yZVxuICAgICAgICAgICB0aGUgZmlyc3QgUkFGIHRpY2sgcGFzcyBzbyB0aGF0IGVsZW1lbnRzIGJlaW5nIGltbWVkaWF0ZWx5IGNvbnNlY3V0aXZlbHkgYW5pbWF0ZWQgLS0gaW5zdGVhZCBvZiBzaW11bHRhbmVvdXNseSBhbmltYXRlZFxuICAgICAgICAgICBieSB0aGUgc2FtZSBWZWxvY2l0eSBjYWxsIC0tIGFyZSBwcm9wZXJseSBiYXRjaGVkIGludG8gdGhlIHNhbWUgaW5pdGlhbCBSQUYgdGljayBhbmQgY29uc2VxdWVudGx5IHJlbWFpbiBpbiBzeW5jIHRoZXJlYWZ0ZXIuICovXG4gICAgICAgIGlmICh0aW1lc3RhbXApIHtcbiAgICAgICAgICAgIC8qIFdlIGlnbm9yZSBSQUYncyBoaWdoIHJlc29sdXRpb24gdGltZXN0YW1wIHNpbmNlIGl0IGNhbiBiZSBzaWduaWZpY2FudGx5IG9mZnNldCB3aGVuIHRoZSBicm93c2VyIGlzXG4gICAgICAgICAgICAgICB1bmRlciBoaWdoIHN0cmVzczsgd2Ugb3B0IGZvciBjaG9wcGluZXNzIG92ZXIgYWxsb3dpbmcgdGhlIGJyb3dzZXIgdG8gZHJvcCBodWdlIGNodW5rcyBvZiBmcmFtZXMuICovXG4gICAgICAgICAgICB2YXIgdGltZUN1cnJlbnQgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBDYWxsIEl0ZXJhdGlvblxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIHZhciBjYWxsc0xlbmd0aCA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzLmxlbmd0aDtcblxuICAgICAgICAgICAgLyogVG8gc3BlZWQgdXAgaXRlcmF0aW5nIG92ZXIgdGhpcyBhcnJheSwgaXQgaXMgY29tcGFjdGVkIChmYWxzZXkgaXRlbXMgLS0gY2FsbHMgdGhhdCBoYXZlIGNvbXBsZXRlZCAtLSBhcmUgcmVtb3ZlZClcbiAgICAgICAgICAgICAgIHdoZW4gaXRzIGxlbmd0aCBoYXMgYmFsbG9vbmVkIHRvIGEgcG9pbnQgdGhhdCBjYW4gaW1wYWN0IHRpY2sgcGVyZm9ybWFuY2UuIFRoaXMgb25seSBiZWNvbWVzIG5lY2Vzc2FyeSB3aGVuIGFuaW1hdGlvblxuICAgICAgICAgICAgICAgaGFzIGJlZW4gY29udGludW91cyB3aXRoIG1hbnkgZWxlbWVudHMgb3ZlciBhIGxvbmcgcGVyaW9kIG9mIHRpbWU7IHdoZW5ldmVyIGFsbCBhY3RpdmUgY2FsbHMgYXJlIGNvbXBsZXRlZCwgY29tcGxldGVDYWxsKCkgY2xlYXJzIFZlbG9jaXR5LlN0YXRlLmNhbGxzLiAqL1xuICAgICAgICAgICAgaWYgKGNhbGxzTGVuZ3RoID4gMTAwMDApIHtcbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyA9IGNvbXBhY3RTcGFyc2VBcnJheShWZWxvY2l0eS5TdGF0ZS5jYWxscyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGFjdGl2ZSBjYWxsLiAqL1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLyogV2hlbiBhIFZlbG9jaXR5IGNhbGwgaXMgY29tcGxldGVkLCBpdHMgVmVsb2NpdHkuU3RhdGUuY2FsbHMgZW50cnkgaXMgc2V0IHRvIGZhbHNlLiBDb250aW51ZSBvbiB0byB0aGUgbmV4dCBjYWxsLiAqL1xuICAgICAgICAgICAgICAgIGlmICghVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgIENhbGwtV2lkZSBWYXJpYWJsZXNcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICB2YXIgY2FsbENvbnRhaW5lciA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2ldLFxuICAgICAgICAgICAgICAgICAgICBjYWxsID0gY2FsbENvbnRhaW5lclswXSxcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IGNhbGxDb250YWluZXJbMl0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVTdGFydCA9IGNhbGxDb250YWluZXJbM10sXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0VGljayA9ICEhdGltZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICB0d2VlbkR1bW15VmFsdWUgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgLyogSWYgdGltZVN0YXJ0IGlzIHVuZGVmaW5lZCwgdGhlbiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHRoYXQgdGhpcyBjYWxsIGhhcyBiZWVuIHByb2Nlc3NlZCBieSB0aWNrKCkuXG4gICAgICAgICAgICAgICAgICAgV2UgYXNzaWduIHRpbWVTdGFydCBub3cgc28gdGhhdCBpdHMgdmFsdWUgaXMgYXMgY2xvc2UgdG8gdGhlIHJlYWwgYW5pbWF0aW9uIHN0YXJ0IHRpbWUgYXMgcG9zc2libGUuXG4gICAgICAgICAgICAgICAgICAgKENvbnZlcnNlbHksIGhhZCB0aW1lU3RhcnQgYmVlbiBkZWZpbmVkIHdoZW4gdGhpcyBjYWxsIHdhcyBhZGRlZCB0byBWZWxvY2l0eS5TdGF0ZS5jYWxscywgdGhlIGRlbGF5XG4gICAgICAgICAgICAgICAgICAgYmV0d2VlbiB0aGF0IHRpbWUgYW5kIG5vdyB3b3VsZCBjYXVzZSB0aGUgZmlyc3QgZmV3IGZyYW1lcyBvZiB0aGUgdHdlZW4gdG8gYmUgc2tpcHBlZCBzaW5jZVxuICAgICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSBpcyBjYWxjdWxhdGVkIHJlbGF0aXZlIHRvIHRpbWVTdGFydC4pICovXG4gICAgICAgICAgICAgICAgLyogRnVydGhlciwgc3VidHJhY3QgMTZtcyAodGhlIGFwcHJveGltYXRlIHJlc29sdXRpb24gb2YgUkFGKSBmcm9tIHRoZSBjdXJyZW50IHRpbWUgdmFsdWUgc28gdGhhdCB0aGVcbiAgICAgICAgICAgICAgICAgICBmaXJzdCB0aWNrIGl0ZXJhdGlvbiBpc24ndCB3YXN0ZWQgYnkgYW5pbWF0aW5nIGF0IDAlIHR3ZWVuIGNvbXBsZXRpb24sIHdoaWNoIHdvdWxkIHByb2R1Y2UgdGhlXG4gICAgICAgICAgICAgICAgICAgc2FtZSBzdHlsZSB2YWx1ZSBhcyB0aGUgZWxlbWVudCdzIGN1cnJlbnQgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0ID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bM10gPSB0aW1lQ3VycmVudCAtIDE2O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFRoZSB0d2VlbidzIGNvbXBsZXRpb24gcGVyY2VudGFnZSBpcyByZWxhdGl2ZSB0byB0aGUgdHdlZW4ncyBzdGFydCB0aW1lLCBub3QgdGhlIHR3ZWVuJ3Mgc3RhcnQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAod2hpY2ggd291bGQgcmVzdWx0IGluIHVucHJlZGljdGFibGUgdHdlZW4gZHVyYXRpb25zIHNpbmNlIEphdmFTY3JpcHQncyB0aW1lcnMgYXJlIG5vdCBwYXJ0aWN1bGFybHkgYWNjdXJhdGUpLlxuICAgICAgICAgICAgICAgICAgIEFjY29yZGluZ2x5LCB3ZSBlbnN1cmUgdGhhdCBwZXJjZW50Q29tcGxldGUgZG9lcyBub3QgZXhjZWVkIDEuICovXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IE1hdGgubWluKCh0aW1lQ3VycmVudCAtIHRpbWVTdGFydCkgLyBvcHRzLmR1cmF0aW9uLCAxKTtcblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgRWxlbWVudCBJdGVyYXRpb25cbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogRm9yIGV2ZXJ5IGNhbGwsIGl0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBlbGVtZW50cyBpbiBpdHMgc2V0LiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBjYWxsTGVuZ3RoID0gY2FsbC5sZW5ndGg7IGogPCBjYWxsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuc0NvbnRhaW5lciA9IGNhbGxbal0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdG8gc2VlIGlmIHRoaXMgZWxlbWVudCBoYXMgYmVlbiBkZWxldGVkIG1pZHdheSB0aHJvdWdoIHRoZSBhbmltYXRpb24gYnkgY2hlY2tpbmcgZm9yIHRoZVxuICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZWQgZXhpc3RlbmNlIG9mIGl0cyBkYXRhIGNhY2hlLiBJZiBpdCdzIGdvbmUsIHNraXAgYW5pbWF0aW5nIHRoaXMgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEYXRhKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1Qcm9wZXJ0eUV4aXN0cyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgIERpc3BsYXkgJiBWaXNpYmlsaXR5IFRvZ2dsaW5nXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGRpc3BsYXkgb3B0aW9uIGlzIHNldCB0byBub24tXCJub25lXCIsIHNldCBpdCB1cGZyb250IHNvIHRoYXQgdGhlIGVsZW1lbnQgY2FuIGJlY29tZSB2aXNpYmxlIGJlZm9yZSB0d2VlbmluZyBiZWdpbnMuXG4gICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGRpc3BsYXkncyBcIm5vbmVcIiB2YWx1ZSBpcyBzZXQgaW4gY29tcGxldGVDYWxsKCkgb25jZSB0aGUgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQuKSAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy5kaXNwbGF5ICE9PSBudWxsICYmIG9wdHMuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IFwiZmxleFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXhWYWx1ZXMgPSBbIFwiLXdlYmtpdC1ib3hcIiwgXCItbW96LWJveFwiLCBcIi1tcy1mbGV4Ym94XCIsIFwiLXdlYmtpdC1mbGV4XCIgXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChmbGV4VmFsdWVzLCBmdW5jdGlvbihpLCBmbGV4VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIGZsZXhWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBvcHRzLmRpc3BsYXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU2FtZSBnb2VzIHdpdGggdGhlIHZpc2liaWxpdHkgb3B0aW9uLCBidXQgaXRzIFwibm9uZVwiIGVxdWl2YWxlbnQgaXMgXCJoaWRkZW5cIi4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ2aXNpYmlsaXR5XCIsIG9wdHMudmlzaWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5IEl0ZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIGV2ZXJ5IGVsZW1lbnQsIGl0ZXJhdGUgdGhyb3VnaCBlYWNoIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB0d2VlbnNDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluIGFkZGl0aW9uIHRvIHByb3BlcnR5IHR3ZWVuIGRhdGEsIHR3ZWVuc0NvbnRhaW5lciBjb250YWlucyBhIHJlZmVyZW5jZSB0byBpdHMgYXNzb2NpYXRlZCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0d2VlbiA9IHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRWFzaW5nIGNhbiBlaXRoZXIgYmUgYSBwcmUtZ2VuZXJlYXRlZCBmdW5jdGlvbiBvciBhIHN0cmluZyB0aGF0IHJlZmVyZW5jZXMgYSBwcmUtcmVnaXN0ZXJlZCBlYXNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gdGhlIFZlbG9jaXR5LkVhc2luZ3Mgb2JqZWN0LiBJbiBlaXRoZXIgY2FzZSwgcmV0dXJuIHRoZSBhcHByb3ByaWF0ZSBlYXNpbmcgKmZ1bmN0aW9uKi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gVHlwZS5pc1N0cmluZyh0d2Vlbi5lYXNpbmcpID8gVmVsb2NpdHkuRWFzaW5nc1t0d2Vlbi5lYXNpbmddIDogdHdlZW4uZWFzaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEN1cnJlbnQgVmFsdWUgQ2FsY3VsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGlzIHRoZSBsYXN0IHRpY2sgcGFzcyAoaWYgd2UndmUgcmVhY2hlZCAxMDAlIGNvbXBsZXRpb24gZm9yIHRoaXMgdHdlZW4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuc3VyZSB0aGF0IGN1cnJlbnRWYWx1ZSBpcyBleHBsaWNpdGx5IHNldCB0byBpdHMgdGFyZ2V0IGVuZFZhbHVlIHNvIHRoYXQgaXQncyBub3Qgc3ViamVjdGVkIHRvIGFueSByb3VuZGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGVyY2VudENvbXBsZXRlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHR3ZWVuLmVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgY2FsY3VsYXRlIGN1cnJlbnRWYWx1ZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkZWx0YSBmcm9tIHN0YXJ0VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuRGVsdGEgPSB0d2Vlbi5lbmRWYWx1ZSAtIHR3ZWVuLnN0YXJ0VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHR3ZWVuLnN0YXJ0VmFsdWUgKyAodHdlZW5EZWx0YSAqIGVhc2luZyhwZXJjZW50Q29tcGxldGUsIG9wdHMsIHR3ZWVuRGVsdGEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBubyB2YWx1ZSBjaGFuZ2UgaXMgb2NjdXJyaW5nLCBkb24ndCBwcm9jZWVkIHdpdGggRE9NIHVwZGF0aW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZpcnN0VGljayAmJiAoY3VycmVudFZhbHVlID09PSB0d2Vlbi5jdXJyZW50VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHdlJ3JlIHR3ZWVuaW5nIGEgZmFrZSAndHdlZW4nIHByb3BlcnR5IGluIG9yZGVyIHRvIGxvZyB0cmFuc2l0aW9uIHZhbHVlcywgdXBkYXRlIHRoZSBvbmUtcGVyLWNhbGwgdmFyaWFibGUgc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0IGNhbiBiZSBwYXNzZWQgaW50byB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2suICovIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJ0d2VlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuRHVtbXlWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhvb2tzOiBQYXJ0IElcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBob29rZWQgcHJvcGVydGllcywgdGhlIG5ld2x5LXVwZGF0ZWQgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSBpcyBjYWNoZWQgb250byB0aGUgZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciBzdWJzZXF1ZW50IGhvb2tzIGluIHRoaXMgY2FsbCB0aGF0IGFyZSBhc3NvY2lhdGVkIHdpdGggdGhlIHNhbWUgcm9vdCBwcm9wZXJ0eS4gSWYgd2UgZGlkbid0IGNhY2hlIHRoZSB1cGRhdGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlLCBlYWNoIHN1YnNlcXVlbnQgdXBkYXRlIHRvIHRoZSByb290IHByb3BlcnR5IGluIHRoaXMgdGljayBwYXNzIHdvdWxkIHJlc2V0IHRoZSBwcmV2aW91cyBob29rJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlcyB0byByb290UHJvcGVydHlWYWx1ZSBwcmlvciB0byBpbmplY3Rpb24uIEEgbmljZSBwZXJmb3JtYW5jZSBieXByb2R1Y3Qgb2Ygcm9vdFByb3BlcnR5VmFsdWUgY2FjaGluZyBpcyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNlcXVlbnRseSBjaGFpbmVkIGFuaW1hdGlvbnMgdXNpbmcgdGhlIHNhbWUgaG9va1Jvb3QgYnV0IGEgZGlmZmVyZW50IGhvb2sgY2FuIHVzZSB0aGlzIGNhY2hlZCByb290UHJvcGVydHlWYWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUgPSBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm9vdFByb3BlcnR5VmFsdWVDYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLnJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWVDYWNoZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9NIFVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBzZXRQcm9wZXJ0eVZhbHVlKCkgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcHJvcGVydHkgbmFtZSBhbmQgcHJvcGVydHkgdmFsdWUgcG9zdCBhbnkgbm9ybWFsaXphdGlvbiB0aGF0IG1heSBoYXZlIGJlZW4gcGVyZm9ybWVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUbyBzb2x2ZSBhbiBJRTw9OCBwb3NpdGlvbmluZyBidWcsIHRoZSB1bml0IHR5cGUgaXMgZHJvcHBlZCB3aGVuIHNldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZSBvZiAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWRqdXN0ZWRTZXREYXRhID0gQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgLyogU0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSArIChwYXJzZUZsb2F0KGN1cnJlbnRWYWx1ZSkgPT09IDAgPyBcIlwiIDogdHdlZW4udW5pdFR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4ucm9vdFByb3BlcnR5VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zY3JvbGxEYXRhKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIb29rczogUGFydCBJSVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdyB0aGF0IHdlIGhhdmUgdGhlIGhvb2sncyB1cGRhdGVkIHJvb3RQcm9wZXJ0eVZhbHVlICh0aGUgcG9zdC1wcm9jZXNzZWQgdmFsdWUgcHJvdmlkZWQgYnkgYWRqdXN0ZWRTZXREYXRhKSwgY2FjaGUgaXQgb250byB0aGUgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgYWRqdXN0ZWRTZXREYXRhIGNvbnRhaW5zIG5vcm1hbGl6ZWQgZGF0YSByZWFkeSBmb3IgRE9NIHVwZGF0aW5nLCB0aGUgcm9vdFByb3BlcnR5VmFsdWUgbmVlZHMgdG8gYmUgcmUtZXh0cmFjdGVkIGZyb20gaXRzIG5vcm1hbGl6ZWQgZm9ybS4gPz8gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKFwiZXh0cmFjdFwiLCBudWxsLCBhZGp1c3RlZFNldERhdGFbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdID0gYWRqdXN0ZWRTZXREYXRhWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGbGFnIHdoZXRoZXIgYSB0cmFuc2Zvcm0gcHJvcGVydHkgaXMgYmVpbmcgYW5pbWF0ZWQgc28gdGhhdCBmbHVzaFRyYW5zZm9ybUNhY2hlKCkgY2FuIGJlIHRyaWdnZXJlZCBvbmNlIHRoaXMgdGljayBwYXNzIGlzIGNvbXBsZXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRqdXN0ZWRTZXREYXRhWzBdID09PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1Qcm9wZXJ0eUV4aXN0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVIQVxuICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIG1vYmlsZUhBIGlzIGVuYWJsZWQsIHNldCB0aGUgdHJhbnNsYXRlM2QgdHJhbnNmb3JtIHRvIG51bGwgdG8gZm9yY2UgaGFyZHdhcmUgYWNjZWxlcmF0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICBJdCdzIHNhZmUgdG8gb3ZlcnJpZGUgdGhpcyBwcm9wZXJ0eSBzaW5jZSBWZWxvY2l0eSBkb2Vzbid0IGFjdHVhbGx5IHN1cHBvcnQgaXRzIGFuaW1hdGlvbiAoaG9va3MgYXJlIHVzZWQgaW4gaXRzIHBsYWNlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubW9iaWxlSEEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvbid0IHNldCB0aGUgbnVsbCB0cmFuc2Zvcm0gaGFjayBpZiB3ZSd2ZSBhbHJlYWR5IGRvbmUgc28uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZS50cmFuc2xhdGUzZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWxsIGVudHJpZXMgb24gdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdCBhcmUgbGF0ZXIgY29uY2F0ZW5hdGVkIGludG8gYSBzaW5nbGUgdHJhbnNmb3JtIHN0cmluZyB2aWEgZmx1c2hUcmFuc2Zvcm1DYWNoZSgpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QgPSBcIigwcHgsIDBweCwgMHB4KVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFRoZSBub24tXCJub25lXCIgZGlzcGxheSB2YWx1ZSBpcyBvbmx5IGFwcGxpZWQgdG8gYW4gZWxlbWVudCBvbmNlIC0tIHdoZW4gaXRzIGFzc29jaWF0ZWQgY2FsbCBpcyBmaXJzdCB0aWNrZWQgdGhyb3VnaC5cbiAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgaXQncyBzZXQgdG8gZmFsc2Ugc28gdGhhdCBpdCBpc24ndCByZS1wcm9jZXNzZWQgYnkgdGhpcyBjYWxsIGluIHRoZSBuZXh0IHRpY2suICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bMl0uZGlzcGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2ldWzJdLnZpc2liaWxpdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBQYXNzIHRoZSBlbGVtZW50cyBhbmQgdGhlIHRpbWluZyBkYXRhIChwZXJjZW50Q29tcGxldGUsIG1zUmVtYWluaW5nLCB0aW1lU3RhcnQsIHR3ZWVuRHVtbXlWYWx1ZSkgaW50byB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2suICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMucHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5wcm9ncmVzcy5jYWxsKGNhbGxDb250YWluZXJbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsQ29udGFpbmVyWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoMCwgKHRpbWVTdGFydCArIG9wdHMuZHVyYXRpb24pIC0gdGltZUN1cnJlbnQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EdW1teVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGNhbGwgaGFzIGZpbmlzaGVkIHR3ZWVuaW5nLCBwYXNzIGl0cyBpbmRleCB0byBjb21wbGV0ZUNhbGwoKSB0byBoYW5kbGUgY2FsbCBjbGVhbnVwLiAqL1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIE5vdGU6IGNvbXBsZXRlQ2FsbCgpIHNldHMgdGhlIGlzVGlja2luZyBmbGFnIHRvIGZhbHNlIHdoZW4gdGhlIGxhc3QgY2FsbCBvbiBWZWxvY2l0eS5TdGF0ZS5jYWxscyBoYXMgY29tcGxldGVkLiAqL1xuICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuaXNUaWNraW5nKSB7XG4gICAgICAgICAgICB0aWNrZXIodGljayk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDYWxsIENvbXBsZXRpb25cbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogTm90ZTogVW5saWtlIHRpY2soKSwgd2hpY2ggcHJvY2Vzc2VzIGFsbCBhY3RpdmUgY2FsbHMgYXQgb25jZSwgY2FsbCBjb21wbGV0aW9uIGlzIGhhbmRsZWQgb24gYSBwZXItY2FsbCBiYXNpcy4gKi9cbiAgICBmdW5jdGlvbiBjb21wbGV0ZUNhbGwgKGNhbGxJbmRleCwgaXNTdG9wcGVkKSB7XG4gICAgICAgIC8qIEVuc3VyZSB0aGUgY2FsbCBleGlzdHMuICovXG4gICAgICAgIGlmICghVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogUHVsbCB0aGUgbWV0YWRhdGEgZnJvbSB0aGUgY2FsbC4gKi9cbiAgICAgICAgdmFyIGNhbGwgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzBdLFxuICAgICAgICAgICAgZWxlbWVudHMgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzFdLFxuICAgICAgICAgICAgb3B0cyA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMl0sXG4gICAgICAgICAgICByZXNvbHZlciA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bNF07XG5cbiAgICAgICAgdmFyIHJlbWFpbmluZ0NhbGxzRXhpc3QgPSBmYWxzZTtcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBFbGVtZW50IEZpbmFsaXphdGlvblxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBjYWxsTGVuZ3RoID0gY2FsbC5sZW5ndGg7IGkgPCBjYWxsTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gY2FsbFtpXS5lbGVtZW50O1xuXG4gICAgICAgICAgICAvKiBJZiB0aGUgdXNlciBzZXQgZGlzcGxheSB0byBcIm5vbmVcIiAoaW50ZW5kaW5nIHRvIGhpZGUgdGhlIGVsZW1lbnQpLCBzZXQgaXQgbm93IHRoYXQgdGhlIGFuaW1hdGlvbiBoYXMgY29tcGxldGVkLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogZGlzcGxheTpub25lIGlzbid0IHNldCB3aGVuIGNhbGxzIGFyZSBtYW51YWxseSBzdG9wcGVkICh2aWEgVmVsb2NpdHkoXCJzdG9wXCIpLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogRGlzcGxheSBnZXRzIGlnbm9yZWQgd2l0aCBcInJldmVyc2VcIiBjYWxscyBhbmQgaW5maW5pdGUgbG9vcHMsIHNpbmNlIHRoaXMgYmVoYXZpb3Igd291bGQgYmUgdW5kZXNpcmFibGUuICovXG4gICAgICAgICAgICBpZiAoIWlzU3RvcHBlZCAmJiAhb3B0cy5sb29wKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIG9wdHMuZGlzcGxheSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInZpc2liaWxpdHlcIiwgb3B0cy52aXNpYmlsaXR5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIElmIHRoZSBlbGVtZW50J3MgcXVldWUgaXMgZW1wdHkgKGlmIG9ubHkgdGhlIFwiaW5wcm9ncmVzc1wiIGl0ZW0gaXMgbGVmdCBhdCBwb3NpdGlvbiAwKSBvciBpZiBpdHMgcXVldWUgaXMgYWJvdXQgdG8gcnVuXG4gICAgICAgICAgICAgICBhIG5vbi1WZWxvY2l0eS1pbml0aWF0ZWQgZW50cnksIHR1cm4gb2ZmIHRoZSBpc0FuaW1hdGluZyBmbGFnLiBBIG5vbi1WZWxvY2l0eS1pbml0aWF0aWVkIHF1ZXVlIGVudHJ5J3MgbG9naWMgbWlnaHQgYWx0ZXJcbiAgICAgICAgICAgICAgIGFuIGVsZW1lbnQncyBDU1MgdmFsdWVzIGFuZCB0aGVyZWJ5IGNhdXNlIFZlbG9jaXR5J3MgY2FjaGVkIHZhbHVlIGRhdGEgdG8gZ28gc3RhbGUuIFRvIGRldGVjdCBpZiBhIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHksXG4gICAgICAgICAgICAgICB3ZSBjaGVjayBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBvdXIgc3BlY2lhbCBWZWxvY2l0eS5xdWV1ZUVudHJ5RmxhZyBkZWNsYXJhdGlvbiwgd2hpY2ggbWluaWZpZXJzIHdvbid0IHJlbmFtZSBzaW5jZSB0aGUgZmxhZ1xuICAgICAgICAgICAgICAgaXMgYXNzaWduZWQgdG8galF1ZXJ5J3MgZ2xvYmFsICQgb2JqZWN0IGFuZCB0aHVzIGV4aXN0cyBvdXQgb2YgVmVsb2NpdHkncyBvd24gc2NvcGUuICovXG4gICAgICAgICAgICBpZiAob3B0cy5sb29wICE9PSB0cnVlICYmICgkLnF1ZXVlKGVsZW1lbnQpWzFdID09PSB1bmRlZmluZWQgfHwgIS9cXC52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnL2kudGVzdCgkLnF1ZXVlKGVsZW1lbnQpWzFdKSkpIHtcbiAgICAgICAgICAgICAgICAvKiBUaGUgZWxlbWVudCBtYXkgaGF2ZSBiZWVuIGRlbGV0ZWQuIEVuc3VyZSB0aGF0IGl0cyBkYXRhIGNhY2hlIHN0aWxsIGV4aXN0cyBiZWZvcmUgYWN0aW5nIG9uIGl0LiAqL1xuICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIGVsZW1lbnQncyByb290UHJvcGVydHlWYWx1ZUNhY2hlLCB3aGljaCB3aWxsIGJlY29tZSBzdGFsZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlID0ge307XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgYW55IDNEIHRyYW5zZm9ybSBzdWJwcm9wZXJ0eSBpcyBhdCBpdHMgZGVmYXVsdCB2YWx1ZSAocmVnYXJkbGVzcyBvZiB1bml0IHR5cGUpLCByZW1vdmUgaXQuICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChDU1MuTGlzdHMudHJhbnNmb3JtczNELCBmdW5jdGlvbihpLCB0cmFuc2Zvcm1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdFZhbHVlID0gL15zY2FsZS8udGVzdCh0cmFuc2Zvcm1OYW1lKSA/IDEgOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdICE9PSB1bmRlZmluZWQgJiYgbmV3IFJlZ0V4cChcIl5cXFxcKFwiICsgZGVmYXVsdFZhbHVlICsgXCJbXi5dXCIpLnRlc3QoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIE1vYmlsZSBkZXZpY2VzIGhhdmUgaGFyZHdhcmUgYWNjZWxlcmF0aW9uIHJlbW92ZWQgYXQgdGhlIGVuZCBvZiB0aGUgYW5pbWF0aW9uIGluIG9yZGVyIHRvIGF2b2lkIGhvZ2dpbmcgdGhlIEdQVSdzIG1lbW9yeS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubW9iaWxlSEEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2Q7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBGbHVzaCB0aGUgc3VicHJvcGVydHkgcmVtb3ZhbHMgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHRoZSBcInZlbG9jaXR5LWFuaW1hdGluZ1wiIGluZGljYXRvciBjbGFzcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgQ1NTLlZhbHVlcy5yZW1vdmVDbGFzcyhlbGVtZW50LCBcInZlbG9jaXR5LWFuaW1hdGluZ1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIE9wdGlvbjogQ29tcGxldGVcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogQ29tcGxldGUgaXMgZmlyZWQgb25jZSBwZXIgY2FsbCAobm90IG9uY2UgcGVyIGVsZW1lbnQpIGFuZCBpcyBwYXNzZWQgdGhlIGZ1bGwgcmF3IERPTSBlbGVtZW50IHNldCBhcyBib3RoIGl0cyBjb250ZXh0IGFuZCBpdHMgZmlyc3QgYXJndW1lbnQuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBDYWxsYmFja3MgYXJlbid0IGZpcmVkIHdoZW4gY2FsbHMgYXJlIG1hbnVhbGx5IHN0b3BwZWQgKHZpYSBWZWxvY2l0eShcInN0b3BcIikuICovXG4gICAgICAgICAgICBpZiAoIWlzU3RvcHBlZCAmJiBvcHRzLmNvbXBsZXRlICYmICFvcHRzLmxvb3AgJiYgKGkgPT09IGNhbGxMZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIC8qIFdlIHRocm93IGNhbGxiYWNrcyBpbiBhIHNldFRpbWVvdXQgc28gdGhhdCB0aHJvd24gZXJyb3JzIGRvbid0IGhhbHQgdGhlIGV4ZWN1dGlvbiBvZiBWZWxvY2l0eSBpdHNlbGYuICovXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZS5jYWxsKGVsZW1lbnRzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgdGhyb3cgZXJyb3I7IH0sIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIFByb21pc2UgUmVzb2x2aW5nXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBOb3RlOiBJbmZpbml0ZSBsb29wcyBkb24ndCByZXR1cm4gcHJvbWlzZXMuICovXG4gICAgICAgICAgICBpZiAocmVzb2x2ZXIgJiYgb3B0cy5sb29wICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZXIoZWxlbWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBMb29wIChJbmZpbml0ZSlcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIGlmIChvcHRzLmxvb3AgPT09IHRydWUgJiYgIWlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIC8qIElmIGEgcm90YXRlWC9ZL1ogcHJvcGVydHkgaXMgYmVpbmcgYW5pbWF0ZWQgdG8gMzYwIGRlZyB3aXRoIGxvb3A6dHJ1ZSwgc3dhcCB0d2VlbiBzdGFydC9lbmQgdmFsdWVzIHRvIGVuYWJsZVxuICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXMgaXRlcmF0aXZlIHJvdGF0aW9uIGxvb3BpbmcuIChPdGhlcmlzZSwgdGhlIGVsZW1lbnQgd291bGQganVzdCByb3RhdGUgYmFjayBhbmQgZm9ydGguKSAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lciwgZnVuY3Rpb24ocHJvcGVydHlOYW1lLCB0d2VlbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15yb3RhdGUvLnRlc3QocHJvcGVydHlOYW1lKSAmJiBwYXJzZUZsb2F0KHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlKSA9PT0gMzYwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlID0gMzYwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eYmFja2dyb3VuZFBvc2l0aW9uLy50ZXN0KHByb3BlcnR5TmFtZSkgJiYgcGFyc2VGbG9hdCh0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSkgPT09IDEwMCAmJiB0d2VlbkNvbnRhaW5lci51bml0VHlwZSA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLnN0YXJ0VmFsdWUgPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFZlbG9jaXR5KGVsZW1lbnQsIFwicmV2ZXJzZVwiLCB7IGxvb3A6IHRydWUsIGRlbGF5OiBvcHRzLmRlbGF5IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBEZXF1ZXVlaW5nXG4gICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIEZpcmUgdGhlIG5leHQgY2FsbCBpbiB0aGUgcXVldWUgc28gbG9uZyBhcyB0aGlzIGNhbGwncyBxdWV1ZSB3YXNuJ3Qgc2V0IHRvIGZhbHNlICh0byB0cmlnZ2VyIGEgcGFyYWxsZWwgYW5pbWF0aW9uKSxcbiAgICAgICAgICAgICAgIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBjYXVzZWQgdGhlIG5leHQgY2FsbCB0byBmaXJlLiBOb3RlOiBFdmVuIGlmIHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBxdWV1ZSBoYXMgYmVlbiByZWFjaGVkLFxuICAgICAgICAgICAgICAgJC5kZXF1ZXVlKCkgbXVzdCBzdGlsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY29tcGxldGVseSBjbGVhciBqUXVlcnkncyBhbmltYXRpb24gcXVldWUuICovXG4gICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIENhbGxzIEFycmF5IENsZWFudXBcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFNpbmNlIHRoaXMgY2FsbCBpcyBjb21wbGV0ZSwgc2V0IGl0IHRvIGZhbHNlIHNvIHRoYXQgdGhlIHJBRiB0aWNrIHNraXBzIGl0LiBUaGlzIGFycmF5IGlzIGxhdGVyIGNvbXBhY3RlZCB2aWEgY29tcGFjdFNwYXJzZUFycmF5KCkuXG4gICAgICAgICAgKEZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB0aGUgY2FsbCBpcyBzZXQgdG8gZmFsc2UgaW5zdGVhZCBvZiBiZWluZyBkZWxldGVkIGZyb20gdGhlIGFycmF5OiBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9zcGVlZC92OC8pICovXG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0gPSBmYWxzZTtcblxuICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNhbGxzIGFycmF5IHRvIGRldGVybWluZSBpZiB0aGlzIHdhcyB0aGUgZmluYWwgaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uLlxuICAgICAgICAgICBJZiBzbywgc2V0IGEgZmxhZyB0byBlbmQgdGlja2luZyBhbmQgY2xlYXIgdGhlIGNhbGxzIGFycmF5LiAqL1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgY2FsbHNMZW5ndGggPSBWZWxvY2l0eS5TdGF0ZS5jYWxscy5sZW5ndGg7IGogPCBjYWxsc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuY2FsbHNbal0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVtYWluaW5nQ2FsbHNFeGlzdCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW1haW5pbmdDYWxsc0V4aXN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLyogdGljaygpIHdpbGwgZGV0ZWN0IHRoaXMgZmxhZyB1cG9uIGl0cyBuZXh0IGl0ZXJhdGlvbiBhbmQgc3Vic2VxdWVudGx5IHR1cm4gaXRzZWxmIG9mZi4gKi9cbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKiBDbGVhciB0aGUgY2FsbHMgYXJyYXkgc28gdGhhdCBpdHMgbGVuZ3RoIGlzIHJlc2V0LiAqL1xuICAgICAgICAgICAgZGVsZXRlIFZlbG9jaXR5LlN0YXRlLmNhbGxzO1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgRnJhbWV3b3Jrc1xuICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIEJvdGggalF1ZXJ5IGFuZCBaZXB0byBhbGxvdyB0aGVpciAkLmZuIG9iamVjdCB0byBiZSBleHRlbmRlZCB0byBhbGxvdyB3cmFwcGVkIGVsZW1lbnRzIHRvIGJlIHN1YmplY3RlZCB0byBwbHVnaW4gY2FsbHMuXG4gICAgICAgSWYgZWl0aGVyIGZyYW1ld29yayBpcyBsb2FkZWQsIHJlZ2lzdGVyIGEgXCJ2ZWxvY2l0eVwiIGV4dGVuc2lvbiBwb2ludGluZyB0byBWZWxvY2l0eSdzIGNvcmUgYW5pbWF0ZSgpIG1ldGhvZC4gIFZlbG9jaXR5XG4gICAgICAgYWxzbyByZWdpc3RlcnMgaXRzZWxmIG9udG8gYSBnbG9iYWwgY29udGFpbmVyICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpIHNvIHRoYXQgY2VydGFpbiBmZWF0dXJlcyBhcmVcbiAgICAgICBhY2Nlc3NpYmxlIGJleW9uZCBqdXN0IGEgcGVyLWVsZW1lbnQgc2NvcGUuIFRoaXMgbWFzdGVyIG9iamVjdCBjb250YWlucyBhbiAuYW5pbWF0ZSgpIG1ldGhvZCwgd2hpY2ggaXMgbGF0ZXIgYXNzaWduZWQgdG8gJC5mblxuICAgICAgIChpZiBqUXVlcnkgb3IgWmVwdG8gYXJlIHByZXNlbnQpLiBBY2NvcmRpbmdseSwgVmVsb2NpdHkgY2FuIGJvdGggYWN0IG9uIHdyYXBwZWQgRE9NIGVsZW1lbnRzIGFuZCBzdGFuZCBhbG9uZSBmb3IgdGFyZ2V0aW5nIHJhdyBET00gZWxlbWVudHMuICovXG4gICAgZ2xvYmFsLlZlbG9jaXR5ID0gVmVsb2NpdHk7XG5cbiAgICBpZiAoZ2xvYmFsICE9PSB3aW5kb3cpIHtcbiAgICAgICAgLyogQXNzaWduIHRoZSBlbGVtZW50IGZ1bmN0aW9uIHRvIFZlbG9jaXR5J3MgY29yZSBhbmltYXRlKCkgbWV0aG9kLiAqL1xuICAgICAgICBnbG9iYWwuZm4udmVsb2NpdHkgPSBhbmltYXRlO1xuICAgICAgICAvKiBBc3NpZ24gdGhlIG9iamVjdCBmdW5jdGlvbidzIGRlZmF1bHRzIHRvIFZlbG9jaXR5J3MgZ2xvYmFsIGRlZmF1bHRzIG9iamVjdC4gKi9cbiAgICAgICAgZ2xvYmFsLmZuLnZlbG9jaXR5LmRlZmF1bHRzID0gVmVsb2NpdHkuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgUGFja2FnZWQgUmVkaXJlY3RzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBzbGlkZVVwLCBzbGlkZURvd24gKi9cbiAgICAkLmVhY2goWyBcIkRvd25cIiwgXCJVcFwiIF0sIGZ1bmN0aW9uKGksIGRpcmVjdGlvbikge1xuICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbXCJzbGlkZVwiICsgZGlyZWN0aW9uXSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgYmVnaW4gPSBvcHRzLmJlZ2luLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZSxcbiAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlcyA9IHsgaGVpZ2h0OiBcIlwiLCBtYXJnaW5Ub3A6IFwiXCIsIG1hcmdpbkJvdHRvbTogXCJcIiwgcGFkZGluZ1RvcDogXCJcIiwgcGFkZGluZ0JvdHRvbTogXCJcIiB9LFxuICAgICAgICAgICAgICAgIGlubGluZVZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvKiBTaG93IHRoZSBlbGVtZW50IGJlZm9yZSBzbGlkZURvd24gYmVnaW5zIGFuZCBoaWRlIHRoZSBlbGVtZW50IGFmdGVyIHNsaWRlVXAgY29tcGxldGVzLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElubGluZSBlbGVtZW50cyBjYW5ub3QgaGF2ZSBkaW1lbnNpb25zIGFuaW1hdGVkLCBzbyB0aGV5J3JlIHJldmVydGVkIHRvIGlubGluZS1ibG9jay4gKi9cbiAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSAoZGlyZWN0aW9uID09PSBcIkRvd25cIiA/IChWZWxvY2l0eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGVsZW1lbnQpID09PSBcImlubGluZVwiID8gXCJpbmxpbmUtYmxvY2tcIiA6IFwiYmxvY2tcIikgOiBcIm5vbmVcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgdXNlciBwYXNzZWQgaW4gYSBiZWdpbiBjYWxsYmFjaywgZmlyZSBpdCBub3cuICovXG4gICAgICAgICAgICAgICAgYmVnaW4gJiYgYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGVsZW1lbnRzJyBvcmlnaW5hbCB2ZXJ0aWNhbCBkaW1lbnNpb25hbCBwcm9wZXJ0eSB2YWx1ZXMgc28gdGhhdCB3ZSBjYW4gYW5pbWF0ZSBiYWNrIHRvIHRoZW0uICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY29tcHV0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lVmFsdWVzW3Byb3BlcnR5XSA9IGVsZW1lbnQuc3R5bGVbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzbGlkZURvd24sIHVzZSBmb3JjZWZlZWRpbmcgdG8gYW5pbWF0ZSBhbGwgdmVydGljYWwgcHJvcGVydGllcyBmcm9tIDAuIEZvciBzbGlkZVVwLFxuICAgICAgICAgICAgICAgICAgICAgICB1c2UgZm9yY2VmZWVkaW5nIHRvIHN0YXJ0IGZyb20gY29tcHV0ZWQgdmFsdWVzIGFuZCBhbmltYXRlIGRvd24gdG8gMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBWZWxvY2l0eS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzW3Byb3BlcnR5XSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiKSA/IFsgcHJvcGVydHlWYWx1ZSwgMCBdIDogWyAwLCBwcm9wZXJ0eVZhbHVlIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogRm9yY2UgdmVydGljYWwgb3ZlcmZsb3cgY29udGVudCB0byBjbGlwIHNvIHRoYXQgc2xpZGluZyB3b3JrcyBhcyBleHBlY3RlZC4gKi9cbiAgICAgICAgICAgICAgICBpbmxpbmVWYWx1ZXMub3ZlcmZsb3cgPSBlbGVtZW50LnN0eWxlLm92ZXJmbG93O1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLyogUmVzZXQgZWxlbWVudCB0byBpdHMgcHJlLXNsaWRlIGlubGluZSB2YWx1ZXMgb25jZSBpdHMgc2xpZGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGlubGluZVZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XSA9IGlubGluZVZhbHVlc1twcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgcGFzc2VkIGluIGEgY29tcGxldGUgY2FsbGJhY2ssIGZpcmUgaXQgbm93LiAqL1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlICYmIGNvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlRGF0YSAmJiBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBWZWxvY2l0eShlbGVtZW50LCBjb21wdXRlZFZhbHVlcywgb3B0cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKiBmYWRlSW4sIGZhZGVPdXQgKi9cbiAgICAkLmVhY2goWyBcIkluXCIsIFwiT3V0XCIgXSwgZnVuY3Rpb24oaSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1tcImZhZGVcIiArIGRpcmVjdGlvbl0gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudHNJbmRleCwgZWxlbWVudHNTaXplLCBlbGVtZW50cywgcHJvbWlzZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSB7IG9wYWNpdHk6IChkaXJlY3Rpb24gPT09IFwiSW5cIikgPyAxIDogMCB9LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcGxldGUgPSBvcHRzLmNvbXBsZXRlO1xuXG4gICAgICAgICAgICAvKiBTaW5jZSByZWRpcmVjdHMgYXJlIHRyaWdnZXJlZCBpbmRpdmlkdWFsbHkgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgYW5pbWF0ZWQgc2V0LCBhdm9pZCByZXBlYXRlZGx5IHRyaWdnZXJpbmdcbiAgICAgICAgICAgICAgIGNhbGxiYWNrcyBieSBmaXJpbmcgdGhlbSBvbmx5IHdoZW4gdGhlIGZpbmFsIGVsZW1lbnQgaGFzIGJlZW4gcmVhY2hlZC4gKi9cbiAgICAgICAgICAgIGlmIChlbGVtZW50c0luZGV4ICE9PSBlbGVtZW50c1NpemUgLSAxKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IG9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbENvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhICYmIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIElmIGEgZGlzcGxheSB3YXMgcGFzc2VkIGluLCB1c2UgaXQuIE90aGVyd2lzZSwgZGVmYXVsdCB0byBcIm5vbmVcIiBmb3IgZmFkZU91dCBvciB0aGUgZWxlbWVudC1zcGVjaWZpYyBkZWZhdWx0IGZvciBmYWRlSW4uICovXG4gICAgICAgICAgICAvKiBOb3RlOiBXZSBhbGxvdyB1c2VycyB0byBwYXNzIGluIFwibnVsbFwiIHRvIHNraXAgZGlzcGxheSBzZXR0aW5nIGFsdG9nZXRoZXIuICovXG4gICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSAoZGlyZWN0aW9uID09PSBcIkluXCIgPyBcImF1dG9cIiA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcywgcHJvcGVydGllc01hcCwgb3B0cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gVmVsb2NpdHk7XG59KCh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpLCB3aW5kb3csIGRvY3VtZW50KTtcbn0pKTtcblxuLyoqKioqKioqKioqKioqKioqKlxuICAgS25vd24gSXNzdWVzXG4qKioqKioqKioqKioqKioqKiovXG5cbi8qIFRoZSBDU1Mgc3BlYyBtYW5kYXRlcyB0aGF0IHRoZSB0cmFuc2xhdGVYL1kvWiB0cmFuc2Zvcm1zIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiAtLSBub3QgaXRzIHBhcmVudC5cblZlbG9jaXR5LCBob3dldmVyLCBkb2Vzbid0IG1ha2UgdGhpcyBkaXN0aW5jdGlvbi4gVGh1cywgY29udmVydGluZyB0byBvciBmcm9tIHRoZSAlIHVuaXQgd2l0aCB0aGVzZSBzdWJwcm9wZXJ0aWVzXG53aWxsIHByb2R1Y2UgYW4gaW5hY2N1cmF0ZSBjb252ZXJzaW9uIHZhbHVlLiBUaGUgc2FtZSBpc3N1ZSBleGlzdHMgd2l0aCB0aGUgY3gvY3kgYXR0cmlidXRlcyBvZiBTVkcgY2lyY2xlcyBhbmQgZWxsaXBzZXMuICovIiwibW9kdWxlLmV4cG9ydHMgPSBbJyR0aW1lb3V0JywgJyRpbnRlcnZhbCcsICckY29tcGlsZScsICdJR0Nhcm91c2VsU2VydmljZScsIGZ1bmN0aW9uKCR0aW1lb3V0LCAkaW50ZXJ2YWwsICRjb21waWxlLCBJR0Nhcm91c2VsU2VydmljZSkge1xuXG4gICAgICAgIC8vIENvbnN0YW50c1xuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhdXRvU2xpZGU6IHRydWUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uRHVyYXRpb246IDEwMDAsIC8vaW4gbXNcbiAgICAgICAgICAgIHNsaWRlRHVyYXRpb246IDMsIC8vaW4gc2VjXG4gICAgICAgICAgICBpdGVtRGlzcGxheWVkOiA1LCAvL2l0ZW0gZGlzcGxheWVkIGluIHRoZSBzYW1lIHRpbWVcbiAgICAgICAgICAgIHJ0bDogdHJ1ZSwvL3JpZ2h0IHRvIGxlZnRcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgZGVsdGFaID0gMTAwLFxuICAgICAgICAgICAgbWluU2NhbGUgPSAwLjg7XG5cbiAgICAgICAgLy9cbiAgICAgICAgdmFyIGNvbnRhaW5lckVsZW1lbnQgPSBudWxsLFxuICAgICAgICAgICAgaXRlbXNFbGVtZW50cyA9IFtdLFxuICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkgPSBbXSxcbiAgICAgICAgICAgIGluZGV4VG9EaXNwbGF5ID0gMCxcbiAgICAgICAgICAgIGRlbHRhWCA9IDAsXG4gICAgICAgICAgICBkZWx0YVNjYWxlID0gMC4wLFxuICAgICAgICAgICAgbGFzdEl0ZW1zID0gW10sXG4gICAgICAgICAgICBpbnRlcnZhbCxcbiAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICBydGxUbXA7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgY29udGFpbmVyIHN0eWxlICh1bClcbiAgICAgICAgICogQHBhcmFtIHtbalFsaXRlRWxlbWVudF19IGNvbnRhaW5lckVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGFkZFN0eWxlT25Db250YWluZXIoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb250YWluZXJFbGVtZW50ID0gY29udGFpbmVyO1xuICAgICAgICAgICAgY29udGFpbmVyRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICBjb250YWluZXJFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgICAgICBjb250YWluZXJFbGVtZW50LnN0eWxlLm1hcmdpbiA9ICcwIGF1dG8nO1xuICAgICAgICAgICAgY29udGFpbmVyRWxlbWVudC5zdHlsZS5wYWRkaW5nID0gJzAnO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNlbGVjdCB0aGUgaXRlbXMgdG8gYmUgZGlzcGxheWVkIGluIGZ1bmN0aW9uIG9mIHRoZSBpbmRleCBnaXZlblxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEl0ZW1zVG9EaXNwbGF5KGluZGV4LCBuYkl0ZW1zVG9EaXNwbGF5KXtcbiAgICAgICAgICAgIGlmKG5iSXRlbXNUb0Rpc3BsYXkgJSAyID09PSAwKSB7IC8vbmIgZWxlbWVudCB0byBkaXNwbGF5IGhhdmUgdG8gYmUgZXZlblxuICAgICAgICAgICAgICAgIG5iSXRlbXNUb0Rpc3BsYXktLTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGFzdEl0ZW1zID0gYW5ndWxhci5jb3B5KGl0ZW1zVG9EaXNwbGF5KTtcbiAgICAgICAgICAgIGl0ZW1zVG9EaXNwbGF5ID0gW107XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgaXRlbXMgdG8gYmUgZGlzcGxheWVkXG4gICAgICAgICAgICB2YXIgZW5kID0gKG5iSXRlbXNUb0Rpc3BsYXktMSkgLyAyO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gMCAtIGVuZDtcbiAgICAgICAgICAgIHZhciBuYkVsZW1zID0gaXRlbXNFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRtcEluZGV4ID0gaW5kZXggKyBpIDtcbiAgICAgICAgICAgICAgICBpZih0bXBJbmRleCA+PSAwICYmIHRtcEluZGV4IDwgbmJFbGVtcykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtc1RvRGlzcGxheS5wdXNoKGl0ZW1zRWxlbWVudHNbdG1wSW5kZXhdLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZih0bXBJbmRleCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNUb0Rpc3BsYXkucHVzaChpdGVtc0VsZW1lbnRzW3RtcEluZGV4ICsgbmJFbGVtc10uaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKHRtcEluZGV4ID49IGl0ZW1zRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zVG9EaXNwbGF5LnB1c2goaXRlbXNFbGVtZW50c1t0bXBJbmRleCAtIG5iRWxlbXNdLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpbml0aWFsaXplIHRoZSBpdGVtc1xuICAgICAgICAgKiBBZGQgaW5kZXggdG8gYWxsIGl0ZW1zLCBhbmQgYWRkIGxpc3RlbmVyIG9uQ2xpY2sgZXZlbnRcbiAgICAgICAgICogQHBhcmFtcyBzY29wZSwgbmVlZGVkIGZvciBjb21waWxlZCBodG1sIGFuZCBtYWtlIG5nLWNsaWNrIGVmZmVjdGl2ZVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gaW5pdEl0ZW1zKHNjb3BlKSB7XG4gICAgICAgICAgICAkLmVhY2goaXRlbXNFbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBpdGVtLmlkID0gXCJpdGVtLVwiICsgaW5kZXg7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgICAgICAkKGl0ZW0pLmF0dHIoXCJpbmRleFwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgJChpdGVtKS5jbGljayhmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkKHRoaXMpLmF0dHIoXCJpbmRleFwiKSB8IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKGludGVydmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbW92ZShpbmRleCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBseSBuZXcgc3R5bGVcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGluaXRJdGVtc1N0eWxlICgpIHtcblxuICAgICAgICAgICAgdmFyIGNlbnRlckluZGV4ID0gaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XS5pZCk7XG4gICAgICAgICAgICB2YXIgaXRlbURpc3BsYXllZCA9IGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldO1xuICAgICAgICAgICAgZGVsdGFYID0gKCQoY29udGFpbmVyRWxlbWVudCkud2lkdGgoKSAtICQoaXRlbURpc3BsYXllZCkud2lkdGgoKSkgLyAoaXRlbXNUb0Rpc3BsYXkubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBkZWx0YVNjYWxlID0gMC4yIC8gKChpdGVtc1RvRGlzcGxheS5sZW5ndGggLSAxKS8yKTtcblxuICAgICAgICAgICAgJC5lYWNoKGl0ZW1zRWxlbWVudHMsIGZ1bmN0aW9uKGluZGV4LCBpdGVtKSB7XG5cbiAgICAgICAgICAgICAgICAkKGl0ZW0pLm1vdXNlb3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKGludGVydmFsKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoaXRlbSkubW91c2VsZWF2ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuYXV0b1NsaWRlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFuZ3VsYXIuaXNEZWZpbmVkKGludGVydmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSBydW5JbnRlcnZhbCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPT09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICgkKGNvbnRhaW5lckVsZW1lbnQpLndpZHRoKCkvNCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLnRyYW5zZm9ybSA9IFwic2NhbGUobWluU2NhbGUpXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUluZGV4ID0gaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGl0ZW1JbmRleCAqIGRlbHRhWCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVo7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZShcIiArIChtaW5TY2FsZSArICgoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFTY2FsZSkpICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZSBpdGVtcyB0byB0aGUgbmV3IGluZGV4XG4gICAgICAgICAqIEZ1bmN0aW9uIGNhbGxlZCB3aXRoIG9uIGNsaWNrIGZ1bmN0aW9uXG4gICAgICAgICAqIEBwYXJhbSAge1t0eXBlXX0gbmV3SW5kZXggW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmUobmV3SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBkaWZmSW5kZXggPSBJR0Nhcm91c2VsU2VydmljZS5nZXRNaW5EaWZmKG5ld0luZGV4LCBpbmRleFRvRGlzcGxheSwgaXRlbXNFbGVtZW50cy5sZW5ndGgpLFxuICAgICAgICAgICAgICAgIG5iU3RlcCA9IE1hdGguYWJzKGRpZmZJbmRleCk7XG5cbiAgICAgICAgICAgIHRtcFJ0bCA9IGRpZmZJbmRleCA+IDA7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBvcHRpb25zLnRyYW5zaXRpb25EdXJhdGlvbiAgLSAobmJTdGVwICogMzApO1xuICAgICAgICAgICAgdmFyIHRpbWVvdXREZWxheSA9IDA7XG5cbiAgICAgICAgICAgIHZhciB0aW1lRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZih0bXBSdGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZVJUTChkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlTFRSKGR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmF1dG9TbGlkZSAmJiAoaW5kZXhUb0Rpc3BsYXkgPT09IG5ld0luZGV4KSApe1xuICAgICAgICAgICAgICAgICAgICBpZihhbmd1bGFyLmlzRGVmaW5lZChpbnRlcnZhbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvL1JlcGVhdCBtb3ZlIGVsZW1lbnQgaW4gZnVuY3Rpb24gb2YgbmJTdGVwXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwIDsgaSA8IG5iU3RlcCA7IGkrKykge1xuICAgICAgICAgICAgICAgICR0aW1lb3V0KHRpbWVGdW5jLCB0aW1lb3V0RGVsYXkpO1xuICAgICAgICAgICAgICAgIHRpbWVvdXREZWxheSA9IGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gb3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24gIC0gKChuYlN0ZXAgLSBpKSAqIDMwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgIC8qKlxuICAgICAgICAgKiBNb3ZlIGl0ZW1zIGZyb20gUmlnaHQgVG8gTGVmdCAoUlRMKVxuICAgICAgICAgKiBAcGFyYW0gIGludGVnZXIgZHVyYXRpb24gdGhlIGFuaW1hdGlvbiBkdXJhdGlvbiBpbiBtc1xuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gbW92ZVJUTChkdXJhdGlvbikge1xuXG4gICAgICAgICAgICBpbmRleFRvRGlzcGxheSA9IGluZGV4VG9EaXNwbGF5ICsgMSA+PSBpdGVtc0VsZW1lbnRzLmxlbmd0aCA/IDAgOiBpbmRleFRvRGlzcGxheSArIDE7XG5cbiAgICAgICAgICAgIHNlbGVjdEl0ZW1zVG9EaXNwbGF5KGluZGV4VG9EaXNwbGF5LCBvcHRpb25zLml0ZW1EaXNwbGF5ZWQpO1xuICAgICAgICAgICAgdmFyIGNlbnRlckluZGV4ID0gaXRlbXNUb0Rpc3BsYXkuaW5kZXhPZihpdGVtc0VsZW1lbnRzW2luZGV4VG9EaXNwbGF5XS5pZCk7XG4gICAgICAgICAgICB2YXIgaXRlbURpc3BsYXllZCA9IGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldO1xuXG4gICAgICAgICAgICAkLmVhY2goaXRlbXNFbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgIHZhciBsZWZ0UG9zID0gKGl0ZW1JbmRleCAqIGRlbHRhWCk7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1NjYWxlID0gKG1pblNjYWxlICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSk7XG4gICAgICAgICAgICAgICAgdmFyIHpJbmRleCA9IChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVo7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZWRaSW5kZXggPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogbmV3U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IHpJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpID4gLTEgJiYgbGFzdEl0ZW1zLmluZGV4T2YoaXRlbS5pZCkgPT09IC0xKSB7IC8vaXRlbSBlbnRyYW5jZVxuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgwLjIpXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSAgPSAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MgKyBcInB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGU6IG5ld1NjYWxlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddID0gekluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkWkluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPT09IC0xICYmIGxhc3RJdGVtcy5pbmRleE9mKGl0ZW0uaWQpID4gLTEpIHsgLy9pdGVtIGV4aXRhbmNlXG5cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtKS52ZWxvY2l0eSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoJChjb250YWluZXJFbGVtZW50KS53aWR0aCgpLzQpICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAwLjdcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGVsZW1lbnRzLCBjb21wbGV0ZSwgcmVtYWluaW5nLCBzdGFydCwgdHdlZW5WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbXBsZXRlICogMTAwID4gNTAgJiYgIWNoYW5nZWRaSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRaSW5kZXggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZSBpdGVtcyBmcm9tIExlZnQgVG8gUmlnaHQgKExUUilcbiAgICAgICAgICogQHBhcmFtICBpbnRlZ2VyIGR1cmF0aW9uIHRoZSBhbmltYXRpb24gZHVyYXRpb24gaW4gbXNcbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVMVFIoZHVyYXRpb24pIHtcblxuICAgICAgICAgICAgaW5kZXhUb0Rpc3BsYXkgPSAoKGluZGV4VG9EaXNwbGF5IC0gMSkgPCAwKSA/IGl0ZW1zRWxlbWVudHMubGVuZ3RoIC0gMSA6IGluZGV4VG9EaXNwbGF5IC0gMTtcblxuICAgICAgICAgICAgc2VsZWN0SXRlbXNUb0Rpc3BsYXkoaW5kZXhUb0Rpc3BsYXksIG9wdGlvbnMuaXRlbURpc3BsYXllZCk7XG4gICAgICAgICAgICB2YXIgY2VudGVySW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW1zRWxlbWVudHNbaW5kZXhUb0Rpc3BsYXldLmlkKTtcbiAgICAgICAgICAgIHZhciBpdGVtRGlzcGxheWVkID0gaXRlbXNFbGVtZW50c1tpbmRleFRvRGlzcGxheV07XG5cbiAgICAgICAgICAgICAkLmVhY2goaXRlbXNFbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIGl0ZW0pIHtcblxuICAgICAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpO1xuICAgICAgICAgICAgICAgIHZhciB6SW5kZXggPSAoY2VudGVySW5kZXggLSBNYXRoLmFicyhpdGVtSW5kZXggLSBjZW50ZXJJbmRleCkpICogZGVsdGFaO1xuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VkWkluZGV4ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGxlZnRQb3MgPSAoaXRlbUluZGV4ICogZGVsdGFYKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3U2NhbGUgPSAobWluU2NhbGUgKyAoKGNlbnRlckluZGV4IC0gTWF0aC5hYnMoaXRlbUluZGV4IC0gY2VudGVySW5kZXgpKSAqIGRlbHRhU2NhbGUpKTtcblxuICAgICAgICAgICAgICAgIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPiAtMSAmJiBsYXN0SXRlbXMuaW5kZXhPZihpdGVtLmlkKSA+IC0xKSB7IC8vIFdhcyBkaXNwbGF5ZWQgYmVmb3JlIGFuZCBzdGlsbCBkaXNwbGF5ZWRcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnRQb3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogbmV3U2NhbGUsXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IHpJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZFpJbmRleCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZihpdGVtc1RvRGlzcGxheS5pbmRleE9mKGl0ZW0uaWQpID4gLTEgJiYgbGFzdEl0ZW1zLmluZGV4T2YoaXRlbS5pZCkgPT09IC0xKSB7IC8vaXRlbSBlbnRyYW5jZVxuXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgwLjIpXCI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddICA9IC0gMTtcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoaXRlbUluZGV4ICogZGVsdGFYKSArIFwicHhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogKG1pblNjYWxlICsgKChjZW50ZXJJbmRleCAtIE1hdGguYWJzKGl0ZW1JbmRleCAtIGNlbnRlckluZGV4KSkgKiBkZWx0YVNjYWxlKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0se1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXYWl0IDEwMG1zIGJlZm9yZSBhbHRlcm5hdGluZyBiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uKGVsZW1lbnRzLCBjb21wbGV0ZSwgcmVtYWluaW5nLCBzdGFydCwgdHdlZW5WYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbXBsZXRlICogMTAwID4gNTAgJiYgIWNoYW5nZWRaSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddID0gekluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkWkluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmKGl0ZW1zVG9EaXNwbGF5LmluZGV4T2YoaXRlbS5pZCkgPT09IC0xICYmIGxhc3RJdGVtcy5pbmRleE9mKGl0ZW0uaWQpID4gLTEpIHsgLy9pdGVtIGV4aXRhbmNlXG5cbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZVsnei1pbmRleCddICA9IC0gMTtcblxuICAgICAgICAgICAgICAgICAgICAkKGl0ZW0pLnZlbG9jaXR5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAoJChjb250YWluZXJFbGVtZW50KS53aWR0aCgpLzQpICsgXCJweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2FpdCAxMDBtcyBiZWZvcmUgYWx0ZXJuYXRpbmcgYmFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbihlbGVtZW50cywgY29tcGxldGUsIHJlbWFpbmluZywgc3RhcnQsIHR3ZWVuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb21wbGV0ZSAqIDEwMCA+IDUwICYmICFjaGFuZ2VkWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbJ3otaW5kZXgnXSA9IC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkWkluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKGVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJ1biBpbnRlcnZhbCBpbiBvcmRlciB0byBhdXRvIHNsaWRlXG4gICAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiBydW5JbnRlcnZhbCgpe1xuICAgICAgICAgICAgcmV0dXJuICRpbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLnJ0bCkge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlUlRMKG9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVMVFIob3B0aW9ucy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG9wdGlvbnMuc2xpZGVEdXJhdGlvbiAqIDEwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkFcIixcbiAgICAgICAgICAgIHNjb3BlOiB0cnVlLFxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcbiAgICAgICAgICAgICAgICAvL2luaXRpYWxpemUgZGlyZWN0aXZlIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIGFkZFN0eWxlT25Db250YWluZXIoZWxlbWVudFswXSk7XG5cbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemUgY2Fyb3VzZWwgb3B0aW9uc1xuICAgICAgICAgICAgICAgIHZhciBydGwgPSBhbmd1bGFyLmlzRGVmaW5lZChhdHRyLnJ0bCkgPyAgYXR0ci5ydGwgPT09IFwidHJ1ZVwiIDogZGVmYXVsdE9wdGlvbnMucnRsO1xuICAgICAgICAgICAgICAgIHZhciBhdXRvID0gYW5ndWxhci5pc0RlZmluZWQoYXR0ci5hdXRvU2xpZGUpID8gIGF0dHIuYXV0b1NsaWRlID09PSBcInRydWVcIiA6IGRlZmF1bHRPcHRpb25zLmF1dG87XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgYXV0b1NsaWRlOiBhdXRvLFxuICAgICAgICAgICAgICAgICAgICBydGw6IHJ0bCxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBwYXJzZUludChhdHRyLmFuaW1hdGlvbkR1cmF0aW9uLCAxMCkgfHwgZGVmYXVsdE9wdGlvbnMudHJhbnNpdGlvbkR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBzbGlkZUR1cmF0aW9uOiBwYXJzZUludChhdHRyLnNsaWRlRHVyYXRpb24sIDEwKSB8fCBkZWZhdWx0T3B0aW9ucy5zbGlkZUR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpdGVtRGlzcGxheWVkOiBwYXJzZUludChhdHRyLml0ZW1EaXNwbGF5ZWQsIDEwKSB8fCBkZWZhdWx0T3B0aW9ucy5pdGVtRGlzcGxheWVkLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvL1RPRE8gPz8gUHV0IGEgc3RhcnRpbmcgaW5kZXggdmFsdWVcbiAgICAgICAgICAgICAgICAvL2luZGV4VG9EaXNwbGF5ID0gYXR0ci5zdGFydGluZ0luZGV4IHx8IDA7XG5cbiAgICAgICAgICAgICAgICAvL1RpbWVvdXQgbmVlZGVkIGluIG9yZGVyIHRvIGZvcmNlIGRpZ2VzdCBzbyBnZW5lcmF0ZSBuZy1yZXBlYXQgZWxlbWVudHNcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNFbGVtZW50cyA9ICQoZWxlbWVudCkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaW5pdEl0ZW1zKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0SXRlbXNUb0Rpc3BsYXkoaW5kZXhUb0Rpc3BsYXksIG9wdGlvbnMuaXRlbURpc3BsYXllZCk7XG4gICAgICAgICAgICAgICAgICAgIGluaXRJdGVtc1N0eWxlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9DYWxsIGluIG9yZGVyIHRvIGF2b2lkIFVJIGJ1ZyBvbiBmaXJzdCBjYWxsLlxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMCA7IGkgPCBpdGVtc0VsZW1lbnRzLmxlbmd0aCA7IGkgKysgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChtb3ZlUlRMKDApLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lckVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSdW4gYXV0byBzbGlkZSBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy5hdXRvU2xpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsID0gcnVuSW50ZXJ2YWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfV07IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IE1hdGhpZXUgQmVydGluIChpR3JhYWwpIG9uIDEwLzAyLzIwMTUuXG4gKiBWZXJzaW9uIDEuMC4wXG4gKi9cblxuLy9SZXF1aXJlIHVzZSBmb3IgYnJvd3NlcmlmeVxucmVxdWlyZSgnLi4vYm93ZXJfY29tcG9uZW50cy92ZWxvY2l0eS92ZWxvY2l0eS5qcycpO1xuXG5hbmd1bGFyLm1vZHVsZSgnaWctY2Fyb3VzZWwnLCBbXSlcblx0LmRpcmVjdGl2ZSgnaWdDYXJvdXNlbCcsIHJlcXVpcmUoJy4vZGlyZWN0aXZlcy9pZy1jYXJvdXNlbCcpKVxuXHQuc2VydmljZSgnSUdDYXJvdXNlbFNlcnZpY2UnLCByZXF1aXJlKCcuL3NlcnZpY2VzL0lHQ2Fyb3VzZWxTZXJ2aWNlJykpXG5cdC5ydW4oWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnTW9kdWxlIGlnLWNhcm91c2VsIHJ1bm5uaW5nJyk7XG4gICAgfV0pO1xuIiwiLyoqXG4gKiBTZXJ2aWNlIHRoYXQgd2lsbCBnaXZlIHRoZSBpbWFnZSB1cmwgY29ycmVzcG9uZGluZyB0byBhIGNhdGVnb3J5IGlkZW50aWZpZWQgYnkgaGlzIElEXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gW2Z1bmN0aW9uICgpIHtcblxuICAgIHZhciBJR0Nhcm91c2VsU2VydmljZSA9IGZ1bmN0aW9uKCkge307XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgdGhlIHN0eWxlIG9mIHRoZSBjYXRlZ29yeSBpdGVtIGlmIGl0J3Mgc2VsZWN0ZWQgYnkgc2V0dGluZyB0aGUgYXNzb2NpYXRlZCBiYWNrZ3JvdW5kIGRlZmluZSBpbiBjYXRlZ29yeS5jb2xvclxuICAgICAqIEBwYXJhbSBjYXRlZ29yeSwgdGhlIGNhdGVnb3J5IHRvIHN0eWxlXG4gICAgICogQHJldHVybnMgb2JqZWN0IGNvbnRhaW5pbmcgc3R5bGUgcHJvcGVydHlcbiAgICAgKi9cbiAgICBJR0Nhcm91c2VsU2VydmljZS5nZXRNaW5EaWZmID0gZnVuY3Rpb24gKG5ld0luZGV4LCBvbGRJbmRleCwgYXJyYXlMZW5ndGgpIHtcblxuICAgICAgICB2YXIgbGVmdEN1cnNvciA9IG9sZEluZGV4LFxuICAgICAgICAgICAgcmlnaHRDdXJzb3IgPSBvbGRJbmRleCxcbiAgICAgICAgICAgIGRpZmYgPSAwO1xuXG4gICAgICAgIGZvciAoZGlmZjsgbGVmdEN1cnNvciAhPT0gbmV3SW5kZXggJiYgcmlnaHRDdXJzb3IgIT09IG5ld0luZGV4OyBkaWZmKyspIHtcbiAgICAgICAgICAgIGxlZnRDdXJzb3IgPSAoKGxlZnRDdXJzb3IgLSAxKSA8IDApID8gYXJyYXlMZW5ndGggLSAxIDogbGVmdEN1cnNvciAtIDE7XG4gICAgICAgICAgICByaWdodEN1cnNvciA9ICgocmlnaHRDdXJzb3IgKyAxKSA+PSBhcnJheUxlbmd0aCkgPyAwIDogcmlnaHRDdXJzb3IgKyAxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobGVmdEN1cnNvciA9PT0gbmV3SW5kZXgpIHtcbiAgICAgICAgICAgIGRpZmYgPSBkaWZmICogLTE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlmZjtcbiAgICB9O1xuXG4gICAgcmV0dXJuIElHQ2Fyb3VzZWxTZXJ2aWNlO1xufV07Il19
