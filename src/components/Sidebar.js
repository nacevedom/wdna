/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavbarBrand } from "reactstrap";
import "../assets/css/paper-dashboard.css";
import "../assets/css/paper-dashboard.css.map";

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      color: "transparent",
    };

    this.sidebarToggle = React.createRef();
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  render() {
    return (
      <div className="sidebar" data-color="black" data-active-color="blue">
        <div className="sidebar-wrapper" ref={this.sidebar}>
          <Nav>
            <li>
              <NavLink
                to="/chart"
                className="nav-link"
                activeClassName="active"
              >
                prueba
              </NavLink>
            </li>
            <li>
              <NavLink to="/bars" className="nav-link">
                prueba2
              </NavLink>
            </li>
          </Nav>
        </div>
        <div className="navbar-toggle">
          <button
            type="button"
            ref={this.sidebarToggle}
            className="navbar-toggler"
            onClick={() => this.openSidebar()}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <NavbarBrand />
      </div>
    );
  }
}

export default Sidebar;
