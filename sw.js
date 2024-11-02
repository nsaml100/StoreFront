self.addEventListener("install", e => {
    console.log('install code');
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./styles.css", "./store.js", "./index.html", "./about.html", "./Album 1", "./Album 2", "./Album 3", "./Album 4"]);
        })
    );
});

self.addEventListener( "fetch", e =>{
    e.respondWith(
        caches.match(e.request).then(response =>{
            return response || fetch(e.request);
        })
    );
});