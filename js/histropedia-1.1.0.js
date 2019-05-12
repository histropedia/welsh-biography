/*!
 * ﻿HistropediaJS v1.1.0 | Histropedia Ltd. (c) 2019 | histropedia.com/histropediajs/index.html
 * Use of this software is subject to our End User Licence Agreement: http://histropedia.com/histropediajs/licence.html
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************!*\
  !*** ./js/Histropedia.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.Histropedia = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _Timeline = __webpack_require__(/*! ./Timeline */ 1);
	
	var _Article = __webpack_require__(/*! ./Article */ 16);
	
	var _Dmy = __webpack_require__(/*! ./Dmy */ 5);
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var constants = _interopRequireWildcard(_constants);
	
	var _Article2 = __webpack_require__(/*! ./Article.sorters */ 8);
	
	var articleSorters = _interopRequireWildcard(_Article2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var Histropedia = exports.Histropedia = _extends({
	   Timeline: _Timeline.Timeline,
	   Article: _Article.Article,
	   Dmy: _Dmy.Dmy
	}, articleSorters, constants);

/***/ }),
/* 1 */
/*!************************!*\
  !*** ./js/Timeline.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Timeline = undefined;
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	__webpack_require__(/*! ./Timeline.groups */ 11);
	
	__webpack_require__(/*! ./Timeline.dragging */ 12);
	
	__webpack_require__(/*! ./Timeline.data */ 15);
	
	__webpack_require__(/*! ./Timeline.articles */ 21);
	
	__webpack_require__(/*! ./Timeline.draw */ 22);
	
	__webpack_require__(/*! ./Timeline.stack */ 23);
	
	__webpack_require__(/*! ./Timeline.storage */ 24);
	
	__webpack_require__(/*! ./Timeline.wheel */ 25);
	
	__webpack_require__(/*! ./Timeline.anim */ 26);
	
	var Timeline = exports.Timeline = _Timeline.Timeline;

/***/ }),
/* 2 */
/*!*****************************!*\
  !*** ./js/Timeline.base.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	// todo: yuck
	
	
	exports.Timeline = Timeline;
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _TimescaleManager = __webpack_require__(/*! ./TimescaleManager */ 4);
	
	var _Dmy = __webpack_require__(/*! ./Dmy */ 5);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	var _Timeline = __webpack_require__(/*! ./Timeline.options */ 7);
	
	var _Article = __webpack_require__(/*! ./Article.data */ 9);
	
	function Timeline(container, inputOptions) {
	    var _this = this;
	
	    this.options = $.extend( /* deep */true, {}, _Timeline.DEFAULT_OPTIONS, inputOptions);
	
	    if ($(container).is("canvas")) {
	        this.canvas = $(container);
	        this.options.width = this.canvas.width();
	    } else {
	        this.canvas = $("<canvas width='" + this.options.width + "' height='" + this.options.height + "'/>");
	        $(container).append(this.canvas);
	    }
	
	    this.canvasContext = this.canvas[0].getContext("2d");
	
	    this.width = this.options.width;
	    this.top = this.options.height - this.options.verticalOffset;
	
	    // reposition window to enable dragging, works with From 
	    this.repositionWindow = 0;
	
	    // id
	    this.uniqueId = 'tl' + new Date().getTime(); // this can be removed? should we use reference instead here?
	    this.title = "My timeline";
	
	    // info
	    this.ownerId = undefined;
	    this.isInPublicDirectory = false;
	
	    // states
	    this.isDragging = false;
	    this.draggingArticle = null;
	    this.dragStartX = 0;
	    this.loadingHttpRequests = [];
	
	    this.articles = [];
	    this.articleImageLoadQueue = [];
	
	    this.lastAnimatingArticle = { //records the article that is "leading" the animation (the the one that will finish last)
	        id: null,
	        endTime: 0
	    };
	    this.topRow = 0;
	
	    // events
	    // todo: worth having different handlers for activated/onclick? confusing?
	    // todo: activated/doubleclicked on Article as well?
	    // todo: what do we want to pass to the handler functions? original event, and article?
	    // todo: Timeline.dragging is in charge of triggering click event
	    this.activatedHandlers = [];
	    this.articleDoubleClickedHandlers = [];
	    this.backgroundClickHandlers = [];
	
	    if (this.options.onArticleClick) {
	        this.addActivatedHandler(this.options.onArticleClick);
	    }
	
	    // dblclick
	    if (this.options.onArticleDoubleClick) {
	        this.addArticleDoubleClickedHandlers(this.options.onArticleDoubleClick);
	    }
	
	    if (this.options.onBackgroundClick) {
	        this.onBackgroundClick(this.options.onBackgroundClick);
	    }
	
	    if (this.options.enableCursor) {
	        this.canvas.mousemove(function (event) {
	            _this.canvas.css('cursor', _this.getCursor(event));
	        });
	    }
	
	    // init
	    var zoom = this.options.zoom;
	    this.timescaleManager = new _TimescaleManager.TimescaleManager(this, zoom);
	    this.timescaleManager.setUnitLevels();
	    this.timescaleManager.addZoomChangedHandler(this.zoomChanged, this);
	    this.timescaleManager.setZoom(zoom.initial);
	    this.timescaleManager.setStartDate(new _Dmy.Dmy(this.options.initialDate));
	    if (this.options.enableUserControl) {
	        this.enableZoomByWheel();
	        this.enableDragging();
	    }
	    this.groups = { level: -1, periods: [] };
	
	    // setup article image load queue
	    setInterval(this.loadArticleImageFromQueue.bind(this), 5);
	    this.defaultRedraw();
	}
	
	Timeline.prototype.setTitle = function (title) {
	    this.title = title;
	    this.save();
	    PubSub.publish(EVENTS.TIMELINE_TITLE_CHANGED, title);
	};
	
	Timeline.prototype.setIsInPublicDirectory = function (isInPublicDirectory) {
	    this.isInPublicDirectory = isInPublicDirectory;
	    this.save();
	    PubSub.publish(EVENTS.TIMELINE_IS_IN_PUBLIC_DIRECTORY_CHANGED, isInPublicDirectory);
	};
	
	// functions
	Timeline.prototype.getWidth = function () {
	    return this.canvas[0].width;
	};
	
	Timeline.prototype.isInVicinity = function (event, vicinityParameters, relativePositions) {
	    var pos = relativePositions || this.getRelativePosition(event);
	
	    return pos.top > this.top - vicinityParameters.up && pos.top < this.top + vicinityParameters.down;
	};
	
	Timeline.prototype.getPixel = function (dmy, drawCycleContext) {
	
	    var cache;
	    var key = dmy.toKeyString();
	
	    if (drawCycleContext) {
	        cache = drawCycleContext.tokens;
	
	        if (cache.hasOwnProperty(key)) return cache[key];
	    } else {
	        // TODO: remvoe when made sure it is always being called by a proper cache argument
	        cache = {};
	    }
	
	    var width = this.getWidth();
	    var x = this.repositionWindow;
	    var token = this.timescaleManager.startToken;
	
	    // go one token back from startToken if necessary (based on repositionWindow)
	    while (x > 0) {
	        token = this.timescaleManager.getPrevious(token);
	        x -= token.length;
	    }
	
	    if (this.timescaleManager.unit > _constants.ZOOM_DAY) {
	
	        var proximateDays = (dmy.year - token.value.year) * 365.2422 + (dmy.month - token.value.month) * 30.44 + (dmy.day - token.value.day);
	
	        if (this.timescaleManager.unit == _constants.ZOOM_MONTH) {
	            return cache[key] = proximateDays * this.timescaleManager.unitSizeInPixels / 30.44 + x;
	        } else {
	            var unitLengthInYears = this.timescaleManager.unitLengthInYears;
	            return cache[key] = proximateDays * this.timescaleManager.unitSizeInPixels / (365.2422 * unitLengthInYears) + x;
	        }
	    }
	
	    // ZOOM_DAY:
	    var exactDays = token.value.getDaysTo(dmy); //find exact difference in days
	    return cache[key] = exactDays * this.timescaleManager.unitSizeInPixels + x; //then use to calculate pixel	
	};
	
	// events
	
	Timeline.prototype.addActivatedHandler = function (handler) {
	    this.activatedHandlers.push(handler);
	};
	
	Timeline.prototype.activated = function (article) {
	    if (article) {
	        for (var i = 0; i < this.activatedHandlers.length; i++) {
	            this.activatedHandlers[i].call(this, article);
	        }
	    }
	};
	
	// positioning
	Timeline.prototype.getRelativePosition = function (event) {
	    var screenPos = this.canvas.offset();
	    var pagePos = (0, _utils.extractPagePosition)(event);
	
	    return { left: pagePos.left - screenPos.left, top: pagePos.top - screenPos.top };
	};
	
	Timeline.prototype.getRelativeCoordinates = function (coords) {
	
	    var screenPos = this.canvas.offset();
	    return { x: coords.x - screenPos.left, y: coords.y - screenPos.top };
	};
	
	Timeline.prototype.getPagePosition = function (pos) {
	    var screenPos = this.canvas.parent().position();
	    return { left: pos.left + screenPos.left, top: pos.top + screenPos.top };
	};
	
	// cursor
	Timeline.prototype.getCursor = function (event) {
	    if (this.isDragging) return "e-resize";
	    var pos = this.getRelativePosition(event);
	    if (this.draggingArticle) return this.draggingArticle.getCursor(pos);
	
	    if (!this.options.disableBranding && (this._isInsideHistropediaJSLink(pos) || this._isInsideTermsLink(pos))) return 'pointer';
	
	    for (var i = this.articles.length - 1; i >= 0; i--) {
	        var article = this.articles[i];
	        if (article.isInside(pos)) {
	            var cursor = article.getCursor(pos);
	            if (cursor !== null) return cursor;
	        }
	    }
	
	    return 'default';
	};
	
	// double click
	Timeline.prototype.doubleClicked = function (event) {
	    var pos = this.getRelativePosition(event);
	    for (var i = this.articles.length - 1; i >= 0; i--) {
	        var article = this.articles[i];
	        if (article.isInside(pos)) {
	            this.articleDoubleClicked(article);
	            return;
	        }
	    }
	};
	
	Timeline.prototype.addArticleDoubleClickedHandlers = function (handler) {
	    this.articleDoubleClickedHandlers.push(handler);
	};
	
	Timeline.prototype.articleDoubleClicked = function (article) {
	    for (var i = 0; i < this.articleDoubleClickedHandlers.length; i++) {
	        this.articleDoubleClickedHandlers[i].call(this, article);
	    }
	};
	
	Timeline.prototype.onBackgroundClick = function (handler) {
	    this.backgroundClickHandlers.push(handler);
	};
	
	Timeline.prototype.backgroundClicked = function (event, isDoubleClick) {
	    for (var i = 0; i < this.backgroundClickHandlers.length; i++) {
	        this.backgroundClickHandlers[i].call(this, event, isDoubleClick);
	    }
	};
	
	Timeline.prototype.zoomChanged = function () {
	    var oldRegionId;
	    if (this.currentDensitySetting) oldRegionId = this.currentDensitySetting.region;
	
	    this.updateCurrentDensitySetting();
	
	    if (oldRegionId !== this.currentDensitySetting.region) {
	        this.updateArticlesGroupIndex();
	    }
	};
	
	Timeline.prototype.updateCurrentDensitySetting = function () {
	    for (var i = 0; i < _constants.DENSITY_SETTINGS.length; i++) {
	        var densitySetting = _constants.DENSITY_SETTINGS[i];
	
	        if (this.timescaleManager.zoom >= densitySetting.zoom.from && this.timescaleManager.zoom < densitySetting.zoom.to) {
	
	            this.currentDensitySetting = densitySetting;
	            break;
	        }
	    }
	};
	
	Timeline.prototype.calculateEndToken = function () {
	    var width = this.getWidth();
	    var x = this.repositionWindow;
	    var startToken = this.timescaleManager.startToken;
	    var token = startToken;
	    var endToken;
	
	    do {
	        endToken = token;
	        token = this.timescaleManager.getNext(token);
	        x += token.length;
	    } while (x < width);
	
	    return endToken;
	};
	
	Timeline.prototype.getDensityPick = function () {
	    // density is currently controlled through the same user control as event spacing for #27164 @ 27/01/2015 
	    switch (this.options.article.density) {
	        case _constants.DENSITY_LOW:
	            return this.currentDensitySetting.low;
	        case _constants.DENSITY_MEDIUM:
	            return this.currentDensitySetting.medium;
	        case _constants.DENSITY_HIGH:
	            return this.currentDensitySetting.high;
	        case _constants.DENSITY_ALL:
	            return this.currentDensitySetting.all;
	    }
	
	    console.error('Unknown density selector:' + val);
	};
	
	Timeline.prototype.invoke = function (method, callbacks, params) {
	    if (callbacks.hasOwnProperty(method)) {
	        callbacks[method].call(this, params);
	    }
	};
	
	Timeline.prototype.forLoadedArticles = function (f) {
	    for (var i = 0; i < this.articles.length; i++) {
	        var article = this.articles[i];
	        if (article.isDataLoaded) {
	            f.call(this, article);
	        }
	    }
	};
	
	Timeline.prototype.forVisibleArticles = function (f) {
	    for (var i = 0; i < this.articles.length; i++) {
	        var article = this.articles[i];
	        if (article.isDataLoaded && article.isVisible) {
	            f.call(this, article);
	        }
	    }
	};
	
	Timeline.prototype.forInRangeArticles = function (f) {
	    for (var i = 0; i < this.articles.length; i++) {
	        var article = this.articles[i];
	        if (article.isDataLoaded && (article.isInRange || article.isFading)) {
	            // "|| article.isFading" is a bit of a hack to solve issues with articles that are fading OUT at the edges of the screen stopping moving with the timeline. They are not in range, but do need repositioning to finish scrolling off the screen. This will be solved properly automatically once we are only drawing event cards that are in view.
	            f.call(this, article);
	        }
	    }
	};
	
	//add enqueueImageLoad
	Timeline.prototype.enqueueImageLoad = function (article) {
	    this.articleImageLoadQueue.push(article);
	};
	
	Timeline.prototype.loadArticleImageFromQueue = function () {
	
	    var article = this.articleImageLoadQueue.pop();
	
	    if (article) {
	
	        article.image = new Image();
	
	        article.image.onload = function () {
	            article.adjustHeightFromLoadedImage();
	            article.imageLoaded = true;
	            article.owner.redraw();
	        };
	
	        article.image.src = (0, _Article.getPropertyFromData)(article.data, "imageUrl");
	    }
	};
	
	Timeline.prototype.setStartDate = function (dmy, pixelOffset) {
	    //pixelOffset lets you adjust the screen position of the specifed start date
	    var pixelOffset = pixelOffset || 0; //default date position is left edge of canvas
	    if (typeof dmy === "string") {
	        dmy = _Dmy.Dmy.fromString(dmy);
	    }
	    this.repositionWindow = 0;
	    this.timescaleManager.setStartDate(dmy);
	    if (pixelOffset) this.updateFromByPixels(-pixelOffset);
	    this.defaultRedraw();
	};
	
	Timeline.prototype.setCentreDate = function (dmy, pixelOffset) {
	    this.setStartDate(dmy, this.options.width / 2 + pixelOffset);
	};
	
	Timeline.prototype.setOption = function (option, value) {
	    if (typeof option === "string") {
	        var selectedOption = (0, _Article.getPropertyFromData)(this.options, option);
	        if (typeof value === 'undefined') {
	            //return current value if none given
	            return selectedOption;
	        }
	        //build object so that check for special cases (e.g. when width changes) is same for string or object input 
	        option = (0, _utils.buildObjectFromPath)(option, value);
	    }
	
	    $.extend( /* deep */true, this.options, option);
	
	    //has width or height changed?
	    if (option.width || option.height) {
	        this.setSize(this.options.width, this.options.height);
	    }
	
	    //has verticalOffset has changed?
	    if (typeof option.verticalOffset === 'number') {
	        //need to allow 0 as possible value
	        this.top = this.options.height - this.options.verticalOffset;
	    }
	
	    //has default article style changed?
	    if (option.article && (_typeof(option.article.defaultStyle) === 'object' || _typeof(option.article.defaultActiveStyle) === 'object')) this.forLoadedArticles(function (article) {
	        article.style = $.extend(true, {}, this.options.article.defaultStyle, article.data.style || {});
	        article.activeStyle = $.extend(true, {}, article.style, this.options.article.defaultActiveStyle, article.data.activeStyle || {});
	        article.titleLines = undefined; //todo: only need to update titleLines if header text margin,font or no. of lines changes
	        article.summarisedSubtitle = undefined; //todo: onnly update if subheader text margin or font changes
	    });
	
	    this.defaultRedraw();
	};
	
	Timeline.prototype.setSize = function (width, height) {
	    this.canvas[0].height = this.options.width = height;
	    this.canvas[0].width = this.width = this.options.width = width;
	    this.top = height - this.options.verticalOffset;
	
	    this.defaultRedraw();
	};
	
	Timeline.prototype.generateDensitySettings = function () {
	    //Generate density settings from current zoom ratio. Run at startup if we allow zoom ratio change
	    var zoomRatio = this.timescaleManager.zoomOptions.ratio;
	    console.log(this.timescaleManager);
	    var newSettings = [];
	
	    var halfZoom = Math.round(Math.log(0.5) / Math.log(zoomRatio) * 100) / 100; //the difference in zoom level that will HALF the unit size (i.e. halfZoom can be added to any zoom level to half the size of any time period )
	
	    for (var i = 0; i < 19; i++) {
	        // for 19 regions, can be changed (or could easily be made to stop automatically when zoom maximum has been reached)
	
	        var nextRegion = {
	            region: i + 1,
	            zoom: { from: i * halfZoom, to: (i + 1) * halfZoom },
	            low: 1,
	            medium: 2,
	            high: 3,
	            all: 25,
	            step: { months: 0, days: Math.pow(2, i) }
	        };
	
	        newSettings.push(nextRegion);
	    }
	
	    console.log(JSON.stringify(newSettings));
	};

