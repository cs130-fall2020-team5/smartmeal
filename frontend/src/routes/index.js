import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Navbar, Nav } from 'react-bootstrap'

// pages
import AboutPage from "./AboutPage";
import HomePage from "./HomePage";
import Register from "./Register";

// context providers
import { UserProvider } from "../context/user";
import { MealPlanProvider } from "../context/mealplan";
import { PopupProvider } from "../context/popup-context";

export default function router() {
    return (
        <Router>
            <UserProvider>
                <PopupProvider>
                <MealPlanProvider>
                    {/*}<Navbar className="color-nav" variant="dark" expand="lg">*/}
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
                            <HomePage/>
                        </Route>
                        <Route path="/about">
                            <AboutPage/>
                        </Route>
                        <Route path="/register">
                            <Register/>
                        </Route>
                    </Switch>
                </MealPlanProvider>
                </PopupProvider>
            </UserProvider>
        </Router>
    );
}
