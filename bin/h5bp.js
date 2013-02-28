#!/usr/local/bin/node

/* node script to setup html5 boiler plate framework */
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

