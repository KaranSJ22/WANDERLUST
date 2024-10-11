// let map_token=process.env.MAP_TOKEN;
// console.log(map_token);
mapboxgl.accessToken =map_token; 
  const map = new mapboxgl.Map({
      container: 'map', 
      center: [77.35,12.58], 
      zoom: 9 
  });