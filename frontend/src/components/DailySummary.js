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

        const breakfast = day.breakfast;
        // const lunch = day.lunch;
        // const dinner = day.dinner;

        let price = 0, calories = 0, protein = 0, fat = 0;
        for (const meal of breakfast) {
            for (const ingredient of meal.ingredientList) {
                price += ingredient.price;
                calories += ingredient.ingredientNutrition.calorieCount;
                protein += ingredient.ingredientNutrition.proteinCount;
                fat += ingredient.ingredientNutrition.fatCount;
            }
        }

        // repeat the above for lunch

        // repeat the above for dinner

        setNutritionInformation({ price: price, calories: calories, protein: protein, fat: fat });

    }, [ day ]); 

    return (
        <div>
            <p className="nutrition-information">Calories: {nutritionInformation.calories}</p>
            <p className="nutrition-information">Fat: {nutritionInformation.fat}</p>
            <p className="nutrition-information">Protein: {nutritionInformation.protein}</p>
            <p className="nutrition-information">Price: {nutritionInformation.price}</p>
        </div>
    )
}