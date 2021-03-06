//  Extends App class with all filter related properties and methods
//
//  Sets up filters from properties chosen in App.options
//  After setup you can Add/Remove filters by property and value
//  Search results for each filter are regenerated when panel opens if they've changed 

import {App} from './App.base'; 
var filterData = {};

App.prototype.setupFilterOptions = function () {
    var optionsElements = [];
    var searchBoxElements = []
    for (var i=0; i< this.options.filters.length; i++) {
        var filterProperty = this.options.filters[i],
            filterLabel = this.getLabel.property(filterProperty),
            $optionElement = $(getFilterOptionHtml(filterProperty, filterLabel)),
            $searchElement = $(getSearchBoxHtml(filterProperty));

        // add property to state
        this.state.activeFilters[filterProperty] = [];

        // setup filter data
        filterData[filterProperty] = {
            label: filterLabel,
            $search: $searchElement,
            needsUpdate: true, // only update search results needed
        }

        // add option for filter types panel
        optionsElements.push($optionElement);

        // add search box on filter panel
        searchBoxElements.push($searchElement);
    }

    // append generated html
    $('#filter-types-list-container').html(optionsElements);
    $('#filter-search-panel .panel-content').append(searchBoxElements);

    // wrap in divs for easy hide/show
    $('.filter-panel-search').wrap('<div class="filter-search-container"></div>');

    // add filter on select
    var me = this;
    $('.filter-panel-search').on('select2:select', function(ev) {
        var selected = ev.params.data;

        // close the filter search panel before adding the filter, to prevent unecessary search results update
        me.closeAllPanels();
        me.addFilter(selected.property, selected.id);
    })

    function getFilterOptionHtml(property, label) {
        return '<button type="button" filter-property=' + property + ' class="btn btn-outline-secondary btn-lg" style="text-align: left">' + label + '<i class="fas fa-chevron-right"></i> <span class="label-active-filters"> </span> </button>';
    }

    function getSearchBoxHtml(filterProperty) {
        // wrap search in div to allow easy show/hide
        return '<select class="filter-panel-search" filter-property="{{property}}" style="width:100%"></select>'
            .replace('{{property}}', filterProperty);
    }
}

App.prototype.addFilter = function(property, value, fitArticles=true) {
    this.state.activeFilters[property].push(value);
    var valueLabel = this.getLabel.item(value);
    addFilterTagHtml(property, value, valueLabel);
    this.filtersChanged();

    // after adding filters, pan to see earliest visible article
    if (fitArticles) {
        var offsetX = (!this.contentPanel.isOpen || this.isMobile)? 0 : 450;
        this.timeline.fitArticles({offsetX: offsetX, withAnim: true})
    }
}    

App.prototype.removeFilter = function(property, value) { 
    var propertyFilters = this.state.activeFilters[property];
    if (!propertyFilters) return console.error("no filter setup for property: ", property);

    var valueIndex = propertyFilters.indexOf(value);
    if (valueIndex === -1) return console.error("no filter found using value: ", value);
    propertyFilters.splice(valueIndex, 1);
    removeFilterTagHtml(property, value);
    this.filtersChanged();
}

App.prototype.clearAllFilters = function () {
    for (var property in this.state.activeFilters) {
        this.state.activeFilters[property] = [];
    }
    $('#active-filters-container').empty();
    this.filtersChanged();
}

App.prototype.filtersChanged = function () {
    // notify all filter search boxes they need to update
    for (var prop in filterData) {
        filterData[prop].needsUpdate = true;
    }
    this.applyFilters();
    this.updateFilterTypeButtons();

    if (this.state.filterPanel.panel) {
        // filter search panel is open when filters changed, so search box needs updating
        this.updateFilterSearchResults(this.state.filterPanel.panel)
    }

    if (this.getActiveFilterCount() > 0) {
        $('#btn-open-filters').addClass("active");
    } else {
        $('#btn-open-filters').removeClass("active");
    }

    // re-apply colour code to calculate counts
    if (this.state.appliedColorCode) this.setColorCode(this.state.appliedColorCode);
}

App.prototype.applyFilters = function () {
//sets the visibility of all articles on the timeline according to currently applied filters
    var activeFilters = this.state.activeFilters;

    //check all articles on the timeline
    this.timeline.forLoadedArticles(function(article) {
        article.hiddenByFilter = !getArticleVisiblityFromFilters(article, activeFilters);
    })

    this.timeline.defaultRedraw();
}

/****************** Filter panels ******************/

App.prototype.openFilterTypesPanel = function () {
    $('#filter-types-panel').show();
    this.state.filterPanel.isOpen = true;
}

App.prototype.closeFilterTypesPanel = function () {
    $('#filter-types-panel').hide();
    this.state.filterPanel.isOpen = false;
}

App.prototype.openFilterSearchPanel = function (property) {

    $('#filter-search-panel').show();

    var filterSettings = filterData[property];
    var needsUpdate = filterSettings.needsUpdate;

    if (needsUpdate) {
        this.updateFilterSearchResults(property);
    }
    
    // Update filter tags for the current property on the filter search panel
    this.updateFilterPanelTagsHtml(property, this.state.activeFilters);

    // Update the property label in title of the filter panel
    $('#filter-property-label').text(filterSettings.label);

    $('.filter-search-container').hide();
    filterSettings.$search.parent().show();
    this.state.filterPanel.panel = property;
}

App.prototype.closeFilterSearchPanel = function () {
    $('#filter-search-panel').hide();
    this.state.filterPanel.panel = "";
}

