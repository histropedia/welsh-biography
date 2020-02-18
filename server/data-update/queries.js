/* Queries used for core timeline data and filter values */

var coreDataEn = `SELECT (SUBSTR(STR(?person), 33) as ?id) ?title ?rank ?article ?description (SAMPLE(?imageUrl) as ?imageUrl)
(SAMPLE(?birthDate) as ?birth_date) (SAMPLE(?deathDate) as ?death_date)

(YEAR(?birth_date) as ?from_year)
(MONTH(?birth_date) as ?from_month)
(DAY(?birth_date) as ?from_day)
(SAMPLE(?birthPrecision) as ?from_precision)

(YEAR(?death_date) as ?to_year)
(MONTH(?death_date) as ?to_month)
(DAY(?death_date) as ?to_day)
(SAMPLE(?deathPrecision) as ?to_precision)

(SAMPLE(?dwbId) as ?dwbId)

WHERE {
  ?person wdt:P1648 ?dwbId .
  ?person p:P569/psv:P569 [
    wikibase:timeValue ?birthDate;
    wikibase:timePrecision ?birthPrecision;
    ] .
  OPTIONAL {
   ?person p:P570/psv:P570 [
    wikibase:timeValue ?deathDate;
    wikibase:timePrecision ?deathPrecision;
    ] .
  }
  OPTIONAL { ?person wdt:P18 ?imageUrl }
  ?person wikibase:sitelinks ?rank .
  
  OPTIONAL { 
    ?article schema:about ?person .
    ?article schema:isPartOf <https://en.wikipedia.org/> .
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en".
    ?person rdfs:label ?title .
    ?person schema:description ?description .
  }
} GROUP BY ?person ?title ?subtitle ?rank ?article ?description
ORDER BY DESC (?rank)`;

var coreDataCy = `SELECT (SUBSTR(STR(?person), 33) as ?id) ?title ?rank ?article ?description (SAMPLE(?imageUrl) as ?imageUrl)
(SAMPLE(?birthDate) as ?birth_date) (SAMPLE(?deathDate) as ?death_date)

(YEAR(?birth_date) as ?from_year)
(MONTH(?birth_date) as ?from_month)
(DAY(?birth_date) as ?from_day)
(SAMPLE(?birthPrecision) as ?from_precision)

(YEAR(?death_date) as ?to_year)
(MONTH(?death_date) as ?to_month)
(DAY(?death_date) as ?to_day)
(SAMPLE(?deathPrecision) as ?to_precision)

(SAMPLE(?dwbId) as ?dwbId)
 
WHERE {
  ?person wdt:P1648 ?dwbId .
  ?person p:P569/psv:P569 [
    wikibase:timeValue ?birthDate;
    wikibase:timePrecision ?birthPrecision;
    ] .
  OPTIONAL {
   ?person p:P570/psv:P570 [
    wikibase:timeValue ?deathDate;
    wikibase:timePrecision ?deathPrecision;
    ] .
  }
  OPTIONAL { ?person wdt:P18 ?imageUrl }
  ?person wikibase:sitelinks ?rank .
  
  OPTIONAL { 
    ?article schema:about ?person .
    ?article schema:isPartOf <https://cy.wikipedia.org/> .
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "cy,en".
    ?person rdfs:label ?title .
    ?person schema:description ?description .
  }
} GROUP BY ?person ?title ?subtitle ?rank ?article ?description
ORDER BY DESC (?rank)`;

