import React, { useContext, useState, Fragment } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import './styles.css';
import "bootstrap/dist/css/bootstrap.css";

import { PopupContext } from "../context/popup-context";

//class Popup extends React.Component {
const Popup = () => {

  const { recipeButtonClicked} = useContext(PopupContext);

  const [ingredientFields, setIngredientFields] = useState([
    { name: '', qty: '', units:'' }
  ]);

  const handleSubmit = e => {
    e.preventDefault();
    console.log("inputFields", ingredientFields);
  };

  const handleInputChange = (index, event) => {
    const values = [...ingredientFields];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
    } else if (event.target.name === "qty") {
      values[index].qty = event.target.value;
    } else if (event.target.name === "units") {
      values[index].units = event.target.value;
    }

    setIngredientFields(values);
  };

  const handleAddFields = () => {
    const values = [...ingredientFields];
    values.push({ name:'', qty:'', units:'' });
    setIngredientFields(values);
  };

  return (
    <>
      <div className="popup">
      <form onSubmit={handleSubmit}>
        <div className={"form-row"}>
          {ingredientFields.map((ingredientField, index) => (
            <Fragment key={`${ingredientField}~${index}`}>
              <div className= "form-group col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={ingredientField.name}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group ">
                <input
                  type="text"
                  className="form-control"
                  id="qty"
                  name="qty"
                  value={ingredientField.qty}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>
              <div className="form-group ">
                <input
                  type="text"
                  className="form-control"
                  id="units"
                  name="units"
                  value={ingredientField.units}
                  onChange={event => handleInputChange(index, event)}
                />
              </div>
            </Fragment>
          ))}
        </div>
        <div className="submit-button">
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={() => handleAddFields()}
          >
            Add Ingredient
          </button>
        </div>
        <div className="submit-button text-right">
          <button
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
            onClick={() => recipeButtonClicked()}
          >
            Save
          </button>
        </div>
      </form>
      </div>
    </>
  );
}
export default Popup;
