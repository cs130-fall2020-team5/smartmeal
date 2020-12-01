import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const SESSION_JWT = "SESSION_JWT";

const UserContext = createContext();

function UserProvider({ children }) {
    const [ loginToken, setLoginToken ] = useState(localStorage.getItem(SESSION_JWT) || "");
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");


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