var filterData = `SELECT DISTINCT (SUBSTR(STR(?person), 33) as ?id)
(GROUP_CONCAT(DISTINCT ?genderQ; separator="|") as ?P21)
(GROUP_CONCAT(DISTINCT ?occupationQ; separator="|") as ?P106)
(GROUP_CONCAT(DISTINCT ?placeOfBirthQ; separator="|") as ?P19)
(GROUP_CONCAT(DISTINCT ?placeOfDeathQ; separator="|") as ?P20)
(GROUP_CONCAT(DISTINCT ?educatedAtQ; separator="|") as ?P69)
(GROUP_CONCAT(DISTINCT ?religionQ; separator="|") as ?P140)
(GROUP_CONCAT(DISTINCT ?givenNameQ; separator="|") as ?P735)
(GROUP_CONCAT(DISTINCT ?familyNameQ; separator="|") as ?P734)

WHERE {
  ?person wdt:P1648 [] .
  ?person p:P569/psv:P569 [] .
  OPTIONAL { 
    ?person wdt:P21 ?gender .
    BIND( SUBSTR(STR(?gender),32) as ?genderQ )
  }
  OPTIONAL { 
    ?person wdt:P106 ?occupation .
    BIND( SUBSTR(STR(?occupation),32) as ?occupationQ )
  }
  OPTIONAL { 
    ?person wdt:P19 ?placeOfBirth .
    BIND( SUBSTR(STR(?placeOfBirth),32) as ?placeOfBirthQ )
  }
  OPTIONAL { 
    ?person wdt:P20 ?placeOfDeath .
    BIND( SUBSTR(STR(?placeOfDeath),32) as ?placeOfDeathQ )
  }
  OPTIONAL { 
    ?person wdt:P69 ?educatedAt .
    BIND( SUBSTR(STR(?educatedAt),32) as ?educatedAtQ )
  }
  OPTIONAL { 
    ?person wdt:P735 ?givenName .
    BIND( SUBSTR(STR(?givenName),32) as ?givenNameQ )
  }
  OPTIONAL { 
    ?person wdt:P734 ?familyName .
    BIND( SUBSTR(STR(?familyName),32) as ?familyNameQ )
  }
  OPTIONAL { 
    ?person wdt:P140 ?religion .
    BIND( SUBSTR(STR(?religion),32) as ?religionQ )
  }
} GROUP BY ?person
ORDER BY DESC (?id)`;

var itemLabelsEn = `SELECT DISTINCT (SUBSTR(STR(?value), 32) as ?item) ?valueLabel
WHERE {
  ?person wdt:P1648 [] .
  ?person p:P569/psv:P569 [] .
  
  { ?person wdt:P21 ?value } 
  UNION { ?person wdt:P106 ?value }
  UNION { ?person wdt:P19 ?value }
  UNION { ?person wdt:P20 ?value }
  UNION { ?person wdt:P69 ?value }
  UNION { ?person wdt:P140 ?value }
  UNION { ?person wdt:P735 ?value }
  UNION { ?person wdt:P734 ?value }
  FILTER (!isBLANK(?value))
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}`;

var itemLabelsCy = `SELECT DISTINCT (SUBSTR(STR(?value), 32) as ?item) ?valueLabel

WHERE {
  ?person wdt:P1648 [] .
  ?person p:P569/psv:P569 [] .
  
  { ?person wdt:P21 ?value } 
  UNION { ?person wdt:P106 ?value }
  UNION { ?person wdt:P19 ?value }
  UNION { ?person wdt:P20 ?value }
  UNION { ?person wdt:P69 ?value }
  UNION { ?person wdt:P140 ?value }
  UNION { ?person wdt:P735 ?value }
  UNION { ?person wdt:P734 ?value }
  FILTER (!isBLANK(?value))
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cy, en". }
}`;

