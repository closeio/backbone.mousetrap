(function(_, Backbone, Mousetrap) {
    'use strict';

    // Override Backbone's View constructor, and bind keyboard events
    var View = Backbone.View;
    Backbone.View = function() {
        var ret = View.apply(this, arguments);
        this.bindKeyboardEvents();
        return ret;
    };

    _.extend(Backbone.View.prototype, View.prototype, {

        keyboardEvents: {},

        bindKeyboardEvents: function(events) {
            if (!(events || (events = _.result(this, 'keyboardEvents')))) {
                return;
            }

            for (var key in events) {
                if (_.has(events, key)) {

                    var method = events[key];
                    if (!_.isFunction(method)) {
                        method = this[events[key]];
                    }
                    if (!method) {
                        throw new Error('Method "' + events[key] + '" does not exist');
                    }
                    method = _.bind(method, this);
                    if ('bindGlobal' in Mousetrap && (key.indexOf('command') !== -1 || key.indexOf('ctrl') !== -1)) {
                        Mousetrap.bindGlobal(key, method);
                    } else {
                        Mousetrap.bind(key, method);
                    }
                }
            }
            return this;
        },

        unbindKeyboardEvents: function() {
            for (var keys in this.keyboardEvents) {
                if (_.has(this.keyboardEvents, keys)) {
                    Mousetrap.unbind(keys);
                }
            }
            return this;
        },

        remove: function() {
            var ret = View.prototype.remove.apply(this, arguments);
            if (this.unbindKeyboardEvents) {
                this.unbindKeyboardEvents();
            }
            return ret;
        }
    });

    Backbone.View.extend = View.extend;

})(_, Backbone, Mousetrap);
