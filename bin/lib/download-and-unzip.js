'use strict';

(function(exports) {
  var request = require('request');
  var unzip = require('unzip');
  var path = require('path');
  var fs = require('fs');

  /**
   * Available options:
   * options.fromdir: extract only files from this directory inside the zip. If not specified, all files will be
   *   extracted.
   * options.todir: path to which files will be extracted. Defaults to the current working directory.
   * options.overwrite: if true, existing files will be overwritten by files from the zip
   * options.verbose: optional function to receive verbose logging statements
   * options.complete: callback function, called when the download is complete and all files have been extracted.
   * options.rename: callback function, called for each file or directory in the zip before it is written; the
   *   function can return an alternative path to which the file will be written; or may return null to skip the
   *   file.
   *
   * @param url
   * @param options
   */
  exports.downloadAndUnzip = function(url, options) {
    var verbose = typeof options.verbose === 'function' ? options.verbose : function() { };

    request(url).pipe(unzip.Parse().on("entry", function(entry) {
      if (!options.fromdir || entry.path.indexOf(options.fromdir) === 0) {
        var file = options.fromdir ? path.relative(options.fromdir, entry.path) : entry.path;
        if (options.todir) {
          file = path.resolve(options.todir, file);
        }
        if (typeof options.rename === 'function') {
          var renamed = options.rename.call(entry, file);
          if (renamed) {
            if (renamed !== file) {
              verbose('Renaming "' + file + '" to "' + renamed + '".');
              file = renamed;
            }
          } else {
            verbose('Skipping "' + file + '.');
            return;
          }
        }
        if (entry.type === 'Directory') {
          if (file !== '') {
            if (!fs.existsSync(file)) {
              verbose('Creating directory "' + file + '".');
              fs.mkdirSync(file);
            } else {
              verbose('Directory "' + file + '" already exists.');
            }
          }
        } else {
          if (fs.existsSync(file) && !options.overwrite) {
            verbose('File "' + file + '" already exists so will not extract.');
          } else {
            var fstream = fs.createWriteStream(file);
            entry.pipe(fstream);
            verbose('File "' + file + '" extracted.');
          }
        }
      } else {
        verbose('File "' + entry.path + '" not in directory "' + options.fromdir + '", not extracting.');
      }
    })).on("close", function() {
      if (typeof options.complete === 'function') {
        options.complete();
      }
    });
  };
}(typeof exports === 'object' && exports || this));
