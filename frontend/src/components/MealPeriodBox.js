import React, { useContext } from 'react';

//Context
import { PopupContext } from "../context/popup-context";

/**
  * <pre>
  * Generates a meal box for the provided period in the current plan.
  * Creates a recipe popup button for each meal within the period.
  * </pre>
  * @param { object } obj
  * @param { string } obj.day day of week in planner
  * @param { string } obj.time meal time of day (Breakfast, Lunch, Dinner)
  * @param { meals } obj.meals list of recipes
  * @returns { JSX } div element containing meal buttons
*/
export default function MealPeriodBox({ day, time, meals }) {
  const {recipeButtonClicked} = useContext(PopupContext);

    // each meal period ('Day' in our class diagram) should have an array of 'Recipe's
    /**
      * Creates a list of buttons for existing meals as well as a button for create a new meal
      * @returns { Array<button> } list of buttons for the existing meals and an extra button for creating new meals
      * @memberof MealPeriodBox
      * @inner
    */
    function getMeals() {
        const mealButtons = [];

        let i = 0;
        if (meals && meals.length >= 1) {
            for (const meal of meals) {
                mealButtons.push(<button key={i++} className="meal-button" onClick={() => recipeButtonClicked(day, time, meal)}>{meal.name}</button>)
            }
        }

        mealButtons.push(<button key={i} className="meal-button add-meal-button" onClick={() => recipeButtonClicked(day, time, null)}>+</button>)
        return mealButtons;
    }


    return (
        <div className="meal-period-box">
            { getMeals() }
        </div>
    )
}
