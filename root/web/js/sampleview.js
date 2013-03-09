/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};

    APP.DummyView = Backbone.View.extend({

        tagName:  'h1',
        
        template: _.template("<%= message %>"),

        events: {
            'click': 'helloWorld'
        },

        initialize: function () {
                                         
            this.render();            
            this.listenTo(this.model, "change", this.render);
        },

        render: function() {
            
            this.$el.html(this.template(this.model.attributes));
            return this;
        },

        helloWorld: function() {
        
            var message = global.prompt("New message:");
            
            global.location.href = '/#/message/' + message;
        }
    });
        
    
}( typeof exports === 'object' && exports || this ));
