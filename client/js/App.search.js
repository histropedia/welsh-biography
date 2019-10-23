//  Extends App class with all timeline sesrch related properties and methods
//
//  Links a search box to the timeline with setup function
//  Generates search results based on articles on the timeline
//  Selecting a result selects and zooms to the article on the timeline

import {App} from './App.base';
    
var $searchElement;

App.prototype.setupTimelineSearch = function(inputSelector) {
    $searchElement = $(inputSelector);
    var me = this;

    // Todo: setup client side i18n
    var groupLabels = {
        en_GB: {
            contextEvent: "Welsh History",
            biographyEvent: "People"
        },

        cy: {
            contextEvent: "Hanes Cymru",
            biographyEvent: "Bobl"
        },
    }
    
    var searchResults = this.timeline.articles.map(function(article) {
        var type = article.data.isContextEvent ? "contextEvent" : "biographyEvent";
        return {
            value: article.data.title,
            data: {
                id: article.id,
                subtitle: article.data.subtitle,
                description: article.data.description || "",
                type: type,
                category: groupLabels[currentLang][type]
            }
        }
    })

    // Need to sort by category to avoid multiple instance of each group
    searchResults.sort(function(result) {
        return (result.data.type === "contextEvent") ? +1 : -1;
    })

    $searchElement.autocomplete({
        lookup: searchResults,
        lookupLimit: 100,
        groupBy: "category",
        onSelect: function (result) {
            var articleId = result.data.id,
                article = me.timeline.getArticleById(articleId),
                wasArticleHiddenByFilter = article.hiddenByFilter;
            // make article visible if it's not already
            // if hidden by filter, it will disappear again when you 
            article.hiddenByFilter = false; 
            me.timeline.bringFront(articleId); //select and bring to front
            article.activated(); // fire click event 
            var pixelOffsetX = (me.isMobile) ? 45 : 560;
            me.timeline.goToDateAnim(article.period.from, {
                offsetX: pixelOffsetX,
                complete: function() {article.hiddenByFilter = wasArticleHiddenByFilter; console.log("DONE!")}
            });
        },
        formatResult: function (result) {
            return '<span class="search-result-label">' + result.value + '</span><span class="search-result-date">' + result.data.subtitle + '</span>';
        },
        triggerSelectOnValidInput: false
    })
}


App.prototype.setSearchInputValue = function(value) {
     $searchElement.val(value);
}
