/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};
   
    APP.DummyModel = Backbone.Model.extend({

        defaults: {
            position: 'developer',
            alias: 'geek'
        }

    });


    
}( typeof exports === 'object' && exports || this ));
