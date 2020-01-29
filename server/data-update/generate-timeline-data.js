/* Generates timeline data from Wikidata query results 
 * Combines separate coreData and filterData query results
 * Returns timeline data in HistropediaJS format 
 */

var debug = require('debug')('dwb:data-update:generate-timeline-data');
var WELSH_ID_MAP = require('./welsh-id-map.json');
var OPTIONS = require('./options'),
    DATE_LABELS = OPTIONS.DATE_LABELS,
    RANK_FACTORS = OPTIONS.RANK_FACTORS,
    BIOGRAPHY_URL = OPTIONS.BIOGRAPHY_URL;

module.exports = function(queryResults) {
  var coreData = queryResults.coreData,
  contextData = queryResults.contextData,
  filterData = queryResults.filterData,
  lang = queryResults.lang || "en-GB";

  // Join contextData with coreData without creating a copy 
  var combinedResults = coreData.results.bindings;
  combinedResults.push.apply(combinedResults, contextData.results.bindings);

  var resultsWithDateErrors = [];
  var articleData = combinedResults.map(function(result) {
    if (typeof result.from_year === 'undefined') {
      resultsWithDateErrors.push(result);
      return false;
    }
    var nextArticle = {
      id: parseInt(result.id.value),
      title: result.title.value,
      rank: parseInt(result.rank.value),
      from: getPrecisionFixedDate({
        year: parseInt(result.from_year.value),
        month: parseInt(result.from_month.value),
        day: parseInt(result.from_day.value),
        precision: parseInt(result.from_precision.value),
      })
    }
    if (result.dwbId) {
      var dwbId = result.dwbId.value;
      if (lang === "cy") dwbId = getCyBiographyId(dwbId);
      nextArticle.dwbUrl = BIOGRAPHY_URL[lang] + dwbId;
    } else {
      nextArticle.isContextEvent = true;
    }
    if (result.imageUrl) nextArticle.imageUrl = result.imageUrl.value.replace("http://", "https://");
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

    nextArticle.subtitle = getDateRangeSubtitle(nextArticle.from, nextArticle.to, lang);
    addFiltersToArticleData(nextArticle, filterData);
    // Boost rank if article has statement "gender" (P21) = "female" (Q6581072)
    scaleArticleDataRank(nextArticle, RANK_FACTORS.women, {property:'P21', value: 'Q6581072' })
    return nextArticle;
  })

  if (resultsWithDateErrors.length > 0) {
    //debug(resultsWithDateErrors)
    var errors = resultsWithDateErrors
    .map( function(result, index) {
      return `${index + 1}. ${result.title.value} : https://wikidata.org/wiki/Q${result.id.value} (${result.birth_date.value})`;
    })

    throw {name : "invalidStartDates", message : errors.join('\n')};
  }

  return articleData;
}

function addFiltersToArticleData(articleData, filterData) {
  var filterResults = filterData.results.bindings;
  for (var i=0; i<filterResults.length; i++) {
    var articleFilterData = filterResults[i];

    if (parseInt(articleFilterData.id.value) === articleData.id ) {
      articleData.statements = {};
      for (var filterProperty in articleFilterData) {
        if (filterProperty === 'id') continue;
        articleData.statements[filterProperty] = {values: articleFilterData[filterProperty].value.split("|")};
      }
      break;
    }
  }
  //return articleData;
}

function getPrecisionFixedDate(date) {
  // Wikidata dates at low precision can have inconsistent values for day, month, year
  // This function unifies them so each precision uses the same rules
  // See https://www.wikidata.org/wiki/Help:Dates for more info on the ranges of values covered by each precision
   // Todo: Check for BC dates

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
      date.year = Math.ceil(date.year/100) * 100;
      break;
    case 6:
      // Millennium precision
      date.year = Math.ceil(date.year/1000) * 1000;
      break;
    default:
      debug("Unknown precision: ", precision);
  }
  return date;
}

function getDateRangeSubtitle(from, to, lang) {
  var subtitleText = getPrettyDate(from, lang);
  var isDateRange = !(
    from.year === to.year && 
    from.month === to.month && 
    from.day === to.day
    )

  if (isDateRange) {
    subtitleText += ' - ' + getPrettyDate(to, lang);
  }
  return subtitleText;
}

function getPrettyDate(date, lang) {
  // Todo: Check for BC dates
  var lang = lang || "en-GB",
  isBCE = date.year < 1,
  // Shift BCE dates for display (internally stored with year 0 = 1BC)
  year = (isBCE) ? ( date.year - 1 ) * -1 : date.year,
  month = date.month,
  day = date.day,
  bceText = (date.year < 1) ? getBceText(lang) : '',
  dateString;
  switch (date.precision) {
    case 11:
      dateString = day + ' ' + getMonthLabel(month, lang) + ' ' + year;
      break;
    case 10:
      dateString = getMonthLabel(month, lang) + ' ' + year;
      break;
    case 9:
      dateString = year;
      break;
    case 8:
      dateString = year + getPeriodLabel("decade", lang);
      break;
    case 7:
      dateString = year / 100 + ' . ' + getPeriodLabel("century", lang);
      break;
    case 6:
      dateString = year / 1000 + ' . ' + getPeriodLabel("millennium", lang);
      break;
    default:
      debug("Unknown precision: ", precision);
  }
  
  dateString += bceText;
  return dateString;
}

function getMonthLabel(number, lang) {
  return DATE_LABELS[lang].months[number - 1];
}

function getPeriodLabel(period, lang) {
  return DATE_LABELS[lang].periods[period];
}

function getBceText(lang) {
  return DATE_LABELS[lang].bceText;
}

// Scales rank by specified amount if filter condition is present
function scaleArticleDataRank(articleData, scale, filter) {
  if (articleDataMatchesFilter(articleData,filter)) {
    articleData.rank = Math.round(articleData.rank * scale)
  }
}

function articleDataMatchesFilter(articleData, filter) {
  return (
      articleData.statements &&
      articleData.statements[filter.property] &&
      articleData.statements[filter.property].values.includes(filter.value)
  );
}

function getCyBiographyId(enId) {
  // Most biography IDs for cy version can be found be replacing first "s" with "c"
  // But some older IDs do have no simple convertion so retreived using ID map 
  return WELSH_ID_MAP[enId] || enId.replace("s","c");
}