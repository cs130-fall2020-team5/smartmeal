import React, { useState, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from 'axios';

// styles
import "./styles.css";

// components
import MealPeriodBox from "./MealPeriodBox";
import DailySummary from "./DailySummary";
import GroceryList from "./GroceryList";

// context
import { UserContext } from "../context/user";

export default function MealPlanner({ plan }) {

    const [ showGroceryList, setShowGroceryList ] = useState(false);
    const { isLoggedIn, loginToken } = useContext(UserContext);
    const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];

    function onCloseGroceryList() {
        setShowGroceryList(false);
    }

    function sample() {
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + plan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                monday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk", calories: 10, fat: 15, protein: 10, price: 2.56, unit: "liters", amount: .2 }, { name: "cereal", calories: 20, fat: 3, unit: "kilograms", amount: .1, price: 1.50 } ] } ], lunch: [ { name: "sandwich", ingredientList: [ { name: "bread", unit: "loaf", amount: 1 }, { name: "cheese", unit: "oz", amount: 4 }, { name: "ham", unit: "oz", amount: 10 } ] } ], dinner: [ { name: "pasta", ingredientList: [ { name: "noodles", amount: 1, unit: "lbs" }, { name: "tomato sauce", unit: "fl. oz", amount: 5} ] } ] },
                tuesday: { breakfast: [ { name: "cereal", ingredientList: [ { name: "milk", calories: 10, fat: 15, protein: 10, price: 2.56, unit: "liters", amount: .2 }, { name: "cereal", calories: 20, fat: 3, unit: "kilograms", amount: .1, price: 1.50 } ] } ], lunch: [ { name: "sandwich", ingredientList: [ { name: "bread", unit: "loaf", amount: 1 }, { name: "cheese", unit: "oz", amount: 4 }, { name: "ham", unit: "oz", amount: 10 } ] } ], dinner: [ { name: "pasta", ingredientList: [ { name: "noodles", amount: 1, unit: "lbs" }, { name: "tomato sauce", unit: "fl. oz", amount: 5} ] } ] }
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

    function generateMealPlanBoxes(time) {
        const boxes = [];

        for (let day of days) {
            boxes.push(
                <Col key={day + time}>
                    <MealPeriodBox meals={plan[day][time]}/>
                </Col>
            );
        }

        return boxes;
    }

    return (
        <>
        { showGroceryList && <GroceryList mealPlan={plan} onClose={onCloseGroceryList} /> }
        { plan &&
            <div>
                <Container id="meal-plan">
                    <Row>
                        { days.map((day) => <Col key={day}><span className="day-label">{day.charAt(0).toUpperCase() + day.slice(1, day.length)}</span></Col>)}   
                    </Row>
                    <p className="mealtime-label">Breakfast</p>
                    <Row>
                        { generateMealPlanBoxes("breakfast") }
                    </Row>
                    <p className="mealtime-label">Lunch</p>
                    <Row>
                        { generateMealPlanBoxes("lunch") }
                    </Row>
                    <p className="mealtime-label">Dinner</p>
                    <Row>
                        { generateMealPlanBoxes("dinner") }
                    </Row>
                    <p className="mealtime-label">Daily Summary</p>
                    <Row>
                        { days.map((day) => <Col key={day}><DailySummary day={plan[day]}/></Col>)}
                    </Row>
                    <Row style={{'float': 'right'}}>
                        <Button className="button-row" onClick={ () => setShowGroceryList(!showGroceryList) }>Grocery List</Button>
                        <Button className="button-row" onClick={ () => sample() }>Populate with some static data</Button>
                    </Row>
                </Container>
            </div>
        }
        </>
    );
}
