// Initialise the app
var DWB = new App();

DWB.setupFilterOptions();

// Create the timeline
DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA);

DWB.updateFilterSearchResults("gender") //temp
DWB.updateFilterSearchResults("occupation") //temp
$(".filter-panel").show(); //temp

// Setup colour code
DWB.setupColorCodeOptions();
DWB.setColorCode(DWB.options.colorCode.properties[0]);


// Add click events
// Todo: remove these after setting up panel switching functions
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
});
     
$('#btn-close-color-code-desktop').click( function() {
    DWB.closeColorCodePanel();
});


$('#btn-open-filters').click(function() {
    DWB.openFilterTypesPanel()
})

$('#filter-types-panel .btn-open-page:first-of-type').click(function() { //todo: temporary selector
    DWB.closeFilterTypesPanel()
})

$('#inputGroupSelect01').on('change', function() { //todo: change id
    var selection = $(this).val();
    DWB.setColorCode(selection)
})