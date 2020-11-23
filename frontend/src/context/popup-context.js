import React, { useState, createContext, useEffect } from "react";

const PopupContext = createContext();

function PopupProvider({ children }) {
  const [ showRecipePopup, setShowRecipePopup ] = useState(false);
  const [ recipeInfo, setRecipeInfo ] = useState([
    { name: '', ingredientList: [] }
  ]);

  function recipeButtonClicked(recipe) {
    setShowRecipePopup(!showRecipePopup);
    console.log("Recipe Fields", recipe);
    if (recipe !== null){
      setRecipeInfo({ name: recipe.name, ingredientList: recipe.ingredientList });
    } else {
      setRecipeInfo({name: "", ingredientList: []})
    }
    console.log("Recipe Info:", recipeInfo);
  }

  function saveButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

  function cancelButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

  return (
    <PopupContext.Provider value={{showRecipePopup, recipeButtonClicked, saveButtonClicked, cancelButtonClicked, recipeInfo}}>
        { children }
    </PopupContext.Provider>
  )
}

export { PopupProvider, PopupContext }
