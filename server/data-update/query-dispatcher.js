/* SPARQL query dispatcher constructor */
var fetch = require('node-fetch');

function QueryDispatcher (endpoint) {
  this.endpoint = endpoint;
}

QueryDispatcher.prototype.query = function( sparqlQuery ) {
  const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
  const headers = { 'Accept': 'application/sparql-results+json' };
  return fetch( fullUrl, { headers } ).then(function(body) {return body.json()});
}

module.exports = QueryDispatcher;
