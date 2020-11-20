import React, { useContext, useState, Fragment } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import './styles.css';
import "bootstrap/dist/css/bootstrap.css";

import { PopupContext } from "../context/popup-context";

const RecipePopup = () => {

  const { recipeButtonClicked} = useContext(PopupContext);

  const [ingredientFields, setIngredientFields] = useState([
    { name: '', qty: '', units:'' }
  ]);

  const [recipeName, setRecipeName] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    console.log("inputFields", ingredientFields);
    console.log("Recipe Name", recipeName);
    recipeButtonClicked();
  };

  const handleInputChange = (index, event) => {
    const values = [...ingredientFields];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
    } else if (event.target.name === "qty") {
      values[index].qty = event.target.value;
    } else if (event.target.name === "units") {
      values[index].units = event.target.value;
    } else if (event.target.name === "")

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
      <Container fluid>
        <Row>
          <Col>
          </Col>
          <Col>
            <input
              type="text"
              className="form-control text-center"
              placeholder="Recipe Name"
              value={recipeName}
              onChange={event => setRecipeName(event.target.value)}
            />
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <br>
          </br>
        </Row>
        <div className={"form-row"}>
          {ingredientFields.map((ingredientField, index) => (
            <Fragment key={`${ingredientField}~${index}`}>
              <Row>
                <Col>
                  <div className= "form-group">
                    <label className= "recipe-input-label">
                      Ingredient
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="Ingredient"
                      id="name"
                      name="name"
                      value={ingredientField.name}
                      onChange={event => handleInputChange(index, event)}
                    />
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="form-group ">
                    <label className= "recipe-input-label">
                      Qty
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="0"
                      id="qty"
                      name="qty"
                      value={ingredientField.qty}
                      onChange={event => handleInputChange(index, event)}
                    />
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="form-group ">
                    <label className= "recipe-input-label">
                      Units
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="oz"
                      id="units"
                      name="units"
                      value={ingredientField.units}
                      onChange={event => handleInputChange(index, event)}
                    />
                  </div>
                </Col>
              </Row>
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
          >
            Save
          </button>
        </div>
        </Container>
      </form>
      </div>
    </>
  );
}
export default RecipePopup;
