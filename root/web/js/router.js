/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};
   
    APP.router = Backbone.Router.extend({

      initialize: function() {
          this.messageModel = new APP.DummyModel();
          this.mainView = new APP.DummyAppView({ model: this.messageModel });  
          
          Backbone.history.start();
      },
    
      routes: {
        "/*": "home",
        "message/:message":     "message"
      },
      
      home: function() {
            //console.log("home");
      },

      message: function( message ) {
        
        this.messageModel.set("message", message);
      }

    });
    
}( typeof exports === 'object' && exports || this ));
