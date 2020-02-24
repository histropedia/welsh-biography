var PROPERTY_LABELS = require('./options').PROPERTY_LABELS,
path = require('path'),
fs = require('fs-extra'),
debug = require('debug')('dwb:data-update');

// Requires working directory to be /server, as set in data-update.js
function writeTimelineData(timelineData, lang) {
    var filePath = path.resolve('public/data/', lang) + '/timeline-data.json';
    return fs.outputJson(filePath, timelineData)
    .catch(err => {
        throw new Error(`Error writing ${filePath} to disk \n ${err.message}`);
    })
}

// Write timeline data for all locales to disk
function writeAllTimelineData(allTimelineData) {
    let langData, writeRequests = [];
    for (let lang in allTimelineData) {
      timelineData = allTimelineData[lang];
      writeRequests.push(writeTimelineData(timelineData, lang));
    }
    return Promise.all(writeRequests)
    .then(() => {
      debug('All timeline data updated successfully ✔️');
      return allTimelineData;
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
    return fs.pathExists('./public/data')
    .then( function(exists) {
        if (exists) {
            return fs.copy('./public/data', './data-backup')
            .then(() => {debug("Timeline data backup complete ✔️")});
        } else {
            debug("No timeline data yet, skipping backup")
        }
        return false;
    })
    .catch(err => {throw new Error(`Error backing up timeline data`)})
}

function rollbackTimelineData() {
    debug('Rolling back timeline data...');
    fs.copySync('./data-backup', './public/data');
    debug('Old data restored! ✔️');
    return;
}

module.exports = {
    writeAllTimelineData: writeAllTimelineData,
    generateLabelData: generateLabelData,
    backupTimelineData: backupTimelineData,
    rollbackTimelineData: rollbackTimelineData
}
