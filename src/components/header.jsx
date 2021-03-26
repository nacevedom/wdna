import React from "react";
import "../assets/styles/header.scss";
import Logo from "../assets/logos/wdna_light_skin_sm.png";
import "../assets/styles/navbar.scss";
import { Link } from "react-router-dom";

const Header = () => (
  <div>
    <div className="container-fluid my-4">
      <div className="header_logo">
        <div className="logo">
          <img src={Logo} alt="" />
          <h1 style={{ textAlign: "center" }}>WDNA</h1>
        </div>
      </div>
    </div>

    <div className="container">
      <nav
        className="navbar navbar-expand-lg navbar-light my-4"
        style={{
          borderRadius: "25px",
          backgroundColor: "#e6e5e5",
          padding: "0",
        }}
      >
        <ul className="list">
          <li>
            <Link to="/" className="link">
              Temperature
            </Link>
          </li>
          <li>
            <Link to="/v" className="link">
              Viento
            </Link>
          </li>
          <li>
            <a>ejemplo</a>
          </li>
          <li>
            <a>Ejemplo</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Header;