/***/ }),
/* 3 */
/*!*************************!*\
  !*** ./js/constants.js ***!
  \*************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// timeline marker types
	var MINOR_MARKER = exports.MINOR_MARKER = 0;
	var MAJOR_MARKER = exports.MAJOR_MARKER = 1;
	var ERA_MARKER = exports.ERA_MARKER = 2;
	
	// zoom levels
	var ZOOM_DAY = exports.ZOOM_DAY = 0;
	var ZOOM_MONTH = exports.ZOOM_MONTH = 1;
	var ZOOM_YEAR = exports.ZOOM_YEAR = 2;
	var ZOOM_DECADE = exports.ZOOM_DECADE = 3;
	var ZOOM_CENTURY = exports.ZOOM_CENTURY = 4;
	var ZOOM_MILLENNIUM = exports.ZOOM_MILLENNIUM = 5;
	var ZOOM_10_THOUSAND_YEARS = exports.ZOOM_10_THOUSAND_YEARS = 6;
	var ZOOM_100_THOUSAND_YEARS = exports.ZOOM_100_THOUSAND_YEARS = 7;
	var ZOOM_MILLION_YEARS = exports.ZOOM_MILLION_YEARS = 8;
	var ZOOM_10_MILLION_YEARS = exports.ZOOM_10_MILLION_YEARS = 9;
	var ZOOM_100_MILLION_YEARS = exports.ZOOM_100_MILLION_YEARS = 10;
	var ZOOM_BILLION_YEARS = exports.ZOOM_BILLION_YEARS = 11;
	
	// precision levels
	var PRECISION_DAY = exports.PRECISION_DAY = 11;
	var PRECISION_MONTH = exports.PRECISION_MONTH = 10;
	var PRECISION_YEAR = exports.PRECISION_YEAR = 9;
	var PRECISION_DECADE = exports.PRECISION_DECADE = 8;
	var PRECISION_CENTURY = exports.PRECISION_CENTURY = 7;
	var PRECISION_MILLENNIUM = exports.PRECISION_MILLENNIUM = 6;
	var PRECISION_MILLION_YEARS = exports.PRECISION_MILLION_YEARS = 3;
	var PRECISION_BILLION_YEARS = exports.PRECISION_BILLION_YEARS = 1;
	
	// year multiple prefixes
	var YEAR_PREFIXES = exports.YEAR_PREFIXES = { //uses power of ten of prefix as key to access it's settings
		3: { label: " ka", value: 1000 },
		6: { label: " Ma", value: 1000000 },
		9: { label: " Ga", value: 1000000000 }
	
		// density
	};var DENSITY_LOW = exports.DENSITY_LOW = 1;
	var DENSITY_MEDIUM = exports.DENSITY_MEDIUM = 2;
	var DENSITY_HIGH = exports.DENSITY_HIGH = 3;
	var DENSITY_ALL = exports.DENSITY_ALL = 0;
	
	// auto stacking range
	var RANGE_ALL = exports.RANGE_ALL = 0;
	var RANGE_SCREEN = exports.RANGE_SCREEN = 1;
	
	//todo: decide if these should be configurable
	var DENSITY_SETTINGS = exports.DENSITY_SETTINGS = [{ "region": 1, "zoom": { "from": 0, "to": 3.11 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 1 } }, { "region": 2, "zoom": { "from": 3.11, "to": 6.22 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 2 } }, { "region": 3, "zoom": { "from": 6.22, "to": 9.33 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 4 } }, { "region": 4, "zoom": { "from": 9.33, "to": 12.44 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 8 } }, { "region": 5, "zoom": { "from": 12.44, "to": 15.549999999999999 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 16 } }, { "region": 6, "zoom": { "from": 15.549999999999999, "to": 18.66 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 32 } }, { "region": 7, "zoom": { "from": 18.66, "to": 21.77 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 64 } }, { "region": 8, "zoom": { "from": 21.77, "to": 24.88 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 128 } }, { "region": 9, "zoom": { "from": 24.88, "to": 27.99 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 256 } }, { "region": 10, "zoom": { "from": 27.99, "to": 31.099999999999998 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 512 } }, { "region": 11, "zoom": { "from": 31.099999999999998, "to": 34.21 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 1024 } }, { "region": 12, "zoom": { "from": 34.21, "to": 37.32 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 2048 } }, { "region": 13, "zoom": { "from": 37.32, "to": 40.43 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 4096 } }, { "region": 14, "zoom": { "from": 40.43, "to": 43.54 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 8192 } }, { "region": 15, "zoom": { "from": 43.54, "to": 46.65 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 16384 } }, { "region": 16, "zoom": { "from": 46.65, "to": 49.76 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 32768 } }, { "region": 17, "zoom": { "from": 49.76, "to": 52.87 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 65536 } }, { "region": 18, "zoom": { "from": 52.87, "to": 55.98 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 131072 } }, { "region": 19, "zoom": { "from": 55.98, "to": 59.089999999999996 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 262144 } }, { "region": 20, "zoom": { "from": 59.089999999999996, "to": 62.199999999999996 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 524288 } }, { "region": 21, "zoom": { "from": 62.199999999999996, "to": 65.31 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 1048576 } }, { "region": 22, "zoom": { "from": 65.31, "to": 68.42 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 2097152 } }, { "region": 23, "zoom": { "from": 68.42, "to": 71.53 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 4194304 } }, { "region": 24, "zoom": { "from": 71.53, "to": 74.64 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 8388608 } }, { "region": 25, "zoom": { "from": 74.64, "to": 77.75 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 16777216 } }, { "region": 26, "zoom": { "from": 77.75, "to": 80.86 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 33554432 } }, { "region": 27, "zoom": { "from": 80.86, "to": 83.97 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 67108864 } }, { "region": 28, "zoom": { "from": 83.97, "to": 87.08 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 134217728 } }, { "region": 29, "zoom": { "from": 87.08, "to": 90.19 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 268435456 } }, { "region": 30, "zoom": { "from": 90.19, "to": 93.3 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 536870912 } }, { "region": 31, "zoom": { "from": 93.3, "to": 96.41 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 1073741824 } }, { "region": 32, "zoom": { "from": 96.41, "to": 99.52 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 2147483648 } }, { "region": 33, "zoom": { "from": 99.52, "to": 102.63 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 4294967296 } }, { "region": 34, "zoom": { "from": 102.63, "to": 105.74 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 8589934592 } }, { "region": 35, "zoom": { "from": 105.74, "to": 108.85 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 17179869184 } }, { "region": 36, "zoom": { "from": 108.85, "to": 111.96 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 34359738368 } }, { "region": 37, "zoom": { "from": 111.96, "to": 115.07 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 68719476736 } }, { "region": 38, "zoom": { "from": 115.07, "to": 118.17999999999999 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 137438953472 } }, { "region": 39, "zoom": { "from": 118.17999999999999, "to": 121.28999999999999 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 274877906944 } }, { "region": 40, "zoom": { "from": 121.28999999999999, "to": 124.39999999999999 }, "low": 1, "medium": 2, "high": 3, "all": 25, "step": { "months": 0, "days": 549755813888 } }];

/***/ }),
/* 4 */
/*!********************************!*\
  !*** ./js/TimescaleManager.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TimescaleManager = undefined;
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _Dmy = __webpack_require__(/*! ./Dmy */ 5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// different periods of time have different scales. Bing bang until Jurassic cannot be displayed year by year. This module takes care of these jumps in time scale
	var TimescaleManager = exports.TimescaleManager = function TimescaleManager(owner, zoomOptions) {
		_classCallCheck(this, TimescaleManager);
	
		this.owner = owner;
		this.zoomOptions = zoomOptions;
	
		//todo: hidden constants
		this.zoom = 0;
		this.startToken = null;
		this.unit = _constants.ZOOM_DAY;
		this.unitSizeInPixels = 100;
		this.zoomChangedHandlers = [];
		this.unitLengthInYears = 1;
		this.yearPrefix = { //updated by setCurrentYearPrefixes()
			minor: false,
			major: false
		};
		this.unitLevels = []; //populated by setUnitLevels() on startup
	};
	
	TimescaleManager.prototype.getUnitSizeInPixelsForZoom = function (zoom) {
		var zoomRatio = this.zoomOptions.ratio;
		var currentUnitSettings = this.unitLevels[this.unit];
		var zoomStart = currentUnitSettings.zoomStart; //lower boundary zoom level for the current unit
		var startUnitSize = currentUnitSettings.startUnitSize; //size of unit in pixels at zoomStart
		return startUnitSize * Math.pow(zoomRatio, zoom - zoomStart);
	};
	
	TimescaleManager.prototype.getChangePoint = function (unit) {
		var unitLevels = this.unitLevels;
		return this.unitLevels[this.unit].zoomStart;
	};
	
	TimescaleManager.prototype.getUnitFromZoom = function (zoom) {
		var unitLevels = this.unitLevels;
		for (var i = unitLevels.length - 1; i < unitLevels.length; i--) {
			if (zoom >= unitLevels[i].zoomStart) {
				return i;
			}
		}
	};
	
	TimescaleManager.prototype.getDateLabelFormatOptions = function (tokenType) {
		tokenType = tokenType === _constants.MAJOR_MARKER ? "major" : "minor";
		var dateLabelFormatOptions = this.owner.options.style.dateLabel[tokenType];
		return {
			thousandsSeparator: dateLabelFormatOptions.thousandsSeparator,
			bceText: dateLabelFormatOptions.bceText,
			yearPrefix: this.yearPrefix[tokenType]
		};
	};
	
	TimescaleManager.prototype.createYearToken = function (dmy) {
		var me = this;
		var token = {
			unit: this.unit,
			value: dmy,
			length: this.unitSizeInPixels
		};
	
		var year = dmy.year;
		var is1BC = year == 0;
		if (year <= 0) year = -year + 1;
		var unitLengthInYears = this.unitLengthInYears;
		var unitSettings = this.unitLevels[this.unit];
	
		if (year % (unitLengthInYears * 10) === 0 || is1BC) {
			token.label = dmy.format('YYYY', this.getDateLabelFormatOptions(_constants.MAJOR_MARKER));
			token.type = _constants.MAJOR_MARKER;
		} else {
			token.type = _constants.MINOR_MARKER;
			if (this.zoom < unitSettings.zoomHideMinorLabels) {
				token.label = dmy.format('YYYY', this.getDateLabelFormatOptions(_constants.MINOR_MARKER));
			}
		}
	
		return token;
	};
	
	TimescaleManager.prototype.createMonthToken = function (dmy) {
		var token = {
			unit: this.unit,
			value: dmy,
			length: this.unitSizeInPixels
		};
	
		var unitSettings = this.unitLevels[_constants.ZOOM_MONTH];
	
		if (dmy.month == 1) {
			token.label = dmy.format('YYYY', this.getDateLabelFormatOptions(_constants.MAJOR_MARKER));
			token.type = _constants.MAJOR_MARKER;
		} else {
			token.type = _constants.MINOR_MARKER;
			if (this.zoom < unitSettings.zoomHideMinorLabels) token.label = dmy.format('MMM');
		}
	
		return token;
	};
	
	TimescaleManager.prototype.createDayToken = function (dmy) {
		var token = {
			unit: this.unit,
			value: dmy,
			length: this.unitSizeInPixels
		};
		var unitSettings = this.unitLevels[_constants.ZOOM_DAY];
	
		if (dmy.day == 1) {
			token.label = dmy.format('MMM YYYY', this.getDateLabelFormatOptions(_constants.MAJOR_MARKER));
			token.type = _constants.MAJOR_MARKER;
		} else {
			token.type = _constants.MINOR_MARKER;
			if (this.zoom < unitSettings.zoomHideMinorLabels) token.label = dmy.format('D');
		}
	
		return token;
	};
	
	TimescaleManager.prototype.addZoomChangedHandler = function (handler, context) {
		this.zoomChangedHandlers.push({ callback: handler, context: context || this });
	};
	
	TimescaleManager.prototype.notifyZoomChanged = function () {
		for (var i = 0; i < this.zoomChangedHandlers.length; i++) {
			this.zoomChangedHandlers[i].callback.call(this.zoomChangedHandlers[i].context);
		}
	};
	
	TimescaleManager.prototype.setZoom = function (value) {
		this.zoom = parseFloat(value.toFixed(4));
		if (this.zoom < this.zoomOptions.minimum) this.zoom = this.zoomOptions.minimum;
		if (this.zoom > this.zoomOptions.maximum) this.zoom = this.zoomOptions.maximum;
		// find the unit base on the zoom
		this.unit = this.getUnitFromZoom(this.zoom);
		this.unitSizeInPixels = this.getUnitSizeInPixelsForZoom(this.zoom);
	
		//zoom month or day settings
		var unitLengthInYears = 0; //remove?
	
		if (this.unit >= _constants.ZOOM_YEAR) {
			//zoom year or above settings
			var unitYearPowerOfTen = this.unit - _constants.ZOOM_YEAR;
			unitLengthInYears = Math.pow(10, unitYearPowerOfTen);
		}
	
		this.unitLengthInYears = unitLengthInYears;
		this.setCurrentYearPrefixes();
		this.notifyZoomChanged();
		return this.zoom;
	};
	
	TimescaleManager.prototype.setStartToken = function (token) {
		return this.startToken = token;
	};
	
	// from is Dmy
	// returns a value that indicate compensation necessary to reposition window. Caller can decide to use it or not.
	TimescaleManager.prototype.setStartDate = function (from) {
		var bcMove = 0;
		if (from.year < 0) bcMove = 1; // we want to make sure labels of BC dates are a multiplication of 10 or 1000 in Decade or Century
	
		switch (this.unit) {
			case _constants.ZOOM_DAY:
				this.startToken = this.createDayToken(from);
				return 0;
	
			case _constants.ZOOM_MONTH:
				this.startToken = this.createMonthToken(new _Dmy.Dmy(from.year, from.month, 1));
				var unitSizeForDays = this.unitSizeInPixels / 30.44;
				return unitSizeForDays * (this.startToken.value.day - from.day);
	
			case _constants.ZOOM_YEAR:
				this.startToken = this.createYearToken(new _Dmy.Dmy(from.year, 1, 1));
				var unitSizeForDays = this.unitSizeInPixels / 365.2422;
				return unitSizeForDays * ((this.startToken.value.month - from.month) * 30.44 + (this.startToken.value.day - from.day));
	
			default:
				//zoom decade and above
				var tokenLengthInYears = this.unitLengthInYears;
				this.startToken = this.createYearToken(new _Dmy.Dmy(Math.floor(from.year / tokenLengthInYears) * tokenLengthInYears + bcMove, 1, 1));
				var unitSizeForDays = this.unitSizeInPixels / (365.2422 * tokenLengthInYears);
				return unitSizeForDays * ((this.startToken.value.year - from.year) * 365.2422 + (this.startToken.value.month - from.month) * 30.44 + (this.startToken.value.day - from.day));
		}
	};
	
	// Can be used in cases which a direct reference needed to be changed and we want that to not affect TimescaleManager's startToken
	// In other cases direct accesss to the startToken for performance
	TimescaleManager.prototype.getStartTokenCloned = function () {
		switch (this.startToken.unit) {
			case _constants.ZOOM_DAY:
				return this.createDayToken(this.startToken.value);
			case _constants.ZOOM_MONTH:
				return this.createMonthToken(this.startToken.value);
			default:
				//zoom year and above
				return this.createYearToken(this.startToken.value);
		}
	};
	
	TimescaleManager.prototype.getNext = function (token) {
	
		switch (token.unit) {
			case _constants.ZOOM_DAY:
				return this.createDayToken(token.value.getNextDay());
			case _constants.ZOOM_MONTH:
				return this.createMonthToken(token.value.getNextMonth());
			case _constants.ZOOM_YEAR:
				return this.createYearToken(token.value.addYears(+1));
			default:
				//zoom decade and above
				// in decades jump from 10BC (-9) to 1BC (0)
				// in century jump from 100 BC (-99) to 1BC (0) etc...
				var unitLengthInYears = this.unitLengthInYears;
				return this.createYearToken(token.value.addYears(token.value.year == -(unitLengthInYears - 1) ? unitLengthInYears - 1 : unitLengthInYears));
		}
	
		throw 'Unknown unit:' + token.unit;
	};
	
	TimescaleManager.prototype.getPrevious = function (token) {
	
		switch (token.unit) {
			case _constants.ZOOM_DAY:
				return this.createDayToken(token.value.getPreviousDay());
			case _constants.ZOOM_MONTH:
				return this.createMonthToken(token.value.getPreviousMonth());
			case _constants.ZOOM_YEAR:
				return this.createYearToken(token.value.addYears(-1));
			default:
				//zoom decade and above
				// in decades jump from 1BC (0) to 10BC (-9)
				// in century jump from 1BC (0) to 100BC (-99) etc...
				var unitLengthInYears = this.unitLengthInYears;
				return this.createYearToken(token.value.addYears(token.value.year == 0 ? 1 - unitLengthInYears : -unitLengthInYears));
		}
	};
	
	TimescaleManager.prototype.getPreviousNth = function (token, n) {
		for (var i = 0; i < n; i++) {
			token = this.getPrevious(token);
		}
		return token;
	};
	
	TimescaleManager.prototype.zoomUnitToString = function (unit) {
		switch (unit) {
			case _constants.ZOOM_DAY:
				return 'day';
			case _constants.ZOOM_MONTH:
				return 'month';
			case _constants.ZOOM_YEAR:
				return 'year';
			case _constants.ZOOM_DECADE:
				return 'decade';
			case _constants.ZOOM_CENTURY:
				return 'century';
			case _constants.ZOOM_MILLENNIUM:
				return 'millennium';
			case _constants.ZOOM_10_THOUSAND_YEARS:
				return '10 thousand years';
			case _constants.ZOOM_100_THOUSAND_YEARS:
				return '100 thousand years';
			case _constants.ZOOM_MILLION_YEARS:
				return 'million years';
			case _constants.ZOOM_10_MILLION_YEARS:
				return '10 million years';
			case _constants.ZOOM_100_MILLION_YEARS:
				return '100 million years';
			case _constants.ZOOM_BILLION_YEARS:
				return 'billion years';
			default:
				return 'unknown';
		}
	};
	
	//Calculate the zoom levels where unit changes, according to zoom ratio and minimum allowed unit size
	//Each change level is found by calculating the *change* in zoom level that will turn startUnitSize into minUnitSize
	//Then calculate next startUnitSize so that distance is perfectly matched on transition between units
	//e.g. no. of pixels for 12 months with 'month unit' = no. of pixels for 1 year with 'year unit') 
	//Note: only needs running on startup, or if zoom ratio or minUnitSize changes 
	TimescaleManager.prototype.setUnitLevels = function () {
		this.unitLevels = []; //reset
		var zoomRatio = this.zoomOptions.ratio;
		var minUnitSize = this.zoomOptions.unitSize.minimum; //unit size to switch to next unit
		var showMinorLabelUnitSize = this.zoomOptions.unitSize.showMinorLabels;
		var dayZoomStart = 0;
	
		//zoom change from zoomEnd -> zoomHideMinorLabels
		//This is the same for all unitLevels. It gives the amount to subtract from endZoom to get from minUnitSize (at endZoom) back to showMinorLabelUnitSize
		var hideLabelsZoomChangeFromEnd = this.getZoomChangeByDistance(showMinorLabelUnitSize, minUnitSize);
	
		//day change points
		var dayStartUnitSize = this.zoomOptions.unitSize.initial;
		var dayZoomSpan = this.getZoomChangeByDistance(dayStartUnitSize, minUnitSize);
		var dayZoomEnd = dayZoomStart + dayZoomSpan;
		var dayZoomHideMinorLabels = dayZoomEnd - hideLabelsZoomChangeFromEnd;
	
		var daySettings = {
			startUnitSize: dayStartUnitSize,
			zoomStart: dayZoomStart,
			zoomHideMinorLabels: dayZoomHideMinorLabels,
			zoomEnd: dayZoomEnd
		};
		this.unitLevels.push(daySettings);
	
		//month change points
		var monthStartUnitSize = minUnitSize * 31; //31 days (at minUnitSize) should match 1 month
		var monthZoomSpan = this.getZoomChangeByDistance(monthStartUnitSize, minUnitSize);
		var monthZoomEnd = dayZoomEnd + monthZoomSpan;
		var monthZoomHideMinorLabels = monthZoomEnd - hideLabelsZoomChangeFromEnd;
	
		this.unitLevels.push({
			startUnitSize: monthStartUnitSize,
			zoomStart: dayZoomEnd,
			zoomHideMinorLabels: monthZoomHideMinorLabels,
			zoomEnd: monthZoomEnd
		});
	
		//year change points
		var yearStartUnitSize = minUnitSize * 12; //12 months should match 1 year
		var yearZoomSpan = this.getZoomChangeByDistance(yearStartUnitSize, minUnitSize);
		var yearZoomEnd = monthZoomEnd + yearZoomSpan;
		var yearZoomHideMinorLabels = yearZoomEnd - hideLabelsZoomChangeFromEnd;
	
		this.unitLevels.push({
			startUnitSize: yearStartUnitSize,
			zoomStart: monthZoomEnd,
			zoomHideMinorLabels: yearZoomHideMinorLabels,
			zoomEnd: yearZoomEnd
		});
	
		//decade and above change points
		var startUnitSize;
		var zoomSpan;
		var zoomStart = yearZoomEnd;
		var zoomEnd;
		var zoomHideMinorLabels;
		var numberOfUnits = 8; //e.g. 2 would have zoom century as maximum (10^2 years)
		for (var i = 1; i <= numberOfUnits; i++) {
			//i represents powers of 10, so <=6 would go up to million year zoom units (x10^6)
			startUnitSize = minUnitSize * 10;
			zoomSpan = this.getZoomChangeByDistance(startUnitSize, minUnitSize);
			zoomEnd = zoomStart + zoomSpan;
			zoomHideMinorLabels = zoomEnd - hideLabelsZoomChangeFromEnd;
	
			this.unitLevels.push({
				startUnitSize: startUnitSize,
				zoomStart: zoomStart,
				zoomHideMinorLabels: zoomHideMinorLabels,
				zoomEnd: zoomEnd
			});
	
			zoomStart = zoomEnd;
	
			if (i === numberOfUnits) this.zoomOptions.maximum = Math.min(this.zoomOptions.maximum, zoomEnd);
		}
	};
	
	//get zoom level change that will turn startDistance into endDistance
	TimescaleManager.prototype.getZoomChangeByDistance = function (startDistance, endDistance) {
		var zoomRatio = this.zoomOptions.ratio;
		var zoom = Math.log(endDistance / startDistance) / Math.log(zoomRatio);
		return zoom;
	};
	
	//get changed distance after zoom level change
	TimescaleManager.prototype.scaleDistanceByZoomChange = function (startDistance, zoomChange) {
		var zoomRatio = this.zoomOptions.ratio;
		var endDistance = startDistance * Math.pow(zoomRatio, zoomChange);
		return endDistance;
	};
	
	TimescaleManager.prototype.setCurrentYearPrefixes = function () {
		var markerTypes = ["minor", "major"];
		if (this.unit < _constants.ZOOM_YEAR) {
			//only use yearPrefixes for ZOOM_YEAR and above
			for (var i = 0; i < markerTypes.length; i++) {
				this.yearPrefix[markerTypes[i]] = false;
			}
			return;
		}
		var dateLabelOptions = this.owner.options.style.dateLabel;
	
		var currentDivisions = {
			minor: this.unitLengthInYears,
			major: this.unitLengthInYears * 10
		};
	
		for (var i = 0; i < markerTypes.length; i++) {
			var markerType = markerTypes[i];
			var prefixOptions = Object.values(dateLabelOptions[markerType].yearPrefixes);
	
			//reset to no prefix, will remain like this if no prefix is found 
			this.yearPrefix[markerType] = false;
	
			prefixOptions.sort(function (a, b) {
				return b.minDivision - a.minDivision;
			});
	
			for (var j = 0; j < prefixOptions.length; j++) {
				var prefix = prefixOptions[j];
				if (prefix.minDivision <= currentDivisions[markerType]) {
					this.yearPrefix[markerType] = {
						label: prefix.label,
						value: prefix.value
					};
					break;
				}
			}
		}
	};

