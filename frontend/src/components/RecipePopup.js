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
/**
  * This function escapes regex escapeRegexCharacters
  * @param { string } str the string to escape
  * @returns { string } escaped string
*/
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
  * This function calls spoonSearch to get a list of suggestions for the input string
  * @param { string } value the string to be autocompleted
  * @returns { string[] } array of suggestions
*/
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

/**
  * This function takes returns the 'name' attribute of a data structure
  * @param { object } suggestion object that holds suggestion data
  * @returns { string } the name within the suggestion object
*/
function getSuggestionValue(suggestion) {
  return suggestion.name;
}

/**
  * This function displays a suggestion's name within a 'span' tag
  * @param { object } suggestion object that holds suggestion data
  * @returns { object } span tagged suggestion name
*/
function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

/**
  * This function checks the backend database for existing recipes partially matching the
  * input value.
  * @param { string } value string to be matched with the database
  * @param { string } token authorization token for backend get request
  * @returns { object[] } array of suggested recipes from the backend
*/
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

/**
  * @class
*/
class RecipeSuggest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value,
      suggestions: []
    };
  }

  /**
    * This function detects when the value of an input element changes
    * @param { object } event current state
    * @param { object } obj
    * @param { string } obj.newValue the changed value of element
    * @param { string } obj.method method of axios HTTP request
  */
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

  /**
    * This function signals when suggestions should update
    * @param { object } obj
    * @param { object } obj.value target string to provide suggestions for
  */
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

  /**
    * This function is called every time suggestions need to be cleared.
  */
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

/**
  * @class
*/
class MyAutosuggest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value,
      suggestions: []
    };
  }

  /**
    * This function detects when the value of an input element changes
    * @param { object } event current state
    * @param { object } obj
    * @param { string } obj.newValue the changed value of element
    * @param { string } obj.method method of axios HTTP request
  */
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

  /**
    * This function signals when suggestions should update
    * @param { object } obj
    * @param { object } obj.value target string to provide suggestions for
  */
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

  /**
    * This function is called every time suggestions need to be cleared.
  */
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

