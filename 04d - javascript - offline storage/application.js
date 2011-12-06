/**
 * storing our JavaScript in a separate file allows us to manage our app's
 * behaviour separately from the markup and presentation
 * 
 * if you have a larger app, you will want to split your application code into
 * multiple js files
 */

function loadItUp(initializationFunction) {
	if (document.readyState == 'loaded' || document.readyState == 'complete') {
		document.addEventListener('deviceready', initializationFunction, false);
	} else {
		if (navigator.userAgent.indexOf('Browzr') > -1) {
			setTimeout(initializationFunction, 250)
		} else {
			document.addEventListener('deviceready', initializationFunction,
					false);
		}
	}
};

function appInit() {
	initializeDatabase();

	// there are 4 interaction points in the app:
	// "Show My Location" button (welcome view)

	/*document.getElementById('map_button').onclick = function() {
		displayView('map');
		navigator.notification.alert("Unable to retrieve your location", null,
				"Showing Static Map", "Okay");

	}*/

	document.getElementById('map_button').onclick = function() {
		checkSettingsGetPositionAndDisplayGoogleMap();
	}

	// "Settings" button (welcome view)
	document.getElementById('settings_button').onclick = function() {
		displayView('settings');
	}

	// "Go Back" button (map view)
	document.getElementById('back_button').onclick = function() {
		displayView('welcome');
	}

	// "Save" button (settings view)
	// we want to override the default behavior, so we return false
	// we also want to save any selections to the database
	document.getElementById('save_button').onclick = function() {
		saveSettings();
		displayView('welcome');
		return false;
	}

	// check if we can access google.com
	isNetworkAvailable();
	checkSettings();

};

// this function will allow us to hide the current view and
// to display a new one
function displayView(id) {
	var views = [ "welcome", "map", "settings" ];
	var i = 0;

	while (i < views.length) {
		if (views[i] == id) {
			document.getElementById(id).style.display = "block";
		} else {
			document.getElementById(views[i]).style.display = "none";
		}
		i++;
	}
};

function isNetworkAvailable() {
	try {
		var networkState = navigator.network.connection.type;

		if (networkState === Connection.NONE) {
			navigator.notification
					.alert(
							"No internet connection - we won't be able to show you any maps",
							null, "PhoneGap Training", "Okay");
		} else {
			navigator.notification
					.alert(
							"We can reach the internet - get ready for some awesome maps!",
							null, "PhoneGap Training", "Let's Go!");
		}
	} catch (e) {
		alert("Error: " + e);
	}
};
// replacing the placeholder image with an image based on the given location
function displayGoogleMap(position, mapType, zoomLevel) {
	var location = "" + position.coords.latitude + ","
			+ position.coords.longitude;

	var mapPath = " http://maps.google.com/maps/api/staticmap?center="
			+ location + "&zoom=" + zoomLevel + "&size=250x250&maptype="
			+ mapType + "&markers=color:red|label:P|" + location
			+ "&sensor=false";

	console.log(mapPath);

	document.getElementById("static_map").src = mapPath;

	displayView('map');

};

function saveSettings() {
	var settings = {};
	settings['mapType'] = get_radio_value(document
			.getElementById('settings_form').map_type);
	settings['zoomLevel'] = get_radio_value(document
			.getElementById('settings_form').zoom_level);

	updateDatabase(settings);
};

function updateSettingsView(settings) {

	var mapType = settings['mapType']
			|| get_radio_value(document.getElementById('settings_form').map_type);
	var zoomLevel = settings['zoomLevel']
			|| get_radio_value(document.getElementById('settings_form').zoom_level);

	set_radio_value(document.getElementById('settings_form').map_type, mapType);
	set_radio_value(document.getElementById('settings_form').zoom_level,
			zoomLevel);

};

function checkSettings() {

	getAllSettings(updateSettingsView);

};

function checkSettingsGetPositionAndDisplayGoogleMap() {

	getAllSettings(function(settings) {

		var mapType = settings['mapType']
				|| get_radio_value(document.getElementById('settings_form').map_type);
		var zoomLevel = settings['zoomLevel']
				|| get_radio_value(document.getElementById('settings_form').zoom_level);

		var options = {
			maximumAge : 3000,
			timeout : 5000,
			enableHighAccuracy : true
		};

		navigator.geolocation.getCurrentPosition(function(position) {
			displayGoogleMap(position, mapType, zoomLevel);
		}, displayStaticMap, options);
	});
};

function displayStaticMap(error) {
	document.getElementById("static_map").src = "staticmap.png";
	displayView('map');

	navigator.notification.alert("Unable to retrieve your location: "
			+ error.message, null, "Showing Static Map", "Okay");

};

function get_radio_value(radEl) {
	for ( var i = 0; i < radEl.length; i++) {
		if (radEl[i].checked) {
			return radEl[i].value;
		}
	}
};

function set_radio_value(radEl, value) {
	for ( var i = 0; i < radEl.length; i++) {

		if (radEl[i].value == value) {
			radEl[i].checked = true;
		}
	}
};

