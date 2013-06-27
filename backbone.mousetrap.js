(function(_, Backbone, Mousetrap) {

    var oldDelegateEvents = Backbone.View.prototype.delegateEvents;
    var oldUndelegateEvents = Backbone.View.prototype.undelegateEvents;

    _.extend(Backbone.View.prototype, {

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

        delegateEvents: function() {
            var ret = oldDelegateEvents.apply(this, arguments);
            this.bindKeyboardEvents();
            return ret;
        },

        undelegateEvents: function() {
            var ret = oldUndelegateEvents.apply(this, arguments);
            if (this.unbindKeyboardEvents) this.unbindKeyboardEvents();
            return ret;
        }

    });
})(_, Backbone, Mousetrap);
