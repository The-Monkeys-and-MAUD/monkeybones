#!/usr/local/bin/node

/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    var dnz = require('./lib/download-and-unzip');

    return {
        setup: function(grunt, init, done) {
          dnz.downloadAndUnzip('https://github.com/laravel/laravel/archive/develop.zip', {
            fromdir: 'laravel-develop/',
            verbose: function(msg) {
              grunt.verbose.writeln(msg);
            },
            complete: done
          });
        }
    };
  };

}(typeof exports === 'object' && exports || this));