/***/ }),
/* 5 */
/*!*******************!*\
  !*** ./js/Dmy.js ***!
  \*******************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.Dmy = Dmy;
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	// Proleptic Gregorian calendar
	// Immutable
	// Months are from 1-12
	// Faster than normal Date() or Momentjs
	
	var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	// month 1-12
	function Dmy(year, month, day) {
	    if ((typeof year === 'undefined' ? 'undefined' : _typeof(year)) === "object") {
	        var options = year;
	        this.year = options.year;
	        this.month = options.month;
	        this.day = getCorrectDay(options.year, options.month, options.day);
	    } else {
	        this.year = year;
	        this.month = month;
	        this.day = getCorrectDay(year, month, day);
	    }
	}
	
	function getCorrectDay(year, month, day) {
	    return day > 28 ? Math.min(day, daysInMonth(year, month)) : day;
	}
	
	function daysInMonth(year, month) {
	    if (month == 2) {
	        // is leap year?
	        if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) return 29;
	    }
	
	    return DAYS_IN_MONTH[month - 1];
	}
	
	function digitGroupedNumber(number, separator) {
	    //Separates thousands within the number e.g. 1,345,450 (must have < 3 decimal places)
	    number = number.toString();
	    separator = typeof separator === 'string' ? separator : ",";
	    if (number.length <= 4) return number;
	    return number.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	}
	
	//To find exact days between Dmy and 'other' (returns positive value when other date is after, negative for before)	
	Dmy.prototype.getDaysTo = function (other) {
	    return other.getDaysSinceYearZero() - this.getDaysSinceYearZero();
	};
	
	// Total number of leap years since 'year 0' 
	Dmy.prototype.getLeapYearsSinceYearZero = function () {
	    var year = this.year;
	
	    if (this.month < 3) year--;
	
	    return Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
	};
	
	Dmy.prototype.getDaysSinceYearZero = function () {
	    // Start by adding years and days
	    var year = this.year;
	    var days = year * 365 + this.day;
	
	    // Add days for all the months in the date. Leap year day accounted for afterwards
	    for (var i = 0; i < this.month - 1; i++) {
	        days += DAYS_IN_MONTH[i];
	    }
	
	    // Finally add number of leap years (as there's one extra day for each leap year)
	    days += this.getLeapYearsSinceYearZero();
	
	    return days;
	};
	
	Dmy.prototype.getDayOfYear = function () {
	    // lazy loading 'day of year' to increase speed
	    if (isUndefined(this._dayOfYear)) {
	        this._dayOfYear = 0;
	
	        for (var m = 1; m < this.month; m++) {
	            this._dayOfYear += daysInMonth(this.year, m);
	        }
	
	        this._dayOfYear += this.day;
	    }
	
	    return this._dayOfYear;
	};
	
	// returns a Dmy with correct Month and Day based on the dayOfYear
	Dmy.getByDayOfYear = function (year, dayOfYear) {
	
	    var dmy = new Dmy(year, 1, 1);
	
	    // Performance: instead of calling daysInMonth() only change daysInMonth variable when there is change in month/year
	    var dim = DAYS_IN_MONTH[0];
	
	    for (var i = 0; i < dayOfYear - 1; i++) {
	
	        // Performance: instead of calling getNextDay(), run a mutating version of it
	        dmy.day++;
	        if (dmy.day > dim) {
	            dmy.day = 1;
	            dmy.month++;
	
	            if (dmy.month > 12) {
	                dmy.month = 1;
	                dmy.year++;
	            }
	
	            dim = dmy.month == 2 ? daysInMonth(dmy.year, dmy.month) : DAYS_IN_MONTH[dmy.month - 1];
	        }
	    }
	
	    return dmy;
	};
	
	Dmy.prototype.getNextDay = function () {
	    return this.addDays(1);
	};
	
	// only works for positive values
	Dmy.prototype.addDays = function (amount) {
	    var day = this.day;
	    var month = this.month;
	    var year = this.year;
	
	    for (var i = 0; i < amount; i++) {
	        day++;
	        if (day > daysInMonth(year, month)) {
	            day = 1;
	            month++;
	            if (month > 12) {
	                month = 1;
	                year++;
	            }
	        }
	    }
	
	    return new Dmy(year, month, day);
	};
	
	// limited: assume day is always 1 and amount is positive
	Dmy.prototype.addMonths = function (amount) {
	    var month = this.month;
	    var year = this.year;
	
	    for (var i = 0; i < amount; i++) {
	        month++;
	        if (month > 12) {
	            month = 1;
	            year++;
	        }
	    }
	
	    return new Dmy(year, month, 1);
	};
	
	Dmy.prototype.getPreviousDay = function () {
	    var day = this.day;
	    var month = this.month;
	    var year = this.year;
	
	    day--;
	    if (day < 1) {
	        month--;
	        if (month < 1) {
	            month = 12;
	            year--;
	        }
	
	        day = daysInMonth(year, month);
	    }
	
	    return new Dmy(year, month, day);
	};
	
	// always jump to the first day of the month
	Dmy.prototype.getNextMonth = function () {
	    var month = this.month;
	    var year = this.year;
	    month++;
	    if (month > 12) {
	        month = 1;
	        year++;
	    }
	
	    return new Dmy(year, month, 1);
	};
	
	// always jump to the first day of the month
	Dmy.prototype.getPreviousMonth = function () {
	    var month = this.month;
	    var year = this.year;
	    month--;
	    if (month < 1) {
	        month = 12;
	        year--;
	    }
	
	    return new Dmy(year, month, 1);
	};
	
	// always jump to the first day of the Jan
	Dmy.prototype.addYears = function (amount) {
	    return new Dmy(this.year + amount, 1, 1);
	};
	
	// only supports YYYY, MMM, D
	Dmy.prototype.format = function (format, options) {
	    var options = options || {},
	        format = format || 'D MMM YYYY',
	        prefixSettings = options.yearPrefix,
	        bceText = typeof options.bceText === 'string' ? options.bceText : ' ʙᴄᴇ',
	        isBc = this.year <= 0,
	        is1Bc = this.year === 0,
	        thousandsSeparator = options.thousandsSeparator;
	
	    if (prefixSettings && !is1Bc) {
	        //don't use any prefix for 1BC
	        var prefixValue = prefixSettings.value || 1;
	        var prefixLabel = prefixSettings.label || "";
	        var formattedYear;
	
	        if (isBc) {
	            formattedYear = digitGroupedNumber((-this.year + 1) / prefixValue, thousandsSeparator) + prefixLabel + bceText; // ISO 8601: year 0 is called 1 BC
	        } else {
	            formattedYear = digitGroupedNumber(this.year / prefixValue, thousandsSeparator) + prefixLabel;
	        }
	
	        return formattedYear; //display year only when using a prefix
	    }
	    //else, no prefix settings
	    return format.replace('YYYY', isBc ? digitGroupedNumber(-this.year + 1, thousandsSeparator) + bceText : digitGroupedNumber(this.year, thousandsSeparator)). // ISO 8601: year 0 is called 1 BC
	    replace('D', this.day).replace('MMM', MONTH_NAMES[this.month - 1]);
	};
	
	Dmy.prototype.isSame = function (other) {
	    return other.year == this.year && other.month == this.month && other.day == this.day;
	};
	
	Dmy.prototype.toKeyString = function () {
	    return this.year + '|' + this.month + '|' + this.day;
	};
	
	Dmy.prototype.isAfter = function (other) {
	    if (this.year > other.year) return true;
	
	    if (this.year == other.year) {
	        if (this.month > other.month) return true;
	
	        if (this.month == other.month) {
	            return this.day > other.day;
	        }
	    }
	
	    return false;
	};
	
	Dmy.prototype.isBetween = function (from, to) {
	    return this.isAfter(from) && to.isAfter(this);
	};
	
	Dmy.prototype.compare = function (other) {
	    if (this.isSame(other)) return 0;
	    if (this.isAfter(other)) return +1;
	    return -1;
	};
	
	Dmy.prototype.asFloat = function () {
	    var m = this.month - 1;
	    var d = this.day - 1;
	    if (m == 0 && d == 0) return this.year;
	    return Math.round((this.year + (m * 31 + d) / 371) * 100) / 100;
	};
	
	Dmy.prototype.isInFuture = function () {
	    var date = new Date();
	    var today = new Dmy(date.getFullYear(), date.getMonth() + 1, date.getDate());
	    return this.isAfter(today);
	};
	
	Dmy.CreateAsStartOfPeriod = function (isoYear, month, day, precision) {
	    //century and millenium precision use historical conventions so start at different points to other precisions
	    var month = month || 1;
	    var day = day || 1;
	    var precision = precision || _constants.PRECISION_DAY;
	
	    if (precision === _constants.PRECISION_CENTURY) {
	        // 8th century AD (+800) = 701 AD to 800 AD
	        // 8th century BC (-800) = 800 BC to 701 BC
	        return isoYear < 0 ? new Dmy(isoYear + 1, 1, 1) : new Dmy(isoYear - 99, 1, 1);
	    }
	
	    if (precision === _constants.PRECISION_MILLENNIUM) {
	        // 8th millennium AD (+8000) = 7001 AD to 8000 AD
	        // 8th millennium BC (-8000) = 8000 BC to 7001 BC
	        return isoYear < 0 ? new Dmy(isoYear + 1, 1, 1) : new Dmy(isoYear - 999, 1, 1);
	    }
	
	    return new Dmy(isoYear, month, day);
	};
	
	Dmy.CreateAsEndOfPeriod = function (isoYear, month, day, precision) {
	    //FINISH!
	    //century and millenium precision use historical conventions so start at different points to other precisions
	    var month = month || 1;
	    var day = day || 1;
	    var precision = precision || _constants.PRECISION_DAY;
	
	    if (precision === _constants.PRECISION_DAY) return new Dmy(isoYear, month, day);
	
	    if (precision === _constants.PRECISION_MONTH) return new Dmy(isoYear, month, daysInMonth(isoYear, month));
	
	    if (precision === _constants.PRECISION_YEAR) return new Dmy(isoYear, 12, 31);
	
	    if (precision === _constants.PRECISION_DECADE) return new Dmy(isoYear + 9, 12, 31);
	
	    if (precision === _constants.PRECISION_CENTURY) {
	        // 8th century AD (+800) = 701 AD to 800 AD
	        // 8th century BC (-800) = 800 BC to 701 BC
	        return isoYear < 0 ? new Dmy(isoYear + 99 + 1, 12, 31) : new Dmy(isoYear, 12, 31);
	    }
	
	    if (precision == _constants.PRECISION_MILLENNIUM) {
	        // 8th millennium AD (+8000) = 7001 AD to 8000 AD
	        // 8th millennium BC (-8000) = 8000 BC to 7001 BC
	        return isoYear < 0 ? new Dmy(isoYear + 999 + 1, 12, 31) : new Dmy(isoYear, 12, 31);
	    }
	
	    if (precision == _constants.PRECISION_MILLION_YEARS) {
	        return new Dmy(isoYear + 999999, 12, 31);
	    }
	
	    if (precision == _constants.PRECISION_BILLION_YEARS) {
	        return new Dmy(isoYear + 999999999, 12, 31);
	    }
	    console.error('precision is not implemented');
	    return new Dmy(isoYear, month, day);
	};
	
	Dmy.now = function () {
	    var now = new Date();
	
	    return new Dmy({
	        year: now.getYear() + 1900,
	        month: now.getMonth() + 1,
	        day: now.getDate()
	    });
	};
	
	Dmy.fromString = function (dateString) {
	    //"dd-mm-yyyy" day and month default to 1 if not included
	    var dateParts = dateString.split("-");
	    var isBc = dateParts[0] === ""; //bc dates start with - leaving blank first element
	    if (isBc) {
	        dateParts.shift();
	        dateParts[0] = "-" + dateParts[0];
	    }
	    var year = parseInt(dateParts[0]);
	    var month = parseInt(dateParts[1]) || 1;
	    var day = parseInt(dateParts[2]) || 1;
	
	    if (isBc) year += 1;
	
	    return new Dmy({
	        year: parseInt(year),
	        month: parseInt(month),
	        day: parseInt(day)
	    });
	};

/***/ }),
/* 6 */
/*!*********************!*\
  !*** ./js/utils.js ***!
  \*********************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.preventDefault = preventDefault;
	exports.extractPinchCentre = extractPinchCentre;
	exports.getTouchDistance = getTouchDistance;
	exports.moveInArray = moveInArray;
	exports.getIndexById = getIndexById;
	exports.clearSelection = clearSelection;
	exports.extractPagePosition = extractPagePosition;
	exports.isUndefined = isUndefined;
	exports.bind = bind;
	exports.findMinIndex = findMinIndex;
	exports.isFunction = isFunction;
	exports.buildObjectFromPath = buildObjectFromPath;
	function preventDefault(e) {
	    if (!e) var e = window.event;
	
	    //e.cancelBubble is supported by IE - this will kill the bubbling process.
	    e.cancelBubble = true;
	    e.returnValue = false;
	
	    //e.stopPropagation works only in Firefox.
	    if (e.stopPropagation) {
	        e.stopPropagation();
	        e.preventDefault();
	    }
	
	    return false;
	}
	
	function extractPinchCentre(event) {
	    var touches = event.originalEvent.touches;
	    return {
	        x: (touches[0].pageX + touches[1].pageX) / 2,
	        y: (touches[0].pageY + touches[1].pageY) / 2
	    };
	}
	
	function getTouchDistance(event) {
	    var touches = event.originalEvent.touches;
	    var x1 = touches[0].pageX;
	    var y1 = touches[0].pageY;
	    var x2 = touches[1].pageX;
	    var y2 = touches[1].pageY;
	    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}
	
	var delay = function () {
	    var timer = 0;
	    return function (callback, ms) {
	        clearTimeout(timer);
	        timer = setTimeout(callback, ms);
	    };
	}();
	
	String.prototype.trim = function () {
	    return this.replace(/^\s+|\s+$/g, '');
	};
	
	String.prototype.hashCode = function () {
	    return this.split("").reduce(function (a, b) {
	        a = (a << 5) - a + b.charCodeAt(0);return a & a;
	    }, 0);
	};
	
	function moveInArray(arr, old_index, new_index) {
	    if (new_index >= arr.length) {
	        var k = new_index - arr.length;
	        while (k-- + 1) {
	            arr.push(undefined);
	        }
	    }
	    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	    return arr;
	};
	
	function getIndexById(arr, id) {
	    for (var i = 0; i < arr.length; i++) {
	        if (arr[i].id == id) return i;
	    }
	
	    return -1;
	}
	
	function clearSelection() {
	    if (document.selection) {
	        document.selection.empty();
	    } else if (window.getSelection) {
	        window.getSelection().removeAllRanges();
	    }
	}
	
	function enableSelectionInTextBoxes(target) {
	    if (typeof target.onselectstart != "undefined") {
	        target.onselectstart = function (event) {
	            event.cancelBubble = true;
	            return true;
	        };
	    }
	}
	
	function renderTemplate(template, item) {
	    var result = template;
	
	    for (var p in item) {
	        var re = new RegExp("\{\{" + p + "\}\}", "g");
	        result = result.replace(re, item[p]);
	    }
	
	    return result;
	}
	
	function getQueryString(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(window.location.search);
	    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	
	function formatNumber(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	String.prototype.endsWith = function (suffix) {
	    return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	
	function getMergeOrReplaceDecision(callback) {
	
	    var currentState = timeline.getCurrentState();
	    var hasArticles = currentState && currentState.a && currentState.a.length > 0;
	    if (!hasArticles || isEmbeddedMode) {
	        callback('replace');
	        return;
	    }
	
	    // display Replace, Merge or Cancel
	    var confirmation = $("<div>" + mergeOrReplaceMessage + "</div>");
	    confirmation.dialog({
	        position: { my: "center", at: "center", of: "#canvas-1" },
	        resizable: false,
	        width: 500,
	        modal: true,
	        buttons: [{
	            text: 'Cancel',
	            click: function click() {
	                $(this).dialog("close");callback('cancel');
	            }
	        }, {
	            text: 'Merge',
	            click: function click() {
	                $(this).dialog("close");callback('merge');
	            }
	        }, {
	            text: 'Replace',
	            click: function click() {
	                $(this).dialog("close");callback('replace');
	            }
	        }]
	    });
	}
	
	function MakeTimeoutCall(fn, data) {
	    // to minimise closure
	    setTimeout(function () {
	        fn.call(null, data);
	    }, 0);
	}
	
	function extractPagePosition(event) {
	    //click and single touch events
	
	    return {
	        left: event.pageX ? event.pageX : event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0].pageX : event.pageX,
	        top: event.pageY ? event.pageY : event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0].pageY : event.pageY
	    };
	}
	
	// TODO: move to app.js
	function updateVerticalStackButtonVisibility(eventSpacing) {
	    $(".button-rearrange")[eventSpacing === 0 ? "show" : "hide"]();
	}
	
	function isUndefined(x) {
	    return typeof x === 'undefined';
	}
	
	function hasValue(str) {
	    return typeof str !== "undefined" && str !== null && str.length > 0;
	}
	
	function bind(n, min, max) {
	    if (n < min) return min;
	    if (n > max) return max;
	    return n;
	}
	
	function findMinIndex(arr, property) {
	    if (arr.length == 0) return -1;
	
	    var minIndex = 0;
	    var minValue = arr[0][property];
	    for (var i = 1; i < arr.length; i++) {
	        if (arr[i][property] < minValue) {
	            minValue = arr[i][property];
	            minIndex = i;
	        }
	    }
	
	    return minIndex;
	}
	
	function isFunction(obj) {
	    return typeof obj === 'function';
	}
	
	function buildObjectFromPath(path, value) {
	    //builds object from dot notation property path, with value set for the deepest property
	    var pathParts = path.split(".");
	    var pathEnd = pathParts[pathParts.length - 1];
	    var obj = {};
	    obj[pathEnd] = value;
	    for (var i = pathParts.length - 2; i >= 0; i--) {
	        var previousPathPart = pathParts[i];
	        var objClone = $.extend(true, {}, obj);
	        obj = {};
	        obj[previousPathPart] = objClone;
	    }
	    return obj;
	}

/***/ }),
/* 7 */
/*!********************************!*\
  !*** ./js/Timeline.options.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.DEFAULT_OPTIONS = undefined;
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _Article = __webpack_require__(/*! ./Article.sorters */ 8);
	
	var DEFAULT_OPTIONS = exports.DEFAULT_OPTIONS = {
	    width: 1000,
	    height: 500,
	    verticalOffset: 40,
	    enableUserControl: true,
	    enableCursor: true,
	    zoom: {
	        initial: 34,
	        minimum: 0,
	        maximum: 123,
	        wheelStep: 0.1,
	        wheelSpeed: 1,
	        ratio: 0.8,
	        unitSize: {
	            initial: 200, //todo: This effects 2 things and needs to be adjusted for separate control. Currently is size of day unit at zoom = 0 AND maximum density region size
	            showMinorLabels: 48,
	            minimum: 8
	        }
	    },
	    initialDate: {
	        year: 1990,
	        month: 1,
	        day: 1
	    },
	    draggingVicinity: {
	        up: 460,
	        down: 40
	    },
	    style: {
	        mainLine: {
	            visible: true,
	            size: 7
	        },
	        draggingHighlight: {
	            visible: true,
	            color: 'rgba(237, 247, 255, 0.5)',
	            area: {
	                up: 0,
	                down: 40
	            }
	        },
	        marker: {
	            minor: {
	                height: 12,
	                color: "#6097f2",
	                futureColor: "#ccc"
	            },
	            major: {
	                height: 30,
	                color: "#0c3a88",
	                futureColor: "#ccc"
	            }
	        },
	        dateLabel: {
	            minor: {
	                font: "normal 10px Calibri",
	                color: "#333",
	                futureColor: "#ccc",
	                textAlign: "start",
	                offset: {
	                    x: 4,
	                    y: 0
	                },
	                bceText: "",
	                thousandsSeparator: ",",
	                yearPrefixes: {
	                    ka: { label: "ka", value: 1e3, minDivision: 1e3 },
	                    Ma: { label: "Ma", value: 1e6, minDivision: 1e5 },
	                    Ga: { label: "Ga", value: 1e9, minDivision: 1e8 }
	                }
	            },
	            major: {
	                font: "normal 16px Calibri",
	                color: "#000",
	                futureColor: "#ccc",
	                textAlign: "start",
	                offset: {
	                    x: 4,
	                    y: 0
	                },
	                bceText: " ʙᴄᴇ",
	                thousandsSeparator: ",",
	                yearPrefixes: {
	                    ka: { label: "ka", value: 1e3, minDivision: 1e5 },
	                    Ma: { label: "Ma", value: 1e6, minDivision: 1e6 },
	                    Ga: { label: "Ga", value: 1e9, minDivision: 1e9 }
	                }
	            }
	        }
	    },
	    article: {
	        density: _constants.DENSITY_ALL,
	        draggable: true,
	        distanceToMainLine: 350,
	        collectOngoing: false,
	        autoStacking: {
	            active: true,
	            rowSpacing: 50,
	            range: _constants.RANGE_ALL,
	            fitToHeight: true,
	            topGap: 10
	        },
	        periodLine: {
	            defaultHide: false,
	            spacing: 4,
	            thickness: 10,
	            stacking: {
	                sorter: _Article.ARTICLE_FROM_SORTER,
	                reverseOrder: false
	            }
	        },
	        animation: {
	            fade: {
	                active: true,
	                duration: 1500,
	                easing: "swing"
	            },
	            move: {
	                active: true,
	                duration: 1500,
	                easing: "swing"
	            }
	        },
	        defaultStyle: {
	            width: 150,
	            color: '#e9e9e9',
	            topRadius: 3,
	            maxImageHeight: 400,
	            header: {
	                height: 50,
	                text: {
	                    margin: 10,
	                    font: "normal 14px 'Segoe UI'",
	                    color: "#333",
	                    lineHeight: 18,
	                    numberOfLines: 2
	                }
	            },
	            subheader: {
	                height: 30,
	                color: '#555',
	                text: {
	                    font: "normal 11px 'Segoe UI'",
	                    color: "#eee",
	                    margin: 10
	                }
	            },
	            shadow: {
	                x: 0,
	                y: 0,
	                amount: 0,
	                color: '#000'
	            },
	            border: {
	                color: '#ddd',
	                width: 1
	            },
	            connectorLine: {
	                offsetX: 18,
	                offsetY: -20,
	                thickness: 1,
	                arrow: {
	                    width: 16,
	                    height: 45
	                }
	            },
	            star: {
	                width: 16,
	                margin: 3
	            }
	        },
	        defaultActiveStyle: {
	            color: "#337ab7",
	            header: {
	                text: {
	                    color: "#fff"
	                }
	            },
	            subheader: {
	                color: '#333'
	            },
	            shadow: {
	                x: 3,
	                y: 3,
	                amount: 5,
	                color: '#333'
	            },
	            border: {
	                width: 2,
	                color: "#2e6da4"
	            },
	            connectorLine: {
	                thickness: 2
	            }
	        }
	    }
	};

