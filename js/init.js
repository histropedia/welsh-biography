// Initialise the app
var DWB = new App();

DWB.setupFilterOptions();

// Create the timeline
DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA);

// Setup colour code
DWB.setupColorCodeOptions();
DWB.setColorCode(DWB.options.colorCode.properties[0]);

// Add click events
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
});
     
$('#btn-close-color-code-desktop').click( function() {
    DWB.closeColorCodePanel();
});

$('#inputGroupSelect01').on('change', function() { //todo: change id
    var selection = $(this).val();
    DWB.setColorCode(selection)
})