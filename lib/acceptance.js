/* node script to setup acceptance testing framework */
(function(exports) {
  "use strict";
  exports.prompt = 'Do you want to include the MonkeyTestJS testing framework on the build?';
  exports.template = function(grunt, init, done) {
    var unzipper = require('./process-zip');
    var request = require('request');

    grunt.log.write("Setting up MonkeyTestJS testing framework...");
    unzipper.processZip(request('https://github.com/TheMonkeys/MonkeytestJS/archive/master.zip'), {
      fromdir: 'QUnitRunnerAcceptanceTests-master/',
      todir: 'build/public/tests/',
      verbose: function(msg) {
        grunt.verbose.writeln(msg);
      },
      complete: function() {
        // add a section to the project default README.md file
        var readme = grunt.file.read('README.md');

        // find the heading ### Test
        // then insert at the end of that section
        var match = /### Test/.exec(readme);
        if (match) {
          var head = readme.substr(0, match.index);
          var tail = readme.substr(match.index);
          readme = head + tail.replace(/^.*\n\-\-+\n/m, 'Visit [http://' + init.props.name + '.dev/tests/](http://' + init.props.name + '.dev/tests/) to run the automated acceptance tests.\n\n$&');
          grunt.file.write('README.md', readme);
        }

        grunt.log.ok();
        done();
      }
    });
  };

}(typeof exports === 'object' && exports || this));
