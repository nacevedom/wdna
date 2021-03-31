import React from "react";
import Header from "./header";
import Sidebar from "./Sidebar.js";
import DemoNavbar from "./DemoNavbar.js";
import "../assets/scss/paper-dashboard.scss";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function Layout(props) {
  //const children = props.children;
  return (
    <div className="wrapper">
      <Sidebar bgColor="black" activeColor="blue" />
      <div className="main-panel">
        <DemoNavbar />
        <Header />
        {props.children}
      </div>
    </div>
  );
}
export default Layout;
