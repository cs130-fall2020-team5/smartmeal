import React, { useState, createContext } from "react";

const PopupContext = createContext();

function PopupProvider({ children }) {
  const [ showRecipePopup, setShowRecipePopup ] = useState(false);
  const [ popupDay, setPopupDay ] = useState("");
  const [ popupTime, setPopupTime ] = useState("");
  const [ recipeInfo, setRecipeInfo ] = useState([
    { name: '', ingredientList: [] }
  ]);

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

  function saveButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

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
