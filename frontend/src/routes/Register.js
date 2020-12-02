import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";

// context
import { UserContext } from "../context/user";

export default function Register() {
    const { attemptRegister, errorMessage } = useContext(UserContext);
    const [ formState, setFormState ] = useState({ username: "", password: ""});

    function register(e) {
        e.preventDefault();
        attemptRegister(formState.username, formState.password);
    }

    function goToLogin() {
        window.location.href = "/";
    }

    return (
      <div>
        <div className="login-header">
          <div className="login-header-text">
            <h1>
              Plan, Shop, <b>SmartMeal</b>.
            </h1>
          </div>
        </div>

        <div className="Login login-background">
            <Form onSubmit={register}>
                <Form.Group>
                    <Form.Label>Enter your username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={ e => setFormState({...formState, username: e.target.value})}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Enter your new password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={ e => setFormState({...formState, password: e.target.value})}/>
                </Form.Group>

                <>
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                    <Button variant="link" onClick={goToLogin}> Back to Login </Button>
                </>

                { errorMessage && <div>
                    <br/>
                    <p style={{"color": errorMessage === "Registered!" ? "green" : "red"}}>{ errorMessage }</p>
                </div> }
            </Form>
        </div>
      </div>
    );
}
