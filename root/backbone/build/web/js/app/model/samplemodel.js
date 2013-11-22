/* dummy */     
define(['backbone'], function(Backbone) {
    "use strict";
    
    return Backbone.Model.extend({

        defaults: function() {
          return {
            name: "Dummy",
            message: "Hello world from Backbone",
            speed: 100,
            size: 20,
            visible: false
          };
        },

        initialize: function() {         
            //console.log( this.defaults().name, ' Model created.' );
        }

  });
});
