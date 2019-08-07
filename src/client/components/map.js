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
