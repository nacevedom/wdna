import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import Temperature from "../pages/Temperature";
import Viento from "../pages/Viento";
import Layout from "../components/Layout";
import ScrollToTop from "../components/scroll";
import { createBrowserHistory } from "history";

const hist = createBrowserHistory();

const App = () => (
  <Router history={hist} hashType="noslash">
    <ScrollToTop>
      <Layout>
        <Switch>
          <Route exact path="/chart" component={Temperature} />
          <Route exact path="/bars" component={Viento} />
          <Redirect to="/chart" />
        </Switch>
      </Layout>
    </ScrollToTop>
  </Router>
);

export default App;