/***/ }),
/* 8 */
/*!*******************************!*\
  !*** ./js/Article.sorters.js ***!
  \*******************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ARTICLE_DURATION_SORTER = ARTICLE_DURATION_SORTER;
	exports.ARTICLE_DURATION_YEARS_SORTER = ARTICLE_DURATION_YEARS_SORTER;
	exports.ARTICLE_IMAGE_QUEUE_SORTER = ARTICLE_IMAGE_QUEUE_SORTER;
	exports.ARTICLE_FROM_SORTER = ARTICLE_FROM_SORTER;
	exports.ARTICLE_TO_SORTER = ARTICLE_TO_SORTER;
	exports.ARTICLE_TOP_SORTER = ARTICLE_TOP_SORTER;
	exports.ARTICLE_ROW_SORTER = ARTICLE_ROW_SORTER;
	exports.ARTICLE_RANK_SORTER = ARTICLE_RANK_SORTER;
	exports.ARTICLE_EFFECTIVE_RANK_SORTER = ARTICLE_EFFECTIVE_RANK_SORTER;
	exports.ARTICLE_POSITION_SORTER = ARTICLE_POSITION_SORTER;
	function ARTICLE_DURATION_SORTER(articleA, articleB) {
	
	    var a = articleA.period.from.getDaysTo(articleA.period.to);
	    var b = articleB.period.from.getDaysTo(articleB.period.to);
	
	    if (a < b) return +1;
	    if (a > b) return -1;
	    return parseInt(articleA.id) - parseInt(articleB.id);
	}
	
	//faster than ARTICLE_DURATION_SORTER, but only compares duation in years.
	function ARTICLE_DURATION_YEARS_SORTER(articleA, articleB) {
	    var a = articleA.period.years;
	    var b = articleB.period.years;
	    if (a < b) return +1;
	    if (a > b) return -1;
	    return parseInt(articleA.id) - parseInt(articleB.id);
	}
	
	//To sort imageLoadingQueue to prioritise articles that are inView, visible and closest to the timeline
	function ARTICLE_IMAGE_QUEUE_SORTER(articleA, articleB) {
	    var a = articleA.isInView && articleA.isVisible;
	    var b = articleB.isInView && articleB.isVisible;
	
	    //visbible & inView articles first
	    if (!a && b) return -1;
	    if (a && !b) return +1;
	
	    //articles closer to timeline first
	    return articleA.position.top - articleB.position.top;
	}
	
	//Sort by start date
	function ARTICLE_FROM_SORTER(articleA, articleB) {
	    var a = articleA.period.from;
	    var b = articleB.period.from;
	    var result = a.compare(b);
	    if (result == 0) {
	        result = parseInt(articleB.id) - parseInt(articleA.id);
	    }
	    return result;
	}
	
	//Sort by end date
	function ARTICLE_TO_SORTER(articleA, articleB) {
	    var a = articleA.period.to;
	    var b = articleB.period.to;
	    var result = b.compare(a);
	    if (result == 0) {
	        result = parseInt(articleB.id) - parseInt(articleA.id);
	    }
	    return result;
	}
	
	function ARTICLE_TOP_SORTER(articleA, articleB) {
	    var a = articleA.position.top;
	    var b = articleB.position.top;
	    if (a < b) return -1;
	    if (a > b) return +1;
	    return parseInt(articleB.id) - parseInt(articleA.id);
	}
	
	//Sort by auto-stacking row
	function ARTICLE_ROW_SORTER(articleA, articleB) {
	    var a = articleA.row; //position.top;
	    var b = articleB.row; //position.top;
	    if (a < b) return +1;
	    if (a > b) return -1;
	    return parseInt(articleB.id) - parseInt(articleA.id);
	}
	
	function ARTICLE_RANK_SORTER(articleA, articleB) {
	    var a = articleA.rank;
	    var b = articleB.rank;
	    if (a < b) return +1;
	    if (a > b) return -1;
	    return parseInt(articleB.id) - parseInt(articleA.id);
	}
	
	//effecive rank includes boosting of selected article
	function ARTICLE_EFFECTIVE_RANK_SORTER(articleA, articleB) {
	    var a = articleA.effectiveRank;
	    var b = articleB.effectiveRank;
	    if (a < b) return +1;
	    if (a > b) return -1;
	    return parseInt(articleB.id) - parseInt(articleA.id);
	}
	
	function ARTICLE_POSITION_SORTER(articleA, articleB) {
	    var a = articleA.position.left;
	    var b = articleB.position.left;
	    var result = a < b ? +1 : a > b ? -1 : 0;
	    if (result == 0) {
	        // same left? use top
	        result = articleA.position.top - articleB.position.top;
	        if (result == 0) {
	            // same top? use from
	            result = articleA.period.from.compare(articleB.period.from);
	
	            if (result == 0) {
	                // same from? use id as the last resort
	                result = parseInt(articleA.id) - parseInt(articleB.id);
	            }
	        }
	    }
	
	    return result;
	}

/***/ }),
/* 9 */
/*!****************************!*\
  !*** ./js/Article.data.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getPropertyFromData = getPropertyFromData;
	exports.existsInData = existsInData;
	
	var _Article = __webpack_require__(/*! ./Article.base */ 10);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	var propertyAbbreviations = {
	    "id": "i",
	    "title": "t",
	    "rank": "r",
	    "subtitle": "s",
	    "from.year": "fy",
	    "from.month": "fm",
	    "from.day": "fd",
	    "from.precision": "fp",
	    "to.year": "ty",
	    "to.month": "tm",
	    "to.day": "td",
	    "to.precision": "tp",
	    "isToPresent": "p",
	    "isStarred": "v",
	    "offset.left": "ol",
	    "offset.top": "ot",
	    "imageUrl": "m",
	    "style": "st",
	    "activeStyle": "ast",
	    "hiddenByFilter": "h",
	    "hidePeriodLine": "hp"
	};
	
	function extractProperty(data, property) {
	    return data.hasOwnProperty(property) ? data[property] : data[propertyAbbreviations[property]];
	}
	
	function extractPropertyFromPath(data, path) {
	    var pathParts = path.split(".");
	
	    // pull each object in the path out sequentially and return it
	    return pathParts.reduce(function (curr, next) {
	        return curr ? curr[next] : undefined;
	    }, data);
	}
	
	function isPath(property) {
	    return property.indexOf(".") > -1;
	}
	
	function getPropertyFromData(data, property) {
	    if (isPath(property)) {
	        return extractPropertyFromPath(data, property);
	    }
	
	    return extractProperty(data, property);
	}
	
	function existsInData(data, property) {
	    if (isPath(property)) {
	        return !(0, _utils.isUndefined)(extractPropertyFromPath(data, property));
	    }
	
	    return data.hasOwnProperty(property);
	}
	
	function defineValueOrFunctionProperty(obj, propName) {
	    var privatePropertyName = "_" + propName;
	    obj[privatePropertyName] = undefined;
	
	    Object.defineProperty(obj, propName, {
	        get: function get() {
	            var value = this[privatePropertyName];
	
	            if ((0, _utils.isFunction)(value)) {
	                return value(this);
	            }
	
	            return value;
	        },
	        set: function set(value) {
	            this[privatePropertyName] = value;
	        },
	
	        enumerable: true,
	        configurable: false
	    });
	}
	
	defineValueOrFunctionProperty(_Article.Article.prototype, "hidePeriodLine");
	defineValueOrFunctionProperty(_Article.Article.prototype, "hiddenByFilter");

/***/ }),
/* 10 */
/*!****************************!*\
  !*** ./js/Article.base.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
					value: true
	});
	exports.Article = Article;
	
	var _Dmy = __webpack_require__(/*! ./Dmy */ 5);
	
	var _Article = __webpack_require__(/*! ./Article.data */ 9);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	function Article(owner, id) {
					this.id = id;
					this.owner = owner;
					this.isDataLoaded = false;
					this.imageLoaded = false;
					this.stacking = 0;
					this.groupIndex = 0;
					this.isActive = false;
					this.isVisible = false;
					this.isInRange = false;
					this.isInView = false;
					this.isVisibleInGroup = false;
					this.isVisibleInRows = true;
					this.isStarred = false;
					this.isMouseOverStar = false;
					this.isDragging = false;
					this.registeredPosition = { left: 0, top: 0 };
					this.position = { left: 0, top: 0 };
					this.dragStartOffset = { left: 0, top: 0 };
					this.indicator = { fromX: 0, toX: 0 };
	
					//Move and Fade animations
					this.offset = { left: 0, top: 0 }; // current offset from registeredPosition, including during animation
					this.finalOffset = { left: 0, top: 0 }; // used in timeline.stack to set offset to change to during draw cycle 
					this.isVisibleAfterFade = false; // visiblity article will have once fade animation is complete
					this.opacity = 0;
					this.fadeAnimation = {
									finalOpacity: 0,
									dummyElement: undefined
					};
					this.moveAnimation = {
									finalOffset: { left: 0, top: 0 },
									dummyElement: undefined
					};
					this.row = 0;
					this.isFading = false;
					this.isMoving = false;
	
					// events
					this.activatedHandlers = [];
	}
	
	Article.prototype.setupByReceivedData = function (data) {
					this.data = $.extend( /* deep */true, {}, data);
					this.title = (0, _Article.getPropertyFromData)(data, "title");
					this.rank = (0, _Article.getPropertyFromData)(data, "rank") || 0;
					this.subtitle = (0, _Article.getPropertyFromData)(data, "subtitle") || '';
					this._setupArticlePeriod(data);
					this.offset.left = this.finalOffset.left = this.moveAnimation.finalOffset.left = data.offsetLeft || 0; //todo: shouldn't need to be set in moveAnimation as well
					this.offset.top = this.finalOffset.top = this.moveAnimation.finalOffset.top = data.offsetTop || 0;
					this.isStarred = !!data.starred;
	
					this.isDataLoaded = true;
					this.isImageInfoLoaded = false;
	
					// style
					this.style = $.extend( /*deep*/true, {}, this.owner.options.article.defaultStyle, (0, _Article.getPropertyFromData)(data, "style") || {});
					this.activeStyle = $.extend( /*deep*/true, {}, this.style, this.owner.options.article.defaultActiveStyle, (0, _Article.getPropertyFromData)(data, "activeStyle") || {});
	
					this.hiddenByFilter = (0, _Article.getPropertyFromData)(data, "hiddenByFilter");
					this.hidePeriodLine = (0, _Article.existsInData)(data, "hidePeriodLine") ? (0, _Article.getPropertyFromData)(data, "hidePeriodLine") : this.owner.options.article.periodLine.defaultHide;
	};
	
	Article.prototype._setupArticlePeriod = function (data) {
					var from = _Dmy.Dmy.CreateAsStartOfPeriod(parseInt((0, _Article.getPropertyFromData)(data, "from.year")), parseInt((0, _Article.getPropertyFromData)(data, "from.month")), parseInt((0, _Article.getPropertyFromData)(data, "from.day")), parseInt((0, _Article.getPropertyFromData)(data, "from.precision")));
	
					var isToPresentProp = (0, _Article.getPropertyFromData)(data, "isToPresent");
					var isToPresent = isToPresentProp === true || isToPresentProp === 1;
	
					var to = void 0;
	
					if (isToPresent) {
									to = _Dmy.Dmy.now();
					} else if ((0, _Article.existsInData)(data, "to")) {
									to = _Dmy.Dmy.CreateAsEndOfPeriod(parseInt((0, _Article.getPropertyFromData)(data, "to.year")), parseInt((0, _Article.getPropertyFromData)(data, "to.month")), parseInt((0, _Article.getPropertyFromData)(data, "to.day")), parseInt((0, _Article.getPropertyFromData)(data, "to.precision")));
					} else {
									//if no end date is set and not to present, reuse start date
									to = from;
					}
	
					this.period = { from: from, isToPresent: isToPresent, to: to.getNextDay() };
	
					// period years does not need to be accurate, it will be used only to compare length of the articles
					this.period.years = this.period.to.asFloat() - this.period.from.asFloat();
	};
	
	Article.prototype.setImage = function () {
					this.isImageInfoLoaded = true;
	
					if ((0, _Article.getPropertyFromData)(this.data, "imageUrl")) {
									this.owner.enqueueImageLoad(this);
					} else {
									this.image = null;
					}
	};
	
	Article.prototype.registerPosition = function (pos) {
					this.registeredPosition = this.position = pos;
	};
	
	Article.prototype.overlaps = function (other) {
					return other.period.from.isSame(this.period.from) && other.period.to.isSame(this.period.to) || other.period.from.isBetween(this.period.from, this.period.to) || other.period.to.isBetween(this.period.from, this.period.to) || this.period.from.isBetween(other.period.from, other.period.to) || this.period.to.isBetween(other.period.from, other.period.to);
	};
	
	Article.prototype.overlapsInclusiveWithDates = function (from, to) {
					return !(this.period.from.isAfter(to) || from.isAfter(this.period.to));
	};
	
	Article.prototype.overlapsInclusive = function (other) {
					return this.overlapsInclusiveWithDates(other.period.from, other.period.to);
	};
	
	Article.prototype.isInside = function (pos) {
					return this.isVisible && pos.left >= this.position.left && pos.left <= this.position.left + this._getWidth() && pos.top >= this.position.top && pos.top <= this.position.top + this.height;
	};
	
	// events
	Article.prototype.addActivatedHandler = function (handler) {
					this.activatedHandlers.push(handler);
	};
	
	Article.prototype.activated = function () {
					for (var i = 0; i < this.activatedHandlers.length; i++) {
									this.activatedHandlers[i].call(this);
					}
	};
	
	// cursor
	Article.prototype.updateIsMouseOverStar = function (pos) {
					var star = this.getStarBox();
	
					var oldState = this.isMouseOverStar;
					this.isMouseOverStar = pos.left >= star.left && pos.left <= star.left + star.width && pos.top >= star.top && pos.top <= star.top + star.height;
	
					if (this.isMouseOverStar != oldState) this.owner.redraw();
	
					return this.isMouseOverStar;
	};
	
	Article.prototype.getCursor = function (pos) {
					this.updateIsMouseOverStar(pos);
					if (!this.owner.options.article.draggable) return 'pointer';
					//draggable article
					if (this.isActive) {
									return this.isMouseOverStar ? 'pointer' : 'move';
					}
					return 'pointer';
	};
	
	// returns true if event handled. false if caller should continue handling the event
	Article.prototype.clicked = function (pos) {
					this.activated();
					this.updateIsMouseOverStar(pos);
	
					if (this.isMouseOverStar) {
									this.isStarred = !this.isStarred;
	
									this.owner.redraw();
	
									return true;
					}
	
					return false;
	};
	
	// save
	Article.prototype.getStatusForSave = function () {
					var state = { i: this.id };
					// to keep it compact do not save zero values
					if (this.offset.left != 0) state.l = this.offset.left;
					if (this.offset.top != 0) state.t = this.offset.top;
					if (this.isStarred) state.v = true;
	
					return state;
	};
	
	Article.prototype.headerOverlapsWith = function (other) {
					var thisLeft = this.registeredPosition.left;
					var otherLeft = other.registeredPosition.left;
					var thisRight = thisLeft + this._getWidth();
					var otherRight = otherLeft + other._getWidth();
	
					return otherRight >= thisLeft && thisRight >= otherLeft;
	};
	
	Article.prototype._getWidth = function () {
					return this._getCurrentStyle().width;
	};
	
	Article.prototype.setOption = function (option, value) {
					var needsDefaultRedraw = false;
					var activeStyleUpdated = false;
	
					if (typeof option === "string") {
									if (typeof value === 'undefined') {
													//return current value if none given
													var selectedOption = (0, _Article.getPropertyFromData)(this.data, option);
													return selectedOption;
									}
									//convert option string to object
									option = (0, _utils.buildObjectFromPath)(option, value);
					}
					$.extend( /* deep */true, this.data, option);
	
					//has id changed?
					if ((0, _Article.existsInData)(option, "id")) {
									this.id = option.id;
					}
	
					//has title changed?
					if ((0, _Article.existsInData)(option, "title")) {
									this.title = option.title;
									this.titleLines = undefined; //triggers recalc from this.title on next redraw
					}
	
					//has subtitle changed?
					if ((0, _Article.existsInData)(option, "subtitle")) {
									this.subtitle = option.subtitle;
									this.summarisedSubtitle = undefined; //trigger recalc from this.subtitle on next redraw
					}
	
					//has date changed?
					if ((0, _Article.existsInData)(option, "from") || (0, _Article.existsInData)(option, "to") || (0, _Article.existsInData)(option, "isToPresent")) {
									this._setupArticlePeriod(this.data);
									needsDefaultRedraw = true;
					}
	
					//has image changed?
					if ((0, _Article.existsInData)(option, "imageUrl")) {
									this.setImage();
					}
	
					//has rank changed?
					if ((0, _Article.existsInData)(option, "rank")) {
									this.rank = option.rank;
									needsDefaultRedraw = true;
					}
	
					//has star changed?
					if ((0, _Article.existsInData)(option, "starred")) {
									this.isStarred = option.starred;
					}
	
					//has hiddenByFilter changed?
					if ((0, _Article.existsInData)(option, "hiddenByFilter")) {
									this.hiddenByFilter = option.hiddenByFilter;
					}
	
					//has hidePeriodLine changed?
					if ((0, _Article.existsInData)(option, "hidePeriodLine")) {
									this.hidePeriodLine = option.hidePeriodLine;
					}
	
					//has style changed?
					if ((0, _Article.existsInData)(option, "style")) {
									this.style = $.extend(true, {}, this.owner.options.article.defaultStyle, this.data.style);
									this.activeStyle = $.extend(true, {}, this.style, this.owner.options.article.defaultActiveStyle, this.data.activeStyle || {}); //active style must inherit changes to style	
									activeStyleUpdated = true;
					}
	
					//has activeStyle changed?
					if ((0, _Article.existsInData)(option, "activeStyle") && !activeStyleUpdated) {
									$.extend(true, this.activeStyle, option.activeStyle); //overrides all other styles, so no need to check defaults
					}
	
					if (needsDefaultRedraw) {
									//performance: avoid defaultRedraw if not needed
									this.owner.defaultRedraw();
					} else {
									this.owner.redraw();
					}
	};
	
	Article.prototype.setStyle = function (option, value) {
					if (typeof option === "string") {
									if (typeof value === "undefined") return (0, _Article.getPropertyFromData)(this.style, option);
									//convert option string to object
									option = (0, _utils.buildObjectFromPath)(option, value);
					}
					this.data.style = $.extend(true, this.data.style || {}, option);
					this.style = $.extend( /*deep*/true, {}, this.owner.options.article.defaultStyle, this.data.style);
					this.activeStyle = $.extend( /*deep*/true, {}, this.style, this.owner.options.article.defaultActiveStyle, this.data.activeStyle || {}); //active style must inherit changes to style
					if ((0, _Article.existsInData)(option, "header.text")) {
									// todo: only changes to text.font, text.margin and text.numberOfLines need titleLines updating
									this.titleLines = undefined;
					}
					if ((0, _Article.existsInData)(option, "subheader.text")) {
									// todo: only changes to text.font and text.margin need summarisedSubtitle updating
									this.summarisedSubtitle = undefined;
					}
					this.owner.redraw();
	};
	
	Article.prototype.setActiveStyle = function (option, value) {
					if (typeof option === "string") {
									if (typeof value === "undefined") return (0, _Article.getPropertyFromData)(this.activeStyle, option);
									//convert option string to object
									option = (0, _utils.buildObjectFromPath)(option, value);
					}
					this.data.activeStyle = $.extend(true, this.data.activeStyle || {}, option);
					$.extend(true, this.activeStyle, option); //overrides all other styles, so no need to check defaults
					this.owner.redraw();
	};

