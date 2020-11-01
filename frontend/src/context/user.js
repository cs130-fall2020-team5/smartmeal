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
        console.log("Checking if the user is still authenticated");
        if (loginToken) {
            if (jwt.decode(loginToken).exp < new Date().getTime()) {
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
                // console.log(err);
            })
    }

    return (
        <UserContext.Provider value={{isLoggedIn, errorMessage, attemptLogin}} >
            { children }
        </UserContext.Provider>
    )
}

export { UserProvider, UserContext }