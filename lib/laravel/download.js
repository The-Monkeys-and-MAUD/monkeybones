(function(exports) {
  "use strict";
  var request = require('request');
  var Sink = require('pipette').Sink;
  var unzipper = require('../process-zip');
  var fs = require('fs');

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
        if (/build\/public\/.htaccess$/.test(file)) {
          // need to append this file because it already exists (comes with h5bp)
          new Sink(this).on('data', function(buffer) {
            // need to add an exception for pages served via DirectoryIndex
            // before the line containing
            //     RewriteRule ^(.*)/$
            // insert
            //     RewriteCond %{REQUEST_FILENAME}/index.html !-f
            var htaccess = buffer.toString().replace(/(RewriteRule \^\(\.\*\)\/\$[^\r\n]*)/g, 'RewriteCond %{REQUEST_FILENAME}/index.html !-f\n    $1');

            htaccess = '\n' +
              '# ----------------------------------------------------------------------\n' +
              '# Laravel framework\n' +
              '# ----------------------------------------------------------------------\n' +
              htaccess;
            fs.appendFileSync(file, htaccess);
          });
        }
        return file;
      }
    });
  };


})(typeof exports === 'object' && exports || this);