/***/ }),
/* 11 */
/*!*******************************!*\
  !*** ./js/Timeline.groups.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	_Timeline.Timeline.prototype.updateArticlesGroupIndex = function () {
	    this.forLoadedArticles(function (article) {
	        article.groupIndex = this.calculateGroupIndex(article.period.from);
	    });
	};
	
	_Timeline.Timeline.prototype.updateVisibleArticlesOfGroups = function (drawCycleContext) {
	
	    // TODO: only groups that newly come into view should be updated
	    this.groups = {};
	
	    //When range = "all", we need to go more groups either side to keep stacking & period line visibility as stable as possible 
	    //20 groups seems like a good trade off between stacking stability and performance
	    var groupIndexExtension = this.options.article.autoStacking.range == _constants.RANGE_SCREEN ? 1 : 20;
	
	    var leftmostGroupIndex = this.calculateGroupIndex(drawCycleContext.tokens.start) - groupIndexExtension;
	    var rightmostGroupIndex = this.calculateGroupIndex(drawCycleContext.tokens.end) + groupIndexExtension;
	
	    this.forLoadedArticles(function (article) {
	        article.isVisibleInGroup = false;
	    });
	
	    for (var index = leftmostGroupIndex; index <= rightmostGroupIndex; index++) {
	        this.groups[index] = this.getArticlesInGroup(index, leftmostGroupIndex, rightmostGroupIndex).map(function (a) {
	            a.isVisibleInGroup = true;
	            return a.id;
	        });
	    }
	};
	
	var STARRED_INCREASE_CONSTANT = 10000000;
	var ACTIVE_INCREASE_CONSTANT = 20000000;
	
	_Timeline.Timeline.prototype.getArticlesInGroup = function (index, leftmostGroupIndex, rightmostGroupIndex) {
	    function getArticleEffectiveRank(article) {
	        var effectiveRank = article.rank;
	
	        if (article.isActive) {
	            effectiveRank += ACTIVE_INCREASE_CONSTANT;
	        } else {
	            // don't need to increase twice if active AND starred
	            if (article.isStarred) {
	                effectiveRank += STARRED_INCREASE_CONSTANT;
	            }
	        }
	
	        return effectiveRank;
	    }
	
	    var pick = this.getDensityPick();
	    var topArticles = [];
	    var minRankIndex = 0;
	
	    for (var i = 0; i < this.articles.length; i++) {
	        var article = this.articles[i];
	        if (!article.isDataLoaded || article.isHiddenByFilter) //don't include filtered articles in group count
	            continue;
	
	        var belongsToThisGroup = (0, _utils.bind)(article.groupIndex, leftmostGroupIndex, rightmostGroupIndex) === index;
	        if (!belongsToThisGroup) continue;
	
	        article.effectiveRank = getArticleEffectiveRank(article);
	
	        // initial filling of topArticles array
	        if (topArticles.length < pick) {
	            topArticles.push(article);
	
	            // maintain the position of minRankIndex
	            if (article.effectiveRank < topArticles[minRankIndex].effectiveRank) minRankIndex = topArticles.length - 1;
	
	            continue;
	        }
	
	        // if article.rank is greater than any of the ranks in topArticles replace smallest value with the article
	
	        if (article.effectiveRank > topArticles[minRankIndex].effectiveRank) {
	            topArticles[minRankIndex] = article;
	            // minRankIndex is now possibly changed
	            minRankIndex = (0, _utils.findMinIndex)(topArticles, 'effectiveRank');
	        }
	    }
	
	    return topArticles;
	};
	
	_Timeline.Timeline.prototype.calculateGroupIndex = function (date) {
	    if (this.timescaleManager.unit >= _constants.ZOOM_MONTH && this.currentDensitySetting.step.months !== 0) {
	        var g = date.year * 12 + (date.month - 1);
	        return Math.floor(g / this.currentDensitySetting.step.months);
	    }
	
	    // ZOOM_DAY
	    var g = date.year * 372 + (date.month - 1) * 31 + date.day;
	
	    if (this.currentDensitySetting.step.days === 0) {
	        return Math.floor(g / (this.currentDensitySetting.step.months * 30));
	    }
	    return Math.floor(g / this.currentDensitySetting.step.days);
	};
	
	// TODO: remove
	_Timeline.Timeline.prototype.canBeVisibleInGroup = function (article, startToken, endToken) {
	
	    if (article.isActive) return true;
	
	    startToken = startToken || this.timescaleManager.startToken;
	    endToken = endToken || this.calculateEndToken();
	
	    var leftmostGroupIndex = this.calculateGroupIndex(startToken.value) - 1;
	    var rightmostGroupIndex = this.calculateGroupIndex(endToken.value) + 1;
	
	    var effectiveArticleGroupIndex = (0, _utils.bind)(article.groupIndex, leftmostGroupIndex, rightmostGroupIndex);
	    if (!this.groups.hasOwnProperty(effectiveArticleGroupIndex)) return false;
	
	    return this.groups[effectiveArticleGroupIndex].indexOf(article.id) >= 0;
	};

/***/ }),
/* 12 */
/*!*********************************!*\
  !*** ./js/Timeline.dragging.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _Timeline2 = __webpack_require__(/*! ./Timeline.branding */ 13);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	_Timeline.Timeline.prototype.enableDragging = function () {
	    var me = this;
	    var mousedown = {
	        relativePos: null, //to check if mouse movement is within click tolerance on mouseup
	        pagePos: null, //to check if timeline drag should include article stacking (small movements don't re-stack articles for UX)
	        time: 0,
	        isDoubleClick: false,
	        isArticleClick: false,
	        isArticleDoubleClick: false,
	        isTermsClick: false,
	        isHjsClick: false,
	        article: null
	    };
	
	    var pinch = {
	        initial: {
	            distance: 0,
	            zoom: 0
	        },
	        centre: {},
	        scale: 1
	    };
	
	    function isMousemoveWithinTolerance(mousedownPos, mouseupPos) {
	        //check if click should register on mouseup. Todo: move to utils.js?
	        var mouseMoveClickTolerance = 2; //number of pixels you can move in x or y and still register a click
	        return !(Math.abs(mousedownPos.left - mouseupPos.left) > mouseMoveClickTolerance || Math.abs(mousedownPos.top - mouseupPos.top) > mouseMoveClickTolerance);
	    }
	
	    function mousedownHandler(event) {
	        (0, _utils.clearSelection)(); //clear any selected text on the page
	        event.preventDefault();
	
	        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
	            //if multi-touch event
	            pinchstartHandler(event);
	            return;
	        }
	
	        var relativePos = mousedown.relativePos = me.getRelativePosition(event);
	        if (!me.options.disableBranding) {
	            mousedown.isHjsClick = me._isInsideHistropediaJSLink(relativePos);
	            mousedown.isTermsClick = me._isInsideTermsLink(relativePos);
	        }
	
	        //is it a double click?
	        var now = Date.now();
	        if (now - mousedown.time < 500) {
	            //todo: set double click speed in options
	            mousedown.isDoubleClick = true;
	        }
	        mousedown.time = now; //reset for next click
	
	
	        if (!(mousedown.isHjsClick || mousedown.isTermsClick)) {
	            //if click not on terms/hjs links
	            // is mouse click on an article?
	            for (var i = me.articles.length - 1; i >= 0; i--) {
	                // in reverse order because of the way draw works, the last item is topmost
	                var article = me.articles[i];
	
	                if (article.isVisible && article.isInside(relativePos)) {
	                    //click is on an article...
	
	                    //is it a double click on same article?
	                    if (mousedown.isDoubleClick && mousedown.article !== null && article.id === mousedown.article.id) {
	                        //todo: set double click speed in options
	                        mousedown.isArticleDoubleClick = true;
	                    }
	
	                    //set article click details
	                    mousedown.isArticleClick = true;
	                    mousedown.article = article;
	
	                    //start article dragging if it's active
	                    if (article.isActive && me.options.article.draggable) {
	                        article.startDragging(relativePos);
	                        me.draggingArticle = article;
	                        return;
	                    }
	                    break; //go on to start dragging the timeline now clicked article has been found
	                }
	            }
	        }
	
	        if (me.draggingArticle === null && me.isInVicinity(event, me.options.draggingVicinity, relativePos)) {
	            me.isDragging = true;
	            var pagePos = mousedown.pagePos = (0, _utils.extractPagePosition)(event);
	            me.dragStartX = pagePos.left;
	            me.dragStartY = pagePos.top;
	        }
	    }
	
	    function mouseupHandler(event) {
	        if (me.isPinching && event.originalEvent.touches.length < 2) {
	            //if mouseup ends pinch
	            if (event.originalEvent.touches[0]) {
	                //if one finger remains, dragging is started from current X position
	                me.dragStartX = event.originalEvent.touches[0].pageX;
	            }
	            me.isPinching = false;
	            return;
	        }
	
	        var relativePos = me.getRelativePosition(event);
	        if (mousedown.relativePos !== null && isMousemoveWithinTolerance(mousedown.relativePos, relativePos)) {
	            if (mousedown.isHjsClick) {
	                (0, _Timeline2.handleHistropediaJSLinkClick)();
	                mousedown.isHjsClick = false;
	            } else if (mousedown.isTermsClick) {
	                (0, _Timeline2.handleTermsLinkClick)();
	                mousedown.isHjsClick = false;
	            } else if (mousedown.isArticleClick) {
	                me.bringFront(mousedown.article.id); //select the article that was first clicked on
	                var starClick = mousedown.article.clicked(mousedown.relativePos);
	                me.canvas.css('cursor', mousedown.article.getCursor(relativePos)); //update cursor when clicked article becomes active
	                mousedown.isArticleClick = false;
	
	                if (mousedown.isArticleDoubleClick) {
	                    //fire double click on article
	                    me.articleDoubleClicked(mousedown.article);
	                    mousedown.isArticleDoubleClick = false;
	                }
	            } else {
	                //is click on background
	                me.backgroundClicked(event, mousedown.isDoubleClick);
	            }
	            mousedown.isDoubleClick = false; //reset AFTER isArticleClick and isBackgroundClick else-if blocks
	        }
	
	        if (me.draggingArticle !== null) {
	            me.draggingArticle.stopDragging();
	            me.draggingArticle = null;
	        } else if (me.isDragging) {
	            me.isDragging = false;
	        }
	        me.redraw();
	    }
	
	    function mousemoveHandler(event) {
	
	        if (me.isPinching) {
	            var zoomRatio = me.timescaleManager.zoomOptions.ratio;
	            var previousCentreX = pinch.centre.x;
	            pinch.centre = me.getRelativeCoordinates((0, _utils.extractPinchCentre)(event));
	            pinch.scale = (0, _utils.getTouchDistance)(event) / pinch.initial.distance;
	            var zoomChange = Math.log(pinch.scale) / Math.log(zoomRatio);
	            var deltaX = previousCentreX - pinch.centre.x; //change since last processed mousemove event
	            me.setZoom(pinch.initial.zoom + zoomChange, pinch.centre.x, deltaX);
	        } else if (me.isDragging) {
	            var pagePos = (0, _utils.extractPagePosition)(event);
	            var moveInPixelsX = me.dragStartX - pagePos.left;
	            var moveInPixelsY = me.dragStartY - pagePos.top;
	            me.dragStartX = pagePos.left;
	            var withoutStack = Math.abs(mousedown.pagePos.left - pagePos.left) < 30; // 30px movement allowed without causing restacking on doDrag
	            me.doDrag(moveInPixelsX, withoutStack);
	        } else if (me.draggingArticle !== null) {
	            var relativePos = me.getRelativePosition(event);
	            me.draggingArticle.dragging(relativePos);
	        }
	    }
	
	    function pinchstartHandler(event) {
	        if (!event.originalEvent.touches || event.originalEvent.touches.length < 2) return;
	        pinch.centre = me.getRelativeCoordinates((0, _utils.extractPinchCentre)(event));
	        pinch.initial.distance = (0, _utils.getTouchDistance)(event);
	        pinch.initial.zoom = me.timescaleManager.zoom;
	        me.isPinching = true;
	    }
	
	    this.canvas.on('mousedown touchstart', mousedownHandler);
	    $(document).on('mouseup touchend', mouseupHandler);
	    $(document).on('mousemove touchmove', mousemoveHandler);
	};
	
	_Timeline.Timeline.prototype.doDrag = function (deltaX, withoutStack /*boolean*/) {
	    // change start token
	    this.updateFromByPixels(deltaX);
	    this.defaultRedraw(withoutStack); //pass 'withoutStack=true' to defaultRedraw to surpress article re-stacking
	};
	
	// pixels: pixels to move to left (use negative to move to right)
	_Timeline.Timeline.prototype.updateFromByPixels = function (pixels) {
	    this.repositionWindow -= pixels;
	
	    // tokens
	    var start = this.timescaleManager.startToken;
	    var prev = this.timescaleManager.getPrevious(start);
	
	    // reposition behind previous token
	    while (this.repositionWindow >= prev.length) {
	        this.repositionWindow -= prev.length;
	        start = prev;
	        prev = this.timescaleManager.getPrevious(start);
	    }
	
	    // reposition ahead of start
	    while (-this.repositionWindow >= start.length) {
	        this.repositionWindow += start.length;
	        start = this.timescaleManager.getNext(start);
	    }
	
	    this.timescaleManager.setStartToken(start);
	};

/***/ }),
/* 13 */
/*!*********************************!*\
  !*** ./js/Timeline.branding.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.handleHistropediaJSLinkClick = handleHistropediaJSLinkClick;
	exports.handleTermsLinkClick = handleTermsLinkClick;
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	var LOGO_LEFT_MARGIN = 5;
	var LOGO_BOTTOM_MARGIN = 5;
	var LOGO_HEIGHT = 34;
	var LOGO_WIDTH = 130;
	
	var LOGO_BASE_64_IMAGE = __webpack_require__(/*! base64!../content/histropediajs-overlay-logo.png */ 14);
	var LOGO_SRC_URL = "data:image/png;base64," + LOGO_BASE_64_IMAGE;
	
	_Timeline.Timeline.prototype._drawBranding = function (ctx) {
	    this._drawLogo(ctx);
	    this._drawCopyrightLinks(ctx);
	};
	
	_Timeline.Timeline.prototype._drawLogo = function (ctx) {
	    if ((0, _utils.isUndefined)(this.logo)) {
	        this.logo = new Image();
	
	        this.logo.onload = this._drawLogoImage.bind(this, ctx);
	
	        this.logo.src = LOGO_SRC_URL;
	    } else {
	        this._drawLogoImage(ctx);
	    }
	};
	
	_Timeline.Timeline.prototype._drawLogoImage = function (ctx, top) {
	    ctx.drawImage(this.logo, LOGO_LEFT_MARGIN, this.top - Math.floor(this.options.style.mainLine.size / 2) - LOGO_HEIGHT - LOGO_BOTTOM_MARGIN);
	};
	
	var LINKS_WIDTH = 100;
	var LINKS_HEIGHT = 18;
	var LINKS_RIGHT_MARGIN = 3;
	var LINKS_BOTTOM_MARGIN = 3;
	var LINKS_PADDING_X = 10;
	var LINKS_PADDING_Y = 1;
	var LINKS_FONT_SIZE = 10;
	var LINKS_HISTROPEDIAJS_TEXT = "HistropediaJS";
	var LINKS_HISTROPEDIAJS_WIDTH = 63;
	var LINKS_TERMS_TEXT = "Terms";
	var LINKS_TERMS_WIDTH = 27;
	var LINKS_SEPARATOR_WIDTH = 10;
	var LINKS_TEXT = LINKS_HISTROPEDIAJS_TEXT + " | " + LINKS_TERMS_TEXT;
	var LINKS_TEXT_STYLING = {
	    textBaseline: "middle",
	    fillStyle: "#000000",
	    font: "normal " + LINKS_FONT_SIZE + "px \"Helvetica Neue\", Helvetica, Arial, sans-serif"
	};
	
	_Timeline.Timeline.prototype._drawCopyrightLinks = function (ctx) {
	    // draw background
	    ctx.beginPath();
	    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
	    ctx.fillRect(this.width - LINKS_WIDTH - LINKS_RIGHT_MARGIN - LINKS_PADDING_X * 2, this.top - Math.floor(this.options.style.mainLine.size / 2) - LINKS_HEIGHT - LINKS_BOTTOM_MARGIN - LINKS_PADDING_Y * 2, LINKS_WIDTH + LINKS_PADDING_X * 2, LINKS_HEIGHT + LINKS_PADDING_Y * 2);
	
	    // draw text
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = "#000000";
	    ctx.font = "normal " + LINKS_FONT_SIZE + "px \"Helvetica Neue\", Helvetica, Arial, sans-serif";
	
	    var textCoords = this._getBrandingTextCoords();
	
	    ctx.fillText(LINKS_TEXT, textCoords.left, textCoords.top, LINKS_WIDTH + LINKS_PADDING_X);
	};
	
	_Timeline.Timeline.prototype._getBrandingTextCoords = function () {
	    return {
	        left: this.width - LINKS_WIDTH - LINKS_RIGHT_MARGIN - LINKS_PADDING_X,
	        top: this.top - Math.floor(this.options.style.mainLine.size / 2) - LINKS_HEIGHT - LINKS_BOTTOM_MARGIN + LINKS_FONT_SIZE - LINKS_PADDING_Y
	    };
	};
	
	_Timeline.Timeline.prototype._isInsideHistropediaJSLink = function (pos) {
	    var textCoords = this._getBrandingTextCoords();
	
	    return isInside(pos, {
	        left: textCoords.left,
	        top: textCoords.top - LINKS_FONT_SIZE / 2,
	        width: LINKS_HISTROPEDIAJS_WIDTH,
	        height: LINKS_FONT_SIZE
	    });
	};
	
	_Timeline.Timeline.prototype._isInsideTermsLink = function (pos) {
	    var textCoords = this._getBrandingTextCoords();
	
	    return isInside(pos, {
	        left: textCoords.left + LINKS_HISTROPEDIAJS_WIDTH + LINKS_SEPARATOR_WIDTH,
	        top: textCoords.top - LINKS_FONT_SIZE / 2,
	        width: LINKS_TERMS_WIDTH,
	        height: LINKS_FONT_SIZE
	    });
	};
	
	function handleHistropediaJSLinkClick() {
	    window.open('http://histropedia.com/histropediajs/index.html', '_blank');
	}
	
	function handleTermsLinkClick() {
	    window.open('http://histropedia.com/histropediajs/licence.html', '_blank');
	}
	
	function measureTextWithStyling(ctx, text, textStyling) {
	    var prevTextBaseline = ctx.textBaseline;
	    var prevFillStyle = ctx.fillStyle;
	    var prevFont = ctx.font;
	
	    ctx.textBaseline = textStyling.textBaseline;
	    ctx.fillStyle = textStyling.fillStyle;
	    ctx.font = textStyling.font;
	
	    var result = ctx.measureText(text);
	
	    // text measuring without affecting previous state - don't want side effects
	    ctx.textBaseline = prevTextBaseline;
	    ctx.fillStyle = prevFillStyle;
	    ctx.font = prevFont;
	
	    return result;
	}
	
	function isInside(pos, rectangle) {
	    return pos.left >= rectangle.left && pos.left <= rectangle.left + rectangle.width && pos.top >= rectangle.top && pos.top <= rectangle.top + rectangle.height;
	}

