/* dummy */     
(function(global) {    

    "use strict";
    
    var APP = global.app = global.app || {};

    APP.ControllBarView = Backbone.View.extend({

        _editable: true,

        tagName:  'div',
        
        template: _.template([
            '<label> Message: </label>' +
            '<input name="message" type="text" value="<%= message %>" />' +
            '<label> size: </label>' +
            '<input name="size" type="text" value="<%= size %>" />'
        ].join()),

        events: {
            'keyup input': 'updateModel',
            'blur input': 'enableEdit'
        },

        initialize: function () {
            this.render();            
            this.listenTo(this.model, "change", this.render);
                
            this.$el.find("input[name='message']").val(this.model.get("message"));

        },

        render: function() {
            if( this._editable ) {
                // we are no changing the message manually
                this.$el.html(this.template(this.model.attributes));
            }
            return this;
        },

        updateModel: function( event ) {
            
            this._editable = false;
            
            var _$el = $(event.currentTarget);
            this.model.set( _$el.attr("name"), _$el.val() );
        },
        
        enableEdit: function() {
            this._editable = true;
        }

    });
        
    
}( typeof exports === 'object' && exports || this ));
