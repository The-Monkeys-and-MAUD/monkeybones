/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};
   
    APP.router = new Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },

        setFilter: function (param) {
            // Set the current filter to be used
            app.TodoFilter = param.trim() || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of Todo view items
            app.Todos.trigger('filter');
        }
    });
    
}( typeof exports === 'object' && exports || this ));
