import React from "react";
import mapboxgl from "mapbox-gl";
import "../App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmFjZXZlZG9tIiwiYSI6ImNrb3d1cGFuajA5dXoydm1wdDZsbDEzMjAifQ.U9HqbhNdNMc0PJuI6dygaQ";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -0.376805,
      lat: 39.4702,
      zoom: 9,
      data: [],
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              message: "Foo",
              iconSize: [40, 40],
              temp: 15,
            },
            geometry: {
              type: "Point",
              coordinates: [-0.375807, 39.4705],
            },
          },
          {
            type: "Feature",
            properties: {
              message: "Bar",
              iconSize: [40, 40],
              temp: 30,
            },
            geometry: {
              type: "Point",
              coordinates: [-0.375805, 38.4702],
            },
          },
          {
            type: "Feature",
            properties: {
              message: "Baz",
              iconSize: [40, 40],
              temp: 30,
            },
            geometry: {
              type: "Point",
              coordinates: [-0.4333, 39.15],
            },
          },
        ],
      },
    };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom, geojson } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });
    map.addControl(new mapboxgl.FullscreenControl());
    geojson.features.forEach(function (marker) {
      // Create a DOM element for each marker.
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = (function colortemp() {
        if (marker.properties.temp <= 15) {
          return "green";
        } else if (
          marker.properties.temp >= 20 &&
          marker.properties.temp < 30
        ) {
          return "yellow";
        } else if (marker.properties.temp >= 30) {
          return "orange";
        } else {
          alert("no hay temperatura valida");
        }
      })();
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";
      el.style.backgroundSize = "100%";

      el.addEventListener("click", function () {
        window.alert(marker.properties.message);
      });

      // Add markers to the map.
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    });
  }
  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}
