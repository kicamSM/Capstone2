import React, { useState, useEffect } from "react";
import FastApi from "../Api";
import Loading from "../multiUse/loading/Loading";
import { MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import "./Profile.css"


/**  
 * User profile
 */

function Profile({displayChatList}) {

   /** Set isLoading, rulsets, positions, insurances, city, state phoneNumber, and image in state*/
    const [isLoading, setIsLoading] = useState(true);
    const [rulesets, setRulesets] = useState();
    const [positions, setPositions] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [image, setImage] = useState();
    const [userState, setUserState] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    /** On mount, retrieve user from local storage and set in state*/

    useEffect(() => {

      const user = JSON.parse(localStorage.getItem('user'));
      setUserState(user);
      setIsLoading(false);
    }, []);

    /** On change of image or on change of user state get image*/

    useEffect(() => {

      if(isMounted) {

        async function getImage() {

          try {
            const imageData = await FastApi.getImage(userState.userId)
            if(imageData.image) {
              setImage(imageData.image)
            }
          } catch (errors) {
            console.error("Get image failed", errors);
            return { success: false, errors };
          }
        }

        getImage();
      }
      setIsMounted(true);

    }, [userState, isMounted]); 

    /** Fetch data from ids from user state and call function to get data  */
    // todo update this so it renders when you edit the profile page

    useEffect(() => {
      function fetchData() {
      
          if (userState.ruleset) {
            getUserRulesets();
          }

          if (userState.position) {
            getUserPosition();
          }
  
          if (userState.locationId) {
            getUserLocation();
          }
        }
  
      fetchData();
    }, [userState]); 

  /** Fetch user rulesets from api  */
    // todo update this so it renders when you edit the profile page

  async function getUserRulesets() {
    let rsArr = []
    for(let rs of userState.ruleset) {
      let ruleset = await FastApi.getRuleset(rs.rulesetId);
      rsArr.push(ruleset.name)
    }
    let userRulesets = rsArr.join(", ")
    setRulesets(userRulesets)
  }

  /** Fetch user positions from api  */
    // todo update this so it renders when you edit the profile page
  async function getUserPosition() {
    let posArr = []
    for(let pos of userState.position) {
      let position = await FastApi.getPosition(pos.positionId);
      posArr.push(position.position)
    }
    let userPositions = posArr.join(", ")
    setPositions(userPositions)
  }

  /** Fetch user insurance from api  */
  
    // todo update this so it renders when you edit the profile page
  // async function getUserInsurance() {
  //   let insArr = []
  //   for(let ins of userState.insurance) {
  //     let insurance = await FastApi.getInsurance(ins.insuranceId);
  //     insArr.push(insurance.type + ":")
  //     insArr.push(ins.insuranceNumber)
  //   }
  //   if(insArr.length > 2){
  //     insArr[1] += ","
  //   }    
  //   let userInsurances = insArr.join(" ")
  //   setInsurances(userInsurances)
  // }

  /** Fetch user location from api  */

  async function getUserLocation() {
    let userLocation = await FastApi.getLocation(userState.locationId);
    setCity(userLocation.city)
    setState(userLocation.state)
  }

  /** Format phone number  */
    // todo update this so it renders when you edit the profile page
  // async function formatPhoneNumber() {
  //   let formPhoneNum = userState.phoneNumber.slice(0, 3) + '-' + userState.phoneNumber.slice(3, 6) + '-' + userState.phoneNumber.slice(6);
  //   setPhoneNumber(formPhoneNum)
  // }

  if (isLoading) {
    return (
        <Loading />
    )
  }

    /** Render profile page */

    return (
      <div className="Profile" style={{backgroundColor: 'transparent', padding: '10%', paddingTop: '100px', marginRight: displayChatList ? '400px' : '0px'}} >

        <MDBContainer style={{padding: '0px', margin: '0px' }}>
          <MDBRow style={{padding: '0px', margin: '0px'}}> 
              <MDBCard style={{minWidth: '612px', maxWidth: '1100px', minHeight: '700px', marginTop: '50px', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)'}}>
                <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: 'black', height: '300px', marginTop: '15px'}}>

                  <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '250px' }}>    
                  {image && <MDBCardImage src={image}
                      alt="Skater placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '250px', height: '330px', position: 'relative', backgroundColor: '#d1d2d4', border: '4px solid white', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)'}} /> 
                  }
                  { !image && <MDBCardImage src="/skater_02.svg"
                      alt="Skater placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '250px', height: '330px', position: 'relative', zIndex: '1', backgroundColor: '#d1d2d4', border: '4px solid white', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)'}} /> 
                  }
                  </div>
                  <a href="/setup/profile">
                    <button type="button" className="btn btn-outline-dark"  data-mdb-ripple-color="dark"
                      style={{ height: '40px', backgroundColor: '#d1d2d4', position: 'absolute', right: '30px', top: "30px", fontSize: '15px'}}>
                      Edit
                    </button>
                  </a>
                  <a href="/profile/private">
                    <button type="button" className="btn btn-outline-dark"  data-mdb-ripple-color="dark"
                      style={{ height: '40px', backgroundColor: '#d1d2d4', position: 'absolute', right: '100px', top: "30px", fontSize: '15px'}}>
                      Private Info
                    </button>
                  </a>
                  <div className="ms-3" style={{ marginTop: '200px'}}>
                    <MDBTypography tag="h4">{userState.username} #{userState.primaryNumber}</MDBTypography>
                    {userState.locationId && city && state && <MDBCardText>{city}, {state}</MDBCardText>}
                  </div>
                </div>
                <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}> 
                    <div style={{ marginLeft: '600px'}}>
                      { userState.level && <div>
                        <MDBCardText className="mb-1 h5" style={{marginRight: '80px'}}>{userState.level}</MDBCardText>
                        <MDBCardText className="small text-muted mb-0"style={{marginRight: '80px'}}>level</MDBCardText>
                      </div>
                      }
                    </div>
                    { userState.position && <div>
                      <MDBCardText className="mb-1 h6">{positions}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0" style={{marginRight: '10px', marginTop: '7px'}}>positions</MDBCardText>
                    </div>
                    }
                    { userState.ruleset &&
                    <div className="px-3">
                      <MDBCardText className="mb-1 h6" style={{marginLeft: '30px'}}>{rulesets}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0" style={{marginLeft: '30px', marginTop: '7px'}}>known rulesets</MDBCardText>
                    </div>
                    }
                  </div>
                </div>
                <MDBCardBody className="text-black p-4">

                { userState.about && <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      <MDBCardText className="font-italic mb-1">{userState.about}</MDBCardText>
                    </div>
                  </div>
                  }
                  { userState.associatedLeagues && <div className="mb-5">
                    <p className="lead fw-normal mb-1">Associated Leagues</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      <MDBCardText className="font-italic mb-1">{userState.associatedLeagues}</MDBCardText>
                    </div>
                  </div>
                  }
                  { userState.facebookName && <div className="mb-5">
                    <p className="lead fw-normal mb-1">You can find me on facebook: {userState.facebookName}</p>
                  </div>
                  }
                </MDBCardBody>

              </MDBCard>
          </MDBRow>
        </MDBContainer>


      </div>
    )

}

export default Profile 