import {ContentPanel} from './ContentPanel';
import {TIMELINE_OPTIONS, APP_OPTIONS} from './options';

export function App() {    
    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        urlParameters = getUrlParameters(),
        disableEffects = urlParameters.nofx;
    
    this.isMobile = windowWidth < 450 || windowHeight < 450;
    this.isPortrait = windowWidth < windowHeight;
    
    
    this.state = {
        // can be used to store states for browser history, or to create share URLs with current state
        activeFilters: {}, // e.g. { P19: ["Q84", "Q90"], P27: ["Q47"] }
        appliedColorCode: "", // e.g. "P27"
        filterPanel: {
            isOpen: false,
            panel: "", // e.g. "P19"
        },
        contextEvents: false,
        colorCodePanel: {
            isOpen: false,
        },
        contentPanel: {
            isOpen: false,
            isSummaryMode: false,
            tab: ""
        },
        infoPanel: {
            isOpen: false
        }
    };
    
    this.options = APP_OPTIONS;
    
    // Add any number of optional article array arguments after container
    this.createTimeline = function(container) {
        var defaultOptions = TIMELINE_OPTIONS.default,
            sizeSpecificOptions = getTimelineOptions(),
            options = $.extend(true, {}, defaultOptions, sizeSpecificOptions);
        
        this.timeline = new Histropedia.Timeline( container, options );
        for (var i=1; i<arguments.length; i++) {
            this.timeline.load(arguments[i]);
        }
    }
    

    this.contentPanel = new ContentPanel(this, this.options.contentPanel);
    
    this.windowResized = function () {
        this.updateWindowSettings();
        this.timeline.setOption(getTimelineOptions());
        this.timeline.fitToHeight(true /*with redraw*/);
    }

    this.updateWindowSettings = function () {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        this.isPortrait = windowWidth < windowHeight;
    }

    this.openInfoPanel = function () {
        $('#info-panel').show();
        this.state.infoPanel.isOpen = true;
    }

    this.closeInfoPanel = function () {
        $('#info-panel').hide();
        this.state.infoPanel.isOpen = false;
    }

    this.closeAllPanels = function () {
        this.closeInfoPanel();
        this.closeFilterTypesPanel();
        this.closeFilterSearchPanel();
        this.contentPanel.close();
    }
    
    /****************** Private functions ******************/
    
    function getTimelineOptions() {
        var size = ( windowHeight < 450 ) ? 'small' : 'large';
        //deep copy of size specific options
        var options = $.extend( true , {}, TIMELINE_OPTIONS.default, TIMELINE_OPTIONS[size] );
        options.width = windowWidth;
        options.height = windowHeight;
        
        if (disableEffects) extendNofxTimelineOptions(options);
        return options;
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