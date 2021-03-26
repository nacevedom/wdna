import "../App.css";
import Chart from "../components/chart";
import Table from "../components/table";
import "../assets/styles/fonts.scss";
import React from "react";

class Temperature extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row mx-4">
            <div className="col-md-4">
              <Table />
            </div>
            <div className="col-md-8">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Temperature;
