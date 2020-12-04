import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";

// context
import { UserContext } from "../context/user";

/**
  * This component renders the login page
  * @returns { JSX } Returns the HTML for the login page
*/
export default function Login() {
    const { attemptLogin, errorMessage } = useContext(UserContext);
    const [ formState, setFormState ] = useState({ username: "", password: ""});

    /**
      * Attempt to log in by checking if the user has provided valid login credentials
      * @param { object } e current state of the target input element
      * @memberof Login
      * @inner
    */
    function login(e) {
        e.preventDefault();
        attemptLogin(formState.username, formState.password);
    }

    /**
      * Take the user to the Register page
      * @memberof Login
      * @inner
    */
    function goToRegister() {
        window.location.href = "/Register";
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
              <Form onSubmit={login}>
                  <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control data-testid="username" type="text" placeholder="Enter username" onChange={ e => setFormState({...formState, username: e.target.value})}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control data-testid="password" type="password" placeholder="Password" onChange={ e => setFormState({...formState, password: e.target.value})}/>
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
        </div>
    );
}
