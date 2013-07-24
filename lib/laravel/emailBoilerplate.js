(function(exports) {
  "use strict";
  var fs = require('fs');
  var request = require('request');
  var esrever = require('esrever');

  exports.integrateEmailBoilerplate = function(grunt, init, done) {
    grunt.verbose.write("Integrating htmlemailboilerplate into Laravel...");

    request('https://raw.github.com/seanpowell/Email-Boilerplate/master/email_lite.html', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // add a yield for the title
        var common = body.replace(/<title>.*<\/title>/, '<title>@yield(\'title\')</title>');

        // grab the contents of the first table>tr>td, that's where the body placeholder goes
        var match = /<table(?:.|[\r\n])*?<tr(?:.|[\r\n])*?<td(?:.|[\r\n])*?[\r\n]/mg.exec(common);
        if (match) {
          var bodyStart = match.index + match[0].length;
          body = common.substr(bodyStart);
          // to find the end of the body, we want to find the last </td>
          // this is easy if we reverse the body
          var reversed = esrever.reverse(body);
          match = />dt\/<[ \t\r\n]*/.exec(reversed);
          if (match) {
            var bodyLength = body.length - (match.index + match[0].length);
            body = body.substr(0, bodyLength);
            common = '{{-- This is the HTML Email Boilerplate template - http://htmlemailboilerplate.com/ --}}\n' +
              common.substr(0, bodyStart) +
              '\n\t\t\t@yield(\'emailbody\')' +
              common.substr(bodyStart + bodyLength);

            // save the template to app/views/emails/layouts/common.blade.php
            fs.mkdir('build/app/views/emails/layouts');
            grunt.file.write('app/views/emails/layouts/common.blade.php', common);

            // make a sample email body template
            body = '@extends(\'emails.layouts.common\')\n\n' +
              '@section(\'title\')\n' +
                '\tYour Title Here\n' +
              '@stop\n\n' +
              '@section(\'emailbody\')\n\n' +
                body + '\n' +
              '@stop\n';

            grunt.file.write('app/views/emails/sample.blade.php', body);

            grunt.verbose.ok();
            done();
            return;
          }
        }
      }
      grunt.fail.warn('Error downloading and/or processing htmlemailboilerplate: ' + error);
      done();
    });
  };

})(typeof exports === 'object' && exports || this);
