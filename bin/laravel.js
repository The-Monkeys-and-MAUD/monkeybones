#!/usr/local/bin/node

/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    return {
        setup: function(grunt, init, done) {
            done();
        }
    };
  };

}(typeof exports === 'object' && exports || this));

