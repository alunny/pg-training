// 
//  --- our app behavior logic ---
//
run(function () {
    // immediately invoked on first run
    var init = (function () {
        navigator.network.isReachable("google.com", function(status) {
			var connectivity = (status.internetConnectionStatus || status.code || status);
        	if (connectivity === NetworkStatus.NOT_REACHABLE) {
        		alert("No internet connection - we won't be able to show you any maps");
        	} else {
        		alert("We can reach Google - get ready for some awesome maps!");
        	}
        });
    })();
    
    // a little inline controller
    when('#welcome');
    when('#settings', function() {
		// load settings from store and make sure we persist radio buttons.
		store.get('config', function(saved) {
			if (saved) {
				if (saved.map) {
					// @blackberry
					//
					// While XUI's attribute selector works in general, it does 
					// not work well with BlackBerry's form elements.
					// More specifically, the 'checked' and 'selected' attributes
					// that are common for radio, checkbox, and selection box elements.
					//
					// The alternative is to grab the raw element and explicitly set
					// the attribute.
					// 
					x$('input[value=' + saved.map + ']')[0].checked = true;
				}
				if (saved.zoom) {
					// @blackberry
					x$('input[name=zoom][value="' + saved.zoom + '"]')[0].checked = true;
				}
			}
		});
	});
    when('#map', function () {
        store.get('config', function (saved) {
            // construct a gmap str
            var map  = saved ? saved.map || ui('map') : ui('map')
            ,   zoom = saved ? saved.zoom || ui('zoom') : ui('zoom')
            ,   path = "http://maps.google.com/maps/api/staticmap?center=";
            
            // @blackberry
            //
            // During the training session, the master branch of PhoneGap-BlackBerry
            // was in the progress of updating geolocation to use the W3C geolocation spec.
            // To properly demonstrate the geolocation API call of this demo, we stubbed
            // out a lastPosition with a low timeout. The result is that the native
            // geolocation call is bypassed and the lastPosition is immediatel returned.
            //
            navigator.geolocation.lastPosition = {
                coords: {
                    latitude:  '49.2485',
                    longitude: '-123.1088'
                },
                timestamp: 1,
                timeout:   0
            };
            
            navigator.geolocation.getCurrentPosition(function (position) {
                var location = "" + position.coords.latitude + "," + position.coords.longitude;
                path += location + "&zoom=" + zoom;
                path += "&size=250x250&maptype=" + map + "&markers=color:red|label:P|";
                path += location + "&sensor=false";

                x$('img#static_map').attr('src', path);
            });
        });
    });
    when('#save', function () {
        store.save({
            key:'config',
            map:ui('map'),
            zoom:ui('zoom')
        });
        display('#welcome');
    });
});
