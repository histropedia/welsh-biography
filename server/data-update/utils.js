require('dotenv').config();
var PROPERTY_LABELS = require('./options').PROPERTY_LABELS,
path = require('path'),
fs = require('fs'),
debug = require('debug')('dwb:data-update');

// Requires working directory to be /server
function writeTimelineData(timelineData, lang) {
    var fileContents = JSON.stringify(timelineData);
    var filePath = path.resolve('public/data/', lang) + '/timeline-data.json';
    ensureDirectoryExistence(filePath);
    fs.writeFile(filePath, fileContents, function (err) {
        if (err) throw err;
        debug("Timeline data written to disk")
    });
}

function generateLabelData(itemLabelResults, lang) {
    var results = itemLabelResults.results.bindings;
    var itemLabels = {};
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.item && result.valueLabel) {
            itemLabels[result.item.value] = result.valueLabel.value;
        } else {
            debug("Label query results must have 'item' and 'valueLabel' properties")
        }
    }

    // Property labels are set for each UI language in options
    // Todo: fallback to Wikidata query results when no value set in options
    var propertyLabels = PROPERTY_LABELS[lang];

    return {
        items: itemLabels,
        properties: propertyLabels
    };
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

module.exports = {
    writeTimelineData: writeTimelineData,
    generateLabelData: generateLabelData
}
