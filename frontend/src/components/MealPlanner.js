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

/**
  *   <p>Generates the meal plan calendar and populates it with the user's previously saved meals.</p>
  *   <p>Allows users to customize the name and start day of the plan.</p>
  *   <p>Displays weekly totals, grocery list, and recipe popups if their respective buttons are clicked.</p>
  *
  * @returns { JSX } element containing HTML for the weekly meal planner and flag checks for displaying popup windows
*/
export default function MealPlanner() {
    const { currentPlan, updateMealPlanMetadata, removeMealPlan } = useContext(MealPlanContext);
    const { showRecipePopup, recipeInfo } = useContext(PopupContext);

    const [ showWeeklyTotals, setShowWeeklyTotals ] = useState(false);
    const [ showGroceryList, setShowGroceryList ] = useState(false);
    const [ mealPlanName, setMealPlanName ] = useState("");
    const [ mealPlanStartDay, setMealPlanStartDay ] = useState("");

    /**
      * Observer hook that is called to update the meal plan information whenever the mealplan changes.
      * @memberof MealPlanner
      * @inner
    */
    useEffect(() => {
        if (currentPlan) {
            setMealPlanName(currentPlan.name ? currentPlan.name : "");
            setMealPlanStartDay(currentPlan.startday ? currentPlan.startday : "sunday");
        }
    }, [ currentPlan ])

    /**
      * Gets the order in which the days of the week are displayed in the planner
      * @returns { string[] } days ordered according to the current plan's start day
      * @memberof MealPlanner
      * @inner
    */
    function getDaysOfWeek() {
        let defaultDays = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ];

        let desiredStartDay = "";
        if (defaultDays.filter(day => day === currentPlan.startday).length === 0) {
            desiredStartDay = "sunday";
        } else {
            desiredStartDay = currentPlan.startday;
        }

        while (defaultDays[0] !== desiredStartDay) {
            let firstday = defaultDays.shift();
            defaultDays.push(firstday);
        }
        return defaultDays;
    }

    /**
      * Sets flag to display Weekly Totals popup to false
      * @memberof MealPlanner
      * @inner
    */
    function onCloseWeeklyTotals() {
        setShowWeeklyTotals(false);
    }

    /**
      * Sets flag to display Grocery List popup to false
      * @memberof MealPlanner
      * @inner
    */
    function onCloseGroceryList() {
        setShowGroceryList(false);
    }

    /**
      * Capitalize first letter in a string
      * @param { string } word string to be capitalized
      * @returns { string } capitalized input string
      * @memberof MealPlanner
      * @inner
    */
    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1, word.length)
    }

    /**
      * Renders a column that represents a day of the week and populates the column with meal period boxes
      * that contains the user's saved meals for the day. Each column consists of 3 `MealPeriodBoxes` for the 3 meal
      * periods, plus a `DailySummary` component.
      * @param { string } day day of the week to be genereated
      * @param { boolean } shouldIncludeMealPeriodLabels flag used so that the meal period labels
      * are only included in the leftmost column (i.e. "breakfast", "lunch", "dinner", and "daily summary")
      * @returns { JSX } `column` element that contains the populated meal period boxes for the day
      * @memberof MealPlanner
      * @inner
    */
    function generateDayColumn(day, shouldIncludeMealPeriodLabels = false) {

        return (
            <Col key={day}>
                <div style={{"maxWidth": "180px"}}>
                    <div className="day-label" data-testid="day-label">{capitalize(day)}</div>

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
                                data-testid="mealplan-name"
                                onChange={ (event) => setMealPlanName(event.target.value) }
                            />
                            <label htmlFor="mealplan-startday" style={{ "margin": "10px"}}>Start day: </label>
                            <select data-testid="mealplan-startday" name="mealplan-startday" value={mealPlanStartDay} onChange={ (event) => setMealPlanStartDay(event.target.value) }>
                                { [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].map(day => <option key={day} value={day}>{capitalize(day)}</option>)}
                            </select>
                            <Button className="button-row" onClick={ (e) => { e.preventDefault(); updateMealPlanMetadata(mealPlanName, mealPlanStartDay) } } style={{ "marginLeft": "10px"}}>Save Meal Plan</Button>
                        </div>
                    </Row>
                    <Row>
                        { getDaysOfWeek().map(day => generateDayColumn(day, day === currentPlan.startday)) }
                    </Row>
                    <Row style={{'float': 'right'}}>
                        <Button className="button-row btn btn-danger" onClick={ () => { removeMealPlan(currentPlan._id); } }>Remove Mealplan</Button>
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
