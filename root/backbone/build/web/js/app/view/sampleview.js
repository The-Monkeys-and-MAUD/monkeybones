/* dummy */     
define(['underscore', 'backbone'], function(_, Backbone) {
    "use strict";
    
    return Backbone.View.extend({

        tagName:  'h1',
        
        template: _.template("<%= message %>"),

        events: {
            'click': 'helloWorld'
        },

        initialize: function () {
            this.render();            
            this.listenTo(this.model, "change", this.render);
            this.listenTo(this.model,"change:message", this.updateHash);
        },

        render: function() {

            this.$el.html(this.template(this.model.attributes));

            this.$el.css({
                fontSize: this.model.get("size") + "px"
            });
                
            return this;
        },

        helloWorld: function() {
        
            this.model.set("message", window.prompt("New message:") );
        },

        updateHash: function() {

            window.location.href = '/#/message/' + this.model.get("message");
        }
    });
});
