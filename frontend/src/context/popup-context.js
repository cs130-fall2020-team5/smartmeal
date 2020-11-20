import React, { useState, createContext, useEffect } from "react";

const PopupContext = createContext();

function PopupProvider({ children }) {
  const [ showRecipePopup, setShowRecipePopup ] = useState(false);

  function recipeButtonClicked() {
    setShowRecipePopup(!showRecipePopup);
  }

  return (
    <PopupContext.Provider value={{showRecipePopup, recipeButtonClicked}}>
        { children }
    </PopupContext.Provider>
  )
}

export { PopupProvider, PopupContext }
