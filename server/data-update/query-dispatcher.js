/* SPARQL query dispatcher constructor */
var fetch = require('node-fetch'),
    package =require('../package.json'),
    appName = package.name,
    appVersion = package.version

function QueryDispatcher (endpoint) {
  this.endpoint = endpoint; 
}

QueryDispatcher.prototype.query = function( sparqlQuery ) {
  const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
  const headers = { 
    'Accept': 'application/sparql-results+json',
    'User-Agent': `${appName}/${appVersion} (https://welsh-biography.histropedia.com; info@histropedia.com)`
  };
  return fetch( fullUrl, { headers } ).then(function(body) {return body.json()});
}

module.exports = QueryDispatcher;
