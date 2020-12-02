import React, { useContext, useState, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import './styles.css';
import "bootstrap/dist/css/bootstrap.css";
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import { PopupContext } from "../context/popup-context";
import { UserContext } from "../context/user";
import { MealPlanContext } from "../context/mealplan";

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
    return res.data.filter(language => regex.test(language.name)).slice(0, 5);
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
function recipe_getSuggestions(value,token) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  //console.log(loginToken);
  return axios({
    method: "GET",
    url: "http://localhost:3000/recipe/",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }
})
.then((res) => {
  //console.log(res.data.filter(each_recipe => regex.test(each_recipe.name)));
  return res.data.filter(each_recipe => regex.test(each_recipe.name));
})
.catch((err) => {
  console.log("Failed to do recipe search: ", err);
  return [];
});
}

class RecipeSuggest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value,
      suggestions: []
    };
  }


  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    //console.log(this.state.suggestions);
    //console.log("new", newValue, this.state.suggestions)
    //this.props.onChange(newValue);
    var ingres=this.state.suggestions.filter(a=> a.name===newValue);
    //console.log("new", newValue, ingres)
    if (ingres.length===0){
    }
    else{
      this.props.onChange2(ingres[0]);
    }
    this.props.onChange(newValue);
  };



  onSuggestionsFetchRequested = ({ value }) => {
    recipe_getSuggestions(value, this.props.token)
    .then((res) => {
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
    const { value, id, placeholder, token, /*className*/ } = this.props;
    const { suggestions } = this.state;
    const inputProps = {
      placeholder,
      value,
      //className
      token,
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

class MyAutosuggest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value,
      suggestions: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    var units=this.state.suggestions.filter(a=> a.name===newValue);
    var unit;
    if (units.length===0){
      unit=[];
    }
    else{
    unit=units[0].possibleUnits;
    }
    this.props.onChange(newValue,unit);

  };

  onSuggestionsFetchRequested = ({ value }) => {
    getSuggestions(value)
    .then((res) => {
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
    const { value, id, placeholder, className } = this.props;
    const { suggestions } = this.state;
    const inputProps = {
      placeholder,
      className,
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        id={id}
        className={className}
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

const RecipePopup = ({ recipe }) => {

  const { loginToken } = useContext(UserContext);

  const { saveButtonClicked, cancelButtonClicked } = useContext(PopupContext);
  const { updateCurrentMealPlan } = useContext(MealPlanContext);

  const isExistingRecipe = ( recipe ) => {
    const values = [];
    if (recipe.name !== ""){
      const ingredientList = recipe.ingredientList
      if (ingredientList && ingredientList.length >= 1){
        for (const ingredient of ingredientList){
          values.push({name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit, possibleUnits: ingredient.possibleUnits ? ingredient.possibleUnits : [] });
        }
        return values;
      }
    }
    else {
        values.push({name: '', amount:'', unit:'', possibleUnits:[]});
        return values;
    }
  }

  const [ingredientFields, setIngredientFields] = useState(isExistingRecipe(recipe));

  const [recipeName, setRecipeName] = useState(recipe.name);

  function updateMealplan(recipe_id, recipe_name, ingredient_list){
    var isExistingRecipe=recipe_id.length?true:false;
    console.log("1.1recipe._id", recipe_id);
    axios({
      method: recipe_id.length ? "PUT" : "POST",
      url: "http://localhost:3000/recipe/" + recipe_id,
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + loginToken
      },
      data: {
          name: recipe_name,
          ingredients: JSON.stringify(ingredient_list)
      }
    }).then((res) => {
      //console.log("2new one", recipe_id);
      //console.log("3recipe._id",recipe_id.length? recipe_id: res.data.id);
      updateCurrentMealPlan({ name: recipeName, ingredientList: ingredientFields, _id: recipe_id.length? recipe_id: res.data.id }, true);
    }).catch((err) =>{
      console.log("Failed to save new recipe: ", err);
    })
  }

  function saveRecipe(recipe_name, ingredient_list) {
    var recipe_id="";
    axios({
      method: "GET",
      url: "http://localhost:3000/recipe/",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + loginToken
      }
  })
  .then((res) => {
    //console.log(res.data.filter(each_recipe => regex.test(each_recipe.name)));
     var matched_recipe=res.data.filter(each_recipe => recipe_name===each_recipe.name);
     console.log("1matched",matched_recipe);
     if (matched_recipe.length){
       recipe_id=matched_recipe[0]._id;
     }
     updateMealplan(recipe_id, recipe_name, ingredient_list);

  })
  .catch((err) => {
    console.log("Failed to do recipe search: ", err);
  });

    //isExistingRecipe = recipe_id ? true : false;

  }

  const handleSubmit = e => {
    e.preventDefault();
    saveRecipe(recipeName, ingredientFields);
    saveButtonClicked();
  };

  const handleInputChange = (index, event) => {
    const values = [...ingredientFields];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
      values[index].possibleUnits=event.target.possibleUnits;
    } else if (event.target.name === "amount") {
      values[index].amount = event.target.value;
    } else if (event.target.name === "unit") {
      values[index].unit = event.target.value;
    }
    setIngredientFields(values);
  };

  const handleAddFields = () => {
    const values = [...ingredientFields];
    values.push({ name:'', amount:'', unit:'',possibleUnits:[] });
    setIngredientFields(values);
  };

  const handleRemoveFields = (ing) => {
    const values = [...ingredientFields];
    if (values.length > 1) {
      values.pop();
      setIngredientFields(values);
    }
  };

  const handlePopulateIngredients = (recipe) => {
      setIngredientFields(isExistingRecipe({ name: recipe.name, ingredientList: recipe.ingredients }))
      setRecipeName(recipe.name);
  };

  return (
    <>
      <div className="popup">
      <form onSubmit={handleSubmit}>
      <Container fluid>
        <Row>
          <Col>
          </Col>
          {/* Change Recipe Name field to single column with max-width size */}
          <Col>
          <div>
          <RecipeSuggest
          id="type-recipe"
          token={loginToken}

          type="text"
          className="form-control text-center"
          placeholder="Recipe Name"
          value={recipeName}
          onChange2={(a_recipe) => handlePopulateIngredients(a_recipe)}
          onChange={(name_recipe) => setRecipeName(name_recipe)}
        />
        </div>
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
              <Row data-testid="fragment">
                <Col>
                  <div className= "form-group">
                    <p className= "recipe-input-label">
                      {index === 0  ? "Ingredient" : ""}
                    </p>
                    <MyAutosuggest
                      id="ingre1"
                      placeholder="Type ingredient"
                      value={ingredientField.name}
                      className="form-control text-center"
                      onChange={(value,possibleUnits) => handleInputChange(index, { target: { value: value, name: "name", possibleUnits: possibleUnits } })}
                    />
                  </div>
                </Col>
                <Col xs={3}>
                  <div className="form-group ">
                    <p className= "recipe-input-label">
                      {index === 0  ? "Qty" : ""}
                    </p>
                    <input
                      type="text"
                      className="form-control text-center"
                      placeholder="0"
                      id="qty"
                      name="amount"
                      value={ingredientField.amount}
                      onChange={event => handleInputChange(index, event)}
                    />
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="form-group ">
                    <p className= "recipe-input-label">
                      {index === 0  ? "Units" : ""}
                    </p>

                    <select name="unit" className="form-control text-center" value={ingredientField.unit} onChange={event => handleInputChange(index, event)}>
                      {ingredientField.possibleUnits.map(unit => <option key={unit} value={unit}>{unit}</option> )}
                      </select>
                  </div>
                </Col>

              </Row>
            </Fragment>
          ))}
        </div>

        <Row style={{'float': 'right'}}>
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={() => handleAddFields()}
          >
            Add Ingredient
          </button>
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={() => handleRemoveFields()}
          >
            Remove Ingredient
          </button>
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={cancelButtonClicked}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary mr-2"
            type="submit"
            onSubmit={handleSubmit}
          >
            { recipe._id ? "Update" : "Save"}
          </button>
        </Row>
        </Container>
      </form>
      </div>
    </>
  );
}

function spoonSearch(str) {
  return axios.get('https://api.spoonacular.com/food/ingredients/autocomplete',
    {
      params: {
        apiKey: "db254b5cd61744d39a2deebd9c361444",
        query: str,
        number: 50,
        metaInformation: true
      }
    }
  ).then((res) => {
    res.data = res.data.map((ing) => {
      ing.name = ing.name.toLowerCase();
      return ing;
    });

    res.data.sort((first, second) => {
      return first.name > second.name;
    });

    return res;
  });
}

export default RecipePopup;
