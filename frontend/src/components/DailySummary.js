import React, { useEffect, useState } from "react";

const DEFAULT_NUTRITION = {
    calories: 0,
    fat: 0,
    protein: 0,
    price: 0
}

export default function DailySummary({ day }) {
    const [ nutritionInformation, setNutritionInformation ] = useState(DEFAULT_NUTRITION)

    useEffect(() => {
        if (!day) {
            setNutritionInformation(DEFAULT_NUTRITION);
            return;
        }

        let price = 0, calories = 0, protein = 0, fat = 0;
        function addMealNutrition(meals) {
            for (const meal of meals) {
                console.log(typeof(meal.ingredientList));
                console.log(meal.ingredientList);
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