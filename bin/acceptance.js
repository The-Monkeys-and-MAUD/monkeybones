#!/usr/local/bin/node

/* node script to setup acceptance testing framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    var unzipper = require('./lib/process-zip');
    var request = require('request');

    return {
      setup: function(grunt, init, done) {
        unzipper.processZip(request('https://github.com/TheMonkeys/QUnitRunnerAcceptanceTests/archive/master.zip'), {
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
