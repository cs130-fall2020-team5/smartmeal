import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import axios from 'axios';

import { UserProvider, UserContext } from "../context/user";
// import { MealPlanProvider } from "../context/mealplan";
// import { PopupProvider } from "../context/popup-context";
// import HomePage from "../routes/HomePage";
import Login from "../components/Login";
import Register from "../routes/Register";

var jwt = require('jsonwebtoken');

jest.mock('axios');

describe("login functionality and user context", () => {

    afterEach(cleanup);

    test("user can enter username and password and be authenticated", async () => {
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {/* consume the context to give us a way to make sure it correctly updated */}
                    { value => <span data-testid="isLoggedIn">{value.isLoggedIn ? "true" : "false"}</span>} 
                </UserContext.Consumer>
                <Login />
            </UserProvider>
        );

        let currentTime = new Date().getTime() / 1000; // seconds
        let expirationTime = currentTime + 60 * 60 * 2; // add 2 hours
        const token = jwt.sign({ exp: expirationTime, usr: 'smallberg', }, 'alskdfja;lksjdfa;lskdjf;alsjkdf', { header: { alg: "HS256", typ: "JWT", }, });
        axios.mockImplementationOnce(() =>
            Promise.resolve({ status: 200, data: { jwt: token } })
        );

        await waitFor(() => userEvent.click(screen.getByText('Login'), { button: 1 })) // left click to log in

        expect(screen.getByTestId("isLoggedIn").textContent).toBe("true")
    });

    test("unauthenticated user remains on login page and gets error message", async () => {
        render(
            <UserProvider>
                <Login />
                <UserContext.Consumer>
                    { value => <span data-testid="isLoggedIn">{value.isLoggedIn ? "true" : "false"}</span>}
                </UserContext.Consumer>
            </UserProvider>
        );

        axios.mockImplementationOnce(() =>
            Promise.reject()
        );

        await waitFor(() => userEvent.click(screen.getByText('Login'), { button: 1 })) // left click to log in

        expect(screen.getByText("Error: Failed to log in")).toBeInTheDocument();
        expect(screen.getByTestId("isLoggedIn").textContent).toBe("false")
    });

    test("can register a new account", async () => {
        render(
            <UserProvider>
                <Register />
                <UserContext.Consumer>
                    { value => <span data-testid="isLoggedIn">{value.isLoggedIn ? "true" : "false"}</span>}
                </UserContext.Consumer>
            </UserProvider>
        );

        axios.mockImplementationOnce(() =>
            Promise.resolve({ status: 200 })
        );

        await waitFor(() => userEvent.click(screen.getByText('Register'), { button: 1 })) // left click to log in

        expect(screen.getByText("Registered!")).toBeInTheDocument();
    });

    test("get an error message when registering with existing username", async () => {
        render(
            <UserProvider>
                <Register />
                <UserContext.Consumer>
                    { value => <span data-testid="isLoggedIn">{value.isLoggedIn ? "true" : "false"}</span>}
                </UserContext.Consumer>
            </UserProvider>
        );

        axios.mockImplementationOnce(() =>
            Promise.reject()
        );

        await waitFor(() => userEvent.click(screen.getByText('Register'), { button: 1 })) // left click to log in

        expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
});
