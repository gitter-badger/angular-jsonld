/* global jsonld */
(function(jsonld) {
  'use strict';
  angular
    .module('angularJsonld')
    .provider('jsonld', Jsonld);

  /* @ngInject */
  function Jsonld() {
    var knownContexts = {};
    var provider = this;

    provider.$get = function($log) {
      var nodeDocumentLoader = jsonld.documentLoaders.jquery($);

      var customLoader = function(uri, callback) {
        if(uri in knownContexts) {
          $log.debug('Returning known context:', knownContexts[uri]);
          return callback(
            null, {
              contextUrl: null, // this is for a context via a link header
              document: knownContexts[uri], // this is the actual document that was loaded
              documentUrl: uri // this is the actual context URL after redirects
            });
        }
        nodeDocumentLoader(uri, callback);
      };
      jsonld.documentLoader = customLoader;
      return jsonld;
    };

    provider.registerContext = function(uri, context) {
      knownContexts[uri] = context;
    };
  }

})(jsonld);
