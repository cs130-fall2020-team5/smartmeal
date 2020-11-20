import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";

// context
import { UserContext } from "../context/user";

export default function LoginPage() {
    const { attemptLogin, errorMessage } = useContext(UserContext);
    const [ formState, setFormState ] = useState({ username: "", password: ""});

    function login(e) {
        e.preventDefault();
        attemptLogin(formState.username, formState.password);
    }

    function goToRegister() {
        window.location.href = "/Register";
    }

    return (
        <div className="Login">
            <Form onSubmit={login}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={ e => setFormState({...formState, username: e.target.value})}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={ e => setFormState({...formState, password: e.target.value})}/>
                </Form.Group>

                <>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    <Button variant="link" onClick={goToRegister}> New User? Register </Button>
                </>

                { errorMessage && <div>
                    <br/>
                    <p style={{"color": "red"}}>Error: { errorMessage }</p>
                </div> }

            </Form>

        </div>
    );
}
