import React, { useState, createContext, useEffect, useContext, useCallback } from "react";
import axios from 'axios';

// context
import { UserContext } from "../context/user";
import { PopupContext } from "../context/popup-context";

const MealPlanContext = createContext();

function MealPlanProvider({ children }) {
    const { isLoggedIn, loginToken } = useContext(UserContext);
    const { popupDay, popupTime } = useContext(PopupContext);
    const [ mealPlans, setMealPlans ] = useState([]);
    const [ currentPlan, setCurrentPlan ] = useState(null);

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
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data[0])
            }
        })
        .catch(err => {
            console.log("Failed to get meal plans: ", err);
            setMealPlans([]);
            setCurrentPlan(null);
        });
    }, [loginToken]);

    function updateCustomIngredients(newIng) {
        let newMealPlan = JSON.parse(JSON.stringify(currentPlan));
        newMealPlan.customIngredients.push(newIng);
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: newMealPlan
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0]);
            }
        })
        .catch((err) => {
            console.log("Failed to update meal plan: ", err);
        });
    }

    function updateCurrentMealPlan(newRecipe, isUpdateToExistingMeal) {
        let newMealPlan = JSON.parse(JSON.stringify(currentPlan))
        if (isUpdateToExistingMeal) {
            for (let meal in newMealPlan[popupDay][popupTime]) {
                if (newMealPlan[popupDay][popupTime][meal]._id === newRecipe._id) {
                    newMealPlan[popupDay][popupTime][meal] = newRecipe;
                }
            }
        } else {
            newMealPlan[popupDay][popupTime].push(newRecipe);
        }
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: newMealPlan
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0])
            }
        })
        .catch((err) => {
            console.log("Failed to update meal plan: ", err);
        });
    }

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

    function setCheckedIngredients(mealPlanId, checked, unchecked) {
        axios({
            method: "POST",
            url: 'http://localhost:3000/mealplan/' + mealPlanId + "/check-grocery-items",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                checked: checked,
                unchecked: unchecked
            }
        })
        .then((result) => {
            getMealPlans();
        })
        .catch((err) => {
            console.log("Failed to set checked ingredients ", err);
        });
    }

    function newPlanSelected(planId) {
        console.log("clicked onbutton")
        for (let mp of mealPlans) {
            if (mp._id === planId) {
                setCurrentPlan(mp);
            }
        }
    }

    /**
     * Get the meal plans whenever the user logs in
     */
    useEffect(() => {
        if (isLoggedIn) getMealPlans();
    }, [getMealPlans, isLoggedIn, loginToken]);

    return (
        <MealPlanContext.Provider value={{mealPlans, currentPlan, createNewMealPlan, setCheckedIngredients, newPlanSelected, updateCurrentMealPlan, updateCustomIngredients}} >
            { children }
        </MealPlanContext.Provider>
    )
}

export { MealPlanProvider, MealPlanContext }