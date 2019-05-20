//  Extends App class with all colour code related properties and methods
//  Includes private functions and variables, and click handlers for user changing the colour code
//
//  App.colorGroups stores all data for the active color code, populated by getcolorGroups(property)
//      - Each group uses Wikidata Q number as key (e.g. "Q49757" for a poet)
//      - Contains group label in en and cy
//      - visibleCount to show how many articles currently match
//      - complete list of actual articles objects on the timeline
//
//  App.colorGroups is then used for all further actions, like applying article colours,
//  rendering the legend or filtering the timeline

(function() {

    App.prototype.colorGroups = {}          // groups for currently applied colour code
    App.prototype.orderedColorGroups = []   // used for assigning colours, and rendering the legend
    
    App.prototype.setupColorCodeOptions = function() {
        // add dropdown colour code options to UI
    }
    
    App.prototype.setColorCode = function(property) {
        this.colorGroups = getcolorGroups(this.timeline, property);
        this.orderedColorGroups = getOrderedColorGroups(this.colorGroups);
        assignColorGroupColors(this);
        appyTimelineColors(this.colorGroups);
        // renderLegend()
        
        this.state.appliedColorCode = property;
    }
    
    /****************** Private functions ******************/
    
    // Get main colorGroups object used by all other colour code related functions
    function getcolorGroups(timeline, property) {
        var colorGroups = {};
        var articles = timeline.articles;
        for (var i=0; i < articles.length; i++ ) {
            var article = articles[i];
            var statement = article.data.statements[property];
            var statementValue = (statement && statement.values[0]) ?
                statement.values[0]: 
                "noValue"; // articles without a statement using selected property are stored with "noValue" key instead
            
            // add new empty colorGroups entry if not already found
            if (!colorGroups.hasOwnProperty(statementValue)) {
                colorGroups[statementValue] = {
                    color: "",
                    articles: [],
                    visibleCount: 0,
                    labelEn: "",
                    labelCy: ""
                };
            }
            
            // update colorGroups entry
            colorGroups[statementValue].articles.push(article);
            if (!article.isHiddenByFilter) colorGroups[statementValue].visibleCount += 1;
        }
        
        return colorGroups;
    }
    
    // Convert colorGroups to array sorted by count of visible articles
    function getOrderedColorGroups(colorGroups) {
        var sorter = function(a, b) {
            var result = b.visibleCount - a.visibleCount;
            if (result === 0) result = b.item > a.item;
            return result;
        };
        
        var orderedGroups = Object.entries(colorGroups).map(function(entry) {
            // Combine the two array elements of each entry returned by Object.entries()
            var item = entry[0];
            var cleanedEntry = entry[1];
            entry[1].item = item;
            return entry[1];
        });
        
        return orderedGroups.sort(sorter);
    }
    
    // Set the colour used for each colourGroup from list in options
    function assignColorGroupColors(app) {
        var colorGroups = app.colorGroups;
        var orderedColorGroups = app.orderedColorGroups;
        var colors = app.options.colorCode.colors;
        for (var i=0; i < orderedColorGroups.length; i++) {
            var group = orderedColorGroups[i];
            var item = group.item;
            group.color = colorGroups[item].color = colors[ i % colors.length - 1]
        }
    }
    
    // Colour articles on the timeline according to the current active colour code
    function appyTimelineColors(colorGroups) {
       for (var group in colorGroups) {
           var groupArticles = colorGroups[group].articles;
           var groupColor = colorGroups[group].color;
           
           for (var i=0; i < groupArticles.length; i++) {
               var article = groupArticles[i];
               article.setStyle("color", groupColor);
           }
       }
    }
    
})() 
    
    