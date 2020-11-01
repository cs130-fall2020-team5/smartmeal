import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// styles
import "./styles.css";

// components
import MealPeriodBox from "./MealPeriodBox";
import DailySummary from "./DailySummary";

// sample data
import SampleMealPlan from "../sample-data/plan.json";

export default function MealPlanner() {
    const currentPlan = SampleMealPlan.weeklyPlans[0]; // sample data
    return (
        <Container id="meal-plan">
            <Row>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
                <Col>
                    <span className="day-label">Monday</span>
                </Col>
            </Row>
            <p className="mealtime-label">Breakfast</p>
            <Row>
                <Col>
                    <MealPeriodBox meals={currentPlan.monday.breakfast} />
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
                    <DailySummary day={currentPlan.monday} />
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
        </Container>
    );
}
