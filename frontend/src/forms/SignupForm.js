import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css"
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from "reactstrap";

/** 
 * Display signup form 
 */

const SignupForm = ({signup, setIsSignupVis}) => {

  /** Set error message in state */
  const [errorMessage, setErrorMessage] = useState([]);
  const navigate = useNavigate();
  
  /** Sets initial state of form   */

  let INITIAL_STATE = { username: "",  email: "", password: ""};

  /** Sets formData in initial state */

  const [formData, setFormData] = useState(INITIAL_STATE);

  /** When login page is mounted setIsloginVis to true - false when unmounted */

  useEffect(() => {
    setIsSignupVis(true);
  return () => {
    setIsSignupVis(false);
  };
  }, []);


  /** Handle Submit by either creating user or returning an error message */

  const handleSubmit = async evt => {
    evt.preventDefault();   
    setFormData(INITIAL_STATE);

    let result = await signup(formData);
    console.log("result", result)

    if(result.success) {
        navigate('/login')
    } else {
      setErrorMessage(result.err)
    }
  }

  /** Update local state with current state of input element */

  const handleChange = evt => {
    console.log('handleChange is running')
    const { name, value }= evt.target;

    setFormData(fData => ({
      ...fData,
      [name]: value,
    }));

  };

  /** render signup form form */

  return (
    <section className="col-md-4 SignupForm" style={{minWidth: '400px'}}>
        <Card>
            <CardTitle className="SignupForm-CardTitle">
            <h1>Create a profile</h1>
            <div>
            {errorMessage && (<div style={{color: 'red'}}>{errorMessage}</div>)}
            </div>
            </CardTitle>
            <CardBody>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="username" sm={10}>Derby Name: </Label>
                
                        <Input
                            id="username"
                            name="username"
                            defaultValue={formData.username}
                            onChange={handleChange}
                            placeholder="Derby Name"
                            required
                        />
                  
                        <Label htmlFor="email">Email: </Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            autoComplete="username"
                            required
                        />

                        <Label htmlFor="password">Password: </Label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            id="password"
                            autoComplete="new-password"
                            required
                        />
                    </FormGroup>
                    <Button >Create Profile</Button>
                </Form>
            </CardBody>
        </Card>
    </section>
  );
};

export default SignupForm;
