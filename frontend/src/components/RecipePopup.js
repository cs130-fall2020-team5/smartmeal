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
  const { removeMeal } = useContext(MealPlanContext);

  const isExistingRecipe = ( recipe ) => {
    const values = [];
    if (recipe.name !== ""){
      const ingredientList = recipe.ingredientList
      if (ingredientList && ingredientList.length >= 1){
        for (const ingredient of ingredientList){
          values.push({name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit, possibleUnits: ingredient.possibleUnits ? ingredient.possibleUnits : [] });
        }
      }
      else {
        values.push({name: '', qty:'', units:'', possibleUnits:[]});
      }
    }
    else {
        values.push({name: '', amount:'', unit:'', possibleUnits:[]});
    }
    return values;
  }

  const [ingredientFields, setIngredientFields] = useState(isExistingRecipe(recipe));

  const [recipeName, setRecipeName] = useState(recipe.name);

  async function updateMealplan(recipe_id, recipe_name, ingredient_list){
    const isExistingRecipe = recipe._id ? true : false;
    let recipe_ingredients = await populateIngredientFields(ingredient_list);
    //console.log(recipe_entry);
    axios({
        method: isExistingRecipe ? "PUT" : "POST",
        url: "http://localhost:3000/recipe/" + recipe_id,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + loginToken
        },
        data: {
          name: recipe_name,
          ingredients: recipe_ingredients
        }
      }).then((res) => {
        updateCurrentMealPlan({ name: recipe_name, ingredientList: recipe_ingredients, _id: isExistingRecipe ? recipe_id : res.data.id }, isExistingRecipe)
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
     var matched_recipe=res.data.filter(each_recipe => recipe_name===each_recipe.name);
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

  const handleDeleteMeal = () => {
    removeMeal(recipe._id);
    cancelButtonClicked();
  }

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
            Add
          </button>
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={() => handleRemoveFields()}
          >
            Remove
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
          <button
            className="btn btn-primary mr-2"
            type="button"
            onClick={handleDeleteMeal}
          >
            Delete Meal
          </button>
        </Row>
        </Container>
      </form>
      </div>
    </>
  );
}


const api_key = "db254b5cd61744d39a2deebd9c361444";

// gets ingredient info for each ingredient 
async function populateIngredientFields(ingredientList){
  let ilist = [];
  var i;
  for(i = 0; i < ingredientList.length; i++){
    let iname = ingredientList[i].name;
    let amount = ingredientList[i].amount;
    let unit = ingredientList[i].unit;
    let nutrition = await getIngredientInfo(iname, amount, unit);
    //console.log(nutrition);
    let ingredient = combineJSON(ingredientList[i], nutrition);
    //console.log("ingredient: " + JSON.stringify(ingredient));
    ilist.push(ingredient);
  }
  //console.log({name: name, ingredients: ilist});
  return ilist; //{name: name, ingredients: ilist};
}

// helper queries for getIngredientInfo
function doSearch(iname){
  return axios.get("https://api.spoonacular.com/food/ingredients/search",
    {
      params: {
        apiKey: api_key,
        query: iname
      }
    }).then(res => res);
}
function getInfo(ing_id, amount, unit){
  return axios.get("https://api.spoonacular.com/food/ingredients/" + ing_id + "/information", 
    {
      params: {
        apiKey: api_key,
        id: ing_id,
        amount: amount,
        unit: unit
      }
    }).then(res => res);
}

// queries spoonacular for ingredient info
function getIngredientInfo(iname, amount, unit){
  // get id of ingredient with exact name match
  return doSearch(iname)
  .then(search_res => {
    const isIngredient = (elt) => elt.name === iname;
    let index = search_res.data.results.findIndex(isIngredient);
    if(index === -1)
      throw "Ingredient not found";
    let ing_id = search_res.data.results[index].id;

    // get the basic pricing and nutrition info 
    return getInfo(ing_id, amount, unit)
    .then(res => {
      let price = res.data.estimatedCost.unit === "US Cents" ? (res.data.estimatedCost.value/100) : res.data.estimatedCost.value;
      const findNutrition = (title) => (elt) => elt.title === title;

      let fat_index = res.data.nutrition.nutrients.findIndex(findNutrition("Fat"));
      if(fat_index === -1)
        throw "Fat not found";
      let fat = res.data.nutrition.nutrients[fat_index].amount;

      let cal_index = res.data.nutrition.nutrients.findIndex(findNutrition("Calories"));
      if(cal_index === -1)
        throw "Calories not found";
      let calories = res.data.nutrition.nutrients[cal_index].amount;

      let pro_index = res.data.nutrition.nutrients.findIndex(findNutrition("Protein"));
      if(pro_index === -1)
        throw "Protein not found";
      let protein = res.data.nutrition.nutrients[pro_index].amount;

      return {"price": price, "fat": fat, "calories": calories, "protein": protein};
    })
    .catch(err => console.log("Error getting ingredient info"));
  })
  .catch(err => console.log("Error with search query"));
}

// combines two jSON objects
function combineJSON(j1, j2){
  const result = {};
  let key;

  for (key in j1) {
    if(j1.hasOwnProperty(key)){
      result[key] = j1[key];
    }
  }
  for (key in j2) {
    if(j2.hasOwnProperty(key)){
      result[key] = j2[key];
    }
  }
  //console.log(result);
  return result;
}

function spoonSearch(str) {
  return axios.get('https://api.spoonacular.com/food/ingredients/autocomplete',
    {
      params: {
        apiKey: api_key,
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
