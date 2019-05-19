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
  
    
    App.prototype.colorCodeGroups = {} 
    
    App.prototype.setupColorCodeOptions = function() {
        // add dropdown colour code options to UI
    }
    
    App.prototype.setColorCode = function(property) {
        // updates colour of all articles and gets counts for each colour code group
        // sort legend by count, and append count to all colour code group labels
    }
    
    /****************** Private functions ******************/
    
    function getColorCodeGroups(property) {
        // Loop through articles, store each Q number found as key in groups object (if not already there)
        // Push article to groups[value].article (e.g. groups["Q5"].push(article)
        // If article does not have the colour code property, push it to groups["noValue"] (creating if necessary)
        
    }
    
})() 
    
    