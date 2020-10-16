import {ContentPanel} from './ContentPanel';
import {TIMELINE_OPTIONS, APP_OPTIONS} from './options';

export function App(timelineData, containerSelector) {    
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
        sharePanel: {
            isOpen: false
        },
        infoPanel: {
            isOpen: false
        }
    };
    
    this.options = APP_OPTIONS;
    this.timeline = null;
    this.setupTimeline = function() {
        this.timeline = createTimeline(containerSelector, timelineData.articles);
        this.setupTimelineSearch('#search-box');
        this.setupFilterOptions();

        // Setup colour code options from property list in options
        //DWB.setupColorCodeOptions();
        //DWB.setColorCode(DWB.options.colorCode.properties[0]);

        // Colour scale code by gender and rank
        var femaleFilter = {property: "P21", value:"Q6581072"};
        var maleFilter = {property: "P21", value:"Q6581097"};
        this.setRankColorScale(240 /*hue*/, femaleFilter );
        this.setRankColorScale(125 /*hue*/, maleFilter );

        this.timeline.showContextEvents = false;

        if (urlParameters.filters) {
            const sharedFilters = urlParameters.filters.split("|");
            for (let i=0; i< sharedFilters.length; i++) {
                const parts = sharedFilters[i].split(":"),
                      prop = parts[0],
                      values = parts[1].split(",");
                values.forEach(value => this.addFilter(prop, value, /*fitArticles*/ false))
            }
        }

        if (urlParameters.zoom) {
            this.timeline.timescaleManager.setZoom(parseFloat(urlParameters.zoom))
        }
        
        if (urlParameters.start) {
            const offset = parseFloat(urlParameters.offset || 0);
            console.log(urlParameters.start)
            this.timeline.setStartDate(urlParameters.start, offset);
        }
        
        this.filtersChanged();
    }

    this.getLabel = {
        property: function(property) {
            return timelineData.labels.properties[property] || property;
        },
        item: function(item) {
            return timelineData.labels.items[item] || item;
        }
    }
    
    this.contentPanel = new ContentPanel(this, this.options.contentPanel);
    
    this.windowResized = function () {
        this.updateWindowSettings();
        this.timeline.setOption(getTimelineOptions());
        this.timeline.fitToHeight(true /*with redraw*/);
        if (
            this.isMobile &&
            !this.isPortrait &&
            this.contentPanel.isOpen &&
            this.contentPanel.isMiniMode
            ) this.contentPanel.close();
    }

    this.updateWindowSettings = function () {
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        this.isPortrait = windowWidth < windowHeight;
    }

    this.openSharePanel = function () {
        $('#share-panel').show();
        this.state.sharePanel.isOpen = true;
    }

    this.closeSharePanel = function () {
        $('#share-panel').hide();
        this.state.sharePanel.isOpen = false;
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
        this.closeSharePanel();
        this.closeInfoPanel();
        this.closeFilterTypesPanel();
        this.closeFilterSearchPanel();
        this.contentPanel.close();
    }
    
    /****************** Private functions ******************/
    
    // Add any number of optional article array arguments after container
    function createTimeline(containerSelector /*, articles1, articles2...]*/) {
        var options = getTimelineOptions()
        var timeline = new Histropedia.Timeline( $(containerSelector)[0], options );
        for (var i=1; i<arguments.length; i++) {
            timeline.load(arguments[i]);
        }

        // Increase density of articles when zoomed in
        // Todo: Use single custom density settings object in next HistropediaJS version
        timeline.timescaleManager.addZoomChangedHandler(function() {
            var zoom = timeline.timescaleManager.zoom;
            if (zoom < 15 ) {
                timeline.options.article.density = Histropedia.DENSITY_ALL;
            } else if (zoom < 20) {
                timeline.options.article.density = Histropedia.DENSITY_HIGH;
            } else {
                timeline.options.article.density = options.article.density;
            }
        })

        return timeline;
    }

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
    
    this.setupTimeline();

    //add window resize event passing this context
    $(window).resize($.proxy(this.windowResized, this))
}