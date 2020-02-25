/* Options for data update process */

exports.DATE_LABELS = {
  "en": {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    periods: {
      decade: "s",
      century: "century",
      millennium: "millennium"
    },
    bceText: " BCE"
  },
  "cy": {
    months: ["Ion", "Chw", "Maw", "Ebr", "Mai", "Meh", "Gor", "Aws", "Med", "Hyd", "Tach", "Rhag"],
    periods: {
      decade: "au",
			century: "ganrif",
			millennium: "mileniwm"
    },
    bceText: " BCE"
  }
}

exports.RANK_FACTORS = {
  women: 4,
  contextEvents: 1
}

// Manually set labels for properties used as filters and colour codes
// Todo: Fallback to Wikidata labels so these options are optional
exports.PROPERTY_LABELS = {
  "en": {
    "P21": "Gender",
    "P106": "Occupation",
    "P19": "Place of birth",
    "P20": "Place of death",
    "P69": "Educated at",
    "P140": "Religion",
    "P735": "Given name",
    "P734": "Family name"
  },
  "cy": {
    "P21": "Rhyw", 
    "P106": "Galwedigaeth",
    "P19": "Man geni",
    "P20": "Man marw",
    "P69": "Alma mater",
    "P140": "Crefydd",
    "P735": "Enw cyntaf",
    "P734": "Cyfenw"
  }
}

// Dictionary of Welsh Biography uses different domains for en and cy version
// Used for constructing Biography URL from ID
exports.BIOGRAPHY_URL = {
  "en": 'https://biography.wales/article/',
  "cy": "https://bywgraffiadur.cymru/article/"
}