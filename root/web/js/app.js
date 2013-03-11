/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};

    APP.DummyAppView = Backbone.View.extend({

        el:  $('body'),

        initialize: function () {
        
            //console.log("Main app loaded");
                        
            this.render( this.model );
        },

        render: function( item ) {
            
            var view = new APP.DummyView({ model: item });
            
            this.$el.html(view.render().el); 
        }
    });
        
    
}( typeof exports === 'object' && exports || this ));