/***/ }),
/* 14 */
/*!******************************************************************!*\
  !*** ./~/base64-loader!./content/histropediajs-overlay-logo.png ***!
  \******************************************************************/
/***/ (function(module, exports) {

	module.exports = "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"

/***/ }),
/* 15 */
/*!*****************************!*\
  !*** ./js/Timeline.data.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _Article = __webpack_require__(/*! ./Article */ 16);
	
	var _Article2 = __webpack_require__(/*! ./Article.data */ 9);
	
	_Timeline.Timeline.prototype.load = function (articles) {
	    this.addArticles(articles);
	    this.updateCurrentDensitySetting();
	    this.updateArticlesGroupIndex();
	    this.defaultRedraw();
	};
	// todo: yuck
	
	
	_Timeline.Timeline.prototype.addArticles = function (articles, progress, callback) {
	
	    if (articles.length == 0) {
	        if (callback) {
	            callback.call(this);
	        }
	
	        return;
	    }
	
	    /* bulk load - start */
	
	    // ignore the ones already loaded
	    var existingArticleIds = this.articles.map(function (a) {
	        return a.id;
	    });
	
	    var newArticles = [];
	    for (var i = 0; i < articles.length; i++) {
	        var article = articles[i];
	        if (existingArticleIds.indexOf((0, _Article2.getPropertyFromData)(article, "id")) === -1) {
	            newArticles.push(article);
	        }
	    }
	
	    var me = this;
	    for (var i = 0; i < newArticles.length; i++) {
	        var article = new _Article.Article(this, (0, _Article2.getPropertyFromData)(newArticles[i], "id"));
	
	        this.articles.push(article);
	
	        article.addActivatedHandler(function () {
	            me.activated(this);
	        });
	
	        article.setupByReceivedData(newArticles[i]);
	        article.registerPosition(this.getOriginalPosition(article));
	    }
	
	    this.updateIsActiveStatus();
	
	    if (callback) {
	        callback.call(this);
	    }
	};

/***/ }),
/* 16 */
/*!***********************!*\
  !*** ./js/Article.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Article = undefined;
	
	var _Article = __webpack_require__(/*! ./Article.base */ 10);
	
	__webpack_require__(/*! ./Article.anim */ 17);
	
	__webpack_require__(/*! ./Article.draw */ 18);
	
	__webpack_require__(/*! ./Article.dragging */ 20);
	
	var Article = exports.Article = _Article.Article;

/***/ }),
/* 17 */
/*!****************************!*\
  !*** ./js/Article.anim.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Article = __webpack_require__(/*! ./Article.base */ 10);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	_Article.Article.prototype.updateVisibility = function () {
		var oldVisibility = this.isVisibleAfterFade;
		var newVisibility = this.isInRange && this.isVisibleInGroup && this.isVisibleInRows && !this.isHiddenByFilter;
	
		if (oldVisibility == newVisibility) return;
		if (newVisibility && !this.isImageInfoLoaded) {
			this.setImage(); //only load image the first time article becomes visible
		}
	
		//If fade animation is OFF, set visibility straight away
		if (!this.owner.options.article.animation.fade.active) {
			this.setVisibility(newVisibility);
			return;
		}
		//else
		this.setVisibilityWithFade(newVisibility);
	};
	
	_Article.Article.prototype.setVisibility = function (visibility) {
		this.isVisible = this.isVisibleAfterFade = this.opacity = visibility; //Keep track of article.opacity and this.isVisibleAfterFade, so fade animation works correctly if turned on
	};
	
	_Article.Article.prototype.setVisibilityWithFade = function (visibility /* true or false */, withDefaultRedraw) {
		// Use withDefaultRedraw=true to include a defaultRedraw() when the animation finishes (updates stacking of periodlines after visibility changes)
		// Todo: set without anim when not inView
		var me = this;
		if (visibility == me.isVisibleAfterFade) return;
		if (me.isFading) me.fadeAnimation.dummyElement.stop();
		me.isFading = true;
		if (visibility) {
			me.isVisible = true;
		} //set isVisible immediately for fading in, but wait till end of animation when fading out
		var fadeAnimation = this.fadeAnimation;
		me.isVisibleAfterFade = fadeAnimation.finalOpacity = visibility; //store so we can check animation direction later
		var duration = me.owner.options.article.animation.fade.duration;
	
		if (me.isInView) {
			me.owner.notifyAnimationStarted("fade", me.id); //used to check if this animation will finish last (takes over redraw() on each frame if so)
		}
	
		var animationSettings = me.owner.options.article.animation.fade;
		var dummy = $("<span />").css("left", me.opacity);
	
		fadeAnimation.dummyElement = dummy.animate({ left: fadeAnimation.finalOpacity }, {
			duration: animationSettings.duration,
			easing: animationSettings.easing,
			step: function step(now, fx) {
				me.opacity = now;
				if (me.id == me.owner.lastAnimatingArticle.id) me.owner.redraw();
			},
			complete: function complete() {
				me.isFading = false;
				if (visibility == 0) {
					me.isVisible = false;
				} //When fading OUT, set isVisible at end of animation (so it's still drawn during fade out)
				if (me.id == me.owner.lastAnimatingArticle.id) {
					if (withDefaultRedraw) me.owner.defaultRedraw(true); //defaultRedraw at the end updates stacking of periodlines after visibility changes
				}
			}
		});
	};
	
	_Article.Article.prototype.moveToOffset = function (destination, withDefaultRedraw) {
		this.finalOffset.top = this.offset.top = destination.top || this.offset.top;
		this.finalOffset.left = this.offset.left = destination.left || this.offset.left;
		this.position.top = this.registeredPosition.top + this.offset.top; //set position so that normal redraw updates to show new position (as opposed to defaultRedraw, which will update pos from offset )
		this.position.left = this.registeredPosition.left + this.offset.left;
		if (withDefaultRedraw) this.owner.defaultRedraw();
	};
	
	_Article.Article.prototype.moveTo = function (destination, withDefaultRedraw) {
		var finalOffset = { left: destination.left - this.registeredPosition.left, top: destination.top - this.registeredPosition.top };
		this.moveToOffset(finalOffset);
		if (withDefaultRedraw) this.owner.defaultRedraw();
	};
	
	_Article.Article.prototype.moveToWithAnim = function (destination) {
		var finalOffset = { left: destination.left - this.registeredPosition.left, top: destination.top - this.registeredPosition.top };
		this.moveToOffsetWithAnim(finalOffset); //no redraw at end of anim, as this will make the article jump back to stacked position if autoStacking is active
	};
	
	_Article.Article.prototype.moveToOffsetWithAnim = function (destination, withDefaultRedraw) {
		// withDefaultRedraw lets you control whether to re-stack at the end of animation. This is needed during normal cycle, to restack period lines if some of them changed visibility. Not needed for one-off movements
		// Todo: set without anim when not inView
		var me = this;
		var moveAnimation = me.moveAnimation;
		if (destination.top == moveAnimation.finalOffset.top && destination.left == moveAnimation.finalOffset.left) return;
		moveAnimation.finalOffset = { left: destination.left, top: destination.top };
		if (me.isMoving) {
			moveAnimation.dummyElement.stop();
		}
		me.isMoving = true;
		if (me.isInView) {
			me.owner.notifyAnimationStarted("move", me.id); //used to check if this animation will finish last (takes over redraw() on each frame if so)
		}
		var animationSettings = me.owner.options.article.animation.move;
		var dummy = $("<span />").css("top", me.offset.top).css("left", me.offset.left);
	
		moveAnimation.dummyElement = dummy.animate({
			top: destination.top,
			left: destination.left
		}, {
			duration: animationSettings.duration,
			easing: animationSettings.easing,
			step: function step(now, fx) {
	
				me.offset.top = parseInt(dummy.css("top"));
				me.offset.left = parseInt(dummy.css("left"));
				me.position.top = me.registeredPosition.top + me.offset.top; //set position so that normal redraw updates to show new position (as opposed to defaultRedraw, which will update pos from offset )
				me.position.left = me.registeredPosition.left + me.offset.left;
	
				if (me.id == me.owner.lastAnimatingArticle.id && !me.owner.isDragging) me.owner.redraw();
			},
			complete: function complete() {
				me.isMoving = false;
				if (me.id == me.owner.lastAnimatingArticle.id) {
					if (withDefaultRedraw) me.owner.defaultRedraw(true); //update stacking of periodlines after visibility changes
				}
			}
		});
	};

/***/ }),
/* 18 */
/*!****************************!*\
  !*** ./js/Article.draw.js ***!
  \****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Article = __webpack_require__(/*! ./Article.base */ 10);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	var _utils2 = __webpack_require__(/*! ./utils.drawing */ 19);
	
	_Article.Article.prototype.draw = function (ctx) {
	    if (!this.isDataLoaded || isNaN(this.position.left)) return;
	
	    ctx.globalAlpha = this.owner.options.article.animation.fade.active ? this.opacity : 1;
	
	    var style = this._getCurrentStyle();
	
	    // the outer rectangle
	    // used to draw shadow, border, title background, star
	    var outerSpace = {
	        // always draw on the rounded pixel to avoid misplaced images and shadows due to floating point calulation
	        top: Math.floor(this.position.top),
	        left: Math.floor(this.position.left),
	        width: this._getWidth(),
	        height: this.height // height is set already based on options and image loaded height by this.adjustHeightFromLoadedImage()
	    };
	
	    // the inner rectangle
	    // used to draw title text, subtitle text, subtitle background, subtitle triangle, image
	    var innerSpace = {
	        left: outerSpace.left + style.border.width / 2,
	        top: outerSpace.top + style.border.width / 2,
	        width: outerSpace.width - style.border.width,
	        height: outerSpace.height - style.border.width
	    };
	
	    if (style.shadow) {
	        ctx.shadowOffsetX = style.shadow.x;
	        ctx.shadowOffsetY = style.shadow.y;
	        ctx.shadowBlur = style.shadow.amount;
	        ctx.shadowColor = style.shadow.color;
	
	        ctx.fillStyle = '#fff';
	        // starting just below the curve radius to avoid white colour behind the curve (we want it transparent)
	        ctx.fillRect(outerSpace.left, outerSpace.top + style.topRadius, outerSpace.width, outerSpace.height - style.topRadius);
	        (0, _utils2.noShadow)(ctx);
	    }
	
	    // main title background
	    // we make use pos rather than innerSpace here since we want smooth edges with the border -
	    // we do this by drawing the title background LARGER than the actual innerSpace
	    // the border then draws over this
	    ctx.save();
	    ctx.beginPath();
	    (0, _utils2.topRoundRectPath)(ctx, outerSpace.left, outerSpace.top, outerSpace.width, outerSpace.height, style.topRadius);
	    ctx.clip();
	
	    var titleHeight = style.header.height;
	    var subtitleHeight = style.subheader.height;
	
	    ctx.fillStyle = style.color;
	    ctx.fillRect(outerSpace.left, outerSpace.top, outerSpace.width, Math.ceil(titleHeight + style.border.width / 2));
	
	    // clip is not needed any more
	    ctx.restore();
	
	    // subtitle background
	    ctx.fillStyle = style.subheader.color;
	    ctx.fillRect(outerSpace.left, innerSpace.top + titleHeight, outerSpace.width, subtitleHeight);
	
	    // little triangle    
	    ctx.beginPath();
	    ctx.lineWidth = 1;
	    ctx.moveTo(innerSpace.left + 5, innerSpace.top + titleHeight + 1);
	    ctx.lineTo(innerSpace.left + 10, innerSpace.top + titleHeight - 5);
	    ctx.lineTo(innerSpace.left + 15, innerSpace.top + titleHeight + 1);
	    ctx.closePath();
	    ctx.fill();
	
	    // title
	    ctx.fillStyle = style.header.text.color;
	    ctx.font = style.header.text.font;
	    ctx.textAlign = "left";
	    ctx.textBaseline = "middle";
	
	    // wrap title into several lines and add ellipsis if necessary
	    var textMargin = style.header.text.margin;
	    var lineHeight = style.header.text.lineHeight;
	    var textWidth = innerSpace.width - textMargin * 2;
	
	    var maxNumberOfLines = style.header.text.numberOfLines;
	
	    if ((0, _utils.isUndefined)(this.titleLines)) {
	        this.titleLines = (0, _utils2.wrapText)(ctx, this.title, textWidth);
	
	        if (this.titleLines.length > maxNumberOfLines) {
	            this.titleLines[maxNumberOfLines - 1] = (0, _utils2.squeezeEllipsis)(ctx, this.titleLines[maxNumberOfLines - 1], textWidth);
	        }
	    }
	    var numberOfLines = Math.min(maxNumberOfLines, this.titleLines.length);
	
	    // vertical align middle
	    var allTextHeight = (numberOfLines - 1) * lineHeight;
	    var availableSpace = titleHeight;
	
	    var y = innerSpace.top - (allTextHeight - availableSpace) / 2;
	
	    for (var i = 0; i < numberOfLines; i++) {
	        ctx.fillText(this.titleLines[i], innerSpace.left + textMargin, y, textWidth);
	        y += lineHeight;
	    }
	
	    // subtitle
	    var subheaderTextMargin = style.subheader.text.margin;
	    var subtitleTextWidth = innerSpace.width - subheaderTextMargin * 2;
	
	    // we just have one line of subheader so can use default text orientation rather than manual
	    // calculation of drawing dimensions as in header
	    ctx.textBaseline = "middle";
	    ctx.fillStyle = style.subheader.text.color;
	    ctx.font = style.subheader.text.font;
	
	    if ((0, _utils.isUndefined)(this.summarisedSubtitle)) {
	        this.summarisedSubtitle = (0, _utils2.summarize)(ctx, this.subtitle, subtitleTextWidth);
	    }
	
	    ctx.fillText(this.summarisedSubtitle, innerSpace.left + subheaderTextMargin, innerSpace.top + titleHeight + subtitleHeight / 2, subtitleTextWidth);
	
	    // image
	    if (this.imageLoaded) {
	        // height of the upper part of the article (excluding image)
	        var articleTopHeight = titleHeight + style.subheader.height;
	
	        var w = innerSpace.width;
	        var h = innerSpace.height - articleTopHeight;
	        var imageLeft = innerSpace.left;
	        var imageTop = innerSpace.top + articleTopHeight;
	
	        ctx.fillStyle = '#111';
	        ctx.strokeStyle = '#111';
	        ctx.fillRect(imageLeft, imageTop, w, h);
	        ctx.drawImage(this.image, imageLeft, imageTop, w, h);
	    }
	
	    // border
	    if (style.border.width > 0) {
	        ctx.beginPath();
	        (0, _utils2.topRoundRectPath)(ctx, outerSpace.left, outerSpace.top, outerSpace.width, outerSpace.height, style.topRadius);
	
	        ctx.lineWidth = style.border.width;
	        ctx.strokeStyle = style.border.color;
	
	        // these line dashes are useful for debugging the border drawing
	        //ctx.setLineDash([5,15]);
	        ctx.stroke();
	        //ctx.setLineDash([0,0]);
	    }
	
	    // star
	    if (this.isActive || this.isStarred) {
	        var star = this.getStarBox();
	
	        var starStroke, starFill;
	        if (!this.isStarred) {
	            if (this.isMouseOverStar) {
	                starStroke = '#8A8A8A';
	                starFill = '#dfdfdf';
	            } else {
	                starStroke = '#a5a5a5';
	                starFill = '#ebebeb';
	            }
	        } else {
	            if (this.isMouseOverStar) {
	                starStroke = '#8A8A8A';
	                starFill = '#fff800';
	            } else {
	                starStroke = '#a5a5a5';
	                starFill = '#fff800';
	            }
	        }
	
	        (0, _utils2.drawStar)(ctx, star.centreX, star.centreY, 5, star.innerRadius, star.outerRadius, starFill, starStroke);
	    }
	};
	
	_Article.Article.prototype._getCurrentStyle = function () {
	    if (this.isActive) return this.activeStyle;
	
	    return this.style;
	};
	
	_Article.Article.prototype.drawPeriodLinesAndConnectors = function (ctx, top) {
	    ctx.globalAlpha = this.owner.options.article.animation.fade.active ? this.opacity : 1;
	    var style = this._getCurrentStyle();
	
	    var effectivePeriodLineSize = this.hidePeriodLine ? 0 : this.owner.options.article.periodLine.spacing;
	    var effectivePeriodLineThickness = this.hidePeriodLine ? 0 : this.owner.options.article.periodLine.thickness;
	
	    var offset = (effectivePeriodLineSize + effectivePeriodLineThickness) * this.stacking;
	    // canvas draws a line with y as the centre so we have to adjust
	    var y = top - offset - this.owner.options.style.mainLine.size / 2 - effectivePeriodLineThickness / 2;
	
	    if (!this.hidePeriodLine) {
	        // period line
	        ctx.beginPath();
	        ctx.lineWidth = effectivePeriodLineThickness;
	        ctx.strokeStyle = ctx.fillStyle = style.color;
	
	        ctx.moveTo(this.indicator.fromX, y);
	        ctx.lineTo(this.indicator.toX, y);
	        ctx.stroke();
	
	        // articles without an end date display a fading effect at the end
	        if (this.period.isToPresent) {
	            var grad = ctx.createLinearGradient(this.indicator.toX, y, this.indicator.toX + 10, y);
	            grad.addColorStop(0, style.color);
	            grad.addColorStop(1, "#fff");
	
	            ctx.strokeStyle = ctx.fillStyle = grad;
	            ctx.moveTo(this.indicator.toX, y);
	            ctx.lineTo(this.indicator.toX + 10, y);
	            ctx.stroke();
	        }
	    }
	
	    // connector line
	    var x1 = Math.max(0, this.indicator.fromX);
	    var y1 = y;
	    var x2 = this.position.left + style.connectorLine.offsetX;
	    var y2 = this.position.top + this.height + style.connectorLine.offsetY;
	
	    ctx.strokeStyle = ctx.fillStyle = style.color;
	    ctx.lineWidth = style.connectorLine.thickness;
	
	    // connector line
	    ctx.beginPath();
	    ctx.moveTo(x1, y1);
	    ctx.lineTo(x2, y2);
	    ctx.stroke();
	
	    // arrow head
	    var radians = Math.atan((y2 - y1) / (x2 - x1)) + (x2 >= x1 ? -90 : 90) * Math.PI / 180;
	    ctx.save();
	    ctx.beginPath();
	    ctx.translate(x2, y2);
	    ctx.rotate(radians);
	    ctx.moveTo(-style.connectorLine.arrow.width, 0);
	    ctx.lineTo(style.connectorLine.arrow.width, 0);
	    ctx.lineTo(0, -style.connectorLine.arrow.height);
	    ctx.closePath();
	    ctx.restore();
	    ctx.fill();
	};
	
	_Article.Article.prototype.getStarBox = function () {
	    var style = this._getCurrentStyle();
	    var sideLength = style.star.width;
	    var box = {
	        width: sideLength,
	        height: sideLength
	    };
	    box.left = Math.floor(this.position.left) - style.topRadius / 4 + this._getWidth() - box.width - style.star.margin;
	    box.top = Math.floor(this.position.top) + style.topRadius / 4 + style.star.margin;
	    box.centreX = box.left + box.width / 2;
	    box.centreY = box.top + box.height / 2;
	    box.outerRadius = box.width / 2;
	    box.innerRadius = box.outerRadius / 2;
	
	    return box;
	};
	
	_Article.Article.prototype.adjustHeightFromLoadedImage = function () {
	    var style = this._getCurrentStyle();
	
	    var imageHeight = 0;
	
	    if (this.imageLoaded) {
	        var ratioHW = this._getWidth() / this.image.width;
	        imageHeight = Math.min(this.image.height * ratioHW, style.maxImageHeight);
	    }
	
	    // height of the upper part of the article (excluding image)
	    var articleTopHeight = style.header.height + style.subheader.height + style.border.width / 2;
	
	    this.height = imageHeight + articleTopHeight;
	};

/***/ }),
/* 19 */
/*!*****************************!*\
  !*** ./js/utils.drawing.js ***!
  \*****************************/
