// Related Content Panel
//
// Tab switching buttons use 'tab' attribute to define the tab type
// Must be within tabButtonsContainer specified in options
// You can add handlers for onClose(), onOpen() or onSelectArticle(article) in options

export function ContentPanel(owner, options) {
	
    //Default options
	this.options = {
		textCharacterLimit: 100,
		defaultTab: 'wikipedia',
		tabs: {
			wikipedia: {
				elementId: 'reading-panel-iframe',
				update: function(article) {
                    var url;
                    if (article.data.statements.article) {
                        url = article.data.statements.article.values[0].replace('://en', '://en.m');
                    } else {
                        url = 'no-article.html' + '?name=' + article.data.title;
                    }
                    
                    $('#' + this.elementId).prop('src', url);
					
				},
                /*isButtonVisible: function(article) {
                    return !!article.data.statements.article
                }*/
			},
			
			dwb: {
				elementId: 'reading-panel-iframe',
				update: function(article) {
					$('#' + this.elementId).prop( 'src',  'https://biography.wales/article/' + article.data.statements.dwbId.values[0])
				}
			}
		},
		selectors: {
			container: '#reading-panel',
			tabButtonsContainer: '.reading-panel-btns-container',
			openButton: '.btn-open-reading',
			closeButton: '#btn-close-reading-panel',
			iframe: '#reading-panel-iframe'
		},
	};
	
	$.extend(true /*deep*/, this.options,options);
	
    this.owner = owner;
	this.selectedArticle = null;
	this.container = $(this.options.selectors.container);
	this.iframe = $(this.options.selectors.iframe)
    this.activeTab = this.options.defaultTab;
	this.needsUpdate = true;
	this.isOpen = false;
	this.isMiniMode = false;

	//clicks on tab switching buttons
	var me = this;
	$(this.options.selectors.tabButtonsContainer).click( function(event) {
		if (event.target === event.currentTarget) return false
		var tab = $(event.target).attr('tab');
	
		me.switchTab(tab);					 
		me.container.removeClass('selected');  //switches off mini-card description for full open reading window
		
		$(event.target).blur();
		return false;
	});
	
	//open button click
	$(this.options.selectors.openButton).click( function(event) {
		me.open();
		return false;
	});
	
	//close button click
	$(this.options.selectors.closeButton).click( function(event) {
		me.close();
		return false;
	});
    
    // only show IFrame once loaded, allowing background spinner gif to be seen
    // switch tab functions take care of hiding when content changes
    $(this.options.selectors.iframe).on('load', function() {
        $('.reading-panel-content').show();
    })
}

///////////////////////////////////
/////////// tab content ///////////
///////////////////////////////////

ContentPanel.prototype.setArticle = function (article) {
    this.selectedArticle = article;
    if (this.isOpen && !this.container.hasClass('selected')) {
        this.updateActiveTab();
    }
    else {
        this.needsUpdate = true;
		// auto-open mini mode
		if ( !(this.owner.isMobile && !this.owner.isPortrait) ) { // exclude mobile landscape
            // only if not already open. We need to leave the panel in it's current state if fully/mini open 
			if (!this.isOpen) { 
				this.openMini();
			}
		}
    }
    
    // check for visibility of tab buttons according to selectedArticle data
	this.updateButtonVisibility(); 
		
	// update HTML that's visible for all tabs (i.e. header info)
	$('.label-event-title').text(article.data.title);
	$('.label-event-date').text(article.data.subtitle) ;
	
	if (article.data.description) {
		this.setDescription(article.data.description);
	}
	
	if (this.options.onSetArticle) {
		this.options.onSetArticle(article);
	}
};
ContentPanel.prototype.setDescription = function (text) {
	$('.label-event-desc').text(text);
}

