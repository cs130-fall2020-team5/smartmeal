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
import { PopupProvider } from "../context/popup-context";

export default function HomePage() {
    const { isLoggedIn, loginToken } = useContext(UserContext);
    const [ showMenu, setShowMenu ] = useState(true);
    const [ currentPlan, setCurrentPlan ] = useState(null);
    const [ sideBarButtons, setSideBarButtons ] = useState([]);

    const getMealPlans = useCallback(() => {
        axios({
            method: "GET",
            url: 'http://localhost:3000/mealplan/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            }
        })
        .then(res => {
            if (res.data.length < 1) setSideBarButtons([]);

            let sbb = []
            for (let mealPlan of res.data) {
                let epochStartDate = parseInt(mealPlan.date); // milliseconds since epoch
                let startDate = new Date(epochStartDate);
                let endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 7));
                let formattedDateText = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "-" + (endDate.getMonth() + 1) + "/" + endDate.getDate();
                sbb.push(<Button variant="light" key={mealPlan._id} onClick={() => setCurrentPlan(mealPlan)}>Week of {formattedDateText}</Button>)
            }

            setSideBarButtons(sbb);
        })
        .catch(err => {
            console.log("Failed to get meal plans: ", err);
            setSideBarButtons([]);
        });
    }, [loginToken]);

    /**
     * onClick for the "create new meal plan" button
     */
    function createNewMealPlan() {

        // get the next Monday
        let startdate = new Date(Date.now());
        let day = startdate.getDay();
        if (day === 0) {
            startdate.setDate(startdate.getDate() + 1)
        } else if (day !== 1) {
            let missingDays = 8 - day;
            startdate.setDate(startdate.getDate() + missingDays);
        }

        axios({
            method: "POST",
            url: 'http://localhost:3000/mealplan/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                startdate: startdate.getTime() // milliseconds since epoch
            }
        })
        .then(() => {
            getMealPlans();
        })
        .catch((err) => {
            console.log("Failed to create new meal plan: ", err);
        });
    }

    /**
     * Get the meal plans whenever the user logs in
     */
    useEffect(() => {
        if (isLoggedIn) getMealPlans();
    }, [getMealPlans, isLoggedIn, loginToken]);

    return (
      <PopupProvider>
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
                            <MealPlanner plan={currentPlan} />
                        </div>
                    </div>
                </div>
            ) : (
                <Login />
            )}
            {/* <Button onClick={testMethod}>Test Button</Button> */}
        </div>
        </PopupProvider>
    );
}
