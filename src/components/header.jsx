import React from "react";
import "../assets/styles/header.scss";
import Logo from "../assets/logos/wdna_light_skin_sm.png";

const Header = () => (
  <div className="container-fluid my-4">
    <div className="header_logo">
      <div className="logo">
        <h1 style={{ textAlign: "center", color: "white" }}>WDNA</h1>
      </div>
    </div>
  </div>
);

export default Header;
