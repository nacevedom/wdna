import React from "react";
import "../assets/styles/navbar.scss";
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="container">
    <nav
      className="navbar navbar-expand-lg navbar-light my-4"
      style={{ borderRadius: "25px", backgroundColor: "#e6e5e5" }}>

      <ul className="list">
        <li>
        <Link to="/">Temperature</Link>
        </li>
        <li>
        <Link to="/v">Viento</Link>
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
);

export default Navbar;
