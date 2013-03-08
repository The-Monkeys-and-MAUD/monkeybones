/* node script to setup backbone.js */
(function(exports) {
  "use strict";

  function createStructure(grunt, init, done) {
      // Generate folder structure for backbone
      // - model
      // - collection
      // - view
     grunt.verbose.write("Creating basic folder structure..");
    
     grunt.verbose.ok();
     done();
  }

  function createFiles(grunt, init, done) {
      // Creates sample files
      // - model
      // - collection
      // - view
      // - route
      // - app
     grunt.verbose.write("Creating sample files..");
    
     grunt.verbose.ok();
     done();
  }

  exports.prompt = 'Do you want to include Backbone.js on the build?';
  exports.template = function(grunt, init, done) {
    grunt.log.write("Setting up Backbonejs...");

    // this will set to the latest version
    init.projectDefaultjson.underscore = "";

    // this will set to the latest version
    init.projectDefaultjson.backbone = "";

    var tasks = [
        createStructure,
        createFiles
    ];

    (function next() {
      (tasks.shift())(grunt, init, function() {
        if (tasks.length) {
          next();
        } else {
          grunt.log.ok();
          done();
        }
      });
    }());
  };

}(typeof exports === 'object' && exports || this));
