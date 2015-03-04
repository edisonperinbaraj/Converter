angular.module('AnalyticsApp')

.factory('appCache', ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('app-cache');
}])

.service('StorageService', function ($angularCacheFactory, appCache) {
	
	this.createCache = function(cacheName, onExpiry) {
    
        return $angularCacheFactory(cacheName, {

		    // This cache can hold 1000 items
		    capacity: 1000,

		    // Items added to this cache expire after maxAge minutes
		    maxAge:  window.appConstants.CACHE_MAX_AGE * 60 * 1000,

		    // Items will be actively deleted when they expire
		    deleteOnExpire: 'aggressive',
		    
		    // This cache will check for expired items every minute
		    recycleFreq: 150000,

		    // This cache will clear itself every hour
		    cacheFlushInterval: 10800000,

            // This cache will sync itself with localStorage
		    storageMode: 'localStorage',

            // Full synchronization with localStorage on every operation
		    verifyIntegrity: true,

		    onExpire: onExpiry,

	    });
    };

    this.getCache = function(cacheName) {
        return $angularCacheFactory.get(cacheName);
    };
	
	this.put = function(key, data, ngCache) {
		//if(ngCache.get(key, data)) {
		//	ngCache.remove(key);
		//}
		appCache.put(key, data);
        if(CONFIG.persistantCache)
            ngCache.put(key, data);
        

	};
	
	this.get = function(key, ngCache) {
		var data = appCache.get(key, data);
        if(!data) {
            appCache.put(key, ngCache.get(key));
            return ngCache.get(key) || undefined;
        } else {
            ngCache.put(key, data);
		    return data;
        }
	};
	
	this.isExpired = function(key, ngCache) {
		return ngCache.info(key).isExpired;
	};
	
	this.remove = function(key, ngCache) {
		return ngCache.remove(key);
	};
	
	this.info = function(key, ngCache) {
		return ngCache.info(key);
	};
});