import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";

// context
import { MealPlanContext } from "../context/mealplan";

export default function GroceryList({ mealPlan, onClose }) {
    const { setCheckedIngredients, updateCustomIngredients } = useContext(MealPlanContext);

    const [ shoppingList, setShoppingList ] = useState({});
    const [ customList, setCustomList ] = useState({
        name: "",
        price: 0,
        amount: 0,
        unit: ""
    });

    function generateGroceryListItems() {
        const items = [];
        let totalPrice = 0, checkedPrice = 0;

        for (let key in shoppingList) {
            const attributes = shoppingList[key];
            let amount = attributes.amount.toFixed(2).toString();

            if (amount.charAt(amount.length - 1) === '0') { // remove hundredths place trailing zero
                amount = amount.substring(0, amount.length - 1);
            }
            if (amount.charAt(amount.length - 1) === '0') { // remove tenths place trailing zero + decimal point
                amount = amount.substring(0, amount.length - 2);
            }
            
            items.push(
                <div key={key} className="grocery-item">
                    <input className="check-grocery-item" type="checkbox" id={key + "-checkbox"} onChange={() => onCheckItem(key)} checked={attributes.checked ? true : false}/>
                    <label className="label-grocery-item" htmlFor={key + "-checkbox"}>{key}</label>
                    <span className="price-grocery-item">${attributes.price.toFixed(2)}</span>
                    <div data-testid={key + "-qty"} className="amount-grocery-item">{amount} {attributes.unit}</div>
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

    function handleInput(event) {
        if (event.target.name === "name") {
            setCustomList({...customList, name: event.target.value});
            //event.target.value = "";
        } else if (event.target.name === "price") {
            setCustomList({...customList, price: parseInt(event.target.value)}); // EC
            //event.target.value = "";
        } else if (event.target.name === "amount") {
            setCustomList({...customList, amount: parseInt(event.target.value)}); // EC
            //event.target.value = "";
        } else if (event.target.name === "unit") {
            setCustomList({...customList, unit: event.target.value});
            //event.target.value = "";
        }

        console.log(customList);
    }

    function newCustomIngredient() {
        updateCustomIngredients(customList);
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

        // Push custom ingredients
        for (let ing of mealPlan.customIngredients) {
            ingredients.push(ing);
        }

        // use hash table to condense ingredients
        // ingredient schema: { amount: number, unit: string, price: number }

        const shoppingList = {};
        for (let ingredient of ingredients) {
            if (shoppingList[ingredient.name]) {
                const groceryItem = shoppingList[ingredient.name];
                groceryItem.amount += ingredient.amount ? parseInt(ingredient.amount) : 0; // see proposal report class diagram
                groceryItem.price += ingredient.price ? ingredient.price : 0; // may need to adjust/multiply by amount
                // IMPORTANT: units may differ between different ingredients, possibly will need to convert so amount is correct
            } else {
                shoppingList[ingredient.name] = { amount: ingredient.amount ? parseInt(ingredient.amount) : 0, unit: ingredient.unit, price: ingredient.price ? ingredient.price : 0, checked: ingredient.checked };
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
                    <div className="custom-item">
                        <input name="name" type="text" placeholder="Name" onChange={handleInput}/><br></br>
                        <input name="price" type="text" placeholder="Price" onChange={handleInput}/><br></br>
                        <input name="amount" type="text" placeholder="Quantity" onChange={handleInput}/><br></br>
                        <input name="unit" type="text" placeholder="Unit type" onChange={handleInput}/>
                    </div>
                    <Button onClick={newCustomIngredient}>Add Custom Ingredient</Button>
                    <Button onClick={updateAndClose}>Save</Button>
                </div>
            </div>
        </div>
    );
}
