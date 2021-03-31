import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Temperature from "../pages/Temperature";
import Viento from "../pages/Viento";
import Layout from "../components/Layout";
import ScrollToTop from "../components/scroll";
import { createBrowserHistory } from "history";

const hist = createBrowserHistory();

const App = () => (
  <BrowserRouter history={hist} hashType="noslash">
    <ScrollToTop>
      <Layout>
        <Switch>
          <Route exact path="/chart" component={Temperature} />
          <Route exact path="/bars" component={Viento} />
          <Redirect to="/chart" />
        </Switch>
      </Layout>
    </ScrollToTop>
  </BrowserRouter>
);

export default App;
