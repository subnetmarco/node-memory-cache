cache = require('./lib/cache');

cache.set("item", "this", "ciao");

console.log(cache.get("item","this"));