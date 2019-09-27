let map;
let markers = [];
let pinMap = [];
let newMarkers = [];
// Initialize and add the map
function initMap() {
  console.log(pinMap.length);
  var toronto = { lat: 43.7, lng: -79.4 };
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
        // console.log(item)
        // place_id, name, formatted_address, geometry.location, icon
      });
    }
  });
  //   google.maps.event.addListener(map, "rightclick", function(event) {
  //     var lat = event.latLng.lat();
  //     var lng = event.latLng.lng();
  //     // populate yor box/field with lat, lng
  //     alert("Lat=" + lat + "; Lng=" + lng);
  // });
  google.maps.event.addListener(map, "click", function (event) {
    let marker = new google.maps.Marker({
      id: markers.length,
      position: event["latLng"],
      label: markers.length.toString(),
      map: map,
      draggable: true
    });
    markers.push({ lat: marker.position.lat(), lng: marker.position.lng() });
    newMarkers.push({ lat: marker.position.lat(), lng: marker.position.lng() });
    // marker.setMap(map);
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
      // markers.push(marker);
      //Delete this marker form markers
      for (let targerMarker of markers) {
        if (targerMarker.lat === marker.position.lat() && targerMarker.lng === marker.position.lng()) {
          markers.splice(markers.indexOf(targerMarker), 1);
          newMarkers.splice(markers.indexOf(targerMarker), 1);
        }
      }
    });
    google.maps.event.addListener(marker, 'dragend', function (event) {
      console.log(event.latLng.lat());
      console.log(event.latLng.lng());
    })
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

function generateMapString(markers) {
  let coordsString = '';
  let mapString = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&`;
  for (let marker of markers) {
    mapString += `markers=color:red%7Clabel:S%7C${marker.lat},${marker.lng}&`;
    coordsString += `${marker.lat},${marker.lng},`
  }
  mapString += `key=AIzaSyCZImsQ1Qw68YIf_tHVOoMhs5wz5-F4JHA`;
  console.log(coordsString);
  return [mapString, coordsString];
};

$(() => {
  //ajax request to GET
  let mapID = $('#mapID').val();

  //check liked or not 
  $.ajax({
    url:'/checkliked',
    data: {data: mapID},
    success: (data) => {
      if (!data) {
        $("#unlike").attr("disabled", true);
        $("#like").attr("disabled", false);
      } else {
        $("#unlike").attr("disabled", false);
        $("#like").attr("disabled", true);
      }
    }
  })
  $.ajax({
    url: '/getmap',
    method: 'POST',
    data: { data: mapID },
    success: (data) => {
      console.log(data);
      pinMap = [];
      for (marker of data.coords) {
        // console.log(marker);
        let marker1 = new google.maps.Marker({
          position: { lat: Number(marker.latitude), lng: Number(marker.longitude) },
          map: map,
          draggable: true
        });
        pinMap.push(marker1);
        markers.push({ lat: marker1.position.lat(), lng: marker1.position.lng() });
        console.log(marker1.position.lng() + " " + marker1.position.lat());
        map.setCenter(marker1.getPosition());
        map.setZoom(6);
        $('#mapdescription').html(marker.description)
      }
      var bounds = new google.maps.LatLngBounds();
      pinMap.forEach(item => {
        item.setMap(map);
        bounds.extend(item.getPosition());
      });
      map.fitBounds(bounds);
      google.maps.event.addListener(marker, 'dragend', function (event) {
        console.log(event.latLng.lat());
        console.log(event.latLng.lng());
      })
      //try to delete marker
      // for (let marker of markers) {
      //   google.maps.event.addListener(marker, "rightclick", function () {
      //     marker.setMap(null);
      //     console.log(markers.length);
      //   })
      // }

    }
  });


  $("#map_submission").on("submit", evt => {
    evt.preventDefault();
    const mapString = generateMapString(markers);
    console.log(mapString);
    $('body').append(`<img src="${mapString}">`);
  });
  //like
  $(`#like`).click(() => {
    $("#like").attr("disabled", true);
    $("#unlike").attr("disabled", false);
    $.ajax({
      url: '/likemap',
      method: 'POST',
      data: { data: mapID },
      success: (data) => {
        console.log(data);
      }
    })
  })
  //unlike
  $(`#unlike`).click(() => {
    $("#unlike").attr("disabled", true);
    $("#like").attr("disabled", false);
    $.ajax({
      url: '/unlikemap',
      method: 'POST',
      data: { data: mapID },
      success: (data) => {
        console.log(data);
      }
    })
  })
  //Create new map
  $('#newmap').click(() => {
    const mapString = generateMapString(markers)[0];
    const coordsString = generateMapString(markers)[1];
    $('form').append(`<input id = "mapStr" name = "mapString" value = ${mapString} hidden>`);
    $('form').append(`<input name = "coordsString" value = ${coordsString} hidden>`);
  })

  $('#delete').click(() => {
    $.ajax({
      url: '/delete',
      method: 'POST',
      data: { delete: mapID }
    })
  })
  $('#updatemap').click(() => {
    //console.log(pinMap.length + "  "+markers.length);
    const mapString = generateMapString(markers)[0];
    const coordsString = generateMapString(newMarkers)[1];
    console.log(mapString + " " + coordsString);
    $('form').append(`<input id = "mapStr" name = "mapString" value = "${mapString}" hidden>`);
    $('form').append(`<input name = "coordsString" value = "${coordsString}" hidden>`);
  });
});


