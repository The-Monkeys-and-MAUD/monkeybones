/* dummy */
define(['backbone', 'app/model/samplemodel'], function(Backbone, DummyModel) {
    "use strict";

    return Backbone.Collection.extend({
        model: DummyModel,

        initialize: function() {
            // console.log("collection loaded");
        }   
    }); 

});
