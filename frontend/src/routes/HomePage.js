import React, { useContext, useEffect, useState } from "react";
import { Button } from 'react-bootstrap'
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./styles.css";

// components
import MealPlanner from "../components/MealPlanner";
import Login from "../components/Login";

// context
import { UserContext } from "../context/user";
import { MealPlanContext } from "../context/mealplan";

/**
  * This function is called and will display either the meal planner page or the login page,
  * depending on whether the user is logged in or not.
  * @returns { JSX } Returns JSX that determines if the user is logged in.
*/
export default function HomePage() {
    const { isLoggedIn } = useContext(UserContext);
    const { mealPlans, currentPlan, createNewMealPlan, newPlanSelected } = useContext(MealPlanContext);

    const [ showMenu, setShowMenu ] = useState(true);
    const [ sideBarButtons, setSideBarButtons ] = useState([]);

    /**
     * Clears the local storage and returns user to login page
     * @memberof HomePage
     * @inner
    */
    function logoutUser() {
        localStorage.clear();
        window.location.href = '/';
    }

    /**
     * Creates buttons corresponding to each meal plan the user has and formats the buttons
     * into a sidebar 
     * @memberof HomePage
     * @inner
    */
    useEffect(() => {
        if (mealPlans.length < 1) setSideBarButtons([]);

        let sbb = [];
        for (let mealPlan of mealPlans) {
            let backgroundColor = currentPlan && currentPlan._id === mealPlan._id ? "#c9c9c9" : "#ffffff"
            sbb.push(<Button variant="light" style={{ "background": `${backgroundColor}` }} key={mealPlan._id} onClick={() => newPlanSelected(mealPlan._id)}>{mealPlan.name ? mealPlan.name : "New meal plan"}</Button>)
        }

        setSideBarButtons(sbb);
    }, [currentPlan, mealPlans, newPlanSelected]);

    return (
        <div>
            {isLoggedIn ? (
                <>
                <Button variant="light" onClick={() => setShowMenu(!showMenu)}><FontAwesomeIcon icon="bars"/></Button>
                <div className={`d-flex ${showMenu ? "" : "toggled"}`} id="wrapper">
                    <div className="bg-light border-right">
                        <div>

                        </div>
                        <div id="sidebar-wrapper">
                            <div className="list-group list-group-flush">
                                <span className="sidebar-heading">Select Week</span>
                                { sideBarButtons }
                                <Button id="btn-create-plan" variant="info" onClick={createNewMealPlan}>Create new meal plan</Button>
                                <Button id="btn-create-plan" variant="info" onClick={logoutUser}>Logout</Button>
                            </div>
                        </div>
                    </div>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            { currentPlan && <MealPlanner/>}
                        </div>
                    </div>
                </div>
                </>
            ) : (
                <Login />
            )}
            {/* <Button onClick={testMethod}>Test Button</Button> */}
        </div>
    );
}
