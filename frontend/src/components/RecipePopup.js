import React, { useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import './styles.css';

import { PopupContext } from "../context/popup-context";

class RecipePopup extends React.Component {

static contextType = PopupContext;

  render() {
    const ingredientColSize = 8;
    let context = this.context;
    return (
        <div className='popup'>
          <Form>
            <Form.Row>
              <Col>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Control size="lg" type="recipe_name" placeholder="Recipe" className="text-center"/>
                </Form.Group>
              </Col>
              <Col>
              </Col>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={ingredientColSize}>
                <Form.Label>Ingredient</Form.Label>
                <Form.Control type="ingredient" placeholder="Ingredient" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Qty</Form.Label>
                <Form.Control type="quantity" placeholder="0"/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Units</Form.Label>
                <Form.Control type="units" placeholder="oz"/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={ingredientColSize}>
                <Form.Control type="ingredient" placeholder="Ingredient" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type="quantity" placeholder="0"/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type="units" placeholder="oz"/>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={ingredientColSize}>
                <Form.Control type="ingredient" placeholder="Ingredient" />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type="quantity" placeholder="0"/>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control type="units" placeholder="oz"/>
              </Form.Group>
            </Form.Row>

            <div class="text-left">
            <Button variant="primary" type="add_ingredient">
              Add ingredient
            </Button>
            </div>
            <div class="text-right">
            <Button variant="primary" type="save" onClick={() => context.recipeButtonClicked()}>
              Save
            </Button>
            </div>
          </Form>
            {/*}<button onClick={() => context.recipeButtonClicked()}>Close</button>*/}
        </div>
    );
  }
}

export default RecipePopup;
