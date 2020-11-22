import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";

// context
import { MealPlanContext } from "../context/mealplan";

export default function GroceryList({ mealPlan, onClose }) {
    const { setCheckedIngredients } = useContext(MealPlanContext);

    const [ shoppingList, setShoppingList ] = useState({});

    function generateGroceryListItems() {
        const items = [];
        let totalPrice = 0, checkedPrice = 0;

        for (let key in shoppingList) {
            const attributes = shoppingList[key];
            let quantity = attributes.quantity.toFixed(2).toString();

            if (quantity.charAt(quantity.length - 1) === '0') { // remove hundredths place trailing zero
                quantity = quantity.substring(0, quantity.length - 1);
            }
            if (quantity.charAt(quantity.length - 1) === '0') { // remove tenths place trailing zero + decimal point
                quantity = quantity.substring(0, quantity.length - 2);
            }
            
            items.push(
                <div key={key} className="grocery-item">
                    <input className="check-grocery-item" type="checkbox" id={key + "-checkbox"} onChange={() => onCheckItem(key)} checked={attributes.checked ? true : false}/>
                    <label className="label-grocery-item" htmlFor={key + "-checkbox"}>{key}</label>
                    <span className="price-grocery-item">${attributes.price.toFixed(2)}</span>
                    <div className="quantity-grocery-item">{quantity} {attributes.unit}</div>
                </div>
            );
            totalPrice += attributes.price;
            if (attributes.checked) checkedPrice += attributes.price;
        }

        items.push(
            <div key="totals" className="grocery-item">
                <p>Total cost: ${ totalPrice.toFixed(2) }</p>
                <p>Total in cart: ${ checkedPrice.toFixed(2) }</p>
            </div>
        );

        return items;
    }

    function onCheckItem(item) {
        let newShoppingList = JSON.parse(JSON.stringify(shoppingList))
        newShoppingList[item]["checked"] = !newShoppingList[item]["checked"];
        setShoppingList(newShoppingList);
    }

    function updateAndClose() {

        let checked = [];
        let unchecked = [];
        for (let key in shoppingList) {
            const attributes = shoppingList[key];
            if (attributes.checked) {
                checked.push(key);
            } else {
                unchecked.push(key);
            }
        }

        setCheckedIngredients(mealPlan._id, checked, unchecked);

        onClose();
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
                shoppingList[ingredient.name] = { quantity: ingredient.amount ? ingredient.amount : 0, unit: ingredient.unit, price: ingredient.price ? ingredient.price : 0, checked: ingredient.checked };
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
                    <Button onClick={updateAndClose}>Save</Button>
                </div>
            </div>
        </div>
    );
}
