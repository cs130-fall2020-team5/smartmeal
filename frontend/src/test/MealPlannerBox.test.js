import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'

import { UserProvider } from "../context/user";
import { MealPlanProvider } from "../context/mealplan";
import { PopupProvider, PopupContext } from "../context/popup-context";
// import { MealPlanProvider } from "../context/mealplan";
// import { PopupProvider } from "../context/popup-context";
// import HomePage from "../routes/HomePage";
import MealPeriodBox from "../components/MealPeriodBox";

jest.mock('axios');

describe("meal planner box component", () => {

    afterEach(cleanup);

    test("click + button to trigger popup context to open recipe popup", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanProvider>
                        <MealPeriodBox day="monday" time="breakfast" meals={ sample_mealplans[0].monday.breakfast }/>
                        <PopupContext.Consumer>
                            { value => 
                                <>
                                    <span data-testid="showRecipePopup">{value.showRecipePopup ? "true" : "false"}</span>
                                    <span data-testid="popupDay">{value.popupDay}</span>
                                    <span data-testid="popupTime">{value.popupTime}</span>
                                </>
                            }
                        </PopupContext.Consumer>
                    </MealPlanProvider>
                </UserProvider>
            </PopupProvider>
        );

        const plusButton = screen.getByText("+");
        expect(plusButton).toBeInTheDocument();
        await waitFor(() => userEvent.click(plusButton, { button: 1 }));
        expect(screen.getByTestId("showRecipePopup").textContent).toEqual("true");
        expect(screen.getByTestId("popupDay").textContent).toEqual("monday");
        expect(screen.getByTestId("popupTime").textContent).toEqual("breakfast");
    });

    test("click existing recipe autopopulates popup context", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanProvider>
                        <MealPeriodBox day="monday" time="breakfast" meals={ sample_mealplans[0].monday.breakfast }/>
                        <PopupContext.Consumer>
                            { value => 
                                <>
                                    <span data-testid="recipeInfo">{JSON.stringify(value.recipeInfo)}</span>
                                </>
                            }
                        </PopupContext.Consumer>
                    </MealPlanProvider>
                </UserProvider>
            </PopupProvider>
        );

        const mealButton = screen.getByText(sample_mealplans[0].monday.breakfast[0].name);
        expect(mealButton).toBeInTheDocument();
        await waitFor(() => userEvent.click(mealButton, { button: 1 }));
        expect(screen.getByTestId("recipeInfo").textContent).toEqual(JSON.stringify(sample_mealplans[0].monday.breakfast[0]))
    });

    test("always render + button even if no recipes", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanProvider>
                        <MealPeriodBox day="monday" time="breakfast" meals={ [] }/>
                        <PopupContext.Consumer>
                            { value => 
                                <>
                                    <span data-testid="recipeInfo">{JSON.stringify(value.recipeInfo)}</span>
                                </>
                            }
                        </PopupContext.Consumer>
                    </MealPlanProvider>
                </UserProvider>
            </PopupProvider>
        );

        const mealButton = screen.getByText("+");
        expect(mealButton).toBeInTheDocument();
    });
});

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
