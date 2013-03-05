(function(exports) {
  'use strict';

  var unzip = require('unzip');
  var path = require('path');
  var fs = require('fs');
  var mkdirp = require('mkdirp');

  /**
   * Available options:
   * options.fromdir: extract only files from this directory inside the zip. If not specified, all files will be
   *   extracted.
   * options.depth: ignore the given number of path components of filenames within the zip. Filenames with
   *   fewer than this number of path components will not be extracted at all.
   * options.todir: path to which files will be extracted. Defaults to the current working directory.
   * options.overwrite: if true, existing files will be overwritten by files from the zip
   * options.verbose: optional function to receive verbose logging statements
   * options.complete: callback function, called when the download is complete and all files have been extracted.
   * options.rename: callback function, called for each file or directory in the zip before it is written; the
   *   function can return an alternative path to which the file will be written; or may return null to skip the
   *   file.
   *
   * @param stream
   * @param options
   */
  exports.processZip = function(stream, options) {
    var verbose = typeof options.verbose === 'function' ? options.verbose : function() { };

    stream.pipe(unzip.Parse().on("entry", function(entry) {
      if (!options.fromdir || entry.path.indexOf(options.fromdir) === 0) {
        var file = options.fromdir ? path.relative(options.fromdir, entry.path) : entry.path;
        if (options.depth) {
          // strip this number of directories from the filename (starting from the left)
          var components = file.split('/'); // zipfiles always use '/'
          if (components.length < options.depth + 1) {
            verbose('Skipping "' + file + '" because it is less than depth "' + options.depth + '".');
            return;
          } else {
            components = components.slice(options.depth);
            file = components.join('/');
          }
        }
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
            verbose('Skipping "' + file + '".');
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
            var dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
              mkdirp.sync(dir);
            }
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
