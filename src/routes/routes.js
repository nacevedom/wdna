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
import Temperature from "../pages/Temperature";
import Viento from "../pages/Viento";

var routes = [
  {
    path: "/chart",
    name: "Dashboard",
    component: Temperature,
    layout: "/",
  },
  {
    path: "/bars",
    name: "Bars",
    component: Viento,
    layout: "/bars",
  },
];
export default routes;
