import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const SESSION_JWT = "SESSION_JWT";

const UserContext = createContext();

/**
  * Creates a UserContext to store data relating to user login sessions.
  * Triggers rerenders with latest context value passed to the provider
  * @param { object } obj
  * @param { object } obj.children child components to be rendered in the DOM below the provider
  * @returns { object } returns a context provider for user login
*/
function UserProvider({ children }) {
    const [ loginToken, setLoginToken ] = useState(localStorage.getItem(SESSION_JWT) || "");
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    /**
      * Observer hook that is called to update the user's login state whenever their login token changes.
      * @memberof UserProvider
      * @inner
    */
    useEffect(() => {
        if (loginToken) {
            if (new Date(jwt.decode(loginToken).exp * 1000) > new Date()) {
                localStorage.setItem(SESSION_JWT, loginToken);
                setIsLoggedIn(true);
            } else {
                localStorage.removeItem(SESSION_JWT);
                setIsLoggedIn(false);
            }
        }
    }, [ loginToken ])

    /**
      * Verify a username and password with a POST request. If the verfication is successful,
      * set the user's login token with SESSION_JWT. Otherwise notify user that log in has failed.
      * @param { string } username username input by the user
      * @param { string } password password input by the user
      * @memberof UserProvider
      * @inner
    */
    function attemptLogin(username, password) {
        // attempt to login
        axios({
                method: "POST",
                url: 'http://localhost:3000/users/login',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    username: username,
                    password: password
                }
            })
            .then(res => {
                if (res.status === 200 && res.data && res.data.jwt) {
                    setLoginToken(res.data.jwt);
                }
            })
            .catch(err => {
                setErrorMessage("Failed to log in");
                setIsLoggedIn(false);
                // console.log(err);
            })
    }

    /**
      * Register a new user with a POST request. If the verfication is successful,
      * notify the user that they are registered. Otherwise notify user, that the username already exists.
      * @param { string } username username input by the user
      * @param { string } password password input by the user
      * @memberof UserProvider
      * @inner
    */
    function attemptRegister(username, password) {
        // attempt to register
        axios({
                method: "POST",
                url: 'http://localhost:3000/users/new',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    username: username,
                    password: password
                }
            })
            .then(res => {
                if (res.status === 200) {
                    setErrorMessage("Registered!");
                }
            })
            .catch(err => {
                setErrorMessage("Username already exists");
                // console.log(err);
            })
    }

    return (
        <UserContext.Provider value={{isLoggedIn, errorMessage, attemptLogin, attemptRegister, loginToken}} >
            { children }
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }
