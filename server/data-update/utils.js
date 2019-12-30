require('dotenv').config();
var PROPERTY_LABELS = require('./options').PROPERTY_LABELS,
path = require('path'),
fs = require('fs-extra'),
debug = require('debug')('dwb:data-update');

// Requires working directory to be /server, as set in data-update.js
function writeTimelineData(timelineData, lang) {
    var filePath = path.resolve('public/data/', lang) + '/timeline-data.json';
    fs.outputJson(filePath, timelineData)
    .then(function() {
        debug("Timeline data written to disk")
    })
    .catch(function(err) {
        debug(err)
    })
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

function backupTimelineData() {
    fs.pathExists('./public/data')
    .then( function(exists) {
        if (exists) {
            return fs.copy('./public/data', './data-backup');
        } else {
            debug("No timeline data yet, skipping backup")
        }
        return false;
    })
}

function rollbackTimelineData() {
    return fs.copySync('./data-backup', './public/data');
}

module.exports = {
    writeTimelineData: writeTimelineData,
    generateLabelData: generateLabelData,
    backupTimelineData: backupTimelineData,
    rollbackTimelineData: rollbackTimelineData
}
