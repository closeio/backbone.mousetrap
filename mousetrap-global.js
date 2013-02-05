require([
    'mousetrap'
], function () {

    // https://gist.github.com/3885446
    // https://github.com/ccampbell/mousetrap/pull/64
    /**
     * adds a bindGlobal method to Mousetrap that allows you to
     * bind specific keyboard shortcuts that will still work
     * inside a text input field
     *
     * usage:
     * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
     */
    var _global_callbacks = {},
        _original_stop_callback = Mousetrap.stopCallback,
        _original_unbind = Mousetrap.unbind;

    Mousetrap.stopCallback = function (e, element, combo) {
        if (_global_callbacks[combo]) {
            return false;
        }

        return _original_stop_callback(e, element, combo);
    };

    Mousetrap.bindGlobal = function (keys, callback, action) {
        Mousetrap.bind(keys, callback, action);
        _global_callbacks[keys] = true;
    };

    Mousetrap.unbind = function (keys, action) {
        delete _global_callbacks[keys];
        return _original_unbind.apply(Mousetrap, [keys, action]);
    };

    return Mousetrap;
});
