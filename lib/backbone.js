/* node script to setup backbone.js */
(function(exports) {
  "use strict";

  var path   = require('path');

  var DESTFOLDER = "build/web/js";

  function createFiles(grunt, init, done) {
      // Creates sample files
      // - model
      // - collection
      // - view
      // - route
      // - app
    
     var excludes =[
        'build/web/js/main.js',
        'build/web/js/app/dummy.js',
        'build/web/test/dummy_test.js'
     ];
    
     grunt.verbose.write("Creating sample files..");

     for (var src in init.renames) {

         if( src.indexOf('backbone/') === 0 ) {
            init.renames[src] = src.substr(9); // strip the leading 'backbone/' part
         }
     }

     for( var i=0, len=excludes.length; i<len; i++ ) {

         init.renames[ excludes[i] ] = false;
     }

     grunt.verbose.ok();
     done();
  }

  exports.prompt = 'Do you want to include Backbone.js on the build?';

  exports.initTemplate = function( grunt, init, done ) {

     createFiles( grunt, init, done );
  };

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
