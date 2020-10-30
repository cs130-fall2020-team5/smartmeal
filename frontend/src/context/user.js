import React, { useState, createContext } from "react";
import axios from 'axios';

const UserContext = createContext();

function UserProvider({ children }) {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    function attemptLogin(username, password) {
        // attempt to login
        axios({
                method: "POST",
                url: 'http://localhost:4000/users/login',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    username: username,
                    password: password
                }
            })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setIsLoggedIn(true); // if the http request returns some json: `return res.json();` + chain another `then()`
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