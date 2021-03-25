import React from "react";
import "../assets/styles/navbar.scss";

const Navbar = () => (
  <div className="container">
    <nav className="navbar navbar-expand-lg navbar-light bg-light my-4 rounded-rectangle">
      <ul className="list">
        <li>
          <a>Temperaturas</a>
        </li>
        <li>
          <a>Gráficos</a>
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
