import React, { useContext, useState } from "react";
import './styles.css';

import { PopupContext } from "../context/popup-context";

class RecipePopup extends React.Component {

static contextType = PopupContext;

  render() {
    let context = this.context;
    return (
      <div className='popup'>
        <div className='popup\_inner'>
          <h1>"Test"</h1>
            <button onClick={() => context.recipeButtonClicked()}>Close</button>
        </div>
      </div>
    );
  }
}

export default RecipePopup;
