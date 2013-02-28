#!/usr/local/bin/node

/* node script to setup acceptance testing framework */
(function(exports) {

  exports.acceptance = function() {

    var fs = require('fs');
    var request = require('request');
    var targz = require('tar.gz');
    var rimraf = require('rimraf');
    var colors = require('colors');

    return {
        setup: function() {

          // folder where acceptance will be placed.
          var taskname = "AcceptanceFramework",   
              acceptanceFolder = 'public/acceptance',
              tempbuild = 'tempbuild',
              tempfile = tempbuild + '/acceptance.tar.gz',
              acceptanceUrl = 'https://api.github.com/repos/TheMonkeys/QUnitRunnerAcceptanceTests/tarball', 
              ok = "OK".green,
              outputfile;


            // if we have a build folder delete it before proceding.
            if( fs.existsSync(tempbuild) ) {

                rimraf.sync(tempbuild);
            }

            // create a new folder
            fs.mkdir(tempbuild);

            outputfile = fs.createWriteStream(tempfile);

            console.log(taskname, 'Preparing build..', ok);

            
            outputfile.on("close", function() {
                console.log(taskname, "Downloading.." + acceptanceUrl, ok );
                new targz().extract(tempfile, tempbuild, function() {
                    
                    console.log(taskname, "Extracting..", ok);

                    // deleting tempfile
                    fs.unlinkSync(tempfile);
                    
                    // delete folder in case there is something in there
                    rimraf.sync(acceptanceFolder);

                    // move new content to the folder
                    fs.renameSync(tempbuild + '/' + fs.readdirSync(tempbuild)[0], acceptanceFolder);

                    // remove build folder
                    rimraf.sync(tempbuild);

                    console.log(taskname, "Cleaning..", ok);
                });
            });

            // downloading file from git
            request(acceptanceUrl).pipe( outputfile);

        }
    };
  };  

}(typeof exports === 'object' && exports || this));
