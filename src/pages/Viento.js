import "../App.css";
import ColumnChart from "../components/ColumnChart";
import "../assets/styles/fonts.scss";
import React from "react";
import Table from "../components/table";

class Viento extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="col-md-12 p-5">
          <Table />
        </div>
        <div className="col-md-12 p-5">
          <ColumnChart />
        </div>
      </div>
    );
  }
}

export default Viento;
