let map;
let markers = [];
let pinMap = [];
// Initialize and add the map
function initMap() {
  // The location of Uluru
  var toronto = { lat: 43.7, lng: -79.4 };
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: toronto
  });

  const placeService = new google.maps.places.PlacesService(map);
  const request = {
    query: "ottawa",
    fields: ["place_id", "name", "formatted_address", "icon", "geometry"]
  };
  placeService.findPlaceFromQuery(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      results.forEach(item => {

      });
    }
  });

  google.maps.event.addListener(map, "click", function (event) {
    let marker = new google.maps.Marker({
      id: markers.length,
      position: event["latLng"],
      label: markers.length.toString(),
      // title: "Hello World!"
      draggable: true
    });
    markers.push({ lat: marker.position.lat(), lng: marker.position.lng() });
    marker.setMap(map);
    console.log(marker.position);
    //    const contentString = setContentString(markers.length);
    const contentString = setContentString(marker);
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, "click", function () {
      infowindow.setContent(contentString);
      infowindow.open(map, this);

    });
    google.maps.event.addListener(marker, "rightclick", function () {
      marker.setMap(null);
      markers.push(marker);
    });
  });
  let divMap = document.getElementById("map");
  divMap.gMap = map;
}

function createMarker() {
  var marker = new google.maps.Marker({
    id: markers.length,
    position: event["latLng"],
    label: markers.length.toString(),
    // title: "Hello World!"
    draggable: true
  });
  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(contentString);
    infowindow.open(map, this);
  });
  return marker;
}

function setContentString(marker) {
  const contentString = `<div id=${marker}>
            <div id="siteNotice">
            </div>
            <h1 id="firstHeading" class="firstHeading">${marker.position}</h1>
            <div id="bodyContent">
            <p><b></b>
            </p>
            </div>
            </div>`;
  return contentString;
}




$(() => {
  console.log('loaded');



  //ajax request to GET
  $("#campingmap").click(() => {
    $.ajax({
      url: '/mapID',
      success: (data) => {
        pinMap = [];
        for (marker of data.coords) {
          // console.log(marker);
          let marker1 = new google.maps.Marker({
            position: { lat: Number(marker.latitude), lng: Number(marker.longitude) },
            draggable: true
          });
          pinMap.push(marker1);
          console.log(marker1.position.lng() + " " + marker1.position.lat());
          map.setCenter(marker1.getPosition());
          map.setZoom(6);
        }
        var bounds = new google.maps.LatLngBounds();
        pinMap.forEach(item => {
          item.setMap(map);
          bounds.extend(item.getPosition());
        });
        map.fitBounds(bounds);
      }
    });
  })
  $("#map_submission").on("submit", evt => {
    evt.preventDefault();
    //ajax request to /maps with markers
    $.ajax({
      url: '/pinsCollection',
      method: 'POST',
      data: { data: markers },
      dataType: "json",
      success: function (status) {
        console.log(status);
        // markers=[];
      }
    })
  })
});
