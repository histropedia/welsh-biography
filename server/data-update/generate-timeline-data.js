/* Generates timeline data from Wikidata query results 
 * Combines separate coreData and filterData query results
 * Returns timeline data in HistropediaJS format 
 */


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
      from: {
        year: parseInt(result.from_year.value),
        month: parseInt(result.from_month.value),
        day: parseInt(result.from_day.value),
        precision: parseInt(result.from_precision.value),
      },
      dwbUrl: biographyUrlRoot[lang] + result.dwbId.value
    }
    if (result.imageUrl) nextArticle.imageUrl = result.imageUrl.value;
    if (result.article) nextArticle.article = result.article.value;
    if (result.description) nextArticle.description = result.description.value;
    if (result.to_year) {
      nextArticle.to = {
        year: parseInt(result.to_year.value),
        month: parseInt(result.to_year.value),
        day: parseInt(result.to_day.value),
        precision: parseInt(result.to_precision.value),
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