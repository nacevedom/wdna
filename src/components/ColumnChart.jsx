import React from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "../App.css";
import moment from "moment";
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFjZXZlZG9tIiwiYSI6ImNrb3d1cGFuajA5dXoydm1wdDZsbDEzMjAifQ.U9HqbhNdNMc0PJuI6dygaQ";

export const Fetchdata = async () => {
  const data = await axios.get(
    "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
  );

  this.setState({
    dataTemp: data.data,
  });

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
      datajson: require("./zonas.json"),

      prueba: {
        zonas: [
          {
            id: "aemet-9562X",
            zona: "zona_1",
          },
          // {
          //   zona_2: {
          //     id: "aemet-8520X",
          //   },
          // },
          // {
          //   zona_4: {
          //     id: "aemet-8523X",
          //   },
          // },
          // {
          {
            id: ["aemet-8489X", "aemet-9563X"],
            zona: "zona_5",
          },

          // {
          //   zona_20: [
          //     { id: "aemet-8050X" },
          //     { id: "aemet-8058X" },
          //     { id: "aemet-8058Y" },
          //     { id: "aemet-8072Y" },
          //   ],
          // },
        ],
      },

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
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  insertData = async () => {
    var dateFormat = require("dateformat");
    var date = new Date();

    var subs = moment().subtract(3, "hours");
    var minute = subs.minutes();

    var startdate = subs.subtract(minute, "minutes").format("YYYY-MM-DDTHH:mm");

    var enddate = dateFormat(date, "isoDateTime");
    try {
      const data = await axios.get(
        `http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=${startdate}&end=${enddate}`
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
    this.insertData();
  };
  insertResult = async () => {
    const { dataTemp, dataCord, prueba, datajson } = this.state;

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

    // var zonas = {
    //   "aemet-8337X": "zona 15",
    //   "aemet-7244X": "zona 29",
    //   "aemet-7247X": "zona 27",
    //   "aemet-7261X": "zona 30",
    //   "aemet-8005X": "zona 21",
    //   "aemet-8008Y": "zona 21",
    //   "aemet-8013X": "zona 28",
    //   "aemet-8018X": "zona 28",
    //   "aemet-8019": "zona 26",
    //   "aemet-8025": " zona 26",
    //   "aemet-8050X": "zona 20",
    //   "aemet-8057C": "zona 19",
    //   "aemet-8058X": "zona 20",
    //   "aemet-8058Y": "zona 20",
    //   "aemet-8059C": "zona 22",
    //   "aemet-8072Y": "zona 20",
    //   "aemet-8193E": "zona 14",
    //   "aemet-8203O": "zona 14",
    //   "aemet-8270X": "zona 15",
    //   "aemet-8283X": "zona 18",
    //   "aemet-8293X": "zona 17",
    //   "aemet-8300X": "zona 17",
    //   "aemet-8309X": "zona 11",
    //   "aemet-8319X": "zona 15",
    //   "aemet-8325X": "zona 13",
    //   "aemet-8381X": "zona 10",
    //   "aemet-8395X": "zona 10",
    //   "aemet-8409X": "zona 12",
    //   "aemet-8414A": "zona 13",
    //   "aemet-8416X": "zona 13",
    //   "aemet-8416Y": "zona 13",
    //   "aemet-8446Y": "zona 9",
    //   "aemet-8472A": "zona 6",
    //   "aemet-8489X": "zona 5",
    //   "aemet-8492X": "zona 7",
    //   "aemet-8500A": "zona 8",
    //   "aemet-8503Y": "zona 8",
    //   "aemet-8520X": "zona 2",
    //   "aemet-8523X": "zona 4",
    //   "aemet-9562X": "zona 1",
    //   "aemet-9563X": "zona 5",
    //   "aemet-8439X": "zona 7",
    // };

    dataCord.forEach((item) => {
      if (item.state === "Comunidad Valenciana") {
        result.push({
          type: "Features",
          properties: {
            message: item.locality,
            iconSize: [30, 30],
            temp: temp[i++],
            id: item.unique_id,
            zona: (function getzone() {
              console.log(datajson.data);
              for (i in datajson.data) {
                for (let j = 0; j < datajson.data.length; j++) {
                  if (datajson.data[i]) {
                  }
                }
              }
            })(),
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

    this.setState({
      data: {
        features: result,
      },
    });
    console.log(result);
    this.insertmap(result);
  };
  insertmap = (result) => {
    const { lng, lat, zoom, prueba } = this.state;

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
      //cosascasascasascasascasas
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = (function colortemp() {
        // prueba.forEach((item) => {
        // for (let i = 0; i < item.zonas.length; i++) {
        //   if (item.zonas[i] === marker.properties.) {
        //   }
        // }
        // console.log(item.zonas[0]);
        // });
        if (marker.properties.id) {
        }
        if (marker.properties.temp < 15) {
          return "green";
        } else if (
          marker.properties.temp >= 15 &&
          marker.properties.temp < 21
        ) {
          return "yellow";
        } else if (marker.properties.temp >= 21) {
          return "orange";
        } else {
          return "orange";
        }
      })();
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";
      el.style.backgroundSize = "100%";

      el.addEventListener("click", function () {
        window.alert(
          "Temp: " +
            marker.properties.temp +
            "\n" +
            marker.properties.message +
            "\n" +
            marker.properties.zona +
            "\n" +
            marker.properties.id
        );
      });

      // Add markers to the map.
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    });
  };

  render() {
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="text-light">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}
