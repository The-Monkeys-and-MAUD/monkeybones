(function () {
    'use strict';

    require.config({
        paths: {
            "jquery": "../bower_components/jquery/jquery"
        }
    });
    require(['app/dummy'], function (sample) {
        sample();
    });
})();
