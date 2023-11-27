  // Initialize map with Mapbox GL JS
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center:  coordinates,
    zoom: 12,
  });

  // Add a marker for the listing's location
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map);

