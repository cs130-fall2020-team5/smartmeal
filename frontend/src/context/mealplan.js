import React, { useState, createContext, useEffect, useContext, useCallback } from "react";
import axios from 'axios';

// context
import { UserContext } from "../context/user";
import { PopupContext } from "../context/popup-context";

const MealPlanContext = createContext();

/**
  * Creates a MealPlanContext to store state for the MealPlan. Provides a central module to manage data flow between the MealPlanner, MealPlannerBox, DailySummary, and WeeklyTotals, 
  * Triggers rerenders with latest context value passed to the provider
  * @param { object } obj
  * @param { object } obj.children child components to be rendered in the DOM below the provider
  * @returns { object } returns a context provider for popups
*/
function MealPlanProvider({ children }) {
    const { isLoggedIn, loginToken } = useContext(UserContext);
    const { popupDay, popupTime } = useContext(PopupContext);
    const [ mealPlans, setMealPlans ] = useState([]);
    const [ currentPlan, setCurrentPlan ] = useState(null);

    /**
     * Get all of the user's meal plans from the backend and updates our state
     * @param { string } currentId is the id of the currently selected plan, used to ensure the same plan is displayed on screen after the state update
     * @memberof MealPlanProvider
     * @inner
     */
    const getMealPlans = useCallback((currentId) => {
        axios({
            method: "GET",
            url: 'http://localhost:3000/mealplan/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            }
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                if (currentId) {
                    setCurrentPlan(res.data.filter(mp => mp._id === currentId)[0]);
                } else {
                    setCurrentPlan(res.data[0])
                }
            }
        })
        .catch(err => {
            console.log("Failed to get meal plans: ", err);
            setMealPlans([]);
            setCurrentPlan(null);
        });
    }, [loginToken]);

    /**
     * Updates the custom ingredients contained in a meal plan by issuing a request to the backend
     * @param { object[] } customIngredients the new list of custom ingredients to store
     * @memberof MealPlanProvider
     * @inner
     */
    function updateCustomIngredients(customIngredients) {
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: { customIngredients: customIngredients }
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0]);
            }
        })
        .catch((err) => {
            console.log("Failed to update meal plan: ", err);
        });
    }

    /**
     * Updates metadata about the meal plan, namely its name and starting day
     * @param { string } name name to give the plan
     * @param { string } startday which day this meal plan should now start on
     * @memberof MealPlanProvider
     * @inner
     */
    function updateMealPlanMetadata(name, startday) {
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: { name: name, startday: startday }
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0])
            }
        })
        .catch((err) => {
            console.log("Failed to update meal plan: ", err);
        });
    }

    /**
     * Removes a meal from the currently active meal plan
     * @param { string } recipe_id the id of the recipe in the meal plan to remove
     * @memberof MealPlanProvider
     * @inner
     */
    function removeMeal(recipe_id) {
      var pos=0;
      let newMealPlan = JSON.parse(JSON.stringify(currentPlan))
      for (let meal in newMealPlan[popupDay][popupTime]) {
        if (newMealPlan[popupDay][popupTime][meal]._id === recipe_id) {
          newMealPlan[popupDay][popupTime].splice(pos,1);
        }
        pos+=1;
      }

      axios({
          method: "PUT",
          url: 'http://localhost:3000/mealplan/' + currentPlan._id,
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + loginToken
          },
          data: newMealPlan
      })
      .then(res => {
          if (res.data.length < 1) {
              setMealPlans([]);
              setCurrentPlan(null);
          }
          else {
              setMealPlans(res.data);
              setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0])
          }
      })
      .catch((err) => {
          console.log("Failed to update meal plan: ", err);
      });
  }

  /**
   * Update the meal plan with a new meal for a given meal period. The day and meal period to add this new meal to is known by accessing the PopupContext.
   * @param { object } newRecipe the new recipe to add to the meal plan 
   * @param { boolean } isUpdateToExistingMeal whether this recipe should replace one that matches its id, or be appended as a new recipe
     * @memberof MealPlanProvider
     * @inner
   */
    function updateCurrentMealPlan(newRecipe, isUpdateToExistingMeal) {
        console.log(newRecipe, isUpdateToExistingMeal);
        var meal_exist=false;
        let newMealPlan = JSON.parse(JSON.stringify(currentPlan))
        for (let meal in newMealPlan[popupDay][popupTime]) {
          if (newMealPlan[popupDay][popupTime][meal]._id === newRecipe._id) {
            meal_exist=true;
            newMealPlan[popupDay][popupTime][meal] = newRecipe;
          }
        }
        if (!meal_exist){
            if (newMealPlan[popupDay][popupTime].length >= 5) {
                alert("Too many different recipes for this meal period!")
                return;
            };
            newMealPlan[popupDay][popupTime].push(newRecipe);
        }
        axios({
            method: "PUT",
            url: 'http://localhost:3000/mealplan/' + currentPlan._id,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: newMealPlan
        })
        .then(res => {
            if (res.data.length < 1) {
                setMealPlans([]);
                setCurrentPlan(null);
            }
            else {
                setMealPlans(res.data);
                setCurrentPlan(res.data.filter(mp => mp._id === currentPlan._id)[0])
            }
        })
        .catch((err) => {
            console.log("Failed to update meal plan: ", err);
        });
    }

    /**
     * Create a new meal plan and then fetches all meal plans from the backend.
     * @memberof MealPlanProvider
     * @inner
     */
    function createNewMealPlan() {

        // get the next Monday
        let startdate = new Date(Date.now());
        let day = startdate.getDay();
        if (day !== 0) {
            let missingDays = 7 - day;
            startdate.setDate(startdate.getDate() + missingDays);
        }

        axios({
            method: "POST",
            url: 'http://localhost:3000/mealplan/',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                startdate: startdate.getTime() // milliseconds since epoch
            }
        })
        .then(() => {
            getMealPlans(currentPlan ? currentPlan._id : null);
        })
        .catch((err) => {
            console.log("Failed to create new meal plan: ", err);
        });
    }

    /**
     * Delete a meal plan from this user's account
     * @param { string } mealPlanId id of the meal plan to delete
     * @memberof MealPlanProvider
     * @inner
     */
    function removeMealPlan(mealPlanId) {
        axios({
            method: "DELETE",
            url: 'http://localhost:3000/mealplan/' + mealPlanId,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            }
        })
        .then(() => {
            getMealPlans(currentPlan ? currentPlan._id : null);
        })
        .catch((err) => {
            console.log("Failed to remove meal plan: ", err);
        });
    }

    /**
     * Delete a recipe from this user's account, meaning it will no longer be autosuggested when creating new meals
     * @param { string } recipeId id of the recipe to delete
     * @memberof MealPlanProvider
     * @inner
     */
    function removeRecipe(recipeId) {
        axios({
            method: "DELETE",
            url: 'http://localhost:3000/recipe/' + recipeId,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            }
        })
        .then(() => {
            ;
        })
        .catch((err) => {
            console.log("Failed to remove recipe: ", err);
        });
    }

    /**
     * Check ingredients off in the user's grocery list, and then update state by fetching the user's meal plans.
     * Precondition: `checked` and `unchecked` must be mutually exclusive, or the behavior is undefined.
     * @param { string } mealPlanId id of the meal plan to update the grocery list for 
     * @param { string[] } checked list of ingredient names to check off 
     * @param { string[] } unchecked list of ingredient names to uncheck
     * @memberof MealPlanProvider
     * @inner
     */
    function setCheckedIngredients(mealPlanId, checked, unchecked) {
        return axios({
            method: "POST",
            url: 'http://localhost:3000/mealplan/' + mealPlanId + "/check-grocery-items",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + loginToken
            },
            data: {
                checked: checked,
                unchecked: unchecked
            }
        })
        .then((result) => {
            getMealPlans(currentPlan ? currentPlan._id : null);
            return new Promise(function (resolve, reject) { resolve(true) })
        })
        .catch((err) => {
            console.log("Failed to set checked ingredients ", err);
        });
    }

    /**
     * Change the currently displayed meal plan. This function should be called whenever the user clicks on a new plan in the side bar.
     * @param { string } planId the id of the meal plan to display
     * @memberof MealPlanProvider
     * @inner
     */
    function newPlanSelected(planId) {
        for (let mp of mealPlans) {
            if (mp._id === planId) {
                setCurrentPlan(mp);
            }
        }
    }

    
    /**
      * Observer hook that is called to automatically get the user's mealplans whenever they log in.
      * @memberof MealPlanProvider
      * @inner
    */
    useEffect(() => {
        if (isLoggedIn) getMealPlans(null);
    }, [getMealPlans, isLoggedIn, loginToken]);

    return (
        <MealPlanContext.Provider value={{mealPlans, currentPlan, createNewMealPlan, removeMealPlan, removeRecipe, setCheckedIngredients, newPlanSelected, updateCurrentMealPlan, updateCustomIngredients, updateMealPlanMetadata, removeMeal}} >
            { children }
        </MealPlanContext.Provider>
    )
}

export { MealPlanProvider, MealPlanContext }
