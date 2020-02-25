import {App} from './js/App';
import {registerEvents} from './js/events';

// Todo: remove once client side translation system complete
window.LANG = $('html').attr("lang");

// Get timeline data
$.getJSON('data/' + LANG + '/timeline-data.json', function(timelineData) {

    // Todo: move to createTimeline method
    appendWidthToImageUrls(timelineData.articles, 175)

    // Initialise app and render timeline
    window.DWB = new App(timelineData,"#timeline-container");

    // Setup clicks and other UI events
    registerEvents(DWB);
})

function appendWidthToImageUrls(articleData,width) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        if (article.imageUrl) article.imageUrl += ("?width=" + width);
    }
}