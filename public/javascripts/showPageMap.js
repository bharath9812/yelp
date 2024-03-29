mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/light-v10', // stylesheet location (plain light-varaint)
    // style: 'mapbox://styles/mapbox/satellite-streets-v12', // satelite views
    style: 'mapbox://styles/mapbox/dark-v10',
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
