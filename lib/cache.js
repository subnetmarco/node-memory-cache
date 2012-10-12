var data = {};

exports.get = function(id, property) {
	property = typeof property !== 'undefined' ? property : "this";
	
	var element = data[id];
	if (!element || !element[property]) return null;

	if (element[property].expiration > 0 && getNewReferenceDate(element[property].referenceDate, element[property].expiration) != element[property].referenceDate) {
		// Expired
		return (element[property].counter) ? 0 : null;
	} else {
		return element[property].value
	}
}

exports.populate = function(d) {
	data = d;
}

exports.getAll = function() {
	return data;
}

exports.increment = function(id, property, amount, expiration) {
	exports.set(id, property, amount, expiration, true);
}

exports.set = function(id, property, value, expiration, counter) {
	counter = typeof counter !== 'undefined' ? counter : false;
	
	var element = data[id];
	if (element && element[property]) {
		if (expiration) {
			// update expiration date if set
			if (expiration < 0) expiration = 0;
			element[property].expiration = expiration;
		}
		
		// Item exists
		if (element[property].expiration > 0) {
			var newReferenceDate = getNewReferenceDate(element[property].referenceDate, element[property].expiration);
			if (element[property].referenceDate != newReferenceDate) {
				// Expired
				element[property].value = value;
				element[property].referenceDate = newReferenceDate;
				return;
			}
		}
		
		// Not expired
		if (counter) {
			element[property].value = element[property].value + parseInt(value);
		} else {
			element[property].value = value;
		}
	} else {		
		createItem(id, property, {
			value: (counter) ? parseInt(value) : value,
			counter: counter,
			expiration: (expiration) ? ((expiration < 0) ? 0 : expiration) : 0, // Do not allow negative expiration dates
			referenceDate:new Date().getTime()
		});
	}
}

function getNewReferenceDate(oldReferenceDate, expiration) {
	var now = new Date().getTime();
	
	// NEW_REF_DATE = OLD_REF_DATE + (FLOOR((NOW - OLD_REF_DATE) / EXP) * EXP)
	// If new reference date != referenceDate, is expired.
	
	// Reference date is the date taken as reference when calculating the expiration of an item.

	var newReferenceDate = oldReferenceDate + (Math.floor((now - oldReferenceDate) / expiration) * expiration);
	return newReferenceDate;
}

exports.delete = function(id, property) {
	if (!property) {
		delete data[id];
	} else {
		var element = data[id];
		delete element[property];
		var keys = Object.keys(element);
		if (keys.length == 1 && element[keys[0]] == null) {
			// If this was the only key in the item, remove the whole item from memory
			delete data[id];
		}
	}
}

function createItem(id, property, options) {
	var element = data[id];
	if (!element) element = {};
	element[property] = {
		value: options.value,
		counter: options.counter,
		expiration: (options.expiration) ? parseInt(options.expiration) : 0,
		referenceDate:new Date().getTime()
	}
	
	data[id] = element;
}