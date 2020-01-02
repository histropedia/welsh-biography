
/* Runs Wikidata queries to update timeline data
 * Updates en-GB and cy timeline-data.json files in public/data folder
 */

require('dotenv').config();
var QueryDispatcher = require('./data-update/query-dispatcher'),
generateTimelineData = require('./data-update/generate-timeline-data'),
utils = require('./data-update/utils.js'),
writeTimelineData = utils.writeTimelineData,
generateLabelData = utils.generateLabelData,
backupTimelineData = utils.backupTimelineData,
rollbackTimelineData = utils.rollbackTimelineData,
queries = require('./data-update/queries'),
email = require('./data-update/email'),
debug = require('debug')('dwb:data-update');

// Set working directory
process.chdir( __dirname );

if (process.argv[2] === "--rollback") {
  debug("Rolling back timeline data...")
  // Synchronous folder copying
  rollbackTimelineData();
  debug("Old data restored!");
  return;
}

var endpointUrl = 'https://query.wikidata.org/sparql',
    queryDispatcher = new QueryDispatcher(endpointUrl),
    coreDataEnPromise = queryDispatcher.query( queries.coreDataEn ),
    coreDataCyPromise = queryDispatcher.query( queries.coreDataCy ),
    filterDataPromise = queryDispatcher.query( queries.filterData ),
    contextDataEnPromise = queryDispatcher.query( queries.contextDataEn ),
    contextDataCyPromise = queryDispatcher.query( queries.contextDataCy ),
    itemLabelsEnPromise = queryDispatcher.query( queries.itemLabelsEn ),
    itemLabelsCyPromise = queryDispatcher.query( queries.itemLabelsCy ),
    dataBackupPromise = backupTimelineData();

debug("Queries sent ✔️");

Promise.all([
  coreDataEnPromise,
  coreDataCyPromise,
  filterDataPromise,
  contextDataEnPromise,
  contextDataCyPromise,
  itemLabelsEnPromise,
  itemLabelsCyPromise,
  dataBackupPromise
  ])
  .then(function(values) {
    // Process and combine results to generate timeline data
    debug("Queries and data backup complete ✔️");
    
    var coreDataEn = values[0],
    coreDataCy = values[1],
    filterData = values[2],
    contextDataEn = values[3],
    contextDataCy = values[4],
    itemLabelsEn = values[5],
    itemLabelsCy = values[6];
    
    // Todo: automate from languages in app config
    var articleDataEn = generateTimelineData({
      coreData: coreDataEn,
      contextData: contextDataEn,
      filterData: filterData, 
      lang: 'en-GB'
    });

      // Todo: automate from languages in app config
    var articleDataCy = generateTimelineData({
      coreData: coreDataCy,
      contextData: contextDataCy,
      filterData: filterData,
      lang: 'cy'
    });

    var labelsEn = generateLabelData(itemLabelsEn, "en-GB");
    var labelsCy = generateLabelData(itemLabelsCy, "cy");

    Promise.all([
      writeTimelineData({articles: articleDataEn, labels: labelsEn}, "en-GB"),
      writeTimelineData({articles: articleDataCy, labels: labelsCy}, "cy")
    ])
    .then(function() {
      debug("Timeline data updated successfully ✔️");
      email.sendDataUpdateLog({
        stage: "complete",
        articleCountEn: articleDataEn.length,
        itemLabelCountEn: Object.keys(labelsEn.items).length,
        articleCountCy: articleDataCy.length,
        itemLabelCountCy: Object.keys(labelsCy.items).length,
      });
    })
    .catch(function(err) {
      debug("Error writing timeline data to disk ❌\n", err)
      email.sendDataUpdateLog({
        stage: "writing to disk",
        error: err
      });
    })
  })
  .catch(function(err) {
    debug("Error processing data update queries ❌\n", err)
    email.sendDataUpdateLog({
      stage: "processing queries",
      error: err
    });
    
    // Todo: attempt to re-run the update after a wait period
  })





  