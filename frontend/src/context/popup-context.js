import React, { useState, createContext } from "react";

const PopupContext = createContext();

/**
  * Creates a PopupContext to store state for the RecipePopup. Provides a central module to manage data flow between the RecipePopup and MealPlanner
  * Triggers rerenders with latest context value passed to the provider
  * @param { object } obj
  * @param { object } obj.children child components to be rendered in the DOM below the provider
  * @returns { object } returns a context provider for popups
*/
function PopupProvider({ children }) {
  const [ showRecipePopup, setShowRecipePopup ] = useState(false);
  const [ popupDay, setPopupDay ] = useState("");
  const [ popupTime, setPopupTime ] = useState("");
  const [ recipeInfo, setRecipeInfo ] = useState([
    { name: '', ingredientList: [] }
  ]);

  /**
    * Toggles the showRecipe flag to display the popup and populates the recipe info with the appropriate data
    * @param { string } day the day associated with the column of the recipe button that was clicked
    * @param { string } time the meal period that the clicked button resides in
    * @param { object } recipe object that holds data of recipe
    * @param { string } recipe.name name of recipe
    * @param { object[] } recipe.ingredientList array of ingredient objects
    * @memberof PopupProvider
    * @inner
  */
  function recipeButtonClicked(day, time, recipe) {
    setShowRecipePopup(!showRecipePopup);
    if (recipe !== null){
      setRecipeInfo(recipe);
    } else {
      setRecipeInfo({name: "", ingredientList: []})
    }
    setPopupDay(day);
    setPopupTime(time);
  }

  /**
    * Toggles the showRecipe flag and stops displaying the recipe popup
    * @memberof PopupProvider
    * @inner
  */
  function saveButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

  /**
    * Toggles the showRecipe flag and stops displaying the recipe popup
    * @memberof PopupProvider
    * @inner
  */
  function cancelButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

  return (
    <PopupContext.Provider value={{showRecipePopup, recipeButtonClicked, saveButtonClicked, cancelButtonClicked, recipeInfo, popupDay, popupTime}}>
        { children }
    </PopupContext.Provider>
  )
}

export { PopupProvider, PopupContext }
