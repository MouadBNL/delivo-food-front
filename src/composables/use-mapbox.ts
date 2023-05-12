import { ref } from "vue";

const useMapbox = (container: string, initalCoord: [number, number], onCoorChange: (coor: {lng, lat}) => void) => {

    mapboxgl.accessToken = 'pk.eyJ1Ijoid2Fzc2ltb3giLCJhIjoiY2xoa2tlc3RtMHQxYTNocXAwZTlvMm9zNSJ9.FRtJuCib-wShd0OtDqCq5Q';
    let userCoor = [-6.8498, 31.7917]
    let map = ref(), marker = ref()

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // radius of Earth in meters
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaLat = (lat2 - lat1) * Math.PI / 180;
        const deltaLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // distance in meters
        return d;
    }


    // use the Geolocation API to get the user's current position
    navigator.geolocation.getCurrentPosition(function (position) {
        // get the user's latitude and longitude coordinates
        var lngLat = [position.coords.longitude, position.coords.latitude];

        // use the Mapbox Geocoding API to reverse geocode the coordinates and get the user's country
        var geocodingEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lngLat[0] + ',' + lngLat[1] + '.json?types=country&access_token=' + mapboxgl.accessToken;
        fetch(geocodingEndpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // get the user's country from the API response
                userCoor = data.features[0].center;
                console.log(userCoor);
            });
    });

    function initMap() {
        map.value = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: initalCoord, // starting position [lng, lat]
            zoom: 4 // starting zoom
        });
        
        // create a new Marker object with the div element as its element option
        marker.value = new mapboxgl.Marker({
            color: "black",
            draggable: true,
            anchor: 'bottom'
        })
        .setLngLat(map.value.getCenter()) // set the marker's position to the center of the map
        .addTo(map.value); // add the marker to the map
        
        // add an event listener to the map that repositions the marker on map move
        map.value.on('move', function () {
            marker.value.setLngLat(map.value.getCenter());
            onCoorChange(map.value.getCenter())
        });

        // add a click event listener to the map
        map.value.on('click', function (e) {
            // get the clicked coordinates
            var lngLat = e.lngLat;

            // create two GeoJSON points
            var point1 = e.lngLat;
            var point2 = map.value.getCenter();

            // calculate the distance between the two points in kilometers using the turf.distance function
            var distance = calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);;

            // log the distance to the console
            console.log("distance =" + distance);
        });
    }


    return { initMap, map, calculateDistance }
}

export default useMapbox