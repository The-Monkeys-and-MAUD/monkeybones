#!/usr/local/bin/node

/**
 * This script downloads the latest HTML5 Boilerplate zip and installs into the project at public/.
 *
 * The following files are treated specially:
 *
 * - css/main.css is written to web/scss/_html5boilerplate.scss and has two @import statements added
 * - css/normalize.css is written to web/scss/_normalize.scss
 * - *.md files are saved into the project root and renamed *-h5bp.md.
 *
 */
(function (exports) {
  "use strict";

  var unzipper = require('./lib/process-zip');
  var request = require('request');
  var jsdom = require('jsdom');
  var path = require('path');
  var fs = require('fs');
  var Sink = require('pipette').Sink;

  function processBoilerplateCss(stream) {
    new Sink(stream).on('data', function(buffer) {
      var css = buffer.toString();

      // look for "Author's custom styles" comment
      css = css.replace(/(\/\*(?:.(?!\*\/)|[\n\r])*?Author's custom styles(?:.|[\n\r])*?\*\/)/g, '$1\n@import "base";\n');

      // import 'print' as the last line of the @media print section
      var matches = /(\@media\s+print\s+\{)/g.exec(css);
      if (matches) {
        // find the } that ends the media query
        // nested media queries are theoretically possible so need to balance the braces
        var depth = 0;
        var re = /[\{\}]/g;
        re.lastIndex = matches.index;
        while ((matches = re.exec(css)) !== null) {
          if (matches[0] === '{') {
            depth++;
          } else {
            depth--;
            if (depth === 0) {
              // this is the end of the media query.
              css = css.substr(0, matches.index) + '\n@import "print";\n' + css.substr(matches.index);
              break;
            }
          }
        }
      }

      // write to web/scss/_html5boilerplate.scss
      fs.writeFileSync('web/scss/_html5boilerplate.scss', css);
    });
  }

  exports.template = function () {
    return {
      setup:function (grunt, init, done) {
        var self = this;
        // get a link to the latest h5bp zip by accessing http://html5boilerplate.com/
        jsdom.env(
          "http://html5boilerplate.com/",
          ["http://code.jquery.com/jquery.js"],
          function (errors, window) {
            if (errors && errors.length) {
              grunt.fail.warn('Couldn\'t determine the latest version of HTML5Boilerplate: ' + JSON.stringify(errors));
              done();
              return;
            }

            var url = window.$('a[href*="zipball"]:first').attr('href');
            grunt.verbose.writeln('Downloading HTML5Boilerplate from _' + url + '_...');
            self.unzipBoilerplate(request(url), grunt, init, done);
          }
        );
      },
      unzipBoilerplate: function(stream, grunt, init, done) {
        unzipper.processZip(stream, {
          verbose: function(msg) {
            grunt.verbose.writeln(msg);
          },
          depth: 1,
          complete: done,
          rename: function(file) {
            var dir = path.dirname(file);
            if (dir === '.') {
              // the file is in the root directory
              var matches = /^(.*)\.md$/.exec(file);
              if (matches) {
                return matches[1] + '-h5bp.md';
              }

              // write the file as-is
              return path.resolve('public/', file);
            } else if (dir === 'css') {
              var name = path.basename(file, '.css');
              if (name === 'main') {
                processBoilerplateCss(this);
                return null;
              } else {
                // write verbatim to an _*.scss file
                return path.resolve('web/scss/_' + name + '.scss');
              }
            }

            // ignore any other files not in the root directory
            return null;
          }
        });
      }
    };
  };

}(typeof exports === 'object' && exports || this));

