import React from 'react';
import {
  Map, InfoWindow, Marker, GoogleApiWrapper
} from 'google-maps-react';

// ...

class MapContainer extends React.Component {
  componentDidMount() {
    this.setState({ dumdum: 'us' });
  }

  render() {
    const { campground } = this.props;
    const {
      lat, lng, location, name, description
    } = campground;
    const center = { lat, lng };
    const style = {
      width: '100%',
      height: '400px'
    };
    return (
      <Map
        google={this.props.google}
        style={style}
        center={center}
        zoom={15}
        onClick={this.onMapClicked}
        scrollwheel={false}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCzu35XTda9FLYoYkDRnHGoNVU6bVukyio'
})(MapContainer);

// function Map(props) {
//   const { lat, lng, location, name, description } = this.props
//   const center = {lat: lat, lng: lng };
//   const map = new google.maps.Map(document.getElementById('map'), {
//       zoom: 8,
//       center: center,
//       scrollwheel: false
//   });
//   const contentString = `
//     <strong><%= campground.name %><br />
//     <%= campground.location %></strong>
//     <p><%= campground.description %></p>
//   `
//   const infowindow = new google.maps.InfoWindow({
//     content: contentString
//   });
//   const marker = new google.maps.Marker({
//       position: center,
//       map: map
//   });
//   marker.addListener('click', function() {
//     infowindow.open(map, marker)
//   });

//   return (
//     <h1>MAP</h1>
//   );
// }

// <script>
//   function initMap() {
//     var lat = <%= campground.lat %>;
//     var lng = <%= campground.lng %>;
//     var center = {lat: lat, lng: lng };
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: center,
//         scrollwheel: false
//     });
//     var contentString = `
//       <strong><%= campground.name %><br />
//       <%= campground.location %></strong>
//       <p><%= campground.description %></p>
//     `
//     var infowindow = new google.maps.InfoWindow({
//       content: contentString
//     });
//     var marker = new google.maps.Marker({
//         position: center,
//         map: map
//     });
//     marker.addListener('click', function() {
//       infowindow.open(map, marker)
//     });
//   }
// </script>
// <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzu35XTda9FLYoYkDRnHGoNVU6bVukyio&callback=initMap"></script>

// export default Map;
