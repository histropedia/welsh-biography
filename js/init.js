// Initialise the app
var DWB = new App();

DWB.setupFilterOptions();

// Create the timeline
DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA);

// Setup colour code
DWB.setupColorCodeOptions();
DWB.setColorCode(DWB.options.colorCode.properties[0]);

if (!DWB.isMobile) DWB.openColorCodePanel();
// Add click events
// Todo: remove these after setting up panel switching functions
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
});
     
$('#btn-close-color-code-desktop').click( function() {
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