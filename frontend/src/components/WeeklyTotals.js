import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const DEFAULT_NUTRITION = {
    calories: 0,
    fat: 0,
    protein: 0,
    price: 0
}

/**
  * Renders the weekly totals popup
  * @param { object } obj
  * @param { mealPlan } obj.mealPlan data structure for the current weekly meal plan
  * @param { function } obj.onClose function to stop displaying the popup window
  * @returns { JSX } Returns the HTML for the weekly totals popup
*/
export default function WeeklyTotals({ mealPlan, onClose }) {
    const [ nutritionInformation, setNutritionInformation ] = useState(DEFAULT_NUTRITION)

    /**
     * Calls function to close weekly planner popup
     * @memberof WeeklyTotals
     * @inner
    */
    function updateAndClose() {
        onClose();
    }

    /**
     * @memberof WeeklyTotals
     * @inner
    */
    useEffect(() => {

        let price = 0, calories = 0, protein = 0, fat = 0;

        /**
          * Calls parseMealPeriod for each period of the day.
          * @param { object } day object that has breakfast, lunch, and dinner attributes
          * @memberof WeeklyTotals
          * @inner
        */
        function parseDay(day) {

            /**
              * For each ingredient in each recipe in the meal period, add the price
              * and nutrition amounts to the weekly total
              * @param { object } period list of meals such that each meal has an ingredient list,
              * and each ingredient list has price and nutrition facts
              * @memberof WeeklyTotals
              * @inner
            */
            function parseMealPeriod(period) {
                for (let meal of period) {
                    for (let ingredient of meal.ingredientList) {
                        price += ingredient.price ? ingredient.price : 0;
                        calories += ingredient.calories ? ingredient.calories : 0;
                        protein += ingredient.protein ? ingredient.protein : 0;
                        fat += ingredient.fat ? ingredient.fat : 0;
                    }
                }
            }
            parseMealPeriod(day.breakfast);
            parseMealPeriod(day.lunch);
            parseMealPeriod(day.dinner);
        }

        parseDay(mealPlan.monday);
        parseDay(mealPlan.tuesday);
        parseDay(mealPlan.wednesday);
        parseDay(mealPlan.thursday);
        parseDay(mealPlan.friday);
        parseDay(mealPlan.saturday);
        parseDay(mealPlan.sunday);

        setNutritionInformation({ price: price.toFixed(2), calories: Math.round(calories), protein: Math.round(protein), fat: Math.round(fat) });

    }, [ mealPlan ]);

    return (
        <div className="modal-outline" data-testid="weekly-totals-popup">
            <div className="modal-r">
                <div className="modal-content">
                    <p>Weekly Totals for {mealPlan.name}</p>
                    <div className="grocery-item">
                        <div className="grocery-item">Calories: {nutritionInformation.calories} cal</div>
                        <div className="grocery-item">Fat: {nutritionInformation.fat} g</div>
                        <div className="grocery-item">Protein: {nutritionInformation.protein} g</div>
                        <div className="grocery-item">Price: ${nutritionInformation.price}</div>
                    </div>
                    <Button style={{ "margin-top": "15px" }} onClick={updateAndClose}>Exit</Button>
                </div>
            </div>
        </div>
    );
}
