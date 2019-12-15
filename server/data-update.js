
/* Runs Wikidata queries to update timeline data
 * Updates en-GB and cy biography-events.js files in public/data folder
 */
require('dotenv').config();
var QueryDispatcher = require('./data-update/query-dispatcher');
var generateTimelineData = require('./data-update/generate-timeline-data');
var queries = require('./data-update/queries');
var fs = require('fs');
var debug = require('debug')('dwb:data-update');

var endpointUrl = 'https://query.wikidata.org/sparql';
var queryDispatcher = new QueryDispatcher(endpointUrl);

var coreDataEnPromise = queryDispatcher.query( queries.coreDataEn ),
    coreDataCyPromise = queryDispatcher.query( queries.coreDataCy ),
    filterDataPromise = queryDispatcher.query( queries.filterData ),
    itemLabelsEnPromise = queryDispatcher.query( queries.itemLabelsEn ),
    itemLabelsCyPromise = queryDispatcher.query( queries.itemLabelsCy );

debug("Queries sent...");

Promise.all([coreDataEnPromise, coreDataCyPromise, filterDataPromise, itemLabelsEnPromise, itemLabelsCyPromise])
.then(function(values) {
    // Process and combine results to generate timeline data
    debug("All queries completed, start processing..."); 
    var coreDataEn = values[0],
    coreDataCy = values[1],
    filterData = values[2],
    itemLabelsEn = values[3],
    itemLabelsCy = values[4];
    
    // Todo: automate from languages in app config
    var biographyDataEn = generateTimelineData(coreDataEn, filterData, 'en-GB');
    var biographyDataCy = generateTimelineData(coreDataCy, filterData, 'cy');

    writeBiographyData([biographyDataEn, biographyDataCy]);
  })
  .catch(function(err) {
    debug("something went wrong running at least one of the update queries")
    debug(err)
    // attempt to re-run the update after a wait period
    // if failed multiple times, send error in email to developer
  })

function writeBiographyData(biographyData) {
  // One biography dataset for each language
  // File path for each <lang> is ./public/data/<lang>/biography-events.js
  for (var i=0; i<biographyData.length; i++) {
    var lang = biographyData[i].lang;
    var data = biographyData[i].data;
    var fileContents = 'var BIOGRAPHY_DATA =' + JSON.stringify(data);
    fs.writeFile('./public/data/' + lang + '/biography-events.js', fileContents, function (err) {
      if (err) throw err;
      debug(lang + ' biography data written to disk!');
    });
  }
}


  