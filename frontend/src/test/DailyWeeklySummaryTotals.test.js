import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom'

import { UserProvider } from "../context/user";
import { MealPlanProvider } from "../context/mealplan";
import { PopupProvider } from "../context/popup-context";
// import { MealPlanProvider } from "../context/mealplan";
// import { PopupProvider } from "../context/popup-context";
// import HomePage from "../routes/HomePage";
import DailySummary from "../components/DailySummary";
import WeeklyTotals from "../components/WeeklyTotals";

jest.mock('axios');

describe("nutrition summary components", () => {

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

    test("daily summary contains expected values", async () => {
        wrapProviders( <DailySummary day={ sample_mealplans[0].monday }/>)

        expect(screen.getByText(/^Calories: /).textContent).toEqual("Calories: 30");
        expect(screen.getByText(/^Protein: /).textContent).toEqual("Protein: 15");
        expect(screen.getByText(/^Fat: /).textContent).toEqual("Fat: 6");
        expect(screen.getByText(/^Price: /).textContent).toEqual("Price: $3.50");
    });

    test("daily summary correctly handles missing values", async () => {
        wrapProviders( <DailySummary day={ sample_mealplans[0].tuesday }/>)

        expect(screen.getByText(/^Calories: /).textContent).toEqual("Calories: 0");
        expect(screen.getByText(/^Protein: /).textContent).toEqual("Protein: 0");
        expect(screen.getByText(/^Fat: /).textContent).toEqual("Fat: 0");
        expect(screen.getByText(/^Price: /).textContent).toEqual("Price: $0.00");
    });

    test("weekly summary contains expected values", async () => {
        wrapProviders( <WeeklyTotals mealPlan={ sample_mealplans[0] }/>)

        expect(screen.getByText(/^Calories: /).textContent).toEqual("Calories: 60");
        expect(screen.getByText(/^Protein: /).textContent).toEqual("Protein: 30");
        expect(screen.getByText(/^Fat: /).textContent).toEqual("Fat: 12");
        expect(screen.getByText(/^Price: /).textContent).toEqual("Price: $3.50");
    });

    test("weekly summary correctly handles missing values", async () => {
        const empty = { breakfast: [], lunch: [], dinner: [] };
        wrapProviders( <WeeklyTotals mealPlan={ { monday: empty, tuesday: empty, wednesday: empty, thursday: empty, friday: empty, saturday: empty, sunday: empty } }/>)

        expect(screen.getByText(/^Calories: /).textContent).toEqual("Calories: 0");
        expect(screen.getByText(/^Protein: /).textContent).toEqual("Protein: 0");
        expect(screen.getByText(/^Fat: /).textContent).toEqual("Fat: 0");
        expect(screen.getByText(/^Price: /).textContent).toEqual("Price: $0.00");
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
                "price": 2,
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
                "price": 1,
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
                "price": 0.5,
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
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
                "calories": 10,
                "protein": 5,
                "fat": 2,
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
