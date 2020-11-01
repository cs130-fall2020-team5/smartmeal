import React, { useContext } from "react";

// components
import MealPlanner from "../components/MealPlanner";
import Login from "../components/Login";

// context
import { UserContext } from "../context/user";

export default function HomePage() {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <div>
            { isLoggedIn ? <MealPlanner/> : <Login/>}
        </div>
    );
}