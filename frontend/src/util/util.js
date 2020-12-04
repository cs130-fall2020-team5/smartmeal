import axios from "axios";

/** @module util */

/**
 * This function queries the spoonacular API for auto-complete suggestions.
 * @param { string } str string that needs autocomplete suggestions
 * @returns { object } data structure of auto-complete suggestions
 * @memberof util
 * @inner
 */
export function spoonSearch(str) {
    return axios
        .get("https://api.spoonacular.com/food/ingredients/autocomplete", {
            params: {
                apiKey: process.env.REACT_APP_API_KEY,
                query: str,
                number: 50,
                metaInformation: true,
            },
        })
        .then((res) => {
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

/**
 * This function combines two jSON objects.
 * @param { object } j1 first jSON object to combine
 * @param { object } j2 second jSON object to combine
 * @returns { object } combined jSon object consisting of j1+j2
 * @memberof util
 * @inner
 */
export function combineJSON(j1, j2) {
    const result = {};
    let key;

    for (key in j1) {
        if (j1.hasOwnProperty(key)) {
            result[key] = j1[key];
        }
    }
    for (key in j2) {
        if (j2.hasOwnProperty(key)) {
            result[key] = j2[key];
        }
    }
    //console.log(result);
    return result;
}

/**
 * This function performs a get request that queries the Spoonacular API for nutrition information
 * of a particular ingredient ID.
 * @param { string } ing_id ID of ingredient
 * @param { number } amount numeric quantity of ingredient
 * @param { string } unit unit of mearsurement for the ingredient
 * @returns { object } response object for the query
 * @memberof util
 * @inner
 */
export function getInfo(ing_id, amount, unit) {
    return axios
        .get(
            "https://api.spoonacular.com/food/ingredients/" +
                ing_id +
                "/information",
            {
                params: {
                    apiKey: process.env.REACT_APP_API_KEY,
                    id: ing_id,
                    amount: amount,
                    unit: unit,
                },
            }
        )
        .then((res) => res);
}

/**
 * This function performs a get request that queries the Spoonacular API for ingredients
 * with the name: of the input parameter.
 * @param { string } iname name of ingredient
 * @returns { object } response object for the query
 * @memberof util
 * @inner
 */
export function doSearch(iname) {
    return axios
        .get("https://api.spoonacular.com/food/ingredients/search", {
            params: {
                apiKey: process.env.REACT_APP_API_KEY,
                query: iname,
            },
        })
        .then((res) => res);
}

/**
 * This function escapes regex escapeRegexCharacters
 * @param { string } str the string to escape
 * @returns { string } escaped string
 * @memberof util
 * @inner
 */
export function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * This function calls spoonSearch to get a list of suggestions for the input string
 * @param { string } value the string to be autocompleted
 * @returns { string[] } array of suggestions
 * @memberof util
 * @inner
 */
export function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
        return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return spoonSearch(value)
        .then((res) => {
            return res.data
                .filter((language) => regex.test(language.name))
                .slice(0, 5);
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
 * @memberof util
 * @inner
 */
export function getSuggestionValue(suggestion) {
    return suggestion.name;
}

/**
 * This function displays a suggestion's name within a 'span' tag
 * @param { object } suggestion object that holds suggestion data
 * @returns { object } span tagged suggestion name
 * @memberof util
 * @inner
 */
export function renderSuggestion(suggestion) {
    return <span>{suggestion.name}</span>;
}

/**
 * This function checks the backend database for existing recipes partially matching the
 * input value.
 * @param { string } value string to be matched with the database
 * @param { string } token authorization token for backend get request
 * @returns { object[] } array of suggested recipes from the backend
 * @memberof util
 * @inner
 */
export function recipeGetSuggestions(value, token) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
        return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    //console.log(loginToken);
    return axios({
        method: "GET",
        url: "http://localhost:3000/recipe/",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    })
        .then((res) => {
            //console.log(res.data.filter(each_recipe => regex.test(each_recipe.name)));
            return res.data.filter((each_recipe) =>
                regex.test(each_recipe.name)
            );
        })
        .catch((err) => {
            console.log("Failed to do recipe search: ", err);
            return [];
        });
}