// Updates the active filter tags shown within buttons on filter types panel
App.prototype.updateFilterTypeButtons = function() {
    var me = this;
    var activeFilters = this.state.activeFilters;
    for (var property in activeFilters) {
        var propertyFilters = activeFilters[property];
        var filterLabels = propertyFilters.map( function(filterValue) {
            return me.getLabel.item(filterValue);
        })
        var filterHtmlTags = filterLabels.join(", ");
        $('button[filter-property=' + property + '] .label-active-filters').text(filterHtmlTags);
    }
}

/****************** Filter search ******************/

// Add the filter tags that shows in the Filter Search Panel
App.prototype.updateFilterPanelTagsHtml = function(filterProperty, activeFilters) {
    for (var prop in activeFilters) {
        if (prop === filterProperty) {
            var filterValues = activeFilters[prop];
            var filtersHtml = "";
            for (var i=0; i<filterValues.length; i++) {
                var value = filterValues[i];
                var label = this.getLabel.item(value);
                filtersHtml += getFilterTagHtml(filterProperty, value, label);
            }
            return $('#panel-active-filters-container').html(filtersHtml);
        }
    }
}
App.prototype.updateFilterSearchResults = function(filterProperty) {
    // select2 does not support templated results for dynamically added options
    // so we need to destroy and re-initialise the search box

    var filterSettings = filterData[filterProperty],
        stateAppliedFilters = this.state.activeFilters[filterProperty],
        articles = this.timeline.articles,
        filterValues = {};

    for (var i=0; i < articles.length; i++) {
        if (articles[i].data.isContextEvent) continue;
        var statement = articles[i].data.statements[filterProperty];
        if (articles[i].isHiddenByFilter || !statement || statement.values.length === 0) continue; 

        for (var j=0; j < statement.values.length; j++) {
            var valueId = statement.values[j], // this is the Wikidata item number of the value
                valuelabel = this.getLabel.item(valueId);
            if (filterValues.hasOwnProperty(valueId)) {
                // increment counter if already seen
                filterValues[valueId].count += 1;
            } else {
                // if not, create a new entry
                filterValues[valueId] = {
                    id: valueId,
                    text: valuelabel,
                    count: 1,
                    property: filterProperty
                }
            }
            // check next statement value ...
        }
        // check next article ...
    }

    var sortedResults = Object.values(filterValues).sort(function(a, b) {
        return b.count - a.count;
    })

    var finalResults = removeActiveFiltersFromResults(stateAppliedFilters, sortedResults);
    reInitialiseSelect2(finalResults, filterProperty, this.getLabel.property(filterProperty));
    filterSettings.needsUpdate = false;
}

App.prototype.getActiveFilterCount = function() {
    var count = 0;
    for (var property in this.state.activeFilters) {
        count += this.state.activeFilters[property].length;
    }
    return count;
} 



/****************** Private functions ******************/

function reInitialiseSelect2(results, filterProperty, filterLabel) {
    var data = filterData[filterProperty],
        $controlElement = data.$search;

    // remove the old select2 instance if present
    if ($controlElement.data('select2')) $controlElement.select2("destroy");

    // remove option tags 
    $($controlElement).empty();

    var placeholderText; 
    if (LANG === "en") {
        placeholderText = "Search for *property* filters";
    } else {
        placeholderText = "Chwiliwch am hidlwyr *property*";
    };

    // re-initialise
    $controlElement.select2({
        data: results,
        placeholder: placeholderText.replace( "*property*", filterLabel),
        templateResult: searchResultsFormat,
    });

    $controlElement.val(null).trigger('change'); // start with nothing selected
}

// select2 results template
function searchResultsFormat(state) {
    if (!state.id) {
        return state.text;
    }
    var $state = $('<span class="filter-result-label">' + state.text + '</span><span class="filter-result-count">&nbsp;' + '(' + state.count + ')' + '</span>');
    return $state;
}

// Remove any activeFilters from results list for given filter property 
function removeActiveFiltersFromResults(activeFilters, searchResults) {
    var filteredResults = searchResults.filter(function(result) {
        return !activeFilters.includes(result.id);
    })

    return filteredResults;
}


function getArticleVisiblityFromFilters(article, activeFilters) {
    // article will not be visible if it fails to match any active filters

    if (article.data.isContextEvent) {        
        return article.owner.showContextEvents;
    }

    var articleStatements = article.data.statements;

    for (var property in activeFilters) {
        var propertyFilters = activeFilters[property]
        if (propertyFilters.length === 0) continue;

        // active filters found for this property, now check if the article has matching values
        if (typeof articleStatements[property] === "undefined") return false;
        var articleValues = articleStatements[property].values;
        if (!articleValues) return false;

        // article has statements using this property, check if each active filter value is present
        for (var i=0; i < propertyFilters.length; i++) {
            // is this filter value missing from the article's statements?
            if (!articleValues.includes(propertyFilters[i])) {
                // yes? article must be hidden
                return false;
            }
        }
        // check next filter property...
    }
    // all filter properties and values exist in article statements, so it's visible
    return true
}

function getFilterTagHtml(property, value, label) {
    return '<span class="active-filter-tag badge" filter-property="' + property + '" filter-value="' + value + '">' + label + '<a><i class="fa fa-times remove-filter-tag-btn"></i></a></span>';
}

// Add the main filter tags that show in the header bar
function addFilterTagHtml(property, value, label) {
    $('#active-filters-container').append(getFilterTagHtml(property, value, label));
}

function removeFilterTagHtml(property, value) {
    $('.active-filter-tag').each(function(index, element) {
        var tagProperty = $(this).attr('filter-property'),
            tagValue = $(this).attr('filter-value');
        if (property === tagProperty && value === tagValue) {
            $(this).remove();
        }
    })
}