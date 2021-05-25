import React from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "../App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmFjZXZlZG9tIiwiYSI6ImNrb3d1cGFuajA5dXoydm1wdDZsbDEzMjAifQ.U9HqbhNdNMc0PJuI6dygaQ";

export const Fetchdata = async () => {
  const data = await axios.get(
    "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
  );

  this.setState({
    dataTemp: data.data,
  });
  console.log(data.data);
  const data2 = await axios.get(
    "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/listallwithinfo?id=1"
  );

  this.setState({
    dataCord: data2.data,
  });
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _isMounted: false,
      temperatures: [],
      dataCord: [],
      dataTemp: [],
      lng: -0.376805,
      lat: 39.4702,
      zoom: 9,
      data: {
        features: [],
      },
      // geojson: {
      //   type: "FeatureCollection",
      //   features: [
      //     {
      //       type: "Feature",
      //       properties: {

      //         message: "Foo",
      //         iconSize: [40, 40],
      //         temp: 15,
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-0.375807, 39.4705],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         message: "Bar",
      //         iconSize: [40, 40],
      //         temp: 30,
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-0.375805, 38.4702],
      //       },
      //     },
      //     {
      //       type: "Feature",
      //       properties: {
      //         message: "Baz",
      //         iconSize: [40, 40],
      //         temp: 30,
      //       },
      //       geometry: {
      //         type: "Point",
      //         coordinates: [-0.4333, 39.15],
      //       },
      //     },
      //   ],
      // },
    };

    this.mapContainer = React.createRef();
  }
  componentDidMount() {
    this._isMounted = true;

    this.insertData2();
    this.insertData();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  insertData = async () => {
    try {
      const data = await axios.get(
        "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
      );
      if (this._isMounted) {
        this.setState({
          dataTemp: data.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
    this.insertResult();
  };
  insertData2 = async () => {
    try {
      const data2 = await axios.get(
        "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/listallwithinfo?id=1"
      );

      if (this._isMounted) {
        this.setState({
          dataCord: data2.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  insertResult = async () => {
    const { dataTemp, dataCord } = this.state;

    var result = [];
    var temp = [];
    var i = 0;
    var a = [];
    var b = [];
    dataCord.forEach((item) => {
      if (item.state === "Comunidad Valenciana") {
        a.push(item.unique_id);
      }
    });

    for (let i = 0; i <= a.length; i++) {
      dataTemp.forEach((item) => {
        if (item.id === a[i]) {
          b.push(item);
        }
      });
    }

    b.forEach((n) => {
      temp.push(n.temperature);
    });

    dataCord.forEach((item) => {
      if (item.state === "Comunidad Valenciana") {
        result.push({
          type: "Features",
          properties: {
            message: item.locality,
            iconSize: [30, 30],
            temp: temp[i++],
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(item.longitude),
              parseFloat(item.latitude),
            ],
          },
        });
      }
    });
    console.log(i);
    this.setState({
      data: {
        features: result,
      },
    });
    console.log(result);
    this.insertmap(result);
  };
  insertmap = (result) => {
    const { lng, lat, zoom } = this.state;
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

    result.forEach((marker) => {
      // Create a DOM element for each marker.

      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = (function colortemp() {
        // if (marker.properties.temp <= 15) {
        //   return "green";
        // } else if (
        //   marker.properties.temp >= 20 &&
        //   marker.properties.temp < 30
        // ) {
        //   return "yellow";
        // } else if (marker.properties.temp >= 30) {
        //   return "orange";
        // } else {
        //   alert("no hay temperatura valida");
        // }
        return "orange";
      })();
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";
      el.style.backgroundSize = "100%";

      el.addEventListener("click", function () {
        window.alert(marker.properties.temp && marker.properties.message);
      });

      // Add markers to the map.
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    });
  };

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
