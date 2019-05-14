function App() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	this.isMobile = windowWidth < 450 || windowHeight < 450;
	this.isPortrait = windowWidth < windowHeight;
	
	this.state = {
		//can be used to store states for browser history, or to create share URLs with current state
		appliedFilters: {}, // e.g. { P19: ["london", "paris"], P27: ["UK"]  }
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
		this.state.appliedFilters[property].push(value);
		
		//update visiblity of all timeline articles
		this.applyFilters();
	}	
	
	this.removeFilter = function(property, value) { 
		var propertyFilters = this.state.appliedFilters[property];
		if (!propertyFilters) return console.error("no filter setup for property: ", property);
		
		//remove filter from this.state
		var valueIndex = propertyFilters.indexOf(value);
		if (valueIndex === -1) return console.error("no filter found using value: ", value);
		propertyFilters.splice(valueIndex, 1);
		
		//update visiblity of all timeline articles
		this.applyFilters();
	}
	
	this.applyFilters = function () {
	//sets the visibility of all articles on the timeline according to currently applied filters
		var appliedFilters = this.state.appliedFilters;
		
		//check all articles on the timeline
		this.timeline.forLoadedArticles(function(article) {
			article.hiddenByFilter = !getArticleVisiblityFromFilters(article, appliedFilters);
		})
		
		this.timeline.defaultRedraw();
	}
	
	this.setupFilterOptions = function () {
		//setup blank array for each filter property
		for (var property in this.options.filters) {
			this.state.appliedFilters[property] = [];
		}
	}
	
	this.setColourCode = function(property) {
		//updates colour of all articles and gets counts for each colour code group
		//sort legend by count, and append count to all colour code group labels		
	}
	
	this.windowResized = function () {
		updateWindowSettings()
		this.timeline.setOption(getTimelineOptions());
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
	
	function getArticleVisiblityFromFilters(article, appliedFilters) {
		//article will not be visible if it fails to match any active filters
		
		var articleStatements = article.data.statements;
		
		for (var property in appliedFilters) {
			var propertyFilters = appliedFilters[property]
			if (propertyFilters.length === 0) continue;

			//active filters found for this property, now check if the article has matching values
			var articleStatements = articleStatements[property].values;
			if (!articleStatements) return false;

			//article has statements using this property, check if each active filter value is present
			for (var i=0; i < propertyFilters.length; i++) {
				//is this filter value missing from the article's statements?
				if (!articleStatements.includes(propertyFilters[i])) {
					//yes? article must be hidden
					return false;
				}
			}
			//check next filter property...
		}
		//all filter properties and values exist in article statements, so it's visible
		return true
	}
	
	//add window resize event passing this context
	$(window).resize($.proxy(this.windowResized, this))
}