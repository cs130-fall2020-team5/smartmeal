import React, { useState, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from 'axios';

// styles
import "./styles.css";

// components
import MealPeriodBox from "./MealPeriodBox";
import DailySummary from "./DailySummary";
import GroceryList from "./GroceryList";
import RecipePopup from './RecipePopup';

// context
import { UserContext } from "../context/user";
import { MealPlanContext } from "../context/mealplan";
import { PopupContext } from "../context/popup-context";

export default function MealPlanner() {
    const { loginToken } = useContext(UserContext);
    const { currentPlan } = useContext(MealPlanContext);
    const { showRecipePopup } = useContext(PopupContext);

    const [ showGroceryList, setShowGroceryList ] = useState(false);
    const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];

    function onCloseGroceryList() {
        setShowGroceryList(false);
    }

    function sample() {
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                monday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk", calories: 10, fat: 15, protein: 10, price: 2.56, unit: "liters", amount: .2 }, { name: "cereal", calories: 20, fat: 3, unit: "kilograms", amount: .1, price: 1.50 } ] } ], lunch: [ { name: "sandwich", ingredientList: [ { name: "bread", unit: "loaf", amount: 1 }, { name: "cheese", unit: "oz", amount: 4 }, { name: "ham", unit: "oz", amount: 10 } ] } ], dinner: [ { name: "pasta", ingredientList: [ { name: "noodles", amount: 1, unit: "lbs" }, { name: "tomato sauce", unit: "fl. oz", amount: 5} ] } ] },
                tuesday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk", calories: 10, fat: 15, protein: 10, price: 2.56, unit: "liters", amount: .2 }, { name: "cereal", calories: 20, fat: 3, unit: "kilograms", amount: .1, price: 1.50 } ] }, { name: "cereal", ingredientList: [ { name: "milk", calories: 10, fat: 15, protein: 10, price: 2.56, unit: "liters", amount: .2 }, { name: "cereal", calories: 20, fat: 3, unit: "kilograms", amount: .1, price: 1.50 } ] } ], lunch: [ { name: "sandwich", ingredientList: [ { name: "bread", unit: "loaf", amount: 1 }, { name: "cheese", unit: "oz", amount: 4 }, { name: "ham", unit: "oz", amount: 10 } ] } ], dinner: [ { name: "pasta", ingredientList: [ { name: "noodles", amount: 1, unit: "lbs" }, { name: "tomato sauce", unit: "fl. oz", amount: 5} ] } ] }
            }
        })
        .then((result) => {
            console.log(result);
            alert("Reload your window");
        })
        .catch((err) => {
            console.log("Failed to create new meal plan: ", err);
        });
    }

    function generateDayColumn(day, shouldIncludeMealPeriodLabels = false) {

        return (
            <Col>
                <div style={{"max-width": "180px"}}>
                    <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1, day.length)}</div>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Breakfast" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["breakfast"]}/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Lunch" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["lunch"]}/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Dinner" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["dinner"]}/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Daily Summary" : "" }</p>
                    <DailySummary day={currentPlan[day]}/>
                </div>
            </Col>
        );
    }

    return (
        <>
        { showGroceryList && <GroceryList mealPlan={currentPlan} onClose={onCloseGroceryList} /> }
        { currentPlan &&
            <div>
                <Container id="meal-plan">
                    <Row>
                        { days.map(day => generateDayColumn(day, day === "monday")) }
                    </Row>
                    <Row style={{'float': 'right'}}>
                        <Button className="button-row" onClick={ () => { window.scrollTo(0, 0); setShowGroceryList(!showGroceryList); } }>Grocery List</Button>
                        <Button className="button-row" onClick={ () => sample() }>Populate with some static data</Button>
                    </Row>
                </Container>
                <div>
                  {showRecipePopup ? (
                    <RecipePopup />
                  ) : (
                    null
                  )}
                </div>
            </div>
        }
        </>
    );
}
