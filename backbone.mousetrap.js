(function(_, Backbone, Mousetrap) {

    // Save a reference to the old View-Constructor
    Backbone._View = Backbone.View;

    // This ensures, that the keyboard-events-binding
    // always happens, even if a custom initialize-
    // method is defined in the View-Instance.
    Backbone.View = function() {
        Backbone._View.apply(this, arguments);
        this.bindKeyboardEvents();
    };

    // Extending the new View-Constructor with old
    // and new (Mousetrap-related) stuff.
    _.extend(Backbone.View.prototype, Backbone._View.prototype, {

        keyboardEvents: {},

        bindKeyboardEvents: function(events) {
            if (!(events || (events = _.result(this, 'keyboardEvents')))) return;
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[events[key]];
                if (!method) throw new Error('Method "' + events[key] + '" does not exist');
                method = _.bind(method, this);
                if ('bindGlobal' in Mousetrap && (key.indexOf('command') !== -1 || key.indexOf('ctrl') !== -1)) {
                    Mousetrap.bindGlobal(key, method);
                } else {
                    Mousetrap.bind(key, method);
                }
            }
            return this;
        },

        unbindKeyboardEvents: function() {
            for (var keys in this.keyboardEvents) {
                Mousetrap.unbind(keys);
            }
            return this;
        },

        remove: function() {
            var ret = Backbone._View.prototype.remove.apply(this, arguments);
            if (this.unbindKeyboardEvents) this.unbindKeyboardEvents();
            return ret;
        }

    });

    // Appending the extend-method to the new View-Constructor.
    Backbone.View.extend = Backbone._View.extend;

})(_, Backbone, Mousetrap);