var contextDataEn = `SELECT (SUBSTR(STR(?event), 33) as ?id) ?title ?description ?rank ?article
(SAMPLE(?image) as ?imageUrl)
(SAMPLE(?startDate) as ?fromDate) (SAMPLE(?startPrecision) as ?from_precision)
(SAMPLE(?endDate) as ?toDate) (SAMPLE(?endPrecision) as ?to_precision)
(year(?fromDate) as ?from_year) (month(?fromDate) as ?from_month) (day(?fromDate) as ?from_day)
(year(?toDate) as ?to_year) (month(?toDate) as ?to_month) (day(?toDate) as ?to_day)
WHERE {
  VALUES ?event {wd:Q743768 wd:Q63349363 wd:Q63348899 wd:Q4126360 wd:Q988326 wd:Q759837 wd:Q80330 wd:Q2888504 wd:Q3124572 wd:Q1362660 wd:Q361 wd:Q362 wd:Q918544 wd:Q178275 wd:Q63433422 wd:Q81174 wd:Q1869031 wd:Q577000 wd:Q10691 wd:Q2000845 wd:Q848525 wd:Q7568777 wd:Q790029 wd:Q1035745 wd:Q17985748 wd:Q319761 wd:Q6820681 wd:Q127912 wd:Q3038296 wd:Q5897217 wd:Q63441831 wd:Q1585906 wd:Q1429157 wd:Q13583947 wd:Q608613 wd:Q15932056 wd:Q63440697 wd:Q158822 wd:Q63439774 wd:Q1850537 wd:Q581526 wd:Q7981936 wd:Q63433386 wd:Q2038022 wd:Q275173 wd:Q63433268 wd:Q8059745 wd:Q63413067 wd:Q63413034 wd:Q3404150 wd:Q742306 wd:Q83224 wd:Q10971509 wd:Q7982039 wd:Q12519 wd:Q7837154 wd:Q1488817 wd:Q1190809 wd:Q692259 wd:Q7843244 wd:Q25348506 wd:Q188495 wd:Q222013 wd:Q16889818 wd:Q55638011 wd:Q10637469 wd:Q333343 wd:Q3399475 wd:Q7982000 wd:Q3008641 wd:Q6820683 wd:Q7231235 wd:Q7018976 wd:Q4554588 wd:Q7836552 wd:Q160036 wd:Q63349642 wd:Q15177907 wd:Q4558541 wd:Q666063 wd:Q1321874 wd:Q5607565 wd:Q5137741 wd:Q918396 wd:Q384291 wd:Q63350780 wd:Q2689863 wd:Q204496 wd:Q63410293 wd:Q10536244 wd:Q63410594 wd:Q63410863 wd:Q426637 wd:Q1814107 wd:Q13132469 wd:Q16938617}
  ?event wikibase:sitelinks ?rank .
  ?event p:P585/psv:P585|p:P580/psv:P580|p:P571/psv:P571|p:P1619/psv:P1619 [
      wikibase:timeValue ?startDate ;
      wikibase:timePrecision ?startPrecision ;
    ] .
  OPTIONAL {
    ?event p:P582/psv:P582 [
      wikibase:timeValue ?endDate ;
      wikibase:timePrecision ?endPrecision ;
    ] .
  }
  OPTIONAL {?event wdt:P18 ?image}
  OPTIONAL {
    ?article schema:about ?event .
    ?article schema:isPartOf <https://en.wikipedia.org/>
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "en".
    ?event rdfs:label ?title .
    ?event schema:description ?description .
  }
} GROUP BY ?event ?title ?description ?rank ?article`

var contextDataCy = `SELECT (SUBSTR(STR(?event), 33) as ?id) ?title ?description ?rank ?article
(SAMPLE(?image) as ?imageUrl)
(SAMPLE(?startDate) as ?fromDate) (SAMPLE(?startPrecision) as ?from_precision)
(SAMPLE(?endDate) as ?toDate) (SAMPLE(?endPrecision) as ?to_precision)
(year(?fromDate) as ?from_year) (month(?fromDate) as ?from_month) (day(?fromDate) as ?from_day)
(year(?toDate) as ?to_year) (month(?toDate) as ?to_month) (day(?toDate) as ?to_day)
WHERE {
  VALUES ?event {wd:Q743768 wd:Q63349363 wd:Q63348899 wd:Q4126360 wd:Q988326 wd:Q759837 wd:Q80330 wd:Q2888504 wd:Q3124572 wd:Q1362660 wd:Q361 wd:Q362 wd:Q918544 wd:Q178275 wd:Q63433422 wd:Q81174 wd:Q1869031 wd:Q577000 wd:Q10691 wd:Q2000845 wd:Q848525 wd:Q7568777 wd:Q790029 wd:Q1035745 wd:Q17985748 wd:Q319761 wd:Q6820681 wd:Q127912 wd:Q3038296 wd:Q5897217 wd:Q63441831 wd:Q1585906 wd:Q1429157 wd:Q13583947 wd:Q608613 wd:Q15932056 wd:Q63440697 wd:Q158822 wd:Q63439774 wd:Q1850537 wd:Q581526 wd:Q7981936 wd:Q63433386 wd:Q2038022 wd:Q275173 wd:Q63433268 wd:Q8059745 wd:Q63413067 wd:Q63413034 wd:Q3404150 wd:Q742306 wd:Q83224 wd:Q10971509 wd:Q7982039 wd:Q12519 wd:Q7837154 wd:Q1488817 wd:Q1190809 wd:Q692259 wd:Q7843244 wd:Q25348506 wd:Q188495 wd:Q222013 wd:Q16889818 wd:Q55638011 wd:Q10637469 wd:Q333343 wd:Q3399475 wd:Q7982000 wd:Q3008641 wd:Q6820683 wd:Q7231235 wd:Q7018976 wd:Q4554588 wd:Q7836552 wd:Q160036 wd:Q63349642 wd:Q15177907 wd:Q4558541 wd:Q666063 wd:Q1321874 wd:Q5607565 wd:Q5137741 wd:Q918396 wd:Q384291 wd:Q63350780 wd:Q2689863 wd:Q204496 wd:Q63410293 wd:Q10536244 wd:Q63410594 wd:Q63410863 wd:Q426637 wd:Q1814107 wd:Q13132469 wd:Q16938617}
  ?event wikibase:sitelinks ?rank .
  ?event p:P585/psv:P585|p:P580/psv:P580|p:P571/psv:P571|p:P1619/psv:P1619 [
      wikibase:timeValue ?startDate ;
      wikibase:timePrecision ?startPrecision ;
    ] .
  OPTIONAL {
    ?event p:P582/psv:P582 [
      wikibase:timeValue ?endDate ;
      wikibase:timePrecision ?endPrecision ;
    ] .
  }
  OPTIONAL {?event wdt:P18 ?image}
  OPTIONAL {
    ?article schema:about ?event .
    ?article schema:isPartOf <https://cy.wikipedia.org/>
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "cy,en".
    ?event rdfs:label ?title .
    ?event schema:description ?description .
  }
} GROUP BY ?event ?title ?description ?rank ?article`

