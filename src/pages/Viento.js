import "../App.css";
import ColumnChart from "../components/ColumnChart";
import "../assets/styles/fonts.scss";
import React from "react";
import TableUI from "../components/tableUI";

class Viento extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row mx-4">
            <div className="col-md-4">
              <TableUI />
            </div>
            <div className="col-md-8">
              <ColumnChart />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Viento;