ContentPanel.prototype.switchTab = function (tab) {
	var tabData = this.options.tabs[tab];
	if (!tabData) return console.log('no tab data for',tab)
	
	this.activeTab = tab;
	this.isMiniMode = false; // fully open once any tab is opened
	this.updateActiveTab();
	
	// set tab visibility
    // todo: control tab visiblity with active-panel class
    $('.reading-panel-content .active-panel').hide().removeClass("active-panel");
    $('#' + tabData.elementId).show().addClass("active-panel");
	
	// reassign the active class on tab buttons
	var buttonsContainer = this.options.selectors.tabButtonsContainer;
    $( buttonsContainer + ' button.active' ).removeClass('active');
    $( buttonsContainer + ' button[tab=' + this.activeTab + ']' ).addClass('active');
	
	if (this.options.onSwitchTab) this.options.onSwitchTab()
};

ContentPanel.prototype.updateTab = function (tabName) {
    $('.reading-panel-content').hide();
	var article = this.selectedArticle;
	var tab = this.options.tabs[tabName];
	if (!tab) return console.log('no tab data for',tabName)
	tab.update(article); // run update function for tab
};

ContentPanel.prototype.updateActiveTab = function () {
	this.updateTab(this.activeTab);
    this.needsUpdate = false;
};

ContentPanel.prototype.updateButtonVisibility = function () {
	var article = this.selectedArticle;
	var buttonsContainerSelector = this.options.selectors.tabButtonsContainer;
	
	var tabs = this.options.tabs;
	
	for (var tabName in tabs) { // loop through all tabs
		var buttonVisible;
		var tabData = tabs[tabName];
		if (tabData.isButtonVisible) { // if check function exists, use it
			buttonVisible = tabData.isButtonVisible(article); //check if button should be visible for selected article
		} else {
			buttonVisible = true; // default to visible button
		}
		var buttonElement = $(buttonsContainerSelector + ' [tab=' + tabName + ']');
		if (buttonVisible) {
			buttonElement.show();
		} else {
			buttonElement.hide();
			if (tabName === this.activeTab) { // if active tab gets hidden, switch to the default tab
				this.switchTab(this.options.defaultTab)
			}
		}	
	} //next tab
};

ContentPanel.prototype.getSummarisedText = function (text, characterLimit) {
	if (text.length > characterLimit) {
		text = text.slice(0,characterLimit) + ' ...';
	}
	return text;
};

/////////////////////////////////////////
////////// Opening and closing //////////
/////////////////////////////////////////

ContentPanel.prototype.open = function () {
    // make sure there is an active tab
    if (this.activeTab === null) {
      this.switchTab(this.options.defaultTab);
    }
	
	// add active class to tab launch button
	var buttonsContainer = this.options.selectors.tabButtonsContainer;
	$( buttonsContainer + ' button[tab=' + this.activeTab + ']' ).addClass('active');
	this.container.show();
	this.container.removeClass('selected') // switch content panel to 'full' mode
	this.isOpen = true;
	this.isMiniMode = false;
	
    if (this.needsUpdate) {
		 this.updateActiveTab();
	}
	if (this.options.onOpen) {
		this.options.onOpen(this.isMiniMode);
	}
}

ContentPanel.prototype.openMini = function () {
    if (this.selectedArticle === null) return
	this.container.show();
	this.container.addClass('selected') // switch content panel to 'mini' mode
	this.isOpen = true;
	this.isMiniMode = true;
	if (this.options.onOpen) {
		this.options.onOpen(this.isMiniMode);
	}
}

ContentPanel.prototype.close = function () {
	this.container.hide();
	this.isOpen = false;
	this.isMiniMode = false;
	this.activeTab = null;
	
	//remove active class
	var buttonsContainer = this.options.selectors.tabButtonsContainer;
    $( buttonsContainer + ' button.active' ).removeClass('active');
	
	if (this.options.onClose) {
		this.options.onClose();
	}
}

ContentPanel.prototype.toggle = function () {
    this.isOpen ? this.close() : this.open();
};


