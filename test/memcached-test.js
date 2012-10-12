var vows = require('vows'),
    assert = require('assert'),
	cache = require('./../lib/node-memory-cache');

function sleep(ms) {
	var now = new Date().getTime();
	while(new Date().getTime() - now < ms) {
		// Do nothing
	}
}

vows.describe('cache test').addBatch({
	'Items' : {
		'set an item': {
		    operation: function() {cache.set("item", "this", "simple value")},
		    'get the item': function () {
		        assert.equal ("simple value", cache.get("item", "this"));
		    },
			'get the wrong item':function() {
				assert.equal (null, cache.get("asd", "this"));
			},
			'get the wrong property':function() {
				assert.equal (null, cache.get("item", "asd"));
			}
		},
		'set an item': {
		    operation: function() {cache.set("item", "this", "simple value")},
		    'get the item': function () {
		        assert.equal ("simple value", cache.get("item", "this"));
		    },
			'reset item':function() {
				cache.set("item", "this", "simple updated value");
				assert.equal ("simple updated value", cache.get("item", "this"));
			},
			'set another property':function() {
				cache.set("item", "nickname", "thefosk");
				assert.equal ("simple updated value", cache.get("item", "this"));
				assert.equal ("thefosk", cache.get("item", "nickname"));
				assert.isFalse(cache.getAll().item.nickname.counter);
				assert.equal(0, cache.getAll().item.nickname.expiration);
			}
		}
	},
	'Counters' : {
		'set a counter': {
		    operation: function() {cache.increment("item", "age", 10)},
		    'get the item': function () {
		        assert.equal (10, cache.get("item", "age"));
				assert.isTrue(cache.getAll().item.age.counter);
		    }
		},
		'update a counter': {
		    operation: function() {cache.increment("item", "age", 4)},
		    'get the item': function () {
		        assert.equal (14, cache.get("item", "age"));
				assert.isTrue(cache.getAll().item.age.counter);
				assert.equal(0, cache.getAll().item.nickname.expiration);
		    }
		}
	},
	'Expiration' : {
		'set an item with expiration': {
		    operation: function() {cache.set("item", "name", "Marco", 2000)},
		    'get the item': function () {
		        assert.equal ("Marco", cache.get("item", "name"));
				assert.isFalse(cache.getAll().item.name.counter);
				var referenceDate = cache.getAll().item.name.referenceDate;
				assert.equal(2000, cache.getAll().item.name.expiration);
				
				sleep(2000);
				
				assert.equal(null, cache.get("item", "name"));
				assert.equal(cache.getAll().item.name.referenceDate, referenceDate);
				
				cache.set("item", "name", "Luke");
				assert.equal ("Luke", cache.get("item", "name"));
				assert.isFalse(cache.getAll().item.name.counter);
				assert.equal(2000, cache.getAll().item.name.expiration);
				assert.notEqual(cache.getAll().item.name.referenceDate, referenceDate);
				assert.equal(cache.getAll().item.name.referenceDate, referenceDate + 2000);
				
				sleep(3000);
				
				cache.set("item", "name", "Pippo");
				assert.equal ("Pippo", cache.get("item", "name"));
				assert.isFalse(cache.getAll().item.name.counter);
				assert.equal(2000, cache.getAll().item.name.expiration);
				assert.notEqual(cache.getAll().item.name.referenceDate, referenceDate);
				assert.equal(cache.getAll().item.name.referenceDate, referenceDate + 4000);
		    }
		}
	}
}).export(module);