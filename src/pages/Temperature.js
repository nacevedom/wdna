import "../App.css";
import Chart from "../components/chart";
import App from "../components/table";
import "../assets/styles/fonts.scss";
import React from "react";
//import Input from "../components/input"
// const chartoptions = {
//   title: {
//     text: "My chart",
//   },
//   series: [
//     {
//       type: "column",
//       data: [1, 2, 3],
//     },
//   ],
// };
class Temperature extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="p-5 col-md-12">
          <App />
        </div>
        <div className="p-5 col-md-12">
          <Chart />
        </div>
      </div>
    );
  }
}

export default Temperature;
