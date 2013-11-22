/* dummy */     
define(['backbone', 'app/view/sampleview', 'app/view/controlbarview'], function(Backbone, DummyView, ControlBarView) {
    "use strict";
    
    return Backbone.View.extend({

        el:  'body',

        initialize: function () {
        
            //console.log("Main app loaded");
            
            // clear body 
            this.$el.html("");

            this.render( this.model );
        },

        render: function( item ) {
            
            var view = new DummyView({ model: item });
            var controllBar = new ControlBarView({ model: item });
            
            this.$el.append(controllBar.render().el); 
            this.$el.append(view.render().el); 
        }
    });
        
    
});
