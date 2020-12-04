import React, { useEffect, useState } from "react";

const DEFAULT_NUTRITION = {
    calories: 0,
    fat: 0,
    protein: 0,
    price: 0
}

/**
  * This component calculates the nutritional information for a given day and displays
  * the data in a div element. Works by iterating over all the meals for a given day, summing up the
  * nutritional values across all ingredients, and displaying the final result.
  * @param { object } obj
  * @param { object } obj.day data structure consisting of meal period objects
  * @param { object } obj.day.breakfast list of meals for breakfast period
  * @param { object } obj.day.lunch list of meals for lunch period
  * @param { object } obj.day.dinner list of meals for dinner period
*/
export default function DailySummary({ day }) {
    const [ nutritionInformation, setNutritionInformation ] = useState(DEFAULT_NUTRITION)

    /**
      * Observer hook that is called to update the nutrition and price values whenever the mealplan changes.
      * @memberof DailySummary
      * @inner
    */
    useEffect(() => {
        if (!day) {
            setNutritionInformation(DEFAULT_NUTRITION);
            return;
        }

        let price = 0, calories = 0, protein = 0, fat = 0;

        /**
          * This function iterates through a list of meals and sums the nutritional
          * data respectively.
          * @param { object[] } meals
          * @param { object[] } meals[].ingredientList data structure consisting of meal's
          * ingredients
          * @memberof DailySummary
          * @inner
        */
        function addMealNutrition(meals) {
            for (const meal of meals) {
                for (const ingredient of meal.ingredientList) {
                    price += ingredient.price ? ingredient.price : 0;
                    calories += ingredient.calories ? ingredient.calories : 0;
                    protein += ingredient.protein ? ingredient.protein : 0;
                    fat += ingredient.fat ? ingredient.fat : 0;
                }
            }
        }

        if (day.breakfast) addMealNutrition(day.breakfast);
        if (day.lunch) addMealNutrition(day.lunch);
        if (day.dinner) addMealNutrition(day.dinner);

        setNutritionInformation({ price: price.toFixed(2), calories: Math.round(calories), protein: Math.round(protein), fat: Math.round(fat) });

    }, [ day ]);

    return (
        <div>
            <p className="nutrition-information">Calories: {nutritionInformation.calories} cal</p>
            <p className="nutrition-information">Fat: {nutritionInformation.fat} g</p>
            <p className="nutrition-information">Protein: {nutritionInformation.protein} g</p>
            <p className="nutrition-information">Price: ${nutritionInformation.price}</p>
        </div>
    )
}