/***/ (function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.noShadow = noShadow;
	exports.wrapText = wrapText;
	exports.summarize = summarize;
	exports.topRoundRectPath = topRoundRectPath;
	exports.drawStar = drawStar;
	exports.squeezeEllipsis = squeezeEllipsis;
	function noShadow(context) {
	    context.shadowBlur = 0.0;
	    context.shadowOffsetX = 0.0;
	    context.shadowOffsetY = 0.0;
	    context.shadowColor = "transparent black"; // disable shadow
	}
	
	function wrapText(context, text, width) {
	    var lines = [];
	    var words = text.split(/ /);
	
	    var line = "";
	    for (var n = 0; n < words.length; n++) {
	        var testLine = line + words[n];
	        var metrics = context.measureText(testLine);
	        var testWidth = metrics.width;
	
	        if (testWidth <= width) {
	            line += words[n] + " ";
	        } else if (testLine.split(/ /).length === 1) {
	            line += words[n].substr(0, 12) + "... \n";
	        } else {
	            lines.push(line);
	            line = "";
	            n--;
	        }
	    }
	
	    if (line != "") lines.push(line);
	
	    return lines;
	}
	
	function summarize(context, text, width) {
	    var shortText = text;
	    var lastChar = text.length - 1;
	    while (context.measureText(shortText).width > width) {
	        shortText = text.substr(0, lastChar) + '…';
	        lastChar--;
	    }
	
	    return shortText;
	}
	
	function topRoundRectPath(ctx, x, y, width, height, radius) {
	    ctx.moveTo(x + radius, y);
	    ctx.lineTo(x + width - radius, y);
	
	    if (radius > 0) ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	
	    ctx.lineTo(x + width, y + height);
	    ctx.lineTo(x, y + height);
	    ctx.lineTo(x, y + radius);
	
	    if (radius > 0) ctx.quadraticCurveTo(x, y, x + radius, y);
	
	    if (radius == 0) ctx.closePath();
	}
	
	function drawStar(ctx, cx, cy, spikes, r0, r1, fillColour, strokeColour) {
	
	    ctx.beginPath();
	
	    var angle = Math.PI / spikes;
	    for (var i = 0; i < 2 * spikes; i++) {
	        var r = (i & 1) == 0 ? r1 : r0;
	
	        var currX = cx + Math.cos(1 + i * angle) * r;
	        var currY = cy + Math.sin(1 + i * angle) * r;
	
	        if (i == 0) {
	            ctx.moveTo(currX, currY);
	        } else {
	            ctx.lineTo(currX, currY);
	        }
	    }
	
	    ctx.closePath();
	    ctx.lineWidth = 1;
	    ctx.strokeStyle = strokeColour;
	    ctx.fillStyle = fillColour;
	    ctx.stroke();
	    ctx.fill();
	}
	
	function squeezeEllipsis(context, text, width) {
	    text = text.trim();
	    var shortText = text + '…';
	    var lastChar = text.length - 1;
	    while (context.measureText(shortText).width > width) {
	        shortText = text.substr(0, lastChar) + '…';
	        lastChar--;
	    }
	
	    return shortText;
	}

/***/ }),
/* 20 */
/*!********************************!*\
  !*** ./js/Article.dragging.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Article = __webpack_require__(/*! ./Article.base */ 10);
	
	_Article.Article.prototype.startDragging = function (pos) {
	    if (this.isMoving) this.moveAnimation.dummyElement.stop();
	    this.isDragging = true;
	    this.dragStartOffset = { left: pos.left - this.position.left, top: pos.top - this.position.top };
	};
	
	_Article.Article.prototype.stopDragging = function () {
	    this.offset = this.finalOffset = this.moveAnimation.finalOffset = { left: this.position.left - this.registeredPosition.left, top: this.position.top - this.registeredPosition.top };
	};
	
	_Article.Article.prototype.dragging = function (pos) {
	    this.position = { left: pos.left - this.dragStartOffset.left, top: pos.top - this.dragStartOffset.top };
	    this.owner.redraw();
	};

/***/ }),
/* 21 */
/*!*********************************!*\
  !*** ./js/Timeline.articles.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	_Timeline.Timeline.prototype.getActiveArticle = function () {
		for (var i = this.articles.length - 1; i >= 0; i--) {
			if (this.articles[i].isActive) return this.articles[i];
		}
	
		return null;
	};
	
	_Timeline.Timeline.prototype.getArticleById = function (id) {
		for (var i = 0; i < this.articles.length; i++) {
			var article = this.articles[i];
	
			if (article.id == id) return article;
		}
	};
	
	_Timeline.Timeline.prototype.bringFront = function (articleId) {
	
		var index = (0, _utils.getIndexById)(this.articles, articleId);
		if (index >= 0) {
			(0, _utils.moveInArray)(this.articles, index, this.articles.length - 1);
		}
	
		this.updateIsActiveStatus();
		this.save();
	};
	
	_Timeline.Timeline.prototype.updateIsActiveStatus = function () {
		for (var i = 0; i < this.articles.length; i++) {
			this.articles[i].isActive = false;
		}
	
		// choose the topmost loaded one
		for (var i = this.articles.length - 1; i >= 0; i--) {
			if (this.articles[i].isDataLoaded) {
				this.articles[i].isActive = true;
				return;
			}
		}
	};
	
	_Timeline.Timeline.prototype.getVisibleArticlesClone = function () {
		var validArticles = [];
		for (var i = 0; i < this.articles.length; i++) {
			var article = this.articles[i];
			if (article.isVisible && article.isDataLoaded) {
				validArticles.push(article);
			}
		}
	
		return validArticles;
	};
	
	_Timeline.Timeline.prototype.hasArticle = function (articleId) {
		var article;
		for (var i = 0; i < this.articles.length; i++) {
			if (this.articles[i].id === articleId) {
				article = this.articles[i];
			}
		}
		return !isUndefined(article);
	};
	
	_Timeline.Timeline.prototype.reposition = function (article, drawCycleContext) {
		var pos = this.getOriginalPosition(article, drawCycleContext);
		article.registeredPosition = pos;
		var finalOffset = article.finalOffset; //finalOffset has been updated by stack function
	
		//if move animation is off. Set new position directly
		if (!this.options.article.animation.move.active) {
			article.position = {
				left: pos.left + finalOffset.left,
				top: pos.top + finalOffset.top
			};
	
			//always keep track of current offset, in case animation is turned on
			article.offset = {
				left: finalOffset.left,
				top: finalOffset.top
			};;
			return;
		}
	
		//else, move animation on...
		//does the article have a new destination?
		if (article.moveAnimation.finalOffset.top != finalOffset.top || article.moveAnimation.finalOffset.left != finalOffset.left) {
			//yes, move to new offset with anim
			article.moveToOffsetWithAnim(finalOffset, true /*with defaultRedraw at end*/);
		} else {
			//no animation is needed
			article.position = { // but still need to set the position (registered pos is changing on scroll and zoom)
				left: pos.left + article.offset.left,
				top: pos.top + article.offset.top
			};
		}
	};
	
	_Timeline.Timeline.prototype.getOriginalPosition = function (article, drawCycleContext) {
		var from = this.getPixel(article.period.from, drawCycleContext);
		var to = this.getPixel(article.period.to, drawCycleContext);
		var isFromNegative = isNaN(from) || from < 0;
		var isToPositive = isNaN(to) || to > 0;
	
		if (this.options.article.collectOngoing && isFromNegative && isToPositive) {
			from = 0;
		}
	
		var style = article._getCurrentStyle();
		return {
			left: from - style.connectorLine.offsetX,
			top: this.top - this.options.article.distanceToMainLine
		};
	};
	
	// reorders articles to match the order of given array of ids
	_Timeline.Timeline.prototype.reorderArticles = function (ids) {
		var result = [];
		for (var i = 0; i < ids.length; i++) {
			var index = (0, _utils.getIndexById)(this.articles, ids[i]);
			result.push(this.articles[index]);
		}
	
		this.articles = result;
	};
	
	_Timeline.Timeline.prototype.getSortedByYearClone = function () {// and keep initial order
		// assign current index to each item to use during sort
	
		// really sort them
	};
	
	_Timeline.Timeline.prototype.removeArticleById = function (id) {
		for (var i = 0; i < this.articles.length; i++) {
			if (this.articles[i].id == id) this.articles.splice(i, 1);
		}
	};
	
	// delete
	_Timeline.Timeline.prototype.deleteCurrentArticle = function () {
		if (this.articles.length == 0) return;
	
		this.removeById(this.articles, this.getActiveArticle().id);
	
		this.defaultRedraw();
	
		// update statuses
		for (var i = this.articles.length - 1; i >= 0; i--) {
			var article = this.articles[i];
			if (article.isVisible) {
				this.bringFront(article.id);
				this.activated(this.getActiveArticle());
				this.defaultRedraw();
				return;
			}
		}
	};
	
	// pretty print (for debug only)
	_Timeline.Timeline.prototype.pp = function (msg) {
		var str = "";
		for (var i = 0; i < this.articles.length; i++) {
			str += this.articles[i].title.split(' ')[0] + ",";
		}
	
		msg = msg || "";
		console.log(msg + ":" + str);
	};

/***/ }),
/* 22 */
/*!*****************************!*\
  !*** ./js/Timeline.draw.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	__webpack_require__(/*! ./Timeline.branding */ 13);
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _Article = __webpack_require__(/*! ./Article.sorters */ 8);
	
	_Timeline.Timeline.prototype.defaultRedraw = function (withoutStack /*boolean*/) {
	    //withoutStack = true will supress article stacking (used in mousemoveHandler->doDrag, to prevent stacking for small drag of timeline) 
	    this.redraw({
	        // 1. update isVisibleInGroup and after articles IsInRange is decided
	        onArticlesInRangeIsReady: function defaultRedraw_onArticlesInRangeIsReady(drawCycleContext) {
	
	            this.updateVisibleArticlesOfGroups(drawCycleContext);
	
	            // reposition sets registeredPosition which will be used in stack()
	            this.forInRangeArticles(function defaultRedraw_repositionArticles(article) {
	                this.reposition(article, drawCycleContext);
	            });
	
	            if (!withoutStack) {
	                this.stack(drawCycleContext);
	            }
	        },
	
	        // 2. make sure articles move with the dragged line by repositioning them
	        onArticlesVisiblityIsReady: function defaultRedraw_onArticlesVisiblityIsReady(drawCycleContext) {
	
	            this.updateArticleLines();
	        }
	    });
	};
	
	_Timeline.Timeline.prototype.redraw = function (callbacks) {
	    if (this.redrawInProgress) return;
	    this.redrawInProgress = true;
	    var initialTopRow = this.topRow; //trigger autofit rowSpacing if this has changed by end of draw cycle
	
	    callbacks = callbacks || {};
	    var drawCycleContext = {};
	    var ctx = this.canvasContext;
	    var width = this.getWidth();
	    var top = this.top;
	    if (!this.owner) ctx.clearRect(0, 0, width, this.top + this.options.verticalOffset);
	
	    // 1. find start and end tokens By drawing main line
	    drawCycleContext.tokens = this.drawMainLine(ctx, top, width);
	    this.invoke('onMainRangeIsReady', callbacks, drawCycleContext);
	
	    // 2. decide which articles are in range
	    this.forLoadedArticles(function redraw_articles_updateIsInRange(article) {
	        article.isInView = article.overlapsInclusiveWithDates(drawCycleContext.tokens.start, drawCycleContext.tokens.end);
	
	        //Now on article 
	        //TODO should we check this exists first?
	        if (this.options.article.autoStacking.range == _constants.RANGE_SCREEN) {
	            article.isInRange = article.isInView;
	        } else {
	            article.isInRange = true;
	        }
	
	        if (article.isInRange) {
	            article.isHiddenByFilter = article.hiddenByFilter;
	        }
	    });
	    this.invoke('onArticlesInRangeIsReady', callbacks, drawCycleContext);
	    // methods which would like to change Visiblity based on Column (group) rules or Row rules can do it in the above callback
	
	    // 3. allow articles visiblity to update their visiblity (perhaps start an animation now)
	    this.forLoadedArticles(function redraw_articles_updateVisibility(article) {
	        article.updateVisibility();
	    });
	
	    // Use new sorter to order image load queue
	    this.articleImageLoadQueue.sort(_Article.ARTICLE_IMAGE_QUEUE_SORTER);
	
	    this.invoke('onArticlesVisiblityIsReady', callbacks, drawCycleContext);
	
	    // 4. calculate and draw indicators and article parts
	    this.forInRangeArticles(function redraw_articles_setIndicators(article) {
	
	        article.indicator = {
	            // performance: canvas works better with int, hence the Math.round
	
	            fromX: Math.max(-3, Math.round(this.getPixel(article.period.from, drawCycleContext))), //-3 instead of 0 minimum ensures indicators don't 'pin' to left edge
	            toX: Math.min(this.options.width, Math.round(this.getPixel(article.period.to, drawCycleContext)))
	
	        };
	
	        // events in a year
	        if (article.indicator.toX - article.indicator.fromX < 2) article.indicator.toX = article.indicator.fromX + 2;
	
	        article.adjustHeightFromLoadedImage();
	    });
	
	    // position indicators on main line for articles in ranges (article itself might be invisible but we always draw the indicator)
	    var halfMainlineSize = this.options.style.mainLine.size >> 1; // performance: one-shift-to-right instead of floating point division by 2
	
	    ctx.beginPath();
	    this.forInRangeArticles(function redraw_articles_drawIndicators(article) {
	        if (!article.isHiddenByFilter && article.isInView) {
	            ctx.moveTo(article.indicator.fromX, top - halfMainlineSize);
	            ctx.lineTo(article.indicator.fromX, top + halfMainlineSize);
	        }
	    });
	
	    ctx.lineWidth = 3;
	    ctx.globalAlpha = 0.75;
	    ctx.strokeStyle = '#303030';
	    ctx.stroke();
	    ctx.globalAlpha = 1;
	
	    /*
	     * When drawing articles, we want the article period lines/connectors to be underneath the article headers
	     * We also want the selected article to be drawn over everything else so we draw both parts of that article at the very end
	     */
	
	    // draw article lines
	    for (var i = 0; i < this.articles.length; i++) {
	        var article = this.articles[i];
	        if (article.isDataLoaded && article.isVisible && !article.isActive) {
	            article.drawPeriodLinesAndConnectors(ctx, top);
	        }
	    }
	
	    // draw articles
	    for (var _i = 0; _i < this.articles.length; _i++) {
	        var article = this.articles[_i];
	        if (article.isDataLoaded && article.isVisible && !article.isActive) {
	            article.draw(ctx);
	        }
	    }
	
	    // draw active article
	    var activeArticle = this.getActiveArticle();
	
	    if (activeArticle && activeArticle.isVisible) {
	        activeArticle.drawPeriodLinesAndConnectors(ctx, top);
	        activeArticle.draw(ctx);
	    }
	
	    // draw branding
	    if (!this.options.disableBranding) {
	        ctx.globalAlpha = 1; //^reset in case last drawn article sets global alpha less than 1
	        this._drawBranding(ctx);
	    }
	
	    this.redrawInProgress = false;
	    if (this.options.article.autoStacking.fitToHeight && initialTopRow !== this.topRow) {
	        this.fitToHeight(true /*withDefaultRedraw*/);
	    }
	};
	
	_Timeline.Timeline.prototype.drawMainLine = function (ctx, top, width, done) {
	
	    var tokens = {};
	    var markers = {};
	    markers[_constants.MAJOR_MARKER] = [];
	    markers[_constants.MINOR_MARKER] = [];
	
	    var halfMainlineSize = this.options.style.mainLine.size >> 1; // performance: one-shift-to-right instead of floating point division by 2
	    ctx.globalAlpha = 1;
	
	    // highlight dragging area
	    if (this.isDragging && this.options.style.draggingHighlight.visible) {
	        ctx.fillStyle = this.options.style.draggingHighlight.color;
	        var highlightArea = this.options.style.draggingHighlight.area;
	
	        ctx.fillRect(0, top - highlightArea.up, width, highlightArea.up + highlightArea.down);
	    }
	
	    // generate tokens
	
	    var x = this.repositionWindow;
	
	    var token = this.timescaleManager.startToken;
	    tokens.start = token.value;
	    var endToken = token;
	
	    //go back several tokens so that date labels start being drawn from a position that is OFF the left edge of the screen.
	    //Todo: make this calculated from a number of pixels which can be set in options for left and right edges of screen.
	    var leftBufferNumberOfTokens = 9; //9 tokens always reaches next major marker for zoom levels > month
	    var token = this.timescaleManager.getPreviousNth(token, leftBufferNumberOfTokens);
	    x -= token.length * leftBufferNumberOfTokens;
	
	    do {
	        tokens[token.value.toKeyString()] = token.drawX = x;
	        markers[token.type].push(token); //store tokens by type for later drawing same types together
	        x += token.length;
	        endToken = token;
	        token = this.timescaleManager.getNext(token);
	    } while (x < width + 150); //extra 150px to stop articles disappearing early on right edge of screen. Todo: add to options
	
	    tokens.end = endToken.value;
	
	    // draw main line
	    if (this.options.style.mainLine.visible) {
	        var mainLineGradient = ctx.createLinearGradient(0, top - halfMainlineSize, 0, top + halfMainlineSize);
	        mainLineGradient.addColorStop(0, '#808080');
	        mainLineGradient.addColorStop(1, '#ccc');
	
	        ctx.beginPath();
	        ctx.lineWidth = this.options.style.mainLine.size;
	        ctx.strokeStyle = ctx.fillStyle = mainLineGradient;
	        ctx.moveTo(0, top);
	        ctx.lineTo(width, top);
	        ctx.stroke();
	
	        for (var type in markers) {
	            this.drawMarkersAndLabels(ctx, markers[type], type, top + halfMainlineSize);
	        }
	    }
	    return tokens;
	};
	
	_Timeline.Timeline.prototype.drawMarkersAndLabels = function (ctx, tokens, tokenType, markerTop) {
	    if (tokens.length === 0) return;
	    //Expects groups of markers of same type.
	    //Labels only drawn if first marker has label defined.
	    switch (tokenType) {
	        case JSON.stringify(_constants.MINOR_MARKER):
	            tokenType = "minor";
	            break;
	        case JSON.stringify(_constants.MAJOR_MARKER):
	            tokenType = "major";
	            break;
	        default:
	            console.log("token type not recognised", tokenType, _constants.MINOR_MARKER);
	    }
	    var markerStyle = this.options.style.marker[tokenType];
	    var markerHeight = markerStyle.height;
	    var withLabel = !!tokens[0].label;
	    var isInFuture = tokens[0].value.isInFuture();
	    var wasInPast = !isInFuture;
	
	    if (withLabel) {
	        var labelStyle = this.options.style.dateLabel[tokenType];
	        ctx.font = labelStyle.font;
	        ctx.textAlign = labelStyle.textAlign;
	        ctx.textBaseline = "alphabetic";
	        var labelY = markerTop + markerHeight + labelStyle.offset.y;
	    }
	
	    ctx.beginPath();
	    for (var i = 0; i < tokens.length; i++) {
	        var token = tokens[i];
	
	        // upon transition from past to future draw all the past markers and start a new path
	        isInFuture = token.value.isInFuture();
	        if (wasInPast && isInFuture) {
	            wasInPast = false;
	            ctx.strokeStyle = markerStyle.color;
	            ctx.lineWidth = 1;
	            ctx.stroke();
	            ctx.beginPath();
	        }
	
	        var drawX = Math.round(token.drawX); // performance: canvas works better with int
	        ctx.moveTo(drawX, markerTop);
	        ctx.lineTo(drawX, markerTop + markerHeight);
	
	        if (withLabel && token.label) {
	            var labelX = drawX + labelStyle.offset.x;
	            ctx.fillStyle = isInFuture ? labelStyle.futureColor : labelStyle.color;
	            ctx.fillText(token.label, labelX, labelY);
	        }
	    }
	
	    ctx.strokeStyle = isInFuture ? markerStyle.futureColor : markerStyle.color;
	    ctx.lineWidth = 1;
	    ctx.stroke();
	};

