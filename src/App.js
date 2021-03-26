import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import Header from "./components/header";
import Temperature from './pages/Temperature'
import Viento from './pages/Viento';

const App = () => ( 
        
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={ Temperature } />
            <Route exact path="/v" component={ Viento } />
        </Switch>
        </BrowserRouter>
    );

export default App;
