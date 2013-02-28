#!/usr/local/bin/node

/* node script to setup acceptance testing framework */
(function(exports) {
  "use strict";
  exports.template = function() {

    var fs = require('fs');
    var request = require('request');
    var targz = require('tar.gz');
    var rimraf = require('rimraf');

    return {
        setup: function(grunt, init, done) {

          // folder where acceptance will be placed.
          var taskname = "AcceptanceFramework",   
              acceptanceFolder = 'public/acceptance',
              tempbuild = 'tempbuild',
              tempfile = tempbuild + '/acceptance.tar.gz',
              acceptanceUrl = 'https://api.github.com/repos/TheMonkeys/QUnitRunnerAcceptanceTests/tarball', 
              outputfile;


            // if we have a build folder delete it before proceding.
            if( fs.existsSync(tempbuild) ) {

                rimraf.sync(tempbuild);
            }

            // create a new folder
            fs.mkdir(tempbuild);

            outputfile = fs.createWriteStream(tempfile);

            
            outputfile.on("close", function() {
                grunt.verbose.ok();
                grunt.verbose.write(taskname + ": extracting...");
                new targz().extract(tempfile, tempbuild, function() {
                    // deleting tempfile
                    fs.unlinkSync(tempfile);
                    
                    // delete folder in case there is something in there
                    rimraf.sync(acceptanceFolder);

                    // move new content to the folder
                    fs.renameSync(tempbuild + '/' + fs.readdirSync(tempbuild)[0], acceptanceFolder);

                    grunt.verbose.ok();

                    grunt.verbose.write(taskname + ": cleaning...");
                    // remove build folder
                    rimraf.sync(tempbuild);

                    grunt.verbose.ok();
                    done();
                });
            });

            // downloading file from git
            grunt.verbose.write(taskname + ": downloading..." + acceptanceUrl);
            request(acceptanceUrl).pipe( outputfile);

        }
    };
  };  

}(typeof exports === 'object' && exports || this));
