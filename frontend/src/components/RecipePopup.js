import React, { useContext, useState, Fragment } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import './styles.css';
import "bootstrap/dist/css/bootstrap.css";
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { PopupContext } from "../context/popup-context";
/*const languages = [
  {
    name: 'apple',
    year: 1972
  },
  {
    name: 'dark chocolate',
    year: 2000
  },
  {
    name: 'bread',
    year: 1983
  },
  {
    name: 'flour',
    year: 2007
  },
  {
    name: 'sausage',
    year: 2012
  },
  {
    name: 'Salmon',
    year: 2009
  },
  {
    name: 'shrimp',
    year: 1990
  },
  {
    name: 'Pineapple',
    year: 1995
  },
  {
    name: 'orange',
    year: 1995
  },
  {
    name: 'Pearl',
    year: 1987
  },
  {
    name: 'sugar',
    year: 1995
  },
  {
    name: 'egg',
    year: 1991
  },
  {
    name: 'cucumber',
    year: 1995
  },
  {
    name: 'brocolli',
    year: 2003
  }
];*/

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return spoonSearch(value)
  .then((res) => {
    return res.data.filter(language => regex.test(language.name));
  })
  .catch((err) => {
    console.log("Failed to do remote ingredient search: ", err);
    return [];
  });
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class MyAutosuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value)
    .then((res) => {
      console.log(res);
      this.setState({
        suggestions: res
      });
    })
    .catch((err) => {
      console.log("Failed to do fetch suggestions: ", err);
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { id, placeholder } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder,
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        id={id}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
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
                    <MyAutosuggest
                      id="ingre1"
                      placeholder="Type ingredient"
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

function spoonSearch(str) {
  console.log("spoon");
  return axios.get('https://api.spoonacular.com/food/ingredients/autocomplete',
    {
      params: {
        apiKey: "db254b5cd61744d39a2deebd9c361444",
        query: str,
        number: 5,
        metaInformation: true
        //intolerances:
      }
    }
  )
}

export default RecipePopup;
