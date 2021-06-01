import React from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import "../App.css";
import moment from "moment";
import Papa from "papaparse";
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFjZXZlZG9tIiwiYSI6ImNrb3d1cGFuajA5dXoydm1wdDZsbDEzMjAifQ.U9HqbhNdNMc0PJuI6dygaQ";

// export const Fetchdata = async () => {
//   const data = await axios.get(
//     "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-03-30%2013:00:00&end=2021-03-30%2013:00:00"
//   );

//   this.setState({
//     dataTemp: data.data,
//   });

//   const data2 = await axios.get(
//     "http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/listallwithinfo?id=1"
//   );

//   this.setState({
//     dataCord: data2.data,
//   });
// };

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _isMounted: false,
      dataCSV: [],
      temperatures: [],
      zonas: require("./zonasjosep.json"),
      hora: [],
      final: [],
      dataCord: [],
      dataTemp: [],
      lng: -0.376805,
      lat: 39.4702,
      zoom: 9,
      data: {
        features: [],
      },
    };
    this.getData = this.getData.bind(this);

    this.mapContainer = React.createRef();
  }
  componentDidMount() {
    this._isMounted = true;
    this.insertData2();
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.getCsvData();
  }

  fetchCsv() {
    return fetch("./Umbrals_temperatura_2019").then(function (response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder("utf-8");

      return reader.read().then(function (result) {
        return decoder.decode(result.value);
      });
    });
  }
  getData(result) {
    this.setState({ dataCSV: result.data });
  }
  async getCsvData() {
    let csvData = await this.fetchCsv();

    Papa.parse(csvData, {
      complete: this.getData,
    });
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
        `http://meteoclim.meteoclim.com/apptrack/public/sensor/weatherstation/owner/historical?id=1&start=2021-05-25%204:00:00&end=2021-05-25%204:00:00`
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
    const { dataTemp, dataCord, zonas, hora, final } = this.state;
    var idtemp = [];
    var result = [];
    var temp = [];
    var k = 0;
    var l = 0;
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
      idtemp.push({
        id: n.id,
        temperature: n.temperature,
      });
    });

    b.forEach((n) => {
      var date = moment(n.datetime).subtract(2, "hours");
      hora.push(moment(date).format("HH"));
    });

    for (var i = 0; i < idtemp.length; i++) {
      let igual = false;
      console.log("ENTRO2");
      for (var j = 0; j < a.length; j++) {
        // console.log("ENTRO3");
        if (a[j] === idtemp[i].id) {
          igual = true;
          console.log(a[j]);
          console.log(idtemp[i].id);
          console.log(igual);
        }
      }

      if (igual) {
        console.log(idtemp[i].temperature);
        final.push(idtemp[i].temperature);
      }
    }
    console.log(final);
    dataCord.forEach((item) => {
      if (item.state === "Comunidad Valenciana") {
        result.push({
          type: "Features",
          properties: {
            message: item.locality,
            iconSize: [30, 30],
            temp: final[l++],
            date: hora[k++],
            id: item.unique_id,
            zona: (function getzone() {
              for (var clave in zonas) {
                if (item.unique_id === clave) {
                  return zonas[clave];
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
    console.log(result);
    console.log(final);
    this.setState({
      data: {
        features: result,
      },
    });
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
      //cosascasascasascasascasas
      var el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = (function colortemp() {
        if (marker.properties.date >= 0 && marker.properties.date <= 6) {
          if (marker.properties.zona === "zona 1") {
            if (marker.properties.temp >= 20) {
              return "red";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 20) {
              return "orange";
            }
            if (marker.properties.temp >= 16.5 && marker.properties.temp < 18) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 2") {
            if (marker.properties.temp >= 21) {
              return "red";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 21) {
              return "orange";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 19) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 3") {
            if (marker.properties.temp >= 24) {
              return "red";
            }
            if (marker.properties.temp >= 22.5 && marker.properties.temp < 24) {
              return "orange";
            }
            if (
              marker.properties.temp >= 21.5 &&
              marker.properties.temp < 22.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 4") {
            if (marker.properties.temp >= 26) {
              return "red";
            }
            if (marker.properties.temp >= 24 && marker.properties.temp < 26) {
              return "orange";
            }
            if (marker.properties.temp >= 22.5 && marker.properties.temp < 24) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 5") {
            if (marker.properties.temp >= 24.5) {
              return "red";
            }
            if (marker.properties.temp >= 23 && marker.properties.temp < 24.5) {
              return "orange";
            }
            if (marker.properties.temp >= 22 && marker.properties.temp < 23) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 6") {
            if (marker.properties.temp >= 21) {
              return "red";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 21) {
              return "orange";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 19) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 7") {
            if (marker.properties.temp >= 23.5) {
              return "red";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 23.5) {
              return "orange";
            }
            if (marker.properties.temp >= 20 && marker.properties.temp < 21) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 8") {
            if (marker.properties.temp >= 21.5) {
              return "red";
            }
            if (
              marker.properties.temp >= 19.5 &&
              marker.properties.temp < 21.5
            ) {
              return "orange";
            }
            if (
              marker.properties.temp >= 18.5 &&
              marker.properties.temp < 19.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 9") {
            if (marker.properties.temp >= 22) {
              return "red";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 22) {
              return "orange";
            }
            if (marker.properties.temp >= 20 && marker.properties.temp < 21) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 10") {
            if (marker.properties.temp >= 19) {
              return "red";
            }
            if (marker.properties.temp >= 17 && marker.properties.temp < 19) {
              return "orange";
            }
            if (marker.properties.temp >= 16 && marker.properties.temp < 17) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 11") {
            if (marker.properties.temp >= 21) {
              return "red";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 21) {
              return "orange";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 19) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 12") {
            if (marker.properties.temp >= 23) {
              return "red";
            }
            if (marker.properties.temp >= 21.5 && marker.properties.temp < 23) {
              return "orange";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 21.5) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 13") {
            if (marker.properties.temp >= 23) {
              return "red";
            }
            if (marker.properties.temp >= 21.5 && marker.properties.temp < 23) {
              return "orange";
            }
            if (
              marker.properties.temp >= 20.5 &&
              marker.properties.temp < 21.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 14") {
            if (marker.properties.temp >= 25) {
              return "red";
            }
            if (marker.properties.temp >= 23 && marker.properties.temp < 25) {
              return "orange";
            }
            if (marker.properties.temp >= 22.5 && marker.properties.temp < 23) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 15") {
            if (marker.properties.temp >= 20.5) {
              return "red";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 20.5) {
              return "orange";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 19) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 16") {
            if (marker.properties.temp >= 23.5) {
              return "red";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 23.5) {
              return "orange";
            }
            if (marker.properties.temp >= 20 && marker.properties.temp < 21) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 17") {
            if (marker.properties.temp >= 23) {
              return "red";
            }
            if (marker.properties.temp >= 21.5 && marker.properties.temp < 23) {
              return "orange";
            }
            if (
              marker.properties.temp >= 20.5 &&
              marker.properties.temp < 21.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 18") {
            if (marker.properties.temp >= 24.5) {
              return "red";
            }
            if (marker.properties.temp >= 23 && marker.properties.temp < 24.5) {
              return "orange";
            }
            if (marker.properties.temp >= 22.5 && marker.properties.temp < 23) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 19") {
            if (marker.properties.temp >= 24) {
              return "red";
            }
            if (marker.properties.temp >= 22 && marker.properties.temp < 24) {
              return "orange";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 22) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 20") {
            if (marker.properties.temp >= 25) {
              return "red";
            }
            if (marker.properties.temp >= 23.5 && marker.properties.temp < 25) {
              return "orange";
            }
            if (
              marker.properties.temp >= 22.5 &&
              marker.properties.temp < 23.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 21") {
            if (marker.properties.temp >= 24.5) {
              return "red";
            }
            if (
              marker.properties.temp >= 22.5 &&
              marker.properties.temp < 24.5
            ) {
              return "orange";
            }
            if (
              marker.properties.temp >= 21.5 &&
              marker.properties.temp < 22.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 22") {
            if (marker.properties.temp >= 24) {
              return "red";
            }
            if (marker.properties.temp >= 22 && marker.properties.temp < 24) {
              return "orange";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 22) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 23") {
            if (marker.properties.temp >= 22) {
              return "red";
            }
            if (marker.properties.temp >= 20 && marker.properties.temp < 22) {
              return "orange";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 20) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 24") {
            if (marker.properties.temp >= 25.5) {
              return "red";
            }
            if (marker.properties.temp >= 24 && marker.properties.temp < 25.5) {
              return "orange";
            }
            if (marker.properties.temp >= 23 && marker.properties.temp < 24) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 25") {
            if (marker.properties.temp >= 24) {
              return "red";
            }
            if (marker.properties.temp >= 21 && marker.properties.temp < 24) {
              return "orange";
            }
            if (marker.properties.temp >= 20 && marker.properties.temp < 21) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 26") {
            if (marker.properties.temp >= 21) {
              return "red";
            }
            if (marker.properties.temp >= 19 && marker.properties.temp < 21) {
              return "orange";
            }
            if (marker.properties.temp >= 18 && marker.properties.temp < 19) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 27") {
            if (marker.properties.temp >= 25) {
              return "red";
            }
            if (marker.properties.temp >= 23.5 && marker.properties.temp < 25) {
              return "orange";
            }
            if (
              marker.properties.temp >= 22.5 &&
              marker.properties.temp < 23.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
          if (marker.properties.zona === "zona 28") {
            if (marker.properties.temp >= 24) {
              return "red";
            }
            if (marker.properties.temp >= 22.5 && marker.properties.temp < 24) {
              return "orange";
            }
            if (
              marker.properties.temp >= 21.5 &&
              marker.properties.temp < 22.5
            ) {
              return "yellow";
            } else {
              return "green";
            }
          }
        } else {
          return "pink";
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