// Language template queries
// Replace {{lang}} with e.g. 'cy'
// Replace {{fallbackLang}} with e.g. ',en'

var biographyQueryTemplate = `SELECT (SUBSTR(STR(?person), 33) as ?id) ?title ?rank ?article ?description (SAMPLE(?imageUrl) as ?imageUrl)
(SAMPLE(?birthDate) as ?birth_date) (SAMPLE(?deathDate) as ?death_date)

(YEAR(?birth_date) as ?from_year)
(MONTH(?birth_date) as ?from_month)
(DAY(?birth_date) as ?from_day)
(SAMPLE(?birthPrecision) as ?from_precision)

(YEAR(?death_date) as ?to_year)
(MONTH(?death_date) as ?to_month)
(DAY(?death_date) as ?to_day)
(SAMPLE(?deathPrecision) as ?to_precision)

(SAMPLE(?dwbId) as ?dwbId)

WHERE {
  ?person wdt:P1648 ?dwbId .
  ?person p:P569/psv:P569 [
    wikibase:timeValue ?birthDate;
    wikibase:timePrecision ?birthPrecision;
    ] .
  OPTIONAL {
   ?person p:P570/psv:P570 [
    wikibase:timeValue ?deathDate;
    wikibase:timePrecision ?deathPrecision;
    ] .
  }
  OPTIONAL { ?person wdt:P18 ?imageUrl }
  ?person wikibase:sitelinks ?rank .
  
  OPTIONAL { 
    ?article schema:about ?person .
    ?article schema:isPartOf <https://{{lang}}.wikipedia.org/> .
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "{{lang}}{{fallbackLang}}".
    ?person rdfs:label ?title .
    ?person schema:description ?description .
  }
} GROUP BY ?person ?title ?subtitle ?rank ?article ?description
ORDER BY DESC (?rank)`;

