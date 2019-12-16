/* Generates timeline data from Wikidata query results 
 * Combines separate coreData and filterData query results
 * Returns timeline data in HistropediaJS format 
 */
require('dotenv').config();
var debug = require('debug')('dwb:data-update:generate-timeline-data');

 // Dictionary of Welsh Biography uses different domains for en and cy version
 var biographyUrlRoot = {
   "en-GB": 'https://biography.wales/article/',
   "cy": "https://bywgraffiadur.cymru/article/"
 }


module.exports = function(coreData, filterData, lang) {
  var lang = lang || "en-GB";
  var articleData = coreData.results.bindings.map(function(result) {
    var nextArticle = {
      id: parseInt(result.id.value),
      title: result.title.value,
      rank: parseInt(result.rank.value),
      from: getPrecisionFixedDate({
        year: parseInt(result.from_year.value),
        month: parseInt(result.from_month.value),
        day: parseInt(result.from_day.value),
        precision: parseInt(result.from_precision.value),
      }),
      dwbUrl: biographyUrlRoot[lang] + result.dwbId.value
    }
    if (result.imageUrl) nextArticle.imageUrl = result.imageUrl.value;
    if (result.article) nextArticle.article = result.article.value;
    if (result.description) nextArticle.description = result.description.value;
    if (result.to_year) {
      nextArticle.to = getPrecisionFixedDate({
        year: parseInt(result.to_year.value),
        month: parseInt(result.to_month.value),
        day: parseInt(result.to_day.value),
        precision: parseInt(result.to_precision.value),
      })
    } else {
      // If no end date, copy start date so precision can be used to set time span
      nextArticle.to = {
        year: nextArticle.from.year,
        month: nextArticle.from.month,
        day: nextArticle.from.day,
        precision: nextArticle.from.precision,
      }
    }
    return nextArticle;
  })

  // Add filters to articleData
  articleData = addFiltersToArticleData(articleData, filterData);
  return {data: articleData, lang: lang};
}

function addFiltersToArticleData(articleData, filterData) {
  filterData = filterData.results.bindings;
  for (var i=0; i<articleData.length; i++) {
    var article = articleData[i];
    var articleStatements = {};

    for (var j=0; j<filterData.length; j++) {
      var articleFilterData = filterData[j];

      if (parseInt(articleFilterData.id.value) === article.id ) {
        for (var filterProperty in articleFilterData) {
          if (filterProperty === 'id') continue;
          articleStatements[filterProperty] = {values: articleFilterData[filterProperty].value.split("|")};
        }
        break;
      }
    }
    article.statements = articleStatements;
  }
  return articleData;
}

function getPrecisionFixedDate(date) {
  // Wikidata dates at low precision can have inconsistent values for day, month, year
  // This function unifies them so each precision uses the same rules
  // See https://www.wikidata.org/wiki/Help:Dates for more info on the ranges of values covered by each precision
  // HistropediaJS uses e.g. year=500 for 5th Century, year=2000 for 2nd millenium

  // Todo: Adjust for BC dates
  var precision = date.precision;
  if (precision <= 9) {
    date.day = 1;
    date.month = 1;
  } else if (precision === 10) {
    date.day = 1;
  }
  switch (precision) {
    case 11:
      // Day precision
      break;
    case 10:
      // Month precision
      break;
    case 9:
      // Year precision
      break;
    case 8:
      // Decade precision
      date.year = Math.floor(date.year/10) * 10;
      break;
    case 7:
      // Century precision
      date.year = Math.ceil(date.year/100) * 100;
      break;
    case 6:
      // Century precision
      date.year = Math.ceil(date.year/1000) * 1000;
      break;
    default:
      debug("Unknown precision: ", precision);
  }

  return date;
}

function getPrecisionFixedDate(date) {
  // Wikidata dates at low precision can have inconsistent values for day, month, year
  // This function unifies them so each precision uses the same rules
  // See https://www.wikidata.org/wiki/Help:Dates for more info on the ranges of values covered by each precision
  // Todo: Adjust for BC dates

  var precision = date.precision;
  if (precision <= 9) date.month = 1;
  if (precision <= 10) date.day = 1;

  if (precision > 8) return date;

  switch (precision) {
    case 8:
      // Decade precision
      date.year = Math.floor(date.year/10) * 10;
      break;
    case 7:
      // Century precision
      // e.g. 2nd century
      // Wikidata use any year from 101 to 200
      // HistropediaJS uses year=200
      date.year = Math.ceil(date.year/100) * 100;
      break;
    case 6:
      // Century precision
      // e.g. 2nd millennium
      // Wikidata use any year from 1001 to 2000
      // HistropediaJS uses year=2000
      date.year = Math.ceil(date.year/1000) * 1000;
      break;
    default:
      debug("Unknown precision: ", precision);
  }

  return date;
}