import React from 'react';

export default function MealPeriodBox({ meals }) {

    // each meal period ('Day' in our class diagram) should have an array of 'Recipe's

    function getMeals() {
        const mealButtons = [];

        let i = 0;
        if (meals) {
            for (const meal of meals) {
                mealButtons.push(<button key={i++} className="meal-button">{meal.name}</button>)
            }
        }

        mealButtons.push(<button key={i} className="meal-button add-meal-button">+</button>)
        return mealButtons;
    }


    return (
        <div className="meal-period-box">
            { getMeals() }
        </div>
    )
}