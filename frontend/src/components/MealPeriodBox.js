import React, { useContext, useState } from 'react';

//Context
import { PopupContext } from "../context/popup-context";

export default function MealPeriodBox({ meals }) {
  const {recipeButtonClicked} = useContext(PopupContext);

    // each meal period ('Day' in our class diagram) should have an array of 'Recipe's

    function getMeals() {
        const mealButtons = [];

        let i = 0;
        if (meals && meals.length >= 1) {
            for (const meal of meals) {
                mealButtons.push(<button key={i++} className="meal-button" onClick={() => recipeButtonClicked()}>{meal.name}</button>)
            }
        }

        mealButtons.push(<button key={i} className="meal-button add-meal-button" onClick={() => recipeButtonClicked()}>+</button>)
        return mealButtons;
    }


    return (
        <div className="meal-period-box">
            { getMeals() }
        </div>
    )
}