/***/ }),
/* 23 */
/*!******************************!*\
  !*** ./js/Timeline.stack.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _Article = __webpack_require__(/*! ./Article.sorters */ 8);
	
	_Timeline.Timeline.prototype.updateArticleLines = function () {
	
	    var me = this;
	
	    function prepare(articles) {
	        var result = [];
	
	        me.forVisibleArticles(function (article) {
	            if (!article.hidePeriodLine) {
	                //don't stack hidden period lines
	                result.push(article);
	                result[result.length - 1].stacking = -1;
	            }
	        });
	        result.sort(me.options.article.periodLine.stacking.sorter);
	        if (me.options.article.periodLine.stacking.reverseOrder) result.reverse();
	        return result;
	    }
	
	    function canPutOnStack(article, articlesOnStack) {
	
	        // if there isn't an overlapping between this and other, then it's fine
	        for (var i = 0; i < articlesOnStack.length; i++) {
	            if (article.overlaps(articlesOnStack[i])) return false;
	        }
	
	        return true;
	    }
	
	    var articles = prepare(this.articles);
	
	    var currentStack = 0;
	    var stacks = [];
	    do {
	
	        stacks[currentStack] = [];
	        var articleAddedToStack = false;
	
	        for (var i = 0; i < articles.length; i++) {
	            var article = articles[i];
	
	            if (article.stacking >= 0) // already done
	                continue;
	
	            if (canPutOnStack(article, stacks[currentStack])) {
	                stacks[currentStack].push(article);
	                article.stacking = currentStack;
	                articleAddedToStack = true;
	            }
	        }
	
	        currentStack++;
	    } while (articleAddedToStack);
	
	    // apply stacking to real articles
	};
	
	_Timeline.Timeline.prototype.stack = function (drawCycleContext) {
	    if (this.articles.length == 0) return;
	
	    var me = this,
	        rowHeight = this.options.article.autoStacking.rowSpacing;
	
	    // do not stack if Manual setting is selected
	    if (!this.options.article.autoStacking.active) return;
	
	    // // // PRIVATE FUNCTIONS
	    // Sorts the article into the correct order to be painted (selected > starred (sorted by rank) > non-starred (sorted by rank)
	    function prepare(articles) {
	        var selected;
	        var starred = [];
	        var rest = [];
	
	        for (var i = 0; i < articles.length; i++) {
	            var article = articles[i];
	
	            if (article.isDataLoaded && article.isInRange && article.isVisibleInGroup && !article.isHiddenByFilter) {
	                if (article.isActive) {
	                    selected = article;
	                } else if (article.isStarred) {
	                    starred.push(article);
	                } else {
	                    rest.push(article);
	                }
	            }
	        }
	
	        starred.sort(_Article.ARTICLE_RANK_SORTER);
	        rest.sort(_Article.ARTICLE_RANK_SORTER);
	
	        return [].concat(selected ? selected : [], // in case nothing is selected
	        starred, rest);
	    }
	
	    // Checks if the given article's header overlaps with any of the other article headers in the row
	    function overlapsWithNoArticleInRow(row, article) {
	        for (var i = 0; i < row.length; i++) {
	            var articleInRow = row[i];
	            if (article.headerOverlapsWith(articleInRow)) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	
	    function findLastOverlappingRow(rows, article) {
	        for (var i = rows.length - 1; i >= 0; i--) {
	            if (!overlapsWithNoArticleInRow(rows[i], article)) {
	                return i;
	            }
	        }
	
	        return -1;
	    }
	
	    function findFirstAvailableRow(rows, article) {
	        for (var i = 0; i < rows.length; i++) {
	            if (overlapsWithNoArticleInRow(rows[i], article)) {
	                return i;
	            }
	        }
	
	        // return one row after the topmost
	        return rows.length;
	    }
	
	    // put the article in the first available space
	    function tryPutInRowsHorizontal(rows, article) {
	
	        var firstAvailableRow = findFirstAvailableRow(rows, article);
	
	        if (firstAvailableRow >= rows.length) rows[firstAvailableRow] = [];
	
	        rows[firstAvailableRow].push(article);
	        return true;
	    }
	
	    // Tries to put the article in the rows on the page, returning false if it does not fit in any.
	    function tryPutInRowsVertical(rows, article) {
	
	        var overlapRowIndex = findLastOverlappingRow(rows, article);
	        var nextRow = overlapRowIndex + 1;
	
	        // add a new row
	        if (nextRow >= rows.length) rows[nextRow] = [];
	
	        rows[nextRow].push(article);
	        return true;
	    }
	
	    // --------    
	
	    var articles = prepare(this.articles),
	        rows = [];
	
	    // put them in rows - we set the visibility here so that updateArticleLines knows which articles will really be visible
	    // in manual setting we return before this point so visibility is not altered in that case
	    for (var i = 0; i < articles.length; i++) {
	        // note: as a result of amp #27164 isVisibleInRows will be always true
	        articles[i].isVisibleInRows = tryPutInRowsHorizontal(rows, articles[i]);
	    }
	
	    this.topRow = 0;
	
	    for (var r = 0; r < rows.length; r++) {
	        for (var i = 0; i < rows[r].length; i++) {
	            var article = rows[r][i];
	            article.finalOffset = {
	                left: 0, // keep lines straight and vertical
	                top: r * -rowHeight
	            };
	
	            article.row = r;
	            if (article.isInView) this.topRow = Math.max(this.topRow, r); //track highest used row for articles in view
	
	            this.reposition(article, drawCycleContext);
	        }
	    }
	
	    var currentActiveArticle = this.getActiveArticle();
	    // fix z orders: put items on top behind the rest
	    this.articles.sort(_Article.ARTICLE_ROW_SORTER); //when move animation is turned on, article.row will be the DESTINATION row (row after animation is complete). This gives the best visual effect, as articles change draw order immediately then animate into position with no more order changes
	
	    // bring selected to front
	    if (currentActiveArticle) {
	        this.bringFront(currentActiveArticle.id);
	    }
	};
	
	_Timeline.Timeline.prototype.isInManualStackingMode = function () {
	    return this.options.article.rowSpacing == 0;
	};
	
	_Timeline.Timeline.prototype.notifyEventSpacingChanged = function () {
	    var me = this;
	
	    function repositionOffscreenArticles() {
	        var topOfCanvas = -(this.canvas.height() - this.options.article.distanceToMainLine);
	
	        for (var i = 0; i < me.articles.length; i++) {
	            var article = me.articles[i];
	            // if article is not visible in rows or is drawn off screen
	            if (!article.isVisibleInRows || article.offset.top <= topOfCanvas) {
	                article.isVisibleInRows = true;
	
	                article.offset = {
	                    left: 0, // keep lines straight and vertical
	                    top: topOfCanvas // top of canvas
	                };
	            }
	        }
	    }
	
	    if (this.isInManualStackingMode()) {
	        repositionOffscreenArticles();
	    }
	    this.defaultRedraw();
	};

/***/ }),
/* 24 */
/*!********************************!*\
  !*** ./js/Timeline.storage.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	_Timeline.Timeline.prototype.getStatusForSave = function () {
	    // zoom and from 
	    var from = this.timescaleManager.startToken.value;
	    var articleSaveInfo = [];
	
	    for (var i = 0; i < this.articles.length; i++) {
	        articleSaveInfo.push(this.articles[i].getStatusForSave());
	    }
	
	    return JSON.stringify({
	        t: this.title,
	        o: this.ownerId, //#uiupdate set by server *** we need this so that ownerId can be used to calculate button visibility
	        pd: this.isInPublicDirectory,
	        z: this.timescaleManager.zoom,
	        // todo: confirm removal with Shayan
	        //d: this.eventSpacingSelector.val(),
	        fy: from.year,
	        fm: from.month,
	        fd: from.day,
	        w: this.repositionWindow,
	        a: articleSaveInfo,
	        v: this.version
	    });
	};
	
	// calls save only after callers stopped calling this function repetitively
	_Timeline.Timeline.prototype.deferredSave = function () {
	    if (isEmbeddedMode) return;
	
	    if (this.saveSchedule) {
	        clearTimeout(this.saveSchedule);
	    }
	
	    var me = this;
	    this.saveSchedule = setTimeout(function () {
	        me.save();
	        me.saveSchedule = null;
	    }, 500);
	};
	
	_Timeline.Timeline.prototype.save = function () {
	    if (this.restoring) return;
	
	    if (this.options.onSave) this.options.onSave(this.getStatusForSave());
	
	    // todo: in histro attach this to onSave
	    // also decide what state should be passed to the onSave function
	    //if (state)
	    //    state = JSON.stringify(state);
	
	    //localStorage.setItem(STATE_KEY, state|| this.getStatusForSave());
	};
	
	_Timeline.Timeline.prototype.getCurrentState = function () {
	    return JSON.parse(localStorage.getItem(STATE_KEY) || '{"a":[]}');
	};
	
	_Timeline.Timeline.prototype.mergeWithLocalStorage = function (newState) {
	    var state = this.getCurrentState();
	    var articles = state.a;
	    // to reassign colours in new state
	    var colour,
	        currentIds = [];
	
	    for (var i = 0; i < articles.length; i++) {
	        var article = articles[i];
	        if (isUndefined(colour) || article.c > colour) {
	            colour = article.c + 1;
	        }
	        currentIds.push(article.i);
	    }
	
	    // merge
	    for (var i = 0; i < newState.a.length; i++) {
	        var article = newState.a[i];
	        if (currentIds.indexOf(article.i) == -1) {
	
	            article.c = colour % PERIOD_COLOURS.length;
	            colour++;
	
	            state.a.push(article);
	        }
	    }
	
	    return state;
	};

/***/ }),
/* 25 */
/*!******************************!*\
  !*** ./js/Timeline.wheel.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _Dmy = __webpack_require__(/*! ./Dmy */ 5);
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	var _utils = __webpack_require__(/*! ./utils */ 6);
	
	_Timeline.Timeline.prototype.enableZoomByWheel = function () {
	    var me = this;
	
	    this.canvas.mousewheel(function (event, delta) {
	        me.onWheel(event, delta);
	    });
	};
	
	_Timeline.Timeline.prototype.onWheel = function (event, delta) {
	    var oldZoom = this.timescaleManager.zoom;
	    var speed = this.options.zoom.wheelSpeed;
	
	    var newZoom = oldZoom + -delta * speed * this.options.zoom.wheelStep;
	
	    if (newZoom > this.options.zoom.maximum) newZoom = this.options.zoom.maximum;
	    if (newZoom < this.options.zoom.minimum) newZoom = this.options.zoom.minimum;
	
	    var mousePositionX = event.pageX - this.canvas.parent().offset().left;
	    this.setZoomByPivotPixel(newZoom, mousePositionX);
	
	    this.defaultRedraw();
	    (0, _utils.preventDefault)(event);
	};
	
	_Timeline.Timeline.prototype.setZoom = function (newZoom, pivotPixel, offsetX) {
	    //offsetX optionally used for left/right movement while zooming e.g. with pinch gesture
	    var pivotPixel = pivotPixel || this.width / 2; //default to zoom from centre
	    if (offsetX) {
	        offsetX = Math.round(offsetX);
	    }
	    this.setZoomByPivotPixel(newZoom, pivotPixel, offsetX);
	    this.defaultRedraw();
	};
	
	// zoom with pivot updates the 'from' in a way that current point (pivot) 
	// stays still and the rest of the objects zoom around it
	_Timeline.Timeline.prototype.setZoomByPivotPixel = function (newZoom, pivotPixel, offsetX) {
	    this.setZoomByPivotPoint(newZoom, this.getPivotPoint(pivotPixel), pivotPixel, offsetX);
	};
	
	_Timeline.Timeline.prototype.setZoomByPivotPoint = function (newZoom, pivotPoint, pivotPixel, offsetX) {
	    var offsetX = offsetX || 0;
	    this.timescaleManager.setZoom(newZoom);
	
	    // move the start date to the pivot point to make sure it is in view
	    var compensation = this.timescaleManager.setStartDate(pivotPoint.date);
	    this.repositionWindow = compensation - pivotPoint.fraction;
	
	    this.updateFromByPixels(-pivotPixel + offsetX);
	    // notice: here calling setZoom takes place BEFORE updating start token
	    // so any zoom-change-listerns logic which relies on 'start token' will have unexpected behaviour
	    // TODO: fix or include in the new drawCycle logic
	};
	
	_Timeline.Timeline.prototype.getPivotPoint = function (pixel) {
	
	    var token = this.timescaleManager.getStartTokenCloned();
	    var x = this.repositionWindow;
	
	    // go one token back from startToken if necessary (based on repositionWindow)
	    if (x >= 0) {
	        token = this.timescaleManager.getPrevious(token);
	        x -= token.length;
	    }
	
	    var prevToken = token;
	    while (x <= pixel) {
	        x += token.length;
	        prevToken = token;
	        token = this.timescaleManager.getNext(token);
	    }
	
	    // set date details that might not be available in the token (when zoom in > day)
	    var dmy = prevToken.value;
	    var year = dmy.year;
	    var month = dmy.month;
	    var day = dmy.day;
	    var unit = prevToken.unit;
	    var fraction = pixel - (x - token.length);
	    var len = prevToken.length;
	
	    if (unit === _constants.ZOOM_MONTH) {
	        day = Math.floor(fraction / len * 30.44) + 1;
	        fraction -= (day - 1) * len / 30.44;
	        prevToken.value = new _Dmy.Dmy(year, month, day);
	    } else if (unit !== _constants.ZOOM_DAY) {
	        //zoom year and above
	        var yearMultiple = this.timescaleManager.unitLengthInYears;
	        var daysFromToken = Math.floor(fraction * 365.2422 * yearMultiple / len) + 1;
	        //performance: at higher zoom levels find approximate number of years within daysFromToken to prevent too many year iterations during Dmy.getByDayOfYear()
	        var extraYears = 0;
	        if (daysFromToken > 365) {
	            extraYears = Math.floor(daysFromToken / 365);
	            daysFromToken = daysFromToken - 365 * extraYears;
	        }
	        // fraction is now too low to be noticable 
	        fraction = 0;
	        prevToken.value = _Dmy.Dmy.getByDayOfYear(year + extraYears, daysFromToken);
	    }
	
	    return {
	        date: prevToken.value,
	        fraction: fraction
	    };
	};

/***/ }),
/* 26 */
/*!*****************************!*\
  !*** ./js/Timeline.anim.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Timeline = __webpack_require__(/*! ./Timeline.base */ 2);
	
	var _constants = __webpack_require__(/*! ./constants */ 3);
	
	_Timeline.Timeline.prototype.switchToPositiveRepositionWindow = function () {
	    // There are two ways to express a Start point in combination with Reposition Window
	    // One of them is the year and a negative reposition window, the other one is next year and a positiove reposition window.
	    // The effect on the screen is basically the same.
	    // But some oprations (like go to year by animation) may need the positive window value for their calculations.
	
	    if (this.repositionWindow < 0) {
	        var start = this.timescaleManager.startToken;
	        this.repositionWindow = start.length + this.repositionWindow;
	        start = this.timescaleManager.getNext(start);
	
	        this.timescaleManager.setStartToken(start);
	    }
	};
	
	_Timeline.Timeline.prototype.zoomToAnim = function (newZoom, _complete) {
	    var dummy = $("<span />").css("left", this.timescaleManager.zoom);
	    var me = this;
	
	    dummy.animate({
	        left: newZoom
	    }, {
	        duration: 2000,
	        step: function step(now, fx) {
	            me.setZoom(now);
	            me.invalidated();
	        },
	        complete: function complete() {
	            if (_complete) _complete.call(me);
	        }
	    });
	};
	
	_Timeline.Timeline.prototype.goToDateAnim = function (dmy, options) {
	    // options are {offsetX, complete}
	    options = options || {};
	    var dummy = $("<span />").css("left", 0);
	    this.switchToPositiveRepositionWindow();
	
	    var pixels = this.getPixelsBetween(dmy, this.timescaleManager.startToken.value);
	    if (options.offsetX) pixels -= options.offsetX - this.repositionWindow;
	
	    if (isNaN(pixels)) {
	        pixels = this.getPixelsToDateDay(dmy);
	
	        if (isNaN(pixels)) {
	            // don't use animation, jump to the date
	            console.log('Point too far away, jumping instead of animation');
	            this.timescaleManager.setStartDate(dmy);
	            if (options.complete) options.complete.call(me);
	            return;
	        }
	    }
	
	    var me = this;
	    var oldValue = 0;
	
	    dummy.animate({
	        left: pixels
	    }, {
	        duration: options.duration || 2000,
	        easing: 'swing',
	        step: function step(now, fx) {
	            var amount = now - oldValue;
	            oldValue = now;
	            me.updateFromByPixels(amount);
	            me.defaultRedraw();
	        },
	        complete: function complete() {
	            if (options.complete) options.complete.call(me);
	        }
	    });
	};
	
	_Timeline.Timeline.prototype.getPixelsBetween = function (a, b) {
	
	    var unit = this.timescaleManager.unit;
	    if (unit <= _constants.ZOOM_DAY) return NaN;
	
	    var proximateDays = (a.year - b.year) * 372.0 + (a.month - b.month) * 31.0 + (a.day - b.day);
	
	    if (unit == _constants.ZOOM_MONTH) {
	        return proximateDays * this.timescaleManager.unitSizeInPixels / 31.0;
	    } else {
	        //zoom year and above
	        var unitYearMultiple = this.timescaleManager.unitYearMultiple;
	        return proximateDays * this.timescaleManager.unitSizeInPixels / (372.0 * unitYearMultiple);
	    }
	};
	
	_Timeline.Timeline.prototype.getPixelsToDateDay = function (dmy) {
	
	    function hasReached(unit, a, b, direction) {
	
	        if (direction == -1) return hasReached(unit, b, a, -direction);
	
	        if (unit == _constants.ZOOM_DAY) return a.isSame(b) || a.isAfter(b);
	        //if (unit == ZOOM_MONTH) return a.year >= b.year && a.month >= b.month;
	        //if (unit == ZOOM_YEAR) return a.year >= b.year;
	        //if (unit == ZOOM_DECADE) return a.year / 10 >= b.year / 10;
	        //if (unit == ZOOM_CENTURY) return a.year / 100 >= b.year / 100;
	
	        console.error('unknown unit:' + unit);
	    }
	
	    var startToken = this.timescaleManager.startToken;
	    var direction = startToken.value.isAfter(dmy) ? -1 : 1;
	    var pixels = 0;
	    var token = startToken;
	
	    while (!hasReached(token.unit, token.value, dmy, direction)) {
	        token = direction == -1 ? this.timescaleManager.getPrevious(token) : this.timescaleManager.getNext(token);
	        pixels += direction * token.length;
	
	        // safty break
	        if (pixels > 100000) return NaN;
	    }
	
	    return pixels;
	};
	
	_Timeline.Timeline.prototype.repositionWithAnim = function (article) {
	
	    var pos = this.getOriginalPosition(article);
	    article.registeredPosition = pos;
	
	    var destination = { left: pos.left + article.dragFinishOffset.left, top: pos.top + article.dragFinishOffset.top };
	    article.moveToWithAnim(destination);
	};
	
	_Timeline.Timeline.prototype.notifyAnimationStarted = function (animationType, articleId) {
	    //Used to track the animation that will finish last. This 'leading' animation will take care of redraw on each frame. 
	    var now = new Date().getTime();
	
	    var duration = this.options.article.animation[animationType].duration;
	
	    var endTime = now + duration;
	
	    if (endTime > this.lastAnimatingArticle.endTime) {
	        //if this animation will finish later than the last 'leading' animation, store the id and end time
	        this.lastAnimatingArticle.id = articleId;
	        this.lastAnimatingArticle.endTime = endTime;
	    }
	};
	
	_Timeline.Timeline.prototype.toggleAutoFit = function () {
	    //toggle automatic fit to height on/off
	    var isFitToHeightOn = this.options.article.autoStacking.fitToHeight = !this.options.article.autoStacking.fitToHeight;
	    if (isFitToHeightOn) {
	        this.fitToHeight(true);
	    }
	    return isFitToHeightOn;
	};
	
	_Timeline.Timeline.prototype.fitToHeight = function (withRedraw) {
	    //for non-auto 'fit-to-screen'
	    var numberOfRows = this.topRow + 1; //this.topRow = 0 for row 1, this.topRow = 1 for row 2 etc.
	    if (numberOfRows === 1) return; //nothing to fit with single row
	    var rowSpacing = this.options.article.autoStacking.rowSpacing = this.getFitToHeightRowSpacing();
	    if (withRedraw) {
	        this.defaultRedraw();
	    }
	    return rowSpacing;
	};
	
	_Timeline.Timeline.prototype.getFitToHeightRowSpacing = function () {
	    var options = this.options;
	    var firstRowTop = this.top - options.article.distanceToMainLine;
	    var lastRowTop = options.article.autoStacking.topGap;
	    var topRowNumber = this.topRow;
	    if (topRowNumber == 0) return false;
	    var stackingSpace = Math.abs(firstRowTop - lastRowTop);
	    var numberOfRows = topRowNumber;
	    return Math.max(Math.round(stackingSpace / numberOfRows), 1);
	};
	
	_Timeline.Timeline.prototype.incrementRowSpacing = function (change, withRedraw) {
	    this.options.article.rowSpacing = Math.max(this.options.article.rowSpacing + change, 1);
	    if (withRedraw) {
	        this.defaultRedraw();
	    }
	    return this.options.article.rowSpacing;
	};

/***/ })
/******/ ])
});
;
//# sourceMappingURL=Histropedia.js.map