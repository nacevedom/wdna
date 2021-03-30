import "../App.css";
import Chart from "../components/chart";
import Tabla from "../components/table";
import "../assets/styles/fonts.scss";
import React from "react";
//import Input from "../components/input"



class Temperature extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row mx-4">
            <div className="col-md-4">
              
              <Tabla />
            </div>
            <div className="col-md-12">
              <Chart />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Temperature;
