/* dummy */    
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {}; 
   
    APP.DummyModelCollection = Backbone.Collection.extend({
        model: APP.DummyModel,

        initialize: function() {
            // console.log("collection loaded");
        }   
    }); 

    
}( typeof exports === 'object' && exports || this )); 
