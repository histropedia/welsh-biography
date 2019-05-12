function App() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	this.isMobile = windowWidth < 450 || windowHeight < 450;
	this.isPortrait = windowWidth < windowHeight;
	
	this.state = {
		//can be used to store states for browser history, or to create share URLs with current state
		appliedFilters: [], // decide between {property: P19, value: "London"} or { P19: ["london", "paris"], P27: ["UK"]  }
		appliedColorCode: "", //uses property as id, e.g. "P27"
		filterPanel: {
			isOpen: false,
			panel: "", //uses property as id, e.g. "P19"
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
			options = $.extend( true, {}, defaultOptions, sizeSpecificOptions);
		
		this.timeline = new Histropedia.Timeline( container, options );
		this.timeline.load(articles);
	}
	
	this.addFilter = function(property, value) {
		//add new filter to this.state
		//update visiblity of all timeline articles
		//update article counts for all inactive filter options
	}	
	
	this.removeFilter = function( property, value ) { 
		//remove filter from this.state
		//update visiblity of all timeline articles
		//update article counts for all inactive filter options
	}
	
	this.setColourCode = function( property ) {
		//updates colour of all articles and gets counts for each colour code group
		//sort legend by count, and append count to all colour code group labels		
	}
	
	this.windowResized = function() {
		updateWindowSettings()
		this.timeline.setOption( getTimelineOptions() );
		this.timeline.fitToHeight(true /*with redraw*/);
	}
	
	
	function updateWindowSettings() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		this.isPortrait = windowWidth < windowHeight;
	}
	
	function getTimelineOptions() {
		var size = ( windowHeight < 450 ) ? 'small' : 'large';
		//deep copy of size specific options
		var options = $.extend( true , {}, TIMELINE_OPTIONS[size] );
		options.width = windowWidth;
		options.height = windowHeight;
		return options;
	}
	
	//add window resize event passing this context
	$(window).resize( $.proxy(this.windowResized, this) )
}