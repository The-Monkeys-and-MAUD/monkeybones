(function(exports) {
  "use strict";

  exports.dontIgnoreComposerLockFile = function(grunt, init, done) {
    grunt.verbose.write("Removing composer.lock from .gitignore.");

    var content = grunt.file.read('build/.gitignore').replace(/composer.lock[\r\n]/m, '');
    grunt.file.write('build/.gitignore', content);

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
