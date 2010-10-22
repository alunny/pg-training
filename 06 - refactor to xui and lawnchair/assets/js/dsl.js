// the app method accepts a fn to invoke on init unobtrusively 
var run = function(application) {
    // attach to deviceready event, which is fired when phonegap is all good to go.
    //
    // @blackberry now supports deviceready
    //
    x$(document).on('deviceready', application, false);
}

// throw our settings into a lawnchair
// @blackberry needs to use the BlackBerry Persistent Storage adaptor.
, store = new Lawnchair({adaptor:'blackberry'})

// shows id passed
, display = function(id) {
    x$(["#welcome", "#map", "#settings"]).each(function(e, i) {
        var display = '#' + x$(e)[0].id === id ? 'block' : 'none';
        x$(e).css({ 'display':display });
        window.scrollTo(0, 0);
    });
}

// reg a click to [id]_button, displays id (if it exists) and executes callback (if it exists)
, when = function(id, callback) {
    x$(id + '_button').on('touchstart', function () {
        if (x$(id).length > 0)
            display(id);
        if (callback)
            callback.call(this);
		return false;
    });
}

// gets the value of the setting from the ui
, ui = function(setting) {
    // @blackberry
    //
    // BlackBerry struggles with forms and cannot treat the elements of a form
    // as hash. Instead, we need to manually grab all of the form elements.
    //
    var radio = x$('#settings_form')[0].elements;
    
    for (var i = 0, l = radio.length; i < l; i++) {
        // @blackberry
        //
        // Because we have grabbed all of the form elements, we need to 
        // only consider the elements that have the 'setting' name.
        //
        if (radio[i].name === setting && radio[i].checked)
            return radio[i].value;
    }
};