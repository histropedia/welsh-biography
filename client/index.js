import {App} from './js/App';

// Initialise the app
window.DWB = new App();


// Todo: remove once client side translation system complete
window.LANG = $('html').attr("lang");

// Todo: migrate runtime transforms to server side data update routine 
var femaleFilter = {property: "P21", value:"Q6581072"};
var maleFilter = {property: "P21", value:"Q6581097"};
addToArticleDataRanks(CONTEXT_EVENT_DATA, -1000)
appendWidthToImageUrls(CONTEXT_EVENT_DATA, 175)
appendWidthToImageUrls(BIOGRAPHY_DATA, 175)
scaleArticleDataRanks(BIOGRAPHY_DATA, 4, femaleFilter);


DWB.createTimeline(document.getElementById("timeline-container"), BIOGRAPHY_DATA, CONTEXT_EVENT_DATA);

DWB.setupTimelineSearch('#search-box');

//DWB.setupColorCodeOptions();
//DWB.setColorCode(DWB.options.colorCode.properties[0]);

DWB.setRankColorScale(240 /*hue*/, femaleFilter );
DWB.setRankColorScale(125 /*hue*/, maleFilter );
DWB.setupFilterOptions();

DWB.timeline.showContextEvents = false;
DWB.filtersChanged();

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

$('#show-search-btn').click( function() {
    if ( !$(this).hasClass("active") ) {
        $('#timeline-title-container').css("display", "none");
        $('.event-title-container').css("display", "flex");
        $(this).addClass("active");
    } else {
        $('#timeline-title-container').css("display", "flex");
        $('.event-title-container').css("display", "none");
        $(this).removeClass("active");
    }
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

$('#btn-open-info').click(function() {
    $('#info-panel').show();
})

$('.btn-close-info-panel').click(function() {
    $('#info-panel').hide();
})

$('#active-filters-container, #panel-active-filters-container').on('click', 'a', function() {
    var $tag = $(this).closest('.active-filter-tag'),
        property = $tag.attr('filter-property'),
        value = $tag.attr('filter-value');
    DWB.removeFilter(property, value);
})


$('.timeline-controls-set').on("click", "a", function(ev) {
    console.log(ev.target)
    var buttonId = $(this).attr("id");
    if ( buttonId === "zoom-in-btn" ) {
        DWB.timeline.setZoom(DWB.timeline.timescaleManager.zoom - 1.5);
    } else if ( buttonId === "zoom-out-btn" ) {
        DWB.timeline.setZoom(DWB.timeline.timescaleManager.zoom + 1.5);
    }
})

// temporary for development
function scaleArticleDataRanks(articleData, scale, filter) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        if (doesArticleDataMatchFilter(article,filter)) {
            article.rank = Math.round(article.rank * scale)
        }
    }
}
function addToArticleDataRanks(articleData, amount) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        article.rank += amount;
    }
}

function appendWidthToImageUrls(articleData,width) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        if (article.imageUrl) article.imageUrl += ("?width=" + width);
    }
}

function doesArticleDataMatchFilter(articleData, filter) {
    // Todo: make filter matching public in App.filter.js
    return (
        articleData.statements &&
        articleData.statements[filter.property] &&
        articleData.statements[filter.property].values.includes(filter.value)
    );
}