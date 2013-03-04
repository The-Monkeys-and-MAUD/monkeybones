#!/usr/local/bin/node

/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.template = function() {
    var unzipper = require('./lib/process-zip');
    var request = require('request');
    var fs = require('fs');
    var Sink = require('pipette').Sink;

    return {
        setup: function(grunt, init, done) {
          unzipper.processZip(request('https://github.com/laravel/laravel/archive/develop.zip'), {
            fromdir: 'laravel-develop/',
            verbose: function(msg) {
              grunt.verbose.writeln(msg);
            },
            complete: done,
            rename: function(file) {
              var matches = /^(.*)\.md$/.exec(file);
              if (matches) {
                return matches[1] + '-Laravel.md';
              }
              if (file === 'public/.htaccess') {
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
        }
    };
  };

}(typeof exports === 'object' && exports || this));

