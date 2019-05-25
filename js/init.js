// Initialise the app
var DWB = new App();

DWB.setupFilterOptions();

// Create the timeline
DWB.createTimeline(document.getElementById("timeline-container"), PEOPLE_DATA)


// Add click events
$('#btn-open-color-code').click( function() {
    DWB.openColorCodePanel();
});
     
$('#btn-close-color-code-desktop').click( function() {
    DWB.closeColorCodePanel();
});