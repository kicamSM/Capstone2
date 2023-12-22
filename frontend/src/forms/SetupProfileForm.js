import React, { useContext, useEffect, useState } from "react";
import FastApi from "../Api";
import { useNavigate } from "react-router-dom";

import "./SetupProfileForm.css"
import {
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Label, 
    Input,
    Button,
  } from "reactstrap";
  import PropTypes from 'prop-types';

/** 
 * Form for creating a user or updating a logged in user.
 */

function SetupProfileForm({update}) {

/** Retrieve user from local storage */


const user = JSON.parse(localStorage.getItem('user'));
// console.log("user !!! in setup profile form", user)

 /** Set user, history and initial state and set valid, invalid, and error message in state */
//   const history = useHistory();
//   const [ valid, setValid ] = useState(false);
//   const [ invalid, setInvalid ] = useState(false);
//   const [errorMessage, setErrorMessage] = useState([]);
// const [file, setFile] = useState<File | undefined>();
// const [preview, setPreview] = useState<string | undefined>();
const navigate = useNavigate();
const [primInsNumDisabled, setPrimInsNumDisabled] = useState(true);
const [secInsNumDisabled, setSecInsNumDisabled] = useState(true);
const [formRulesets, setFormRulesets] = useState([]);


// if(!user) {
//   navigate('/')
// }

let INITIAL_STATE = { username: user.username, firstName: user.first_name, lastName: user.last_name, email: user.email,  facebookName: user.facebook_name, about: user.about, primNum: user.prim_number, secNumber: user.secondary_number, level: user.level, primIns: user.primary_Insurance, primInsNum: user.primInsNum, secIns: user.secIns, secInsNum: user.secInsNum, assocLeagues: user.associated_leagues };

  /** Sets formData in initial state */
  const [formData, setFormData] = useState(INITIAL_STATE);

  function format(formData) {
    console.log("formData.secIns", formData.secIns)
    let ins1 = formData.primIns
    let val1 = formData.primInsNum
    let ins2 = formData.secIns
    let val2 = formData.secInsNum
    
    let newData = {
      username: formData.username, firstName: formData.first_name, lastName: formData.last_name, email: formData.email,  facebookName: formData.facebook_name, about: formData.about, primNum: formData.primary_number, secNumber: formData.secondary_number, level: formData.level, primIns: { [ins1]: val1 }, secIns: { [ins2]: val2 }, assocLeagues: user.associated_leagues, rulesets: formRulesets
    }
    console.log("newData:", newData)
  }
  
  /** Handle Submit by either creating user, updating profile, or returning an error message */

  const handleSubmit = async evt => {
    evt.preventDefault();   
    console.log("FormData in SetupProfileForm.js", formData)
    setFormData(INITIAL_STATE);
   
    console.log("update!!!!!:", update)
    format(formData)
    // let result = await update(formData);
    let result = false; 
    console.log("fake form data has been submitted")

    //   setValid(true)
    if(result) {
      navigate('/profile')

    } else {
      // let message = result.errors[0]
      // let message = result
      // setErrorMessage(message)
      // setInvalid(true)
      console.log("fake form has failed to submit")
    }
   }

  /** Update local state with current state of input element */

  const handleRulesetsChange = evt => {
    // ! note you are going to have to adjust this right now you have rulesets as an array but in the database you have rulesets that are an object. 
    console.log("you are hitting handleRulesetsChange")
    // setFormRulesets(evt.target.value);
    // setFormRulesets((prevRulesets) => [...prevRulesets, ...evt.target.value]);
    setFormRulesets((prevRulesets) => [
      ...prevRulesets,
      ...Array.from(evt.target.selectedOptions).map((option) => option.value),
    ])
    /
    console.log("!!!!!!!!!!!!!! formRulesets:", formRulesets)
  };

  const handleChange = evt => {
    console.log('handleChange is running')
    const { name, value }= evt.target;

    setFormData(fData => ({
      ...fData,
      [name]: value,
    }));

    if (name === "primIns") {
      if (value === "") {
        setFormData((prevData) => ({
          ...prevData,
          primInsNum: "",
        })); // Clear the insurance number field
        setPrimInsNumDisabled(true); // Disable the insurance number field
      } else {
        setPrimInsNumDisabled(false); // Enable the insurance number field
        // If needed, prompt for insurance number if it's still empty
      }
    };
    if (name === "secIns") {
      if (value === "") {
        setFormData((prevData) => ({
          ...prevData,
          secInsNum: "",
        })); // Clear the insurance number field
        setSecInsNumDisabled(true); // Disable the insurance number field
      } else {
        setSecInsNumDisabled(false); // Enable the insurance number field
        // If needed, prompt for insurance number if it's still empty
  }

  }

    console.log("formData in setupProfileForm:", formData)
}

  /** toggle dropdown */

// const toggle = () => setDropdownOpen((prevState) => !prevState);

  /** render form */

  return (
    <section className="col-md-4 SetupProfileForm" style={{marginTop: "150px"}}>
        <Card>
            <CardTitle className="SetupProfileForm-CardTitle">
            {/* { !user && ( <h1>Create a Profile</h1> )}
            { user && (<h1>{user.username}'s Profile</h1>)} */}
            <h1>Additional Information</h1>
            </CardTitle>
            <CardBody>
                {/* <Form> */}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>

                    <Label htmlFor="username">Derby Name: </Label>
                       <Input
                           type="text"
                           id="username"
                           name="username"
                           value={formData.username}
                           onChange={handleChange}
                           placeholder="Derby Name"
                           required
                           // valid={valid}
                           // invalid={invalid}
                       />

                    <Label htmlFor="image">Profile Image: </Label>
                      <Input
                          type="file"
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          accept="image/png image/jpg"
                          // valid={valid}
                          // invalid={invalid}
                      />

                        <Label htmlFor="firstName">First Name: </Label>
                       
                        <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            // valid={valid}
                            // invalid={invalid}
                        />
                        
           
                        <Label htmlFor="lastName">Last Name: </Label>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            // valid={valid}
                            // invalid={invalid}
                        />

                        <Label htmlFor="facebookName">Facebook Name: </Label>
                        <Input
                            type="text"
                            name="facebookName"
                            className="form-control"
                            value={formData.facebookName}
                            onChange={handleChange}
                            placeholder="Facebook Name"
                            id="facebookName"
  
                            // invalid={invalid}

                        />
                        {/* </> */}
                        {/* )} */}

                        <Label htmlFor="about">About: </Label>
                        <Input
                            type="textarea"
                            name="about"
                            className="form-control"
                            value={formData.about}
                            onChange={handleChange}
                            placeholder="Write your story..."
                            id="about"
  
                            // invalid={invalid}
                        />

                        <Label htmlFor="primNum">Primary Number: </Label>
                        <Input
                            type="number"
                            name="primNum"
                            className="form-control"
                            value={formData.primNum}
                            onChange={handleChange}
                            placeholder="Primary Number"
                            id="primaryNumber"
  
                            // invalid={invalid}
                        />

                        <Label htmlFor="secNum">Secondary Number: </Label>
                        <Input
                            type="number"
                            name="secNum"
                            className="form-control"
                            value={formData.secNum}
                            onChange={handleChange}
                            placeholder="Secondary Number"
                            id="secondaryNumber"
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        />

                        {/* <Label htmlFor="secInsNum">Secondary Insurance Number: </Label>
                        <Input
                            type="text"
                            name="secInsNum"
                            className="form-control"
                            value={formData.secInsNum}
                            onChange={handleChange}
                            placeholder="Secondary Insurance Number"
                            id="secInsNum"
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        /> */}

      
                        <Label htmlFor="level">Skill Level: </Label>
                        <Input
                            type="select"
                            name="level"
                            className="form-control"
                            value={formData.level}
                            onChange={handleChange}
                            placeholder="level"
                            id="level"
  
                            // invalid={invalid}
                            >
                              <option value={""}>
                                Prefer not to say.
                              </option>
                              <option value={"C"}>
                                C
                              </option>
                              <option value={"B"}>
                                B
                              </option>
                              <option value={"A"}>
                                A
                              </option>
                              <option value={"AA"}>
                                AA
                              </option>
                            {/* </Col> */}
                            </Input>

                        <Label htmlFor="primIns">Primary Insurance: </Label>
                        <Input
                            type="select"
                            name="primIns"
                            className="form-control"
                            value={formData.primIns}
                            onChange={handleChange}
                            placeholder="Primary Insurance"
                            id="primIns"
  
                            // invalid={invalid}
                            >
                              <option value={""}>
                                N/A 
                              </option>
                              <option value={"WFTDA"}>
                                WFTDA
                              </option>
                              <option value={"USARS"}>
                                USARS
                              </option>
                              <option value={"other"}>
                                Other
                              </option>
              
                        </Input>

                        <Label htmlFor="primInsNum">Primary Insurance Number: </Label>
                        <Input
                            type="text"
                            name="primInsNum"
                            className="form-control"
                            value={formData.primInsNum}
                            onChange={handleChange}
                            placeholder="Primary Insurance Number"
                            id="primInsNum"
                            disabled={primInsNumDisabled}
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        />

                        <Label htmlFor="secIns">Secondary Insurance: </Label>
                        <Input
                            type="select"
                            name="secIns"
                            className="form-control"
                            value={formData.secIns}
                            onChange={handleChange}
                            placeholder="Secondary Insurance"
                            id="secIns"
  
                            // invalid={invalid}
                            >
                              <option value={""}>
                                N/A 
                              </option>
                              <option value={"WFTDA"}>
                                WFTDA
                              </option>
                              <option value={"USARS"}>
                                USARS
                              </option>
                              <option value={"other"}>
                                Other
                              </option>
                        </Input>

                        <Label htmlFor="secInsNum">Secondary Insurance Number: </Label>
                        <Input
                            type="text"
                            name="secInsNum"
                            className="form-control"
                            value={formData.secInsNum}
                            onChange={handleChange}
                            placeholder="Secondary Insurance Number"
                            id="secInsNum"
                            disabled={secInsNumDisabled}
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        />

                        <Label htmlFor="assocLeagues">Associated Leagues: </Label>
                        <Input
                            type="text"
                            name="assocLeagues"
                            className="form-control"
                            value={formData.assocLeagues}
                            onChange={handleChange}
                            placeholder="Associated Leagues"
                            id="assocLeagues"
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        />

                        <Label htmlFor="rulesets">Played Rulesets: </Label>
                        <Input
                            type="select"
                            name="rulesets"
                            className="form-control"
                            value={formData.rulesets}
                            onChange={handleRulesetsChange}
                            placeholder="Played Rulesets"
                            id="rulesets"
                            multiple
                            
                        >     
                        <option value={"WFTDA"}>
                        WFTDA
                      </option>
                      <option value={"USARS"}>
                        USARS
                      </option>
                      <option value={"banked track"}>
                        Banked Track 
                      </option>
                      <option value={"short track"}>
                        Short Track 
                      </option>
                        </Input>


                        {/* todod need to add this in */}
                        {/* Played Rulesets
                        <Label htmlFor="playedRulesets">Played Rulesets: </Label>
                        <Input
                            type="radio"
                            name="WFTDA"
                            className="form-control"
                            // value={formData.primaryNumber}
                            // onChange={handleChange}
                            id="WFTDA"
  
                            // invalid={invalid}
                            // note will have to restrict this to numbers only
                        /> */}
                      
                            
                        {/* <FormFeedback valid>Profile updated successfully!</FormFeedback>
                        <FormFeedback tooltip>{errorMessage} </FormFeedback> */}

                    </FormGroup>

                    {/* { user && <Button >Save Changes</Button> }
                    { !user && <Button >Create Profile</Button> } */}
                    <Button >Save Profile</Button>
                </Form>
            </CardBody>
        </Card>
    </section>
  
);
};

export default SetupProfileForm;