/**
  * This function displays the Recipe Popup and provides the
  * necessary functionality to save the recipe information to the backend.
  * @param { object } obj
  * @param { object } obj.recipe A data structure of a recipe containing the recipies
  * @param { string } obj.recipe.name The name of the input recipe
  * @param { object[] } obj.recipe.ingredientList array of ingredients for recipe
  * @returns { JSX } HTML of Recipe Popup
*/
const RecipePopup = ( {recipe} ) => {

  const { loginToken } = useContext(UserContext);

  const { saveButtonClicked, cancelButtonClicked } = useContext(PopupContext);
  const { updateCurrentMealPlan } = useContext(MealPlanContext);
  const { removeMeal } = useContext(MealPlanContext);

  /**
    *Determines whether the input is an existing meal from the meal plan.
    * @param { object } recipe a data structure of a recipe containing the recipies
    * @param { string } recipe.name The name of the input recipe
    * @param { object[] } recipe.ingredientList array of ingredients for recipe
    * @returns { ingredientList } list of ingredients
    * If the input exists, the list is populated with each ingredient's properties
    * If the input does not exist, a single empty ingredient is returned.
    * @memberof RecipePopup
    * @inner
  */
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

  /**
    * Fetches the nutritional information for all ingredients in a recipe
    * @param { object } recipe a data structure of a recipe containing the recipies
    * @param { string } recipe.name The name of the input recipe
    * @param { object[] } recipe.ingredientList array of ingredients for recipe
    * @returns { dictionary } dictionary with ingredients mapped to nutrion facts
    * @memberof RecipePopup
    * @inner
  */
  const getNutrientInfo = ( recipe ) => {
    let nutInfo = {}
    if (recipe.name !== ""){
      const ingredientList = recipe.ingredientList
      if (ingredientList && ingredientList.length >= 1){
        for (const ingredient of ingredientList){
          nutInfo[ingredient.name] = { protein: ingredient.protein, fat: ingredient.fat, price: ingredient.price, calories: ingredient.calories };
        }
      }
    }
    return nutInfo;
  }

  const [ingredientFields, setIngredientFields] = useState(isExistingRecipe(recipe));
  const [nutritionInfo, setNutritionInfo] = useState(getNutrientInfo(recipe));

  const [recipeName, setRecipeName] = useState(recipe.name);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
    *This function updates the backend with new or updated data for a recipe.
    * @param { string } recipe_id Identifier for a recipe
    * @param { string } recipe_name The name of the current recipe
    * @param { object[] } ingredient_list List of ingredients for recipe
    * @memberof RecipePopup
    * @inner
  */
  async function updateMealplan(recipe_id, recipe_name, ingredient_list){
    const isExistingRecipe = recipe_id ? true : false;
    let recipe_ingredients = await populateIngredientFields(ingredient_list);
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

  /**
    * This function checks if the recipe name is already saved in the database and
    * avoids saving multiple recipes with the same name before saving to the database.
    * @param { string } recipe_name The name of the current recipe
    * @param { object[] } ingredient_list List of ingredients for current recipe
    * @memberof RecipePopup
    * @inner
  */
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

  /**
    * This function is called when a user clicks the 'Update' or 'Save' button.
    * It calls saveRecipe to save data in the backend, and then calls saveButtonClicked
    * to close the popup.
    * @param { object } e Current state of HTML element
    * @memberof RecipePopup
    * @inner
  */
  const handleSubmit = e => {
    e.preventDefault();
    if (recipeName === "") {
      setErrorMessage("All recipes must have a name");
      return;
    }
    if (ingredientFields.length === 1 && ingredientFields[0].name === "") {
      setErrorMessage("All recipes must have at least 1 ingredient");
      return;
    }
    saveRecipe(recipeName, ingredientFields);
    saveButtonClicked();
  };

  /**
    * This function is called whenever an ingredient field is changed.
    * The function determines what object is being modified and updates the list
    * of ingredient fields to include the input change.
    * @param { number } index The index of the ingredientField in ingredientFields
    * @param { object } event Current state of HTML element
    * @memberof RecipePopup
    * @inner
  */
  const handleInputChange = (index, event) => {
    const values = [...ingredientFields];
    if (event.target.name === "name") {
      values[index].name = event.target.value;
      values[index].possibleUnits=event.target.possibleUnits;
      values[index].unit = event.target.possibleUnits[0];
      setErrorMessage("");
    } else if (event.target.name === "amount") {
      values[index].amount = event.target.value;
    } else if (event.target.name === "unit") {
      values[index].unit = event.target.value;
    }
    setIngredientFields(values);
  };

  /**
    * This function is called when the user clicks the Add button to add another
    * row of ingredient fields.
    * The function pushes an empty ingredientField object onto the ingredientFields list.
    * @memberof RecipePopup
    * @inner
  */
  const handleAddFields = () => {
    setErrorMessage("");
    if (ingredientFields.length >= 10) {
      alert("Too many ingredients for this meal!")
      return;
    };
    const values = [...ingredientFields];
    values.push({ name:'', amount:'', unit:'',possibleUnits:[] });
    setIngredientFields(values);
  };


  /**
    * This function is called when the user clicks the Remove button to remove
    * the lowest row of ingredient fields.
    * The function pops an ingredientField object off the ingredientFields list.
    * @memberof RecipePopup
    * @inner
  */
  const handleRemoveFields = () => {
    const values = [...ingredientFields];
    if (values.length > 1) {
      values.pop();
      setIngredientFields(values);
    }
  };

  /**
    * This function is called when the user modifies the Recipe Name textbox.
    * The ingredientFields data structure is set to the return of the isExistingRecipe function.
    * The recipeName string is set to recipe.name.
    * @param { object } recipe a data structure of a recipe containing the recipies
    * @param { string } recipe.name The name of the input recipe
    * @param { object[] } recipe.ingredientList List of ingredients for recipe
    * @memberof RecipePopup
    * @inner
  */
  const handlePopulateIngredients = (recipe) => {
      setIngredientFields(isExistingRecipe({ name: recipe.name, ingredientList: recipe.ingredients }))
      setNutritionInfo(getNutrientInfo({ name: recipe.name, ingredientList: recipe.ingredients }))
      setRecipeName(recipe.name);
  };

  /**
    * This function is called when the user clicks the Delete Meal button to remove
    * the recipe from the weekly meal plan.
    * The removeMeal function is called to locate and remove the recipe from the meal plan.
    * The cancelButtonClicked function is called to close the popup without saving.
    * @memberof RecipePopup
    * @inner
  */
  const handleDeleteMeal = () => {
    removeMeal(recipe._id);
    cancelButtonClicked();
  }

  /**
    *This function gets ingredient info for each ingredient
    * @param { object[] } ingredientList array of ingredients for the recipe
    * @param { string } ingredientList[].name name of the ingredient
    * @param { number } ingredientList[].amount pricing of ingredient
    * @param { string } ingredientList[].unit type of units for ingredient
    * @param { string[] } ingredientList[].possibleUnits array of possible unit types for
    * the ingredient
    * @returns { object[] } array of jSON objects that represent ingredient data
    * @memberof RecipePopup
    * @inner
  */
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

  /**
    * This function is the wrapper function for queries to spoonacular.
    * The function calls the doSearch and getInfo functions.
    * @param { string } iname name of ingredient
    * @param { number } amount numeric quantity of ingredient
    * @param { string } unit unit of mearsurement for the ingredient
    * @returns { object } data structure that contains the specified ingredient's
    * price, fat, calories, and protein.
    * @memberof RecipePopup
    * @inner
  */
  function getIngredientInfo(iname, amount, unit){
    if (nutritionInfo[iname]) { // avoid querying spoonacular if we already have nutrition information saved
      return {"price": nutritionInfo[iname].price, "fat": nutritionInfo[iname].fat, "calories": nutritionInfo[iname].calories, "protein": nutritionInfo[iname].protein}
    }
    // get id of ingredient with exact name match
    return doSearch(iname)
    .then(search_res => {
      const isIngredient = (elt) => elt.name === iname;
      let index = search_res.data.results.findIndex(isIngredient);
      if(index === -1)
        throw Error("Ingredient not found");
      let ing_id = search_res.data.results[index].id;

      // get the basic pricing and nutrition info
      return getInfo(ing_id, amount, unit)
      .then(res => {
        let price = res.data.estimatedCost.unit === "US Cents" ? (res.data.estimatedCost.value/100) : res.data.estimatedCost.value;
        const findNutrition = (title) => (elt) => elt.title === title;

        let fat_index = res.data.nutrition.nutrients.findIndex(findNutrition("Fat"));
        if(fat_index === -1)
          throw Error("Fat not found");
        let fat = res.data.nutrition.nutrients[fat_index].amount;

        let cal_index = res.data.nutrition.nutrients.findIndex(findNutrition("Calories"));
        if(cal_index === -1)
          throw Error("Calories not found");
        let calories = res.data.nutrition.nutrients[cal_index].amount;

        let pro_index = res.data.nutrition.nutrients.findIndex(findNutrition("Protein"));
        if(pro_index === -1)
          throw Error("Protein not found");
        let protein = res.data.nutrition.nutrients[pro_index].amount;

        return {"price": price, "fat": fat, "calories": calories, "protein": protein};
      })
      .catch(err => console.log("Error getting ingredient info"));
    })
    .catch(err => console.log("Error with search query"));
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
          onChange={(name_recipe) => { setRecipeName(name_recipe); setErrorMessage(null); } }
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
        <Row>
          <p style={{ "color": "red", "display": `${ errorMessage ? "block" : "none"}`}}>{errorMessage}</p>
        </Row>
        </Container>
      </form>
      </div>
    </>
  );
}


const api_key = "db254b5cd61744d39a2deebd9c361444";
// 4119fc6a6de3413cbfc379525c7d4e2a - axel
// db254b5cd61744d39a2deebd9c361444 - current
// c25140a9d4a94ed2b11bddd00a30b486 - john

/**
  * This function performs a get request that queries the Spoonacular API for ingredients
  * with the name: of the input parameter.
  * @param { string } iname name of ingredient
  * @returns { object } response object for the query
*/
function doSearch(iname){
  return axios.get("https://api.spoonacular.com/food/ingredients/search",
    {
      params: {
        apiKey: api_key,
        query: iname
      }
    }).then(res => res);
}

/**
  * This function performs a get request that queries the Spoonacular API for nutrition information
  * of a particular ingredient ID.
  * @param { string } ing_id ID of ingredient
  * @param { number } amount numeric quantity of ingredient
  * @param { string } unit unit of mearsurement for the ingredient
  * @returns { object } response object for the query
*/
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

  /**
    * This function combines two jSON objects.
    * @param { object } j1 first jSON object to combine
    * @param { object } j2 second jSON object to combine
    * @returns { object } combined jSon object consisting of j1+j2
  */
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

/**
  * This function queries the spoonacular API for auto-complete suggestions.
  * @param { string } str string that needs autocomplete suggestions
  * @returns { object } data structure of auto-complete suggestions
*/
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
