
/* Runs queries to retrieve data from Wikidata and updates*/

var QueryDispatcher = require('./query-dispatcher');
var endpointUrl = 'https://query.wikidata.org/sparql';
var queries = require('./queries');

var queryDispatcher = new QueryDispatcher(endpointUrl);

var coreDataEnPromise = queryDispatcher.query( queries.coreDataEn ),
    coreDataCyPromise = queryDispatcher.query( queries.coreDataCy ),
    filterDataPromise = queryDispatcher.query( queries.filterData ),
    itemLabelsEnPromise = queryDispatcher.query( queries.itemLabelsEn ),
    itemLabelsCyPromise = queryDispatcher.query( queries.itemLabelsCy );


Promise.all([coreDataEnPromise, coreDataCyPromise, filterDataPromise, itemLabelsEnPromise, itemLabelsCyPromise])
  .then(function(values) {
    // Process and combine results to generate timeline data
    console.log(values[0].results.bindings[0]);
  })
  .catch(function(err) {
    console.log("something went wrong running at least one of the update queries")
    // attempt to re-run the update after a wait period
    // if failed multiple times, send email to developer
  })
