/* node script to setup laravel framework */
(function(exports) {
  "use strict";
  exports.prompt = 'Do you want to include Laravel 4.0 on the build?';

  var path = require('path');

  var createLayout = require('./laravel/layout').createLayout;
  var configureEnvironments = require('./laravel/environments').configureEnvironments;
  var configureMail = require('./laravel/mail').configureMail;
  var downloadLaravel = require('./laravel/download').downloadLaravel;
  var changeStoragePermissions = require('./laravel/storage').changeStoragePermissions;
  var configureTrustedProxies = require('./laravel/trustedProxies').configureTrustedProxies;


  exports.initTemplate = function(grunt, init, done) {
    // need to ask the user some more questions...
    init.process({}, [
      {
        name: 'environments',
        message: 'What environments (other than local) do you want to configure?',
        warning: 'Must be zero or more space-separated environment names.',
        'default': 'stage beta production',
        // Split the string on spaces.
        sanitize: function(value, data, done) { done(['local'].concat(value.split(/\s+/))); }
      },
      {
        name: 'mail',
        message: 'Do you want to configure an SMTP mail server?',
        'default': init.defaults.mail || 'Y/n'
      }
    ], function(err, props) {
      var prompts = [
      ];
      // if the user specified some environments then we'll need to ask how they should be detected.
      props.environments.forEach(function(environment) {
        prompts.push({
          name: 'environment-' + environment,
          message: 'What hostname patterns will be matched on the environment "' + environment + '"?',
          warning: 'Must be zero or more space-separated hostname patterns.',
            'default': init.defaults['environment-' + environment] || (environment === 'local' ?
              'localhost *.dev *.dev:*' : 'your-' + environment + '-host.com'),
          // Split the string on spaces.
          sanitize: function(value, data, done) { done(value.split(/\s+/)); }
        });
      });
      // if the user wants to configure an SMTP mail server then we'll need to ask for details now.
      if (/y/i.test(props.mail)) {
        prompts = prompts.concat([
          {
            name: 'smtphost',
            message: 'What SMTP Host Address do you want to use?',
            'default': init.defaults.smtphost || 'smtp.mailgun.org'
          },
          {
            name: 'smtpport',
            message: 'What SMTP Host Port do you want to use?',
            'default': init.defaults.smtpport || '587'
          },
          {
            name: 'smtpencryption',
            message: 'What E-Mail Encryption Protocol do you want to use?',
            'default': init.defaults.smtpencryption || 'tls'
          },
          {
            name: 'smtpusername',
            message: 'What SMTP Server Username do you want to use, if any?',
            'default': init.defaults.smtpusername
          },
          {
            name: 'smtppassword',
            message: 'What SMTP server Password do you want to use, if any?',
            'default': init.defaults.smtppassword
          },
          {
            name: 'smtpfrom',
            message: 'What Global "From" Address do you want to use, if any?',
            'default': init.defaults.smtpfrom
          },
          {
            name: 'smtpfromname',
            message: 'What Global "From" Name do you want to use, if any?',
            'default': init.defaults.smtpfromname
          }
        ]);
      }
      if (prompts.length) {
        init.process({}, prompts, function(err, detailedProps) {
          exports.props = grunt.util._.extend(props, detailedProps);
          next();
        });
      } else {
        exports.props = props;
        next();
      }
    });

    function next() {
      // Laravel is enabled so enable copying across files under app/
      // but only copy the environments that are required
      var mail = /y/i.test(exports.props.mail);
      for (var src in init.renames) {
        if (src.indexOf('laravel/') === 0) {
          var enable = true;

          var match = /build\/app\/config\/env(\d+)/.exec(src);
          var env = null;
          if (match) {
            var i = parseInt(match[1], 10);
            if (i < exports.props.environments.length) {
              env = exports.props.environments[i];
            } else {
              enable = false;
            }
          }

          // if mail was not enabled then don't copy app/config/**/mail.php
          if (!mail && /mail.php$/.test(src)) {
            enable = false;
          }

          if (enable) {
            if (env) {
              // rename the environment part of the pathname
              init.renames[src] = 'build/app/config/' + env + '/' + path.basename(src);
            } else {
              init.renames[src] = src.substr(8); // strip the leading 'laravel/' part
            }
          }
        }
      }
      done();
    }
  };

  exports.template = function(grunt, init, done) {
    grunt.log.write("Setting up the Laravel framework...");

    var tasks = [
      downloadLaravel,
      changeStoragePermissions,
      createLayout,
      configureEnvironments,
      configureTrustedProxies
    ];
    if (/y/i.test(exports.props.mail)) {
      tasks.push(configureMail);
    }

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

