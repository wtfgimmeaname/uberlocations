define(
  "googlemaps",
  ["async!http://maps.googleapis.com/maps/api/js?key=AIzaSyCHc8NBkhZEZWTdWCI1ZkuJuuWpUCBE1HY&sensor=false"],
  function() {
    return {
      getCoordinates: function(address, editView) {
        var geocoder = new google.maps.Geocoder();
        var coords   = { "lat": "", "lng": "" };

        geocoder.geocode({ "address" : address }, function(resp, stat) {
          if (stat == google.maps.GeocoderStatus.OK) {
            lat = resp[0]["geometry"]["location"]["Xa"];
            lng = resp[0]["geometry"]["location"]["Ya"];
            editView.coordsCallback(lat, lng);
          }
        });
      },
      renderMap: function(model, ele, zoom) {
        var gMap = $(document.createElement('div'));
        $(ele).empty().append(gMap);

        var zlvl = (zoom) ? zoom : 15;
        var pos  = new google.maps.LatLng(40.730885,-73.997383);
        var opts = { zoom: zlvl, mapTypeId: google.maps.MapTypeId.ROADMAP, center: pos };
        var geo  = new google.maps.Geocoder();
        var map  = new google.maps.Map($(ele).find('> div')[0], opts);

        geo.geocode({ "address" : model.get('address') }, function(resp, stat) {
          if (stat == google.maps.GeocoderStatus.OK) {
            newPos = resp[0].geometry.location;
            map.setCenter(newPos);
            var marker = new google.maps.Marker({ map: map, position: newPos });
          }
        });
        return map;
      }
    }
  }
);
