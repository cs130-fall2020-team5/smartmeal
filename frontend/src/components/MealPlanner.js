import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

// styles
import "./styles.css";

// components
import MealPeriodBox from "./MealPeriodBox";
import DailySummary from "./DailySummary";
import GroceryList from "./GroceryList";
import RecipePopup from './RecipePopup';
import WeeklyTotals from "./WeeklyTotals";

// context
import { MealPlanContext } from "../context/mealplan";
import { PopupContext } from "../context/popup-context";

export default function MealPlanner() {
    const { currentPlan, updateMealPlanMetadata } = useContext(MealPlanContext);
    const { showRecipePopup, recipeInfo } = useContext(PopupContext);

    const [ showWeeklyTotals, setShowWeeklyTotals ] = useState(false);
    const [ showGroceryList, setShowGroceryList ] = useState(false);
    const [ mealPlanName, setMealPlanName ] = useState(currentPlan.name ? currentPlan.name : "");
    const [ mealPlanStartDay, setMealPlanStartDay ] = useState(currentPlan.startday ? currentPlan.startday : "sunday");

    useEffect(() => {
        if (currentPlan) {
            setMealPlanName(currentPlan.name ? currentPlan.name : "");
            setMealPlanStartDay(currentPlan.startday ? currentPlan.startday : "sunday");
        }
    }, [ currentPlan ])

    function getDaysOfWeek() {
        let defaultDays = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];
        while (defaultDays[0] !== currentPlan.startday) {
            let firstday = defaultDays.shift();
            defaultDays.push(firstday);
        }
        return defaultDays;
    }

    function onCloseWeeklyTotals() {
        setShowWeeklyTotals(false);
    }

    function onCloseGroceryList() {
        setShowGroceryList(false);
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1, word.length)
    }

    function generateDayColumn(day, shouldIncludeMealPeriodLabels = false) {

        return (
            <Col key={day}>
                <div style={{"maxWidth": "180px"}}>
                    <div className="day-label">{capitalize(day)}</div>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Breakfast" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["breakfast"]} day={day} time="breakfast"/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Lunch" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["lunch"]} day={day} time="lunch"/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Dinner" : "" }</p>
                    <MealPeriodBox meals={currentPlan[day]["dinner"]} day={day} time="dinner"/>

                    <p className="mealtime-label">{ shouldIncludeMealPeriodLabels ? "Daily Summary" : "" }</p>
                    <DailySummary day={currentPlan[day]}/>
                </div>
            </Col>
        );
    }

    return (
        <>
        { showWeeklyTotals && <WeeklyTotals mealPlan={currentPlan} onClose={onCloseWeeklyTotals} /> }
        { showGroceryList && <GroceryList mealPlan={currentPlan} onClose={onCloseGroceryList} /> }
        { currentPlan &&
            <div>
                <Container id="meal-plan">
                    <Row>
                        <div style={{ "padding": "10px", "marginLeft": "auto", "marginRight": "auto"}}>
                            <label htmlFor="mealplan-name" style={{ "marginRight": "10px"}}>Meal Plan Name: </label>
                            <input
                                type="text"
                                name="mealplan-name"
                                value={mealPlanName}
                                onChange={ (event) => setMealPlanName(event.target.value) }
                            />
                            <label htmlFor="mealplan-startday" style={{ "margin": "10px"}}>Start day: </label>
                            <select name="mealplan-startday" value={mealPlanStartDay} onChange={ (event) => setMealPlanStartDay(event.target.value) }>
                                { [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].map(day => <option key={day} value={day}>{capitalize(day)}</option>)}
                            </select>
                            <Button className="button-row" onClick={ (e) => { e.preventDefault(); updateMealPlanMetadata(mealPlanName, mealPlanStartDay) } } style={{ "marginLeft": "10px"}}>Save Meal Plan</Button>
                        </div>
                    </Row>
                    <Row>
                        { getDaysOfWeek().map(day => generateDayColumn(day, day === currentPlan.startday)) }
                    </Row>
                    <Row style={{'float': 'right'}}>
                        <Button className="button-row" disabled={showGroceryList} onClick={ () => { window.scrollTo(0, 0); setShowWeeklyTotals(!showWeeklyTotals); } }>Weekly Totals</Button>
                        <Button className="button-row" disabled={showWeeklyTotals} onClick={ () => { window.scrollTo(0, 0); setShowGroceryList(!showGroceryList); } }>Grocery List</Button>
                    </Row>
                </Container>
                <div>
                  {showRecipePopup ? (
                    <RecipePopup recipe={recipeInfo}/>
                  ) : (
                    null
                  )}
                </div>
            </div>
        }
        </>
    );
}
