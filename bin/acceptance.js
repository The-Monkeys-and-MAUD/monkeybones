#!/usr/local/bin/node

/* node script to setup acceptance testing framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    var dnz = require('./lib/download-and-unzip');

    return {
      setup: function(grunt, init, done) {
        dnz.downloadAndUnzip('https://github.com/TheMonkeys/QUnitRunnerAcceptanceTests/archive/master.zip', {
          fromdir: 'QUnitRunnerAcceptanceTests-master/',
          todir: 'public/acceptance/',
          verbose: function(msg) {
            grunt.verbose.writeln(msg);
          },
          complete: done
        });
      }
    };
  };

}(typeof exports === 'object' && exports || this));
