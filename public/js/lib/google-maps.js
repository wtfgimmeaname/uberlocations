define(
  "googlemaps",
  ["async!http://maps.googleapis.com/maps/api/js?key=AIzaSyCHc8NBkhZEZWTdWCI1ZkuJuuWpUCBE1HY&sensor=false"],
  function() {
    return {
      getCoordinates: function(address, model, callback) {
        var geocoder = new google.maps.Geocoder();
        var coords   = { "lat": "", "lng": "" };

        geocoder.geocode({ "address" : address }, function(resp, stat) {
          if (stat == google.maps.GeocoderStatus.OK) {
            model.set({
              "lat" : resp[0]["geometry"]["location"]["Xa"],
              "lng" : resp[0]["geometry"]["location"]["Ya"]
            }, { silent: true });
            callback();
          }
        });
      },
      renderMap: function(model, ele) {
        var pos  = new google.maps.LatLng(40.730885,-73.997383);
        var opts = { zoom: 16, mapTypeId: google.maps.MapTypeId.ROADMAP, center: pos };
        var geo  = new google.maps.Geocoder();
        var map  = new google.maps.Map(ele, opts);

        geo.geocode({ "address" : model.get('address') }, function(resp, stat) {
          if (stat == google.maps.GeocoderStatus.OK) {
            newPos = resp[0].geometry.location;
            map.setCenter(newPos);
            var marker = new google.maps.Marker({ map: map, position: newPos });
          }
        });
      }
    }
  }
);
