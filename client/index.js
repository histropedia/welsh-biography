import {App} from './js/App';

// Initialise the app
window.DWB = new App();

// Todo: remove once client side translation system complete
window.LANG = $('html').attr("lang");

// Todo: migrate to server side data update routine
addToArticleDataRanks(CONTEXT_EVENT_DATA, -1000)

appendWidthToImageUrls(CONTEXT_EVENT_DATA, 175)
appendWidthToImageUrls(BIOGRAPHY_DATA, 175)

// Setup the timeline
DWB.createTimeline(document.getElementById("timeline-container"), BIOGRAPHY_DATA, CONTEXT_EVENT_DATA);
DWB.setupTimelineSearch('#search-box');
DWB.setupFilterOptions();

// Setup colour code from the property list in options
//DWB.setupColorCodeOptions();
//DWB.setColorCode(DWB.options.colorCode.properties[0]);

// Colour code by gender and rank
var femaleFilter = {property: "P21", value:"Q6581072"};
var maleFilter = {property: "P21", value:"Q6581097"};
DWB.setRankColorScale(240 /*hue*/, femaleFilter );
DWB.setRankColorScale(125 /*hue*/, maleFilter );

DWB.timeline.showContextEvents = false;
DWB.filtersChanged();


// Click events

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
    DWB.openInfoPanel()
})

$('.btn-close-info-panel').click(function() {
    DWB.closeInfoPanel()
})

$('#active-filters-container, #panel-active-filters-container').on('click', 'a', function() {
    var $tag = $(this).closest('.active-filter-tag'),
        property = $tag.attr('filter-property'),
        value = $tag.attr('filter-value');
    DWB.removeFilter(property, value);
})

$('.timeline-controls-set').on("click", "a", function(ev) {
    var buttonId = $(this).attr("id");
    switch (buttonId) {
        case "zoom-in-btn":
            DWB.timeline.setZoom(DWB.timeline.timescaleManager.zoom - 1.5);
            break;
        case "zoom-out-btn":
            DWB.timeline.setZoom(DWB.timeline.timescaleManager.zoom + 1.5);
            break;
        case "fit-screen-btn":
            DWB.timeline.fitArticles();
    }
})

$('#search-box').on('input js-input', function() {
    // 'input' for normal user input, 'js-input' for script updated input
    if ($(this).val() !== "" ) {
        $('#btn-close-reading-panel').css('visibility','visible')
    } else if ( !DWB.contentPanel.isOpen ) {
        // Do not hide clear search button if content panel is open
        // because it doubles as the close button
        $('#btn-close-reading-panel').css('visibility','hidden')
    }
})


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