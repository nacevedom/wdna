import React from "react";
import Header from "./header";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar.jsx";
import "../assets/scss/paper-dashboard.scss";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function Layout(props) {
  //const children = props.children;
  return (
    <div>
      <Container fluid>
        <Row>
          <Col md={2}>
            <div className="wrapper">
              <Sidebar bgColor="black" activeColor="blue" />
            </div>
          </Col>
          <Col md={10}>
            <Header />
            {props.children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Layout;
