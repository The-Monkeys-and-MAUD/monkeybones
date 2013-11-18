(function (global) {
  'use strict';
  var APP = global.APP = global.APP || {}; // main app namespace

  APP.init = function () {

    // build a list of all modules that need initialising
    var toInitialise = [];
    var defaultOrder = 0;
    for (var name in APP) {

      if (APP.hasOwnProperty(name) && typeof APP[name] === "object" && APP[name] !== null) {
        var info = {
          module: APP[name],
          name: name
        };

        // if the module doesn't specify an order, then give it a default
        // we want default order to be the same as they are encountered in this loop, so preserve that
        // order we allocating the default order property
        info.order = info.module.order || 0;
        if (info.order > 0) {
          // if order was specifed and greater than 0, then need to increase its order by the number
          // of modules that received a default order.

          info.order += defaultOrder;
        } else if (info.order === 0) {
          // if order was not specified or was set to 0, then need to allocate a new order to preserve
          // the natural ordering of the array.

          info.order = defaultOrder++;
        }

        if (typeof info.module.init !== "undefined") {
          //console.log('Would have initialised module ' + info.name + ' now.');

          toInitialise.push(info);
        }
      }
    }

    // sort the modules by their (optional) order property. If order is not specified then they will
    // be initialised in the order in which they're found in global.APP.
    toInitialise.sort(function (a, b) {
      return a.order - b.order;
    });

    for (var i = 0; i < toInitialise.length; ++i) {
      //console.log('Initialising module ' + toInitialise[i].name);

      toInitialise[i].module.init();
    }

    return true;
  };

  // call init on dom ready
  global.jQuery(APP.init);

}(this));
