
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
    contextDataEnPromise = queryDispatcher.query( queries.contextDataEn ),
    contextDataCyPromise = queryDispatcher.query( queries.contextDataCy ),
    itemLabelsEnPromise = queryDispatcher.query( queries.itemLabelsEn ),
    itemLabelsCyPromise = queryDispatcher.query( queries.itemLabelsCy );

debug("Queries sent...");
//debug(contextDataEn)
Promise.all([
  coreDataEnPromise,
  coreDataCyPromise,
  filterDataPromise,
  contextDataEnPromise,
  contextDataCyPromise,
  itemLabelsEnPromise,
  itemLabelsCyPromise
])
.then(function(values) {
    // Process and combine results to generate timeline data
    debug("All queries completed, start processing..."); 
    var coreDataEn = values[0],
    coreDataCy = values[1],
    filterData = values[2],
    contextDataEn = values[3],
    contextDataCy = values[4],
    itemLabelsEn = values[5],
    itemLabelsCy = values[6];
    
    
    // Todo: automate from languages in app config
    var biographyDataEn = generateTimelineData({
      coreData: coreDataEn,
      contextData: contextDataEn,
      filterData: filterData, 
      lang: 'en-GB'
    });

      // Todo: automate from languages in app config
    var biographyDataCy = generateTimelineData({
      coreData: coreDataCy,
      contextData: contextDataCy,
      filterData: filterData,
      lang: 'cy'
    });

    writeTimelineData([biographyDataEn, biographyDataCy]);
  })
  .catch(function(err) {
    debug("something went wrong running at least one of the update queries")
    debug(err)
    // attempt to re-run the update after a wait period
    // if failed multiple times, send error in email to developer
  })

function writeTimelineData(timelineData) {
  // One biography dataset for each language
  // File path for each <lang> is ./public/data/<lang>/timeline-data.js
  for (var i=0; i<timelineData.length; i++) {
    var lang = timelineData[i].lang;
    var data = timelineData[i].data;
    var fileContents = 'var TIMELINE_DATA =' + JSON.stringify(data);
    fs.writeFile('./public/data/' + lang + '/timeline-data.js', fileContents, function (err) {
      if (err) throw err;
      debug('data written to disk!');
    });
  }
}


  