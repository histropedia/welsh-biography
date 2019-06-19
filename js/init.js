// Initialise the app
var DWB = new App();

DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA);

DWB.setupTimelineSearch('#search-box');

DWB.setupColorCodeOptions();
DWB.setColorCode(DWB.options.colorCode.properties[0]);

DWB.setupFilterOptions();

if (!DWB.isMobile) DWB.openColorCodePanel();

// Add click events
// Todo: remove or move after setting up panel switching functions
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
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