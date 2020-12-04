import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const SESSION_JWT = "SESSION_JWT";

const UserContext = createContext();

/**
  * Creates a context provider and passes functions to it as its value
  * Triggers rerenders with latest context value passed to the provider
  * @param { object } obj
  * @param { object } obj.children functions to be used in the tree below the provider
  * @returns { object } returns a context provider for user login
*/
function UserProvider({ children }) {
    const [ loginToken, setLoginToken ] = useState(localStorage.getItem(SESSION_JWT) || "");
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    /**
      *
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
      * set the user's login token with SESSION_JWT. Otherwise notify user, that log in has failed.
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
      * Verify a username and password was registered with a POST request. If the verfication is successful,
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

    /**
      * Test that requests to the backend are working
      * @memberof UserProvider
      * @inner
    */
    function testMethod() {
        axios({
                method: "GET",
                url: 'http://localhost:3000/users/example',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + loginToken
                }
            })
            .then(res => {
                //
            })
            .catch(err => {
                //
            })
    }

    return (
        <UserContext.Provider value={{isLoggedIn, errorMessage, attemptLogin, attemptRegister, testMethod, loginToken}} >
            { children }
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }
