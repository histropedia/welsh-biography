import {App} from './js/App';

// Todo: remove once client side translation system complete
window.LANG = $('html').attr("lang");

// Get timeline data
$.getJSON('data/' + LANG + '/timeline-data.json', function(timelineData) {

    // Todo: move to createTimeline method
    appendWidthToImageUrls(timelineData.articles, 175)

    // Initialise app and render timeline
    window.DWB = new App(timelineData,"#timeline-container");
})


// Click events

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

function appendWidthToImageUrls(articleData,width) {
    for (var i=0; i<articleData.length; i++) {
        var article = articleData[i];
        if (article.imageUrl) article.imageUrl += ("?width=" + width);
    }
}