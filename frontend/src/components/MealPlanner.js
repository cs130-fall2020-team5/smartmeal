import React, { useState, useContext } from "react";
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
    const { currentPlan } = useContext(MealPlanContext);
    const { showRecipePopup, recipeInfo } = useContext(PopupContext);

    const [ showWeeklyTotals, setShowWeeklyTotals ] = useState(false);
    const [ showGroceryList, setShowGroceryList ] = useState(false);
    const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];

    function onCloseWeeklyTotals() {
        setShowWeeklyTotals(false);
    }

    function onCloseGroceryList() {
        setShowGroceryList(false);
    }

    function generateDayColumn(day, shouldIncludeMealPeriodLabels = false) {

        return (
            <Col key={day}>
                <div style={{"maxWidth": "180px"}}>
                    <div className="day-label">{day.charAt(0).toUpperCase() + day.slice(1, day.length)}</div>

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
                        { days.map(day => generateDayColumn(day, day === "monday")) }
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
