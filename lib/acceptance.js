/* node script to setup acceptance testing framework */
(function(exports) {
  "use strict";
  exports.template = function(grunt, init, done) {
    var unzipper = require('./process-zip');
    var request = require('request');

    grunt.log.write("Setting up Acceptance Testing framework...");
    unzipper.processZip(request('https://github.com/TheMonkeys/QUnitRunnerAcceptanceTests/archive/master.zip'), {
      fromdir: 'QUnitRunnerAcceptanceTests-master/',
      todir: 'public/acceptance/',
      verbose: function(msg) {
        grunt.verbose.writeln(msg);
      },
      complete: function() {
        grunt.log.ok();
        done();
      }
    });
  };

}(typeof exports === 'object' && exports || this));
