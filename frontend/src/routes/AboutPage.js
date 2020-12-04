import React from "react";

import './styles.css'

/**
  * This component displays the About page
  * @returns { JSX } Returns the HTML for the About page
*/
export default function AboutPage() {
    return (
        <div className="main-text">
            <p>A smart meal planning application to help you plan your week.</p>
            <p>Created as a class project in CS 130: Software Engineering at UCLA.</p>
        </div>
    )
}
