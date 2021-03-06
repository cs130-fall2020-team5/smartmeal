import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'

import { UserProvider } from "../context/user";
import { MealPlanProvider } from "../context/mealplan";
import { PopupProvider } from "../context/popup-context";
// import { MealPlanProvider } from "../context/mealplan";
// import { PopupProvider } from "../context/popup-context";
// import HomePage from "../routes/HomePage";
import RecipePopup from "../components/RecipePopup";

jest.mock('axios');

describe("recipe popup component", () => {

    afterEach(cleanup);

    function wrapProviders(children) {
      return render(
        <PopupProvider>
            <UserProvider>
                <MealPlanProvider>
                    { children }
                </MealPlanProvider>
            </UserProvider>
        </PopupProvider>
      );
    }

    test("renders correctly with no recipe", async () => {
        wrapProviders( <RecipePopup recipe={ { name: '', ingredientList: [] } }  /> )

        expect(screen.getAllByTestId("fragment").length).toBe(1);
        expect(screen.getByText("Save")).toBeInTheDocument(); 
    });

    test("able to add a new ingredient", async () => {
        wrapProviders( <RecipePopup recipe={ { name: '', ingredientList: [] } }  /> )

        await waitFor(() => { userEvent.click(screen.getByText("Add"), { button: 1 }); });
        expect(screen.getAllByTestId("fragment").length).toBe(2); 
    });

    test("able to remove the bottom ingredient", async () => {
        wrapProviders( <RecipePopup recipe={ { name: '', ingredientList: [] } }  /> )

        await waitFor(() => { userEvent.click(screen.getByText("Add"), { button: 1 }); });
        expect(screen.getAllByTestId("fragment").length).toBe(2); 

        await waitFor(() => { userEvent.click(screen.getByText("Remove"), { button: 1 }); });
        expect(screen.getAllByTestId("fragment").length).toBe(1); 
    });

    test("cannot remove the last element", async () => {
        wrapProviders( <RecipePopup recipe={ { name: '', ingredientList: [] } }  /> )

        await waitFor(() => { userEvent.click(screen.getByText("Remove"), { button: 1 }); });
        expect(screen.getAllByTestId("fragment").length).toBe(1); 
    });

    test("renders correctly with existing recipe", async () => {
        wrapProviders( <RecipePopup recipe={ sample_mealplans[0].monday.breakfast[0] }  /> )

        expect(screen.getAllByTestId("fragment").length).toBe(3); 
        expect(screen.getByDisplayValue("hamburgers")).toBeInTheDocument();
        expect(screen.getByDisplayValue("meat")).toBeInTheDocument();
        expect(screen.getByDisplayValue("bread")).toBeInTheDocument();
        expect(screen.getByDisplayValue("mustard")).toBeInTheDocument();
        expect(screen.getByText("Update")).toBeInTheDocument();
    });
});

// eslint-disable-next-line no-unused-vars
const sample_mealplans = [
    {
      "_id": "5fc309bb2d42f4d58ff4a84c",
      "username": "axel",
      "date": 1606790331505,
      "sunday": {
        "breakfast": [],
        "lunch": [],
        "dinner": []
      },
      "monday": {
        "breakfast": [
          {
            "name": "hamburgers",
            "ingredientList": [
              {
                "name": "meat",
                "amount": "3",
                "unit": "oz",
                "possibleUnits": [
                  "unit",
                  "piece",
                  "g",
                  "oz",
                  "breast",
                  "cup",
                  "serving"
                ],
                "checked": false
              },
              {
                "name": "bread",
                "amount": "1324",
                "unit": "g",
                "possibleUnits": [
                  "piece",
                  "slice",
                  "g",
                  "ounce",
                  "loaf",
                  "oz",
                  "serving"
                ],
                "checked": false
              },
              {
                "name": "mustard",
                "amount": "3",
                "unit": "oz",
                "possibleUnits": [
                  "g",
                  "oz",
                  "teaspoon",
                  "cup",
                  "serving",
                  "tablespoon"
                ],
                "checked": false
              }
            ],
            "_id": "5fc309da2d42f4d58ff4a84d"
          }
        ],
        "lunch": [],
        "dinner": []
      },
      "tuesday": {
        "breakfast": [],
        "lunch": [],
        "dinner": []
      },
      "wednesday": {
        "breakfast": [
          {
            "name": "sandwich",
            "ingredientList": [
              {
                "name": "meat",
                "amount": "1",
                "unit": "breast",
                "possibleUnits": [
                  "unit",
                  "piece",
                  "g",
                  "oz",
                  "breast",
                  "cup",
                  "serving"
                ],
                "checked": false
              }
            ],
            "_id": "5fc309f82d42f4d58ff4a84e"
          }
        ],
        "lunch": [],
        "dinner": []
      },
      "thursday": {
        "breakfast": [
          {
            "name": "TEST",
            "ingredientList": [
              {
                "name": "fettuccine",
                "amount": "3",
                "unit": "bag",
                "possibleUnits": [
                  "package",
                  "g",
                  "bag",
                  "box",
                  "oz",
                  "serving"
                ]
              }
            ],
            "_id": "5fc30b1c2d42f4d58ff4a84f"
          },
          {
            "name": "TEST2",
            "ingredientList": [
              {
                "name": "bean coffee",
                "amount": "3",
                "unit": "oz",
                "possibleUnits": [
                  "piece",
                  "g",
                  "oz",
                  "bean",
                  "cup"
                ],
                "checked": false
              }
            ],
            "_id": "5fc4325440a569e2151c4034"
          }
        ],
        "lunch": [],
        "dinner": []
      },
      "friday": {
        "breakfast": [
          {
            "name": "My recipe",
            "ingredientList": [
              {
                "name": "bean sprouts",
                "amount": "3",
                "unit": "cup",
                "possibleUnits": [
                  "package",
                  "g",
                  "oz",
                  "cup"
                ]
              },
              {
                "name": "noodle",
                "amount": "123",
                "unit": "serving",
                "possibleUnits": [
                  "square",
                  "package",
                  "piece",
                  "g",
                  "bag",
                  "ounce",
                  "box",
                  "sheet",
                  "nest",
                  "oz",
                  "cup",
                  "serving"
                ]
              }
            ],
            "_id": "5fc437f440a569e2151c4035"
          }
        ],
        "lunch": [],
        "dinner": []
      },
      "saturday": {
        "breakfast": [],
        "lunch": [],
        "dinner": []
      }
    }
  ]
