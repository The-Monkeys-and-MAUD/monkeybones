(function(exports) {
  "use strict";
  var request = require('request');
  var Sink = require('pipette').Sink;
  var unzipper = require('../process-zip');

  exports.downloadLaravel = function(grunt, init, done) {
    unzipper.processZip(request('https://github.com/laravel/laravel/archive/master.zip'), {
      fromdir: 'laravel-master/',
      todir: 'build/',
      verbose: function(msg) {
        grunt.verbose.writeln(msg);
      },
      complete: done,
      rename: function(file) {
        var matches = /^(.*)\.md$/.exec(file);
        if (matches) {
          return matches[1] + '-Laravel.md';
        }
        if (file === 'build/public/.htaccess') {
          // need to append this file because it already exists (comes with h5bp)
          new Sink(this).on('data', function(buffer) {
            var htaccess = '\n' +
              '# ----------------------------------------------------------------------\n' +
              '# Laravel framework\n' +
              '# ----------------------------------------------------------------------\n' +
              buffer.toString();
            fs.appendFileSync(file, htaccess);
          });
        }
        return file;
      }
    });
  };


})(typeof exports === 'object' && exports || this);
