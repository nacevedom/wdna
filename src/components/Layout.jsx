import React from 'react';
import Header from './header';
import Navbar from './navbar';


function Layout (props) {
    //const children = props.children;
    return (
        <div>
        <Header />
        <Navbar />
        {props.children}

        </div>
    );
} 
export default Layout;