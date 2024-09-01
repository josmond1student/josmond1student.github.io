const cacheName = 'v2';

// call install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
});

// call activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    // remove unwanted caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// call fetch event
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        fetch(event.request)
            .then(res => {
                // make copy/clone of response
                const resClone = res.clone();
                // open a cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // add response to cache
                        cache.put(event.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(event.request).then(res => res))
    );
});