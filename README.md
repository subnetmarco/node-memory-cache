# node-memory-cache

A simple in memory cache module for node.js

* Supports multiple properties on cached objects
* Supports counters
* Supports different expiration dates on properties.

# Installation

`npm install node-memory-cache`

# Usage

```javascript
var cache = require('node-memory-cache');

// Set an object property
cache.set("ObjectId", "ObjectProperty", "Value");

// Set an object property with a 3000ms expiration
cache.set("ObjectId", "ObjectPropertyWithExpiration", "Another Value", 3000);

// Get the object properties
cache.get("ObjectId", "ObjectProperty");
cache.get("ObjectId", "ObjectPropertyWithExpiration");

// Set a new property that is a counter, and increment it with +1
cache.increment("ObjectId", "CounterProperty", 1);

// Set a new property that is a counter, and increment it with +10, with a 5000ms expiration.
cache.increment("ObjectId", "CounterPropertyWithExpiration", 10, 5000);

// Decrementing a value, it is like incrementing it with a negative amount
cache.increment("ObjectId", "CounterProperty", -5);

// Expiration dates can be overwritten by specifying them again
cache.set("ObjectId", "ObjectPropertyWithExpiration", "Value", 3000);
cache.set("ObjectId", "ObjectPropertyWithExpiration", "Another Value", 5000); // Now the expiration has been updated to 5000ms

// The same for counters
cache.increment("ObjectId", "CounterPropertyWithExpiration", 1, 2000); // The counter has a 2000ms expiration

// The counter still keeps a 2000ms expiration
cache.increment("ObjectId", "CounterPropertyWithExpiration", 3); 
cache.increment("ObjectId", "CounterPropertyWithExpiration", 4);

// We update the expiration date to 5000ms while incrementing the value
cache.increment("ObjectId", "CounterPropertyWithExpiration", 1, 5000);

// To remove an expiration just set it to zero
cache.increment("ObjectId", "CounterPropertyWithExpiration", 1, 0); // We removed the expiration to this property

// Delete a property/counter
cache.delete("ObjectId", "ObjectProperty");

// Get all items stored
var data = cache.getAll();

// Initialize the cache with some predefined data: expected to be in the same format as the return value of getAll()
cache.populate(data);
```

# Support

Open an issue on GitHub.
