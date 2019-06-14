//  Extends App class with all timeline sesrch related properties and methods
//
//  Links a search box to the timeline with setup function
//  Generates search results based on articles on the timeline
//  Selecting a result selects and zooms to the article on the timeline


(function() {
    
    var $searchElement;
    
    App.prototype.setupTimelineSearch = function(inputSelector) {
        $searchElement = $(inputSelector);
        var me = this;
        var searchResults = this.timeline.articles.map(function(article) {
            return {
                value: article.data.title,
                data: {
                    id: article.id,
                    subtitle: article.data.subtitle,
                    description: article.data.description || ""
                }
            }
        })
        
        $searchElement.autocomplete({
            lookup: searchResults,
            lookupLimit: 100,
            //groupBy: "category",
            onSelect: function (result) {
                var articleId = result.data.id,
                    article = me.timeline.getArticleById(articleId);
                
                me.timeline.bringFront(articleId); //select and bring to front
                article.activated(); // fire click event 
                me.timeline.setStartDate(article.period.from, 450);
            },
           // formatResult: function (result) {
           //     return '<span class="person-label">' + result.value + '</span><br><span class="from-year">' + result.data.birthYear + '</span>';
           // },
            triggerSelectOnValidInput: false
        })
    }
    
    
    App.prototype.setSearchInputValue = function(value) {
         $searchElement.val(value);
    }
    
    
})() 
    
    