(function(exports) {
  "use strict";
  var chmodr = require('chmodr');

  exports.changeStoragePermissions = function(grunt, init, done) {
    // Laravel storage folder needs to have writte permisions.
    grunt.verbose.write("Changing permissions on 'build/app/storage' folder..");

    chmodr.sync('build/app/storage/', parseInt('0000777', 8));

    grunt.verbose.ok();
    done();
  };

})(typeof exports === 'object' && exports || this);
