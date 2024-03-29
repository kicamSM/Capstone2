import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";


/** 
 * Display login form page
 *
 */

const LoginForm = ({ login, setIsLoginVis }) => {

  /** Set initial state in form */
   
  let INITIAL_STATE = { username: "", password: ""};

  /** Set form data, history, valid, and errorMessage in State */

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errorMessage, setErrorMessage] = useState();
  const [passVis, setPassVis] = useState(false);
  const navigate = useNavigate();

  /** When login page is mounted setIsloginVis to true - false when unmounted */

  useEffect(() => {
      setIsLoginVis(true);
    return () => {
      setIsLoginVis(false);
    };
  }, []);
  
  /** Handle submit by either logging and redirecting in or returning an error message */

  const  handleSubmit = async evt => {
    evt.preventDefault();
    setFormData(INITIAL_STATE);
    
    let result = await login(formData); 
    
    if(result.success) {
      console.log("result is success")
        navigate('/');
    } else {
      setErrorMessage(result.err);
  }

  };

  /** Update local state with current state of input element */

  const handleChange = evt => {

    const { name, value }= evt.target;
    setFormData(fData => ({
      ...fData,
      [name]: value,
    }));
    
  };

    /** Toggle password visibility */

  const togglePassVis = () => {
    setPassVis(!passVis);
  };


  /** render form */

  return (
    <section className="LoginForm" style={{minWidth: '400px'}}>
        <Card>
            <CardTitle className="LoginForm-CardTitle">
                <h1>Login</h1>
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
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Derby Name"
                            autoComplete="username"
                            required
                            maxLength={35}
                            minLength={2}
                        />

                        <Label htmlFor="password">Password: </Label>
                        <div style={{display: "flex"}}>
                          <Input
                              type={passVis ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Password"
                              autoComplete="current-password"
                              required
                              maxLength={128}
                          />
                          <div className='EyeIcon' role="EyeIcon" onClick={togglePassVis} style={{paddingLeft: '10px'}}>
                            <FontAwesomeIcon icon={passVis ? faEye : faEyeSlash} className='EyeIcon-Icon'/>
                          </div>
                        </div>

                    </FormGroup>
  
                    <Button>Submit</Button>

                </Form>
            </CardBody>
        </Card>
    </section>
  );
};

export default LoginForm;