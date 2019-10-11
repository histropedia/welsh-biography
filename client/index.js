import {App} from './js/App';
import {PEOPLE_DATA} from './js/data';

// Initialise the app
window.DWB = new App();

addToArticleDataRanks(CONTEXT_EVENT_DATA, -1000)
addToArticleIds(CONTEXT_EVENT_DATA, 10000)

DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA, CONTEXT_EVENT_DATA);

DWB.setupTimelineSearch('#search-box');

DWB.setupColorCodeOptions();
DWB.setColorCode(DWB.options.colorCode.properties[0]);

DWB.setupFilterOptions();

DWB.timeline.showContextEvents = true;

// Add click events
// Todo: remove or move after setting up panel switching functions
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
});

$('#btn-world-events').click( function() {
    var isActive = DWB.timeline.showContextEvents = !DWB.timeline.showContextEvents;
    if (isActive) {
        $(this).addClass('active');
    } else {
        $(this).removeClass('active');
    }
    DWB.filtersChanged();

});

$('#btn-close-color-code-desktop, #btn-close-color-code-mobile').click( function() {
    DWB.closeColorCodePanel();
});

$('#color-code-select').on('change', function() { 
    var selection = $(this).val();
    DWB.setColorCode(selection)
})

$('#btn-open-filters').click(function() {
    DWB.openFilterTypesPanel()
})

$('.btn-close-filter-types-panel').click(function() { //todo: temporary selector
    DWB.closeFilterTypesPanel()
})

$('.btn-close-filter-panel').click(function() {
    DWB.closeFilterSearchPanel();
})

$('#filter-types-list-container').on('click', 'button', function() {
    var filterProperty = $(this).attr('filter-property');
    DWB.openFilterSearchPanel(filterProperty);
})

$('#btn-clear-all-filters').click(function() {
    DWB.clearAllFilters();
})

$('#selected-filters-container').on('click', 'a', function() {
    var $tag = $(this).closest('.selected-filter-tag'),
        property = $tag.attr('filter-property'),
        value = $tag.attr('filter-value');
    DWB.removeFilter(property, value);
})


// temporary for development
function scaleArticleDataRanks(articleData, scale) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        article.rank = Math.floor(article.rank * scale)
    }
}
function addToArticleDataRanks(articleData, amount) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        article.rank += amount;
    }
}

function addToArticleIds(articleData, amount) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        article.id += amount;
    }
}