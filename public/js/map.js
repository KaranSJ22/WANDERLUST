// let map_token=process.env.MAP_TOKEN;
// console.log(map_token);
mapboxgl.accessToken =map_token; 

const map = new mapboxgl.Map({
  container: 'map', 
  style:"mapbox://styles/mapbox/dark-v11",
  center:coordinates, 
  zoom: 9 
});
// console.log(coordinates);

const marker=new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.setPopup(
  new mapboxgl.Popup({offset:25})
  .setHTML('<p>Exact Location will be provided after booking</p>')
)
.addTo(map)