import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from 'axios';

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
                    <MealPlanContext.Provider value={{ currentPlan: sample_mealplans[0], updateMealPlanMetadata: jest.fn() }} >
                        {children}
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );
    }

    test("renders correct information", async () => {
        wrapProviders(<MealPlanner />);

        expect(screen.getByText("hamburgers")).toBeInTheDocument();
        expect(screen.getByText("sandwich")).toBeInTheDocument();
        expect(screen.getByText("TEST")).toBeInTheDocument();
        expect(screen.getByText("TEST2")).toBeInTheDocument();
        expect(screen.getByText("My recipe")).toBeInTheDocument();
    });

    test("renders nothing when there is no meal plan to show", async () => {
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanContext.Provider value={{ currentPlan: null, updateMealPlanMetadata: jest.fn() }} >
                        <MealPlanner />
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );

        expect(screen.queryByText("hamburgers")).toBeNull();
        expect(screen.queryByText("sandwich")).toBeNull();
        expect(screen.queryByText("TEST")).toBeNull();
        expect(screen.queryByText("TEST2")).toBeNull();
        expect(screen.queryByText("My recipe")).toBeNull();
    });

    test("correctly orders the days", async () => {
        wrapProviders(<MealPlanner />);

        const dayLabels = screen.getAllByTestId("day-label");
        expect(dayLabels.length).toEqual(7);
        expect(dayLabels[0].textContent).toEqual("Wednesday");
        expect(dayLabels[1].textContent).toEqual("Thursday");
        expect(dayLabels[2].textContent).toEqual("Friday");
        expect(dayLabels[3].textContent).toEqual("Saturday");
        expect(dayLabels[4].textContent).toEqual("Sunday");
        expect(dayLabels[5].textContent).toEqual("Monday");
        expect(dayLabels[6].textContent).toEqual("Tuesday");
    });

    test("can change meal plan name/start day by entering info and clicking save", async () => {

        const updateString = "testing string"
        const updateMealPlanFn = jest.fn((name, startday) => {
            expect(name).toEqual("test-name" + updateString)
            expect(startday).toEqual("saturday");
        });
        render(
            <PopupProvider>
                <UserProvider>
                    <MealPlanContext.Provider value={{ currentPlan: sample_mealplans[0], updateMealPlanMetadata: updateMealPlanFn }} >
                        <MealPlanner />
                    </MealPlanContext.Provider>
                </UserProvider>
            </PopupProvider>
        );

        axios.mockImplementation(() => {
            Promise.resolve(sample_mealplans)
        })

        const updateMpButton = screen.getByText("Save Meal Plan");
        const mpNameTextbox = screen.getByTestId("mealplan-name");
        const mpStartdayTextbox = screen.getByTestId("mealplan-startday");

        await userEvent.type(mpNameTextbox, updateString);
        await userEvent.selectOptions(mpStartdayTextbox, "Saturday");
        await waitFor(() => { userEvent.click(updateMpButton, { button: 1 })});

        expect(updateMealPlanFn.mock.calls.length).toEqual(1);
    });

    test("can click button to open/close grocery list", async () => {
        wrapProviders(<MealPlanner />);

        global.scrollTo = jest.fn();
        await waitFor(() => { userEvent.click(screen.getByText("Grocery List"), { button: 1 }) }); // open
        expect(screen.getByText("Add Custom Ingredient")).toBeInTheDocument(); // ensure grocery list now prsent

        await waitFor(() => { userEvent.click(screen.getAllByText("Grocery List")[1], { button: 1 }) }); // close
        expect(screen.queryByText("Add Custom Ingredient")).toBeNull(); // ensure grocery list not present
    });

    test("can click button to open/close weekly totals", async () => {
        wrapProviders(<MealPlanner />);

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
        startday: "wednesday",
        name: "test-name",
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
