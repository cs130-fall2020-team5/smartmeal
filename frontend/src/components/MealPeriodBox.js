import React, { useContext } from 'react';

//Context
import { PopupContext } from "../context/popup-context";

/**
  * Renders a meal box for the provided period in the weekly planner. The meal plan will have 21 of these; one for each of the 3 meal periods in all 7 days of the week.
  * This meal box contains the list of meals the user has planned for this meal period.
  * @param { object } obj
  * @param { string } obj.day day of week in planner
  * @param { string } obj.time which meal time of day (Breakfast, Lunch, Dinner) this box is for
  * @param { object[] } obj.meals list of recipes
  * @returns { JSX } div element containing meal buttons
*/
export default function MealPeriodBox({ day, time, meals }) {
  const {recipeButtonClicked} = useContext(PopupContext);

    // each meal period ('Day' in our class diagram) should have an array of 'Recipe's
    /**
      * Iterates through the meals for this day to create a list of buttons for existing meals as well as a button for create a new meal
      * @returns { Array<button> } list of button elements for the existing meals and an extra button for creating new meals
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
