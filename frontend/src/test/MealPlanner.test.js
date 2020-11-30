import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { UserProvider } from "../context/user";
import { MealPlanContext } from "../context/mealplan";
import { PopupProvider } from "../context/popup-context";
// import { MealPlanProvider } from "../context/mealplan";
// import { PopupProvider } from "../context/popup-context";
// import HomePage from "../routes/HomePage";
import MealPlanner from "../components/MealPlanner";

jest.mock("axios");
window.scrollTo = jest.fn();

describe("meal planner component", () => {
    afterEach(cleanup);

    function wrapProviders(children) {
        return render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanContext.Provider value={{ currentPlan: sample_mealplans[0] }}>
                        {children}
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );
    }

    test("renders correctly", async () => {
        wrapProviders(<MealPlanner />);

        expect(screen.getByText("hamburgers")).toBeInTheDocument();
        expect(screen.getByText("sandwich")).toBeInTheDocument();
        expect(screen.getByText("TEST")).toBeInTheDocument();
        expect(screen.getByText("TEST2")).toBeInTheDocument();
        expect(screen.getByText("My recipe")).toBeInTheDocument();
    });

    test("can click button to open/close grocery list", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanContext.Provider value={{ currentPlan: sample_mealplans[0] }}>
                        {/* <MealPlanContext.Provider > */}
                            <MealPlanner />
                        {/* </MealPlanContext.Provider> */}
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );

        global.scrollTo = jest.fn();
        await waitFor(() => { userEvent.click(screen.getByText("Grocery List"), { button: 1 }) }); // open
        expect(screen.getByText("Add Custom Ingredient")).toBeInTheDocument(); // ensure grocery list now prsent

        await waitFor(() => { userEvent.click(screen.getAllByText("Grocery List")[1], { button: 1 }) }); // close
        expect(screen.queryByText("Add Custom Ingredient")).toBeNull(); // ensure grocery list not present
    });
    test("can click button to open/close weekly totals", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanContext.Provider value={{ currentPlan: sample_mealplans[0] }}>
                        {/* <MealPlanContext.Provider > */}
                            <MealPlanner />
                        {/* </MealPlanContext.Provider> */}
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );

        global.scrollTo = jest.fn();
        await waitFor(() => { userEvent.click(screen.getByText("Weekly Totals"), { button: 1 }) });
        expect(screen.getByTestId("weekly-totals-popup")).toBeInTheDocument(); // ensure weekly totals now prsent

        await waitFor(() => { userEvent.click(screen.getByText("Weekly Totals"), { button: 1 }) });
        expect(screen.queryByTestId("weekly-totals-popup")).toBeNull(); // ensure weekly totals now not present
    });
});

// eslint-disable-next-line no-unused-vars
const sample_mealplans = [
    {
        _id: "5fc309bb2d42f4d58ff4a84c",
        username: "axel",
        date: 1606790331505,
        customIngredients: [],
        sunday: {
            breakfast: [],
            lunch: [],
            dinner: [],
        },
        monday: {
            breakfast: [
                {
                    name: "hamburgers",
                    ingredientList: [
                        {
                            name: "meat",
                            amount: "3",
                            unit: "oz",
                            possibleUnits: [
                                "unit",
                                "piece",
                                "g",
                                "oz",
                                "breast",
                                "cup",
                                "serving",
                            ],
                            checked: false,
                        },
                        {
                            name: "bread",
                            amount: "1324",
                            unit: "g",
                            possibleUnits: [
                                "piece",
                                "slice",
                                "g",
                                "ounce",
                                "loaf",
                                "oz",
                                "serving",
                            ],
                            checked: false,
                        },
                        {
                            name: "mustard",
                            amount: "3",
                            unit: "oz",
                            possibleUnits: [
                                "g",
                                "oz",
                                "teaspoon",
                                "cup",
                                "serving",
                                "tablespoon",
                            ],
                            checked: false,
                        },
                    ],
                    _id: "5fc309da2d42f4d58ff4a84d",
                },
            ],
            lunch: [],
            dinner: [],
        },
        tuesday: {
            breakfast: [],
            lunch: [],
            dinner: [],
        },
        wednesday: {
            breakfast: [
                {
                    name: "sandwich",
                    ingredientList: [
                        {
                            name: "meat",
                            amount: "1",
                            unit: "breast",
                            possibleUnits: [
                                "unit",
                                "piece",
                                "g",
                                "oz",
                                "breast",
                                "cup",
                                "serving",
                            ],
                            checked: false,
                        },
                    ],
                    _id: "5fc309f82d42f4d58ff4a84e",
                },
            ],
            lunch: [],
            dinner: [],
        },
        thursday: {
            breakfast: [
                {
                    name: "TEST",
                    ingredientList: [
                        {
                            name: "fettuccine",
                            amount: "3",
                            unit: "bag",
                            possibleUnits: [
                                "package",
                                "g",
                                "bag",
                                "box",
                                "oz",
                                "serving",
                            ],
                        },
                    ],
                    _id: "5fc30b1c2d42f4d58ff4a84f",
                },
                {
                    name: "TEST2",
                    ingredientList: [
                        {
                            name: "bean coffee",
                            amount: "3",
                            unit: "oz",
                            possibleUnits: ["piece", "g", "oz", "bean", "cup"],
                            checked: false,
                        },
                    ],
                    _id: "5fc4325440a569e2151c4034",
                },
            ],
            lunch: [],
            dinner: [],
        },
        friday: {
            breakfast: [
                {
                    name: "My recipe",
                    ingredientList: [
                        {
                            name: "bean sprouts",
                            amount: "3",
                            unit: "cup",
                            possibleUnits: ["package", "g", "oz", "cup"],
                        },
                        {
                            name: "noodle",
                            amount: "123",
                            unit: "serving",
                            possibleUnits: [
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
                                "serving",
                            ],
                        },
                    ],
                    _id: "5fc437f440a569e2151c4035",
                },
            ],
            lunch: [],
            dinner: [],
        },
        saturday: {
            breakfast: [],
            lunch: [],
            dinner: [],
        },
    },
];
