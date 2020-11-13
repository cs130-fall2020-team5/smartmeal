import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap'
/*
  Color Scheme 1:
  #2d4059
  #ea5455
  #decdc3
  #e5e5e5
  */

/*
  Color Scheme 2:
  #321f28
  #734046
  #a05344
  #e79e4f
  */

/*
  Color Scheme 3:
  #363636
  #99d8d0
  #b7efcd
  #ffbcbc
*/

// pages
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import LoginPage from "../components/Login";

// context providers
import { UserProvider } from "../context/user";

export default function router() {
    return (
        <Router>
            <UserProvider>
                <Navbar className="color-nav" variant="dark" expand="lg">
                    <Navbar.Brand href="#home">SmartMeal</Navbar.Brand>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>
                            <Nav.Link href="https://github.com/cs130-fall2020-team5/smartmeal">GitHub</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            {/*Still must implement resetting user login auth*/}
                            <Nav.Link as={Link} to="/login">Sign Out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path="/">
                        <HomePage/>
                    </Route>
                    <Route path="/about">
                        <AboutPage/>
                    </Route>
                    <Route path="/login">
                        <LoginPage/>
                    </Route>
                </Switch>
            </UserProvider>
        </Router>
    );
}
