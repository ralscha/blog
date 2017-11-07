let map;
let eventSource;
let locationMarkers = [];
let currentLocationMarker;
let locationAccuracyCircle;
let path;
let previousPosition;

function init() {
  loadMap();
  loadPositions();
  subscribeToServer();
}

function loadMap() {
  const latLng = new google.maps.LatLng(39, 34);

  const mapOptions = {
    center: latLng,
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function loadPositions() {
	fetch('positions').then(resp=>resp.json()).then(handlePositions);
}

function subscribeToServer() {
  eventSource = new EventSource(`register/${uuid.v4()}`);

  eventSource.addEventListener('pos', response => {
    for (const line of response.data.split('\n')) {
      handlePositions(JSON.parse(line));
    }
  }, false);

  eventSource.addEventListener('clear', x => clear(), false);
}

function handlePositions(positions) {
  for (let position of positions) {
    handlePosition(position);
  }

  if (positions.length > 0) {
    const lastPos = positions[positions.length - 1];
    const latlng = new google.maps.LatLng(lastPos.latitude, lastPos.longitude);
    map.setCenter(latlng);
  }
}

function handlePosition(position) {
  const latlng = new google.maps.LatLng(position.latitude, position.longitude);

  if (!currentLocationMarker) {
    currentLocationMarker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: 'gold',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 3
      }
    });
    locationAccuracyCircle = new google.maps.Circle({
      fillColor: 'purple',
      fillOpacity: 0.4,
      strokeOpacity: 0,
      map: map,
      center: latlng,
      radius: position.accuracy
    });
  }
  else {
    currentLocationMarker.setPosition(latlng);
    locationAccuracyCircle.setCenter(latlng);
    locationAccuracyCircle.setRadius(position.accuracy);
  }

  if (previousPosition) {
    locationMarkers.push(new google.maps.Marker({
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: 'green',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 3
      },
      map: map,
      position: new google.maps.LatLng(previousPosition.latitude, previousPosition.longitude)
    }));

    if (locationMarkers.length > 100) {
      const removedMarker = locationMarkers.shift();
      removedMarker.setMap(null);
    }
  }
  else {
    map.setCenter(latlng);
    if (map.getZoom() < 15) {
      map.setZoom(15);
    }
  }

  if (!path) {
    path = new google.maps.Polyline({
      map: map,
      strokeColor: 'blue',
      strokeOpacity: 0.4
    });
  }
  const pathArray = path.getPath();
  pathArray.push(latlng);
  if (pathArray.getLength() > 100) {
    pathArray.removeAt(0);
  }

  previousPosition = position;
}

function clear() {
  locationMarkers.forEach(r => r.setMap(null));
  locationMarkers = [];
  previousPosition = null;
  
  if (currentLocationMarker) {
    currentLocationMarker.setMap(null);
    currentLocationMarker = null;
  }

  if (locationAccuracyCircle) {
    locationAccuracyCircle.setMap(null);
    locationAccuracyCircle = null;
  }

  if (path) {
    path.setMap(null);
    path = null;
  }
}
