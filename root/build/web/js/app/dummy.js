/* dummy */     
(function(global) {    
    
    var APP = global.app = global.app || {},    
        module = APP.dummy = APP.dummy || {};    
    
    module.dummy = function sample() {    
        return 1;    
    };    
    
}( typeof exports === 'object' && exports || this ));
