/* node script to setup backbone.js */
(function(exports) {
  "use strict";
  exports.template = function(grunt, init, done) {
    grunt.log.write("Setting up Backbonejs...");

    // this will set to the latest version
    init.projectDefaultjson.underscore = "";

    // this will set to the latest version
    init.projectDefaultjson.backbone = "";

    grunt.log.ok();
    done();
  };

}(typeof exports === 'object' && exports || this));
