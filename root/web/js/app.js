/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};

    APP.DummyAppView = Backbone.View.extend({

        el:  'body',

        initialize: function () {
        
            //console.log("Main app loaded");
            
            // clear body 
            this.$el.html("");

            this.render( this.model );
        },

        render: function( item ) {
            
            var view = new APP.DummyView({ model: item });
            var controllBar = new APP.ControllBarView({ model: item });
            
            this.$el.append(controllBar.render().el); 
            this.$el.append(view.render().el); 
        }
    });
        
    
}( typeof exports === 'object' && exports || this ));