var contextQueryTemplate = `SELECT (SUBSTR(STR(?event), 33) as ?id) ?title ?description ?rank ?article
(SAMPLE(?image) as ?imageUrl)
(SAMPLE(?startDate) as ?fromDate) (SAMPLE(?startPrecision) as ?from_precision)
(SAMPLE(?endDate) as ?toDate) (SAMPLE(?endPrecision) as ?to_precision)
(year(?fromDate) as ?from_year) (month(?fromDate) as ?from_month) (day(?fromDate) as ?from_day)
(year(?toDate) as ?to_year) (month(?toDate) as ?to_month) (day(?toDate) as ?to_day)
WHERE {
  VALUES ?event {wd:Q743768 wd:Q63349363 wd:Q63348899 wd:Q4126360 wd:Q988326 wd:Q759837 wd:Q80330 wd:Q2888504 wd:Q3124572 wd:Q1362660 wd:Q361 wd:Q362 wd:Q918544 wd:Q178275 wd:Q63433422 wd:Q81174 wd:Q1869031 wd:Q577000 wd:Q10691 wd:Q2000845 wd:Q848525 wd:Q7568777 wd:Q790029 wd:Q1035745 wd:Q17985748 wd:Q319761 wd:Q6820681 wd:Q127912 wd:Q3038296 wd:Q5897217 wd:Q63441831 wd:Q1585906 wd:Q1429157 wd:Q13583947 wd:Q608613 wd:Q15932056 wd:Q63440697 wd:Q158822 wd:Q63439774 wd:Q1850537 wd:Q581526 wd:Q7981936 wd:Q63433386 wd:Q2038022 wd:Q275173 wd:Q63433268 wd:Q8059745 wd:Q63413067 wd:Q63413034 wd:Q3404150 wd:Q742306 wd:Q83224 wd:Q10971509 wd:Q7982039 wd:Q12519 wd:Q7837154 wd:Q1488817 wd:Q1190809 wd:Q692259 wd:Q7843244 wd:Q25348506 wd:Q188495 wd:Q222013 wd:Q16889818 wd:Q55638011 wd:Q10637469 wd:Q333343 wd:Q3399475 wd:Q7982000 wd:Q3008641 wd:Q6820683 wd:Q7231235 wd:Q7018976 wd:Q4554588 wd:Q7836552 wd:Q160036 wd:Q63349642 wd:Q15177907 wd:Q4558541 wd:Q666063 wd:Q1321874 wd:Q5607565 wd:Q5137741 wd:Q918396 wd:Q384291 wd:Q63350780 wd:Q2689863 wd:Q204496 wd:Q63410293 wd:Q10536244 wd:Q63410594 wd:Q63410863 wd:Q426637 wd:Q1814107 wd:Q13132469 wd:Q16938617}
  ?event wikibase:sitelinks ?rank .
  ?event p:P585/psv:P585|p:P580/psv:P580|p:P571/psv:P571|p:P1619/psv:P1619 [
      wikibase:timeValue ?startDate ;
      wikibase:timePrecision ?startPrecision ;
    ] .
  OPTIONAL {
    ?event p:P582/psv:P582 [
      wikibase:timeValue ?endDate ;
      wikibase:timePrecision ?endPrecision ;
    ] .
  }
  OPTIONAL {?event wdt:P18 ?image}
  OPTIONAL {
    ?article schema:about ?event .
    ?article schema:isPartOf <https://{{lang}}.wikipedia.org/>
  }
  SERVICE wikibase:label { 
    bd:serviceParam wikibase:language "{{lang}}{{fallbackLang}}".
    ?event rdfs:label ?title .
    ?event schema:description ?description .
  }
} GROUP BY ?event ?title ?description ?rank ?article`

var labelsQueryTemplate = `SELECT DISTINCT (SUBSTR(STR(?value), 32) as ?item) ?valueLabel
WHERE {
  ?person wdt:P1648 [] .
  ?person p:P569/psv:P569 [] .
  
  { ?person wdt:P21 ?value } 
  UNION { ?person wdt:P106 ?value }
  UNION { ?person wdt:P19 ?value }
  UNION { ?person wdt:P20 ?value }
  UNION { ?person wdt:P69 ?value }
  UNION { ?person wdt:P140 ?value }
  UNION { ?person wdt:P735 ?value }
  UNION { ?person wdt:P734 ?value }
  FILTER (!isBLANK(?value))
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "{{lang}}{{fallbackLang}". }
}`;

// Returns all queries that depend on the required language of the output
// For non-English queries, English fallback is included automatically
function getQueriesForLanguage(lang) {
  var fallbackLang = (lang === 'en') ? '' : ',en';
  return {
    biographyData: biographyQueryTemplate.replace(/{{lang}}/g, lang).replace(/{{fallbackLang}}/g, fallbackLang),
    contextData: contextQueryTemplate.replace(/{{lang}}/g, lang).replace(/{{fallbackLang}}/g, fallbackLang),
    filterLabels: contextQueryTemplate.replace(/{{lang}}/g, lang).replace(/{{fallbackLang}}/g, fallbackLang),
  }
}

module.exports = {
  coreDataEn: coreDataEn,
  coreDataCy: coreDataCy,
  contextDataEn: contextDataEn,
  contextDataCy: contextDataCy,
  filterData: filterData,
  itemLabelsEn: itemLabelsEn,
  itemLabelsCy: itemLabelsCy,
  // new template version
  getForLanguage: getQueriesForLanguage
}