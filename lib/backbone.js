/* node script to setup backbone.js */
(function(exports) {
  "use strict";

  var path   = require('path');

  var DESTFOLDER = "web/js";

  function createFiles(grunt, init, done) {
      // Creates sample files
      // - model
      // - collection
      // - view
      // - route
      // - app
    
     var excludes =[
        'web/js/main.js',
        'web/js/app/dummy.js',
        'web/test/dummy_test.js'
     ];
    
     grunt.verbose.write("Creating sample files..");

     for (var src in init.renames) {

         var match = /web\/js\/?.*/.exec(src);

         if( match ) {
            
            var _filename = path.basename( match );

            switch( _filename ) {

                case "backbonemain.js":
                    init.renames[src] = DESTFOLDER + '/' + _filename;
                    break;
            
                case "app.js":
                    init.renames[src] = DESTFOLDER + '/app/' + _filename;
                    break;

                case "router.js":
                    init.renames[src] = DESTFOLDER + '/app/' + _filename;
                    break;

                case "controllbarview.js":
                case "sampleview.js":
                    init.renames[src] = DESTFOLDER + '/app/view/' + _filename;
                    break;

                case "samplemodel.js":
                    init.renames[src] = DESTFOLDER + '/app/model/' + _filename;
                    break;

                case "samplecollection.js":
                    init.renames[src] = DESTFOLDER + '/app/collection/' + _filename;
                    break;

                case "backbonemodel_test.js":
                    init.renames[src] = DESTFOLDER + '/../test/' + _filename;
                    break;

            }
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
