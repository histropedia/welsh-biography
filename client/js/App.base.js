import {ContentPanel} from './ContentPanel';
import {APP_OPTIONS, TIMELINE_OPTIONS} from './options';

export function App() {    
    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        urlParamters = getUrlParameters(),
        disableEffects = urlParamters.nofx;
    
    this.isMobile = windowWidth < 450 || windowHeight < 450;
    this.isPortrait = windowWidth < windowHeight;
    
    
    this.state = {
        // can be used to store states for browser history, or to create share URLs with current state
        appliedFilters: {}, // e.g. { P19: ["Q84", "Q90"], P27: ["Q47"] }
        appliedColorCode: "", // e.g. "P27"
        filterPanel: {
            isOpen: false,
            panel: "", // e.g. "P19"
        },
        colorCodePanel: {
            isOpen: false,
        },
        contentPanel: {
            isOpen: false,
            isSummaryMode: false,
            tab: ""
        }
    };
    
    this.options = APP_OPTIONS;
    
    this.createTimeline = function(container, articles) {
        var defaultOptions = TIMELINE_OPTIONS.default,
            sizeSpecificOptions = getTimelineOptions(),
            options = $.extend(true, {}, defaultOptions, sizeSpecificOptions);
        
        this.timeline = new Histropedia.Timeline( container, options );
        this.timeline.load(articles);
    }
    
    this.contentPanel = new ContentPanel(this, this.options.contentPanel);
    
    this.windowResized = function () {
        updateWindowSettings()
        this.timeline.setOption(getTimelineOptions());
        this.timeline.fitToHeight(true /*with redraw*/);
    }
    
    /****************** Private functions ******************/
    
    function getTimelineOptions() {
        var size = ( windowHeight < 450 ) ? 'small' : 'large';
        //deep copy of size specific options
        var options = $.extend( true , {}, TIMELINE_OPTIONS[size] );
        options.width = windowWidth;
        options.height = windowHeight;
        
        if (disableEffects) extendNofxTimelineOptions(options);
        return options;
    }
    
    function updateWindowSettings() {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        this.isPortrait = windowWidth < windowHeight;
    }
    
    function getUrlParameters () {
        var parametersObject = {};
        var parameters = window.location.search.substr(1);
        if (parameters == "") return {};
        parameters = parameters.split('&');
        for (var i = 0; i < parameters.length; i++) {
            var splitParameters = parameters[i].split('=');
            parametersObject[ splitParameters[0] ] = splitParameters[1];
        }
        return parametersObject;
    };
    
    function extendNofxTimelineOptions(options) {
        var effectsOptions = {
            article: {
                animation: {
                    fade: {
                        active: false
                    },
                    move: {
                        active: false
                    }
                },
                periodLine: {
                    defaultHide: true
                },
                autoStacking: {
                    range: Histropedia.RANGE_SCREEN
                }
            }
        }
        $.extend(true, options, effectsOptions)
    }
    
    //add window resize event passing this context
    $(window).resize($.proxy(this.windowResized, this))
}