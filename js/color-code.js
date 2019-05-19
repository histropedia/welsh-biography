//  Extends App class with all colour code related properties and methods
//  Includes private functions and variables, and click handlers for user changing the colour code
//
//  App.colorCodeGroups stores all data for the active color code, populated by getColorCodeGroups(property)
//      - Each group uses Wikidata Q number as key (e.g. "Q49757" for a poet)
//      - Contains group label in en and cy
//      - visibleCount to show how many articles currently match
//      - complete list of actual articles objects on the timeline
//
//  App.colorCodeGroups is then used for all further actions, like applying article colours,
//  rendering the legend or filtering the timeline

(function() {

    App.prototype.colorCodeGroups = {} // groups for currently applied colour code
    
    App.prototype.setupColorCodeOptions = function() {
        // add dropdown colour code options to UI
    }
    
    App.prototype.setColorCode = function(property) {
        this.colorCodeGroups = getColorCodeGroups(this.timeline, property);
        
        // renderLegend()
        
        this.state.appliedColorCode = property;
    }
    
    /****************** Private functions ******************/
    
    function getColorCodeGroups(timeline, property) {
        // Loop through articles, store each Q number found as key in colour groups object
        // Articles without a statement using selected property are stored with "noValue" key instead
        var colorGroups = {};
        var articles = timeline.articles;
        for (var i=0; i < articles.length; i++ ) {
            var article = articles[i];
            var statement = article.data.statements[property];
            var statementValue = (statement && statement.values[0]) ?
                statement.values[0]: 
                "noValue";
            
            //add new empty colorGroups entry if not already found
            if (!colorGroups.hasOwnProperty(statementValue)) {
                colorGroups[statementValue] = {
                    color: "",
                    articles: [],
                    visibleCount: 0,
                    labelEn: "",
                    labelCy: ""
                };
            }
            
            //update colorGroups entry
            colorGroups[statementValue].articles.push(article);
            if (!article.isHiddenByFilter) colorGroups[statementValue].visibleCount += 1;
        }
        
        return colorGroups;
    }
    
})() 
    
    