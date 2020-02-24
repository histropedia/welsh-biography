/* Exports function to update timeline data from Wikidata
 * Updates en and cy timeline-data.json files in `./public/data` folder
 * Backup of old timeline data stored in `./data-backup` folder
 * Can also be launched directly using `node data-update` or `node data-update --rollback`
 */

require('dotenv').config();
var QueryDispatcher = require('./data-update/query-dispatcher'),
generateArticleData = require('./data-update/generate-article-data'),
utils = require('./data-update/utils.js'),
writeAllTimelineData = utils.writeAllTimelineData,
generateLabelData = utils.generateLabelData,
backupTimelineData = utils.backupTimelineData,
rollbackTimelineData = utils.rollbackTimelineData,
queries = require('./data-update/queries'),
email = require('./data-update/email'),
debug = require('debug')('dwb:data-update');

const locales = ['en', 'cy'], // todo: create global config for supported locales
endpointUrl = 'https://query.wikidata.org/sparql',
queryDispatcher = new QueryDispatcher(endpointUrl);

// Set working directory
process.chdir( __dirname );

 // Check if file launched directly instead of being required
if (require.main === module) {
  if (process.argv[2] === '--rollback') {
    // synchronous folder copying
    rollbackTimelineData();
  } else {
    updateTimelineData();
  }
}

/*
 * Update all timeline data from Wikidata 
 */
function updateTimelineData() {
  debug('Starting update...');
  Promise.resolve()
  .then(backupTimelineData)
  .then(getFilterData)
  .then(getDataForLocales)
  .then(generateTimelineData)
  .then(writeAllTimelineData)
  .then(email.sendDataUpdateLog)
  .catch(handleDataUpdateError)
}

/*
 * Get filter properties and values for timeline entries
 * Note: These query results have no labels (just P and Q numbers) so are reused for
 * generating all language versions of timeline data
 */
function getFilterData() {
  return queryDispatcher.query(queries.filterData)
  .then(filterResults => {
    debug('Filter data query complete ✔️');
    return filterResults;
  })
  .catch(err => {throw new Error('Failed to retrieve filter data query results'); });
}

/*
 * Get lang dependant query results for all configured locales
 * Add previously retrieved lang independant filter data to each result group 
 */
function getDataForLocales(filterDataResults) {
  return getDataForMultiple(locales)
  .then(resultGroups => {
    for (let lang in resultGroups) {
      resultGroups[lang].filterData = filterDataResults;
    }
    return resultGroups;
  })
}

/*
 * Generate all timeline article and label data for each locale
 */
function generateTimelineData(allQueryResults) {
  // Process and combine query results for each language to generate timeline data
  let localeResults, timelineData = {};
  for (let lang in allQueryResults) {
    localeResults = allQueryResults[lang];
    timelineData[lang] = {
      articles: generateArticleData(localeResults, lang),
      labels: generateLabelData(localeResults.filterLabels, lang)
    }
  }
  return timelineData;
}

/*
 * Handle data update process error
 */
function handleDataUpdateError(err) {
  debug(err.message + ' ❌\n', err);
    // Send failure email
    email.sendDataUpdateLog(err);
    
    // Todo: Trigger n retries with wait period in between
}

/*
 * Get all language dependant timeline data for an array of languages
 */
function getDataForMultiple(languages) {
  let langData = {};

  // Run each getDataFor(lang) group sequentially because 5 parallel query limit 
  // See https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual#Query_limits
  return languages.reduce((p, lang) => {
    return p
    .then(() => getDataFor(lang) )
    .then(data => {langData[lang] = data});
  }, Promise.resolve())
    .then(() => { 
      debug('All language queries complete ✔️');
      return langData; 
    })
}

/*
 * Get all language dependant timeline data for a single language
 * Runs 3 queries in parallel
 */
function getDataFor(language) {
  const langQueries = queries.getForLanguage(language);
  
  return Promise.all([
    queryDispatcher.query(langQueries.biographyData),
    queryDispatcher.query(langQueries.contextData),
    queryDispatcher.query(langQueries.filterLabels)
  ])
  .then( results => {
    debug(language, 'queries complete...');
    return {
      biographyData: results[0],
      contextData: results[1],
      filterLabels: results[2],
    };
  })
  .catch(err => {throw new Error(`Failed to retrieve language data query results for: ${language}`); });
}

module.exports = updateTimelineData;