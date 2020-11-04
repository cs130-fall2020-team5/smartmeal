import React, { useContext, useState } from "react";
import { Button } from 'react-bootstrap'
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./styles.css";

// components
import MealPlanner from "../components/MealPlanner";
import Login from "../components/Login";

// context
import { UserContext } from "../context/user";

// sample data
import SampleMealPlan from "../sample-data/plan.json";

export default function HomePage() {
    const { isLoggedIn, testMethod } = useContext(UserContext);
    const [ showMenu, setShowMenu ] = useState(true);

    const currentPlan = SampleMealPlan.weeklyPlans[0]; // sample data

    return (
        <div>
            {isLoggedIn ? (
                <div className={`d-flex ${showMenu ? "" : "toggled"}`} id="wrapper">
                    <div className="bg-light border-right">
                        <div>
                            <Button variant="light" onClick={() => setShowMenu(!showMenu)}><FontAwesomeIcon icon="bars"/></Button>
                        </div>
                        <div id="sidebar-wrapper">
                            <div className="sidebar-heading">Select Week</div>
                            <div className="list-group list-group-flush">
                                {/* <a href="#" className="list-group-item list-group-item-action bg-light">Week of 10/26-11/1</a>
                                <a href="#" className="list-group-item list-group-item-action bg-light">Week of 10/26-11/1</a>
                                <a href="#" className="list-group-item list-group-item-action bg-light">Week of 10/26-11/1</a> */}
                                <Button variant="light">Week of 10/26-11/1</Button>
                            </div>
                            <Button variant="info">Create new meal plan</Button>
                        </div>
                    </div>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <MealPlanner plan={currentPlan} />
                        </div>
                    </div>
                </div>
            ) : (
                <Login />
            )}
            {/* <Button onClick={testMethod}>Test Button</Button> */}
        </div>
    );
}
