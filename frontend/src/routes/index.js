import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap'

import AboutPage from "./AboutPage";
import MainPage from "./MainPage";

export default function router() {
    return (
        <Router>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">SmartMeal</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link href="https://github.com/cs130-fall2020-team5/smartmeal">GitHub</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Switch>
                <Route exact path="/">
                    <MainPage/>
                </Route>
                <Route path="/about">
                    <AboutPage/>
                </Route>
            </Switch>
        </Router>
    );
}