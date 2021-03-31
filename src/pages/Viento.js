import "../App.css";
import ColumnChart from "../components/ColumnChart";
import "../assets/styles/fonts.scss";
import React from "react";
import Tabla from "../components/table";

class Viento extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-12 p-5">
          <Tabla />
        </div>
        <div className="col-md-12 p-4">
          <ColumnChart />
        </div>
      </div>
    );
  }
}

export default Viento;
