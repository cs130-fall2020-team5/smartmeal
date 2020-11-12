import React, { useContext, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

// styles
import "./styles.css";

//context
import { PopupContext } from "../context/popup-context";

// components
import MealPeriodBox from "./MealPeriodBox";
import DailySummary from "./DailySummary";
import RecipePopup from './RecipePopup';



export default function MealPlanner({ plan }) {
    const { showRecipePopup } = useContext(PopupContext);
    return (
        <Container id="meal-plan">
            <Row>
                <Col>
                    <span className="day-label">Sunday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Tuesday</span>
                </Col>
                <Col>
                    <span className="day-label">Wednesday</span>
                </Col>
                <Col>
                    <span className="day-label">Thursday</span>
                </Col>
                <Col>
                    <span className="day-label">Friday</span>
                </Col>
                <Col>
                    <span className="day-label">Saturday</span>
                </Col>
            </Row>
            <p className="mealtime-label">Breakfast</p>
            <Row>
                <Col>
                    <MealPeriodBox meals={plan.monday.breakfast} />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
            </Row>
            <p className="mealtime-label">Lunch</p>
            <Row>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
            </Row>
            <p className="mealtime-label">Dinner</p>
            <Row>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
                <Col>
                    <MealPeriodBox />
                </Col>
            </Row>
            <p className="mealtime-label">Daily Summary</p>
            <Row>
                <Col>
                    <DailySummary day={plan.monday} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
                <Col>
                    <DailySummary day={null} />
                </Col>
            </Row>
            <div>
              {showRecipePopup ? (
                <RecipePopup />
              ) : (
                null
              )}
            </div>
        </Container>
    );
}
