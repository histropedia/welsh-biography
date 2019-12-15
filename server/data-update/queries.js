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
  
  SERVICE wikibase:label { bd:serviceParam wikibase:language "cy, en". }
}`;


module.exports = {
  coreDataEn: coreDataEn,
  coreDataCy: coreDataCy,
  filterData: filterData,
  itemLabelsEn: itemLabelsEn,
  itemLabelsCy: itemLabelsCy
}