import React, { useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import  { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// context
import { MealPlanContext } from "../context/mealplan";

/**
  * This component displays the popup for the grocery list when a user clicks the
  * 'Grocery List' button.
  * @param { object } obj
  * @param { mealplan } obj.mealPlan data structure for the current weekly meal plan
  * @param { function } obj.onClose function to stop displaying the popup window
  * @returns { JSX } Returns the HTML for the grocery popup
*/
export default function GroceryList({ mealPlan, onClose }) {
    const { setCheckedIngredients, updateCustomIngredients } = useContext(MealPlanContext);

    const [ shoppingList, setShoppingList ] = useState({});
    const [ customList, setCustomList ] = useState({
        name: "",
        price: "",
        amount: "",
        unit: ""
    });


    /**
     * Generates the JSX for each grocery list item.
     * @returns { JSX[] } array of div elements containing the list of grocery items
     * @memberof GroceryList
     * @inner
     */
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
                    <label data-testid={key + "-qty"} className="label-grocery-item" htmlFor={key + "-checkbox"}>{key} ({amount} {attributes.unit})</label>
                    <span className="price-grocery-item">${attributes.price.toFixed(2)}</span>
                    {attributes.isCustom &&
                        <span onClick={() => removeCustomGroceryItem(key)} className="grocery-item-delete">
                            <FontAwesomeIcon icon="trash"/>
                            <span className="grocery-item-tooltip">click to delete custom item</span>
                        </span>
                    }
                </div>
            );

            totalPrice += attributes.price;
            if (attributes.checked) checkedPrice += attributes.price;
        }

        items.push(
            <div key="totals" className="grocery-item">
                <p style={{ "marginTop": "10px"}}>Total: ${ totalPrice.toFixed(2) }&nbsp;&nbsp;&nbsp;In cart: ${ checkedPrice.toFixed(2) }</p>
            </div>
        );

        return items;
    }

    /**
     * Iterates through the shopping list and sorts the items into checked and unchecked lists based on whether the user checked them off.
     * @returns Tuple of checked and unchecked items
     * @memberof GroceryList
     * @inner
    */
    function getCheckedItems() {
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
        return { checked: checked, unchecked: unchecked }
    }

    /**
     * Remove a custom ingregient from the grocery list
     * @param { string } itemName name of item to remove from list
     * @memberof GroceryList
     * @inner
    */
    function removeCustomGroceryItem(itemName) {
        // set what we've checked so far otherwise we lose it

        const { checked, unchecked } = getCheckedItems();

        setCheckedIngredients(mealPlan._id, checked, unchecked)
            .then(() => {
                // now forward the new custom ingredient
                let customIngredients = mealPlan.customIngredients;
                for (let i = 0; i < customIngredients.length; i++) {
                    let ing = customIngredients[i];
                    if (checked.filter(key => key === ing.name).length > 0) {
                        ing.checked = true;
                    } else {
                        ing.checked = false;
                    }

                    if (ing.name === itemName) {
                        customIngredients.splice(i, 1)
                    }
                }
                updateCustomIngredients(customIngredients);
            })
    }

    /**
     * Determines what type of input has changed and updates the current custom ingredient accordingly.
     * @param { object } event current state of the target input element
     * @memberof GroceryList
     * @inner
    */
    function handleInput(event) {
        if (event.target.name === "name") {
            setCustomList({...customList, name: event.target.value});
            //event.target.value = "";
        } else if (event.target.name === "price") {
            setCustomList({...customList, price: event.target.value}); // EC
            //event.target.value = "";
        } else if (event.target.name === "amount") {
            setCustomList({...customList, amount: event.target.value}); // EC
            //event.target.value = "";
        } else if (event.target.name === "unit") {
            setCustomList({...customList, unit: event.target.value});
            //event.target.value = "";
        }
    }

    /**
     * Adds a new custom ingredient to the list of grocery items in the list. Gathers input variables from state variables set by `handleInput()`
     * Issues API requests to the backend to save this new item.
     * @memberof GroceryList
     * @inner
    */
    function newCustomIngredient() {

        // set what we've checked so far otherwise we lose it
        const { checked, unchecked } = getCheckedItems();

        setCheckedIngredients(mealPlan._id, checked, unchecked)
            .then(() => {
                // now forward the new custom ingredient
                let customIngredients = mealPlan.customIngredients;
                for (let ing of customIngredients) {
                    if (checked.filter(key => key === ing.name).length > 0) {
                        ing.checked = true;
                    } else {
                        ing.checked = false;
                    }
                }
                customIngredients.push(customList);
                updateCustomIngredients(customIngredients);
                setCustomList({
                    name: "",
                    price: "",
                    amount: "",
                    unit: ""
                });
            })
    }

    function onCheckItem(item) {
        let newShoppingList = JSON.parse(JSON.stringify(shoppingList))
        newShoppingList[item]["checked"] = !newShoppingList[item]["checked"];
        setShoppingList(newShoppingList);
    }

    /**
     * Save the current state of the grocery list and close the popup
     * @memberof GroceryList
     * @inner
    */
    function updateAndClose() {
        const { checked, unchecked } = getCheckedItems();
        setCheckedIngredients(mealPlan._id, checked, unchecked);
        onClose();
    }


    /**
      * Observer hook that is called to update the quantity and price values whenever the mealplan changes.
      * @memberof DailySummary
      * @inner
    */
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
            ing.isCustom = true;
            ingredients.push(ing);
        }

        // use hash table to condense ingredients
        // ingredient schema: { amount: number, unit: string, price: number }

        const shoppingList = {};
        for (let ingredient of ingredients) {
            if (shoppingList[ingredient.name]) {
                const groceryItem = shoppingList[ingredient.name];
                groceryItem.amount += ingredient.amount ? parseFloat(ingredient.amount) : 0; // see proposal report class diagram
                groceryItem.price += ingredient.price ? parseFloat(ingredient.price) : 0; // may need to adjust/multiply by amount
                // IMPORTANT: units may differ between different ingredients, possibly will need to convert so amount is correct
            } else {
                shoppingList[ingredient.name] = { amount: ingredient.amount ? parseFloat(ingredient.amount) : 0, unit: ingredient.unit, price: ingredient.price ? parseFloat(ingredient.price) : 0, checked: ingredient.checked, isCustom: ingredient.isCustom };
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
                        <input name="name" type="text" placeholder="Name" value={customList.name} onChange={handleInput}/><br></br>
                        <input name="price" type="text" placeholder="Price" value={customList.price} onChange={handleInput}/><br></br>
                        <input name="amount" type="text" placeholder="Quantity" value={customList.amount} onChange={handleInput}/><br></br>
                        <input name="unit" type="text" placeholder="Unit type" value={customList.unit} onChange={handleInput}/>
                    </div>
                    <Button onClick={newCustomIngredient} style={{ "marginBottom": "10px", "marginTop": "10px" }}>Add Custom Ingredient</Button>
                    <Button onClick={updateAndClose}>Save</Button>
                </div>
            </div>
        </div>
    );
}
