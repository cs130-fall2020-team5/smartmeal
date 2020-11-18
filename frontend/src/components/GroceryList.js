import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function GroceryList({ mealPlan, onClose }) {

    const [ shoppingList, setShoppingList ] = useState({});

    function generateGroceryListItems() {
        const items = [];
        let totalPrice = 0;

        console.log("Shopping list: ", shoppingList);

        for (let key in shoppingList) {
            const attributes = shoppingList[key];
            items.push(
                <div key={key} className="grocery-item">
                    <input className="check-grocery-item" type="checkbox" id={key + "-checkbox"} onClick={onCheckItem}/>
                    <label className="label-grocery-item" htmlFor={key + "-checkbox"}>{key}</label>
                    <span className="quantity-grocery-item">{attributes.quantity} {attributes.unit}</span>
                    <span className="price-grocery-item">${attributes.price.toFixed(2)}</span>
                </div>
            );
            totalPrice += attributes.price;
        }

        items.push(
            <div key="totals" className="grocery-item">
                <span>Total cost: ${ totalPrice.toFixed(2) }</span>
            </div>
        );

        return items;
    }

    function onCheckItem(e) {
        console.log("Checked ", e.target);
    }

    useEffect(() => {
        
        let ingredients = [];

        function parseDay(day) {
            function parseMealPeriod(period) {
                for (let meal of period) {
                    for (let ingredient of meal.ingredientList) {
                        ingredients.push(ingredient);
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

        // use hash table to condense ingredients
        // ingredient schema: { quantity: number, unit: string, price: number }

        const shoppingList = {};
        for (let ingredient of ingredients) {
            if (shoppingList[ingredient.name]) {
                const groceryItem = shoppingList[ingredient.name];
                groceryItem.quantity += ingredient.amount ? ingredient.amount : 0; // see proposal report class diagram
                groceryItem.price += ingredient.price ? ingredient.price : 0; // may need to adjust/multiply by quantity
                // IMPORTANT: units may differ between different ingredients, possibly will need to convert so amount is correct
            } else {
                shoppingList[ingredient.name] = { quantity: ingredient.amount ? ingredient.amount : 0, unit: ingredient.unit, price: ingredient.price ? ingredient.price : 0 };
            }
        }

        setShoppingList(shoppingList);
    }, [ mealPlan ]);

    return (
        <div className="modal-outline">
            <div className="modal-r">
                <div className="modal-content">
                    <p>Grocery List</p>
                    { generateGroceryListItems() }
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}
