//  Extends App class with all filter related properties and methods
//
//  Sets up filters from properties chosen in App.options
//  After setup you can Add/Remove filters by property and value
//  Search results for each filter are only generated when panel opens

(function() { 
    
    App.prototype.setupFilterOptions = function () {
        var optionsHtml = '';
        for (var property in this.options.filters) {
            var filter = this.options.filters[property];
            
            //setup blank array for each filter property
            this.state.appliedFilters[property] = [];
            
            //add option for filter types page
            optionsHtml += getFilterOptionHtml(property, filter.label)
        }
        
        $('#filter-types-list-container').html(optionsHtml);
    }
    
    App.prototype.addFilter = function(property, value) {
        this.state.appliedFilters[property].push(value);
        this.applyFilters();
    }    
    
    App.prototype.removeFilter = function(property, value) { 
        var propertyFilters = this.state.appliedFilters[property];
        if (!propertyFilters) return console.error("no filter setup for property: ", property);
        
        var valueIndex = propertyFilters.indexOf(value);
        if (valueIndex === -1) return console.error("no filter found using value: ", value);
        propertyFilters.splice(valueIndex, 1);
        
        this.applyFilters();
    }
    
    App.prototype.applyFilters = function () {
    //sets the visibility of all articles on the timeline according to currently applied filters
        var appliedFilters = this.state.appliedFilters;
        
        //check all articles on the timeline
        this.timeline.forLoadedArticles(function(article) {
            article.hiddenByFilter = !getArticleVisiblityFromFilters(article, appliedFilters);
        })
        
        this.timeline.defaultRedraw();
    }
    
    /****************** Filter panels ******************/
    
    
    /****************** Filter search ******************/
    
    
    /****************** Private functions ******************/
    
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
    
    function getFilterOptionHtml(property, label) {
        //todo: get label from property id
        return '<button type="button" filter-property=' + property + ' class="btn btn-outline-secondary btn-lg" style="text-align: left">' + label + '<i class="fas fa-chevron-right"></i> <span class="label-selected-filters"> </span> </button>'
    }
    
})()