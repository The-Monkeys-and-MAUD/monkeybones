/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};

    APP.DummyView = Backbone.View.extend({

        tagName:  'body',
        
        template: "<h1>Hello world with backbone</h1>",

        events: {
            'click': 'helloWorld'
        },

        initialize: function () {
            this.$el.css("background", "red");
            this.render();
        },

        render: function() {
            this.$el.html( this.template );
            return this;
        },

        helloWorld: function() {
            alert("Hello world from backbone view");
            this.$el.css("background", "blue");
        }
    });
        
    
}( typeof exports === 'object' && exports || this ));
