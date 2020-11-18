import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from 'react-bootstrap'
import axios from 'axios';
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./styles.css";

// components
import MealPlanner from "../components/MealPlanner";
import Login from "../components/Login";

// context
import { UserContext } from "../context/user";
import { MealPlanContext } from "../context/mealplan";

export default function HomePage() {
    const { isLoggedIn } = useContext(UserContext);
    const { mealPlans, currentPlan, createNewMealPlan, newPlanSelected } = useContext(MealPlanContext);

    const [ showMenu, setShowMenu ] = useState(true);
    const [ sideBarButtons, setSideBarButtons ] = useState([]);

    useEffect(() => {
        if (mealPlans.length < 1) setSideBarButtons([]);

        let sbb = [];
        for (let mealPlan of mealPlans) {
            let epochStartDate = parseInt(mealPlan.date); // milliseconds since epoch
            let startDate = new Date(epochStartDate);
            let endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 7));
            let formattedDateText = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "-" + (endDate.getMonth() + 1) + "/" + endDate.getDate();
            sbb.push(<Button variant="light" key={mealPlan._id} onClick={() => newPlanSelected(mealPlan._id)}>Week of {formattedDateText}</Button>)
        }

        setSideBarButtons(sbb);
    }, [mealPlans, newPlanSelected]);

    return (
        <div>
            {isLoggedIn ? (
                <div className={`d-flex ${showMenu ? "" : "toggled"}`} id="wrapper">
                    <div className="bg-light border-right">
                        <div>
                            <Button variant="light" onClick={() => setShowMenu(!showMenu)}><FontAwesomeIcon icon="bars"/></Button>
                            
                        </div>
                        <div id="sidebar-wrapper">
                            <div className="list-group list-group-flush">
                                <span className="sidebar-heading">Select Week</span>
                                { sideBarButtons }
                                <Button id="btn-create-plan" variant="info" onClick={createNewMealPlan}>Create new meal plan</Button>
                            </div>
                        </div>
                    </div>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            { currentPlan && <MealPlanner/>}
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
