mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({     
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
    });


// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : 'red'})
    .setLngLat(coordinates)//listing.geometry.coordinates
    .addTo(map);




 
