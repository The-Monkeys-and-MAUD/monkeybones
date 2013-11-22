/* dummy */    
define([
  'backbone', 'app/model/samplemodel', 'app/collection/samplecollection', 'app/app'
], function(Backbone, DummyModel, DummyModelCollection, DummyAppView) {
    "use strict";
    
    return Backbone.Router.extend({

      initialize: function() {
          this.messageModel = new DummyModel();
          this.messageCollection = new DummyModelCollection([
              this.messageModel, 
              new DummyModel({
                name: "Dummy hidden model", 
                message: "You dont even know that i exist"
              })  
          ]);
          this.mainView = new DummyAppView({ model: this.messageModel });
     
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

});

