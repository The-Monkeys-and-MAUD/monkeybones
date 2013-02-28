/* node script to setup acceptance testing framework */
(function(exports) {

  exports.acceptance = function() {
    return {
        setup: function() {

        /*
          // folder where acceptance will be placed.
          var acceptanceFolder = 'public/acceptance',
              acceptanceUrl = 'https://github.com/TheMonkeys/QUnitRunnerAcceptanceTests/master.tar.gz'; 

          if( !fs.existsSync( acceptanceFolder) ) {

            fs.mkdirSync(acceptanceFolder)

          }

         */
        }
    };
  };  

}(typeof exports === 'object' && exports || this));

