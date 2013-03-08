/* node script to setup backbone.js */
(function(exports) {
  "use strict";

  var fs     = require('fs');
  var path   = require('path');
  var mkdirp = require('mkdirp');

  var DESTFOLDER = "web/js";

  function createStructure(grunt, init, done) {
      // Generate folder structure for backbone
      // - model
      // - collection
      // - view
     grunt.verbose.write("Creating basic folder structure..");

     mkdirp.sync( DESTFOLDER + '/app/view'); 
     mkdirp.sync( DESTFOLDER + '/app/model'); 
     mkdirp.sync( DESTFOLDER + '/app/collection'); 

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
    
     var excludes =[
        'web/js/app/dummy.js',
        'web/test/dummy_test.js'
     ];
    
     grunt.verbose.write("Creating sample files..");

     for (var src in init.renames) {

         var match = /web\/js\/?.*/.exec(src);

         if( match ) {
            
            var _filename = path.basename( match );

            switch( _filename ) {
            
                case "app.js":
                    init.renames[src] = DESTFOLDER + '/app/' + _filename;
                    break;

                case "router.js":
                    init.renames[src] = DESTFOLDER + '/app/' + _filename;
                    break;

                case "sampleview.js":
                    init.renames[src] = DESTFOLDER + '/app/view/' + _filename;
                    break;

                case "samplemodel.js":
                    init.renames[src] = DESTFOLDER + '/app/model/' + _filename;
                    break;

                case "samplecollection.js":
                    init.renames[src] = DESTFOLDER + '/collection/' + _filename;
                    break;

            }
         }
     }

     for( var i=0, len=excludes.length; i<len; i++ ) {

         init.renames[ excludes[i] ] = false;
     }

     console.log( init.renames );

     grunt.verbose.ok();
     done();
  }

  exports.prompt = 'Do you want to include Backbone.js on the build?';

  exports.initTemplate = function( grunt, init, done ) {
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

  exports.template = function(grunt, init, done) {
    grunt.log.write("Setting up Backbonejs...");

    // this will set to the latest version
    init.projectDefaultjson.underscore = "";

    // this will set to the latest version
    init.projectDefaultjson.backbone = "";

  };

}(typeof exports === 'object' && exports || this));
