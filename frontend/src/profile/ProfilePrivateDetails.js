import React, { useState, useEffect } from "react";
import FastApi from "../Api";
import Loading from "../multiUse/loading/Loading";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBTypography } from 'mdb-react-ui-kit';


/**  
 * User profile private details
 */

function ProfilePrivateDetails({displayChatList}) {

   /** Set isLoading, rulsets, positions, insurances, city, state phoneNumber, and image in state*/
    const [isLoading, setIsLoading] = useState(true);
    const [insurances, setInsurances] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [userState, setUserState] = useState({});
   
    /** On mount, retrieve user from local storage and set in state*/

    useEffect(() => {

      const user = JSON.parse(localStorage.getItem('user'));
      setUserState(user);
      setIsLoading(false);
    }, []);

    // todo update this so it renders when you edit the profile page

    useEffect(() => {
      function fetchData() {
        
          if (userState.insurance) {
            getUserInsurance()
          }

          if(userState.phoneNumber){
            formatPhoneNumber()
          }
        }
  
      fetchData();
    }, [userState]); 


  /** Fetch user insurance from api  */

  async function getUserInsurance() {
    let insArr = []
    for(let ins of userState.insurance) {
      let insurance = await FastApi.getInsurance(ins.insuranceId);
      insArr.push(insurance.type + ":")
      insArr.push(ins.insuranceNumber)
    }
    if(insArr.length > 2){
      insArr[1] += ","
    }    
    let userInsurances = insArr.join(" ")
    setInsurances(userInsurances)
  }

  /** Format phone number  */

  async function formatPhoneNumber() {
    let formPhoneNum = userState.phoneNumber.slice(0, 3) + '-' + userState.phoneNumber.slice(3, 6) + '-' + userState.phoneNumber.slice(6);
    setPhoneNumber(formPhoneNum)
  }

  if (isLoading) {
    return (
        <Loading />
    )
  }

    /** Render page */

    return (
      <div className="PROFILE" style={{backgroundColor: 'transparent', padding: '10%', paddingTop: '100px', marginRight: displayChatList ? '400px' : '0px'}} >


                <MDBContainer style={{paddingBottom: '100px', padding: '0px', margin: '0px'}}>
                          <MDBRow> 
                            <MDBCol lg="9" xl="10">
                              <MDBCard style={{minWidth: '400px', minHeight: '700px', marginTop: '50px', boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)'}}>
                                <div>
                                  <h2>Private Information </h2>
                                  <br></br>
                                  <h4>Will be shared with team admin only,</h4>
                                  <h4>if you accept an invite.</h4>
                                  <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '250px' }}>    
                                      <a href="/setup/private">
                                          <button type="button" className="btn btn-outline-dark"  data-mdb-ripple-color="dark"
                                             style={{ height: '40px', backgroundColor: '#d1d2d4', position: 'absolute', right: '20px', top: "20px", fontSize: '15px'}}>
                                            Edit
                                          </button>
                                      </a>
                                  </div>
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style= {{marginTop: '2px'}}>
                                    </div>
                                </div>

                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Name:
                                    </div>
                                    {userState.firstName && userState.lastName && <MDBCardText style={{marginTop: '5px', overflow: 'hidden'}} tag="h4">{userState.firstName} {userState.lastName}</MDBCardText>}
                                    </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>

                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Email:
                                    </div>
                                    <MDBCardText style={{ marginTop: '5px', overflow: 'hidden', width: '50%', textAlign: 'left', paddingBottom: '5px'}} tag="h4">{userState.email} </MDBCardText>
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>

                                
                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Phone #:
                                    </div>
                                    {userState.phoneNumber && <MDBTypography style={{marginTop: '5px'}} tag="h4">{phoneNumber}</MDBTypography>}
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>

                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Insurances:
                                    </div>

                                    { insurances &&
                                          <MDBTypography style={{marginTop: '5px', width: '50%', textAlign: 'left'}} tag="h4">{insurances}</MDBTypography>
                                    }
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>

                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Additional Info:
                                    </div>

                                    {userState.additionalInfo && 
                                        <MDBTypography style={{marginTop: '5px', width: '50%', textAlign: 'left'}} tag="h4">{userState.additionalInfo}</MDBTypography>
                                    }
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>

                                <div className="ms-3 d-flex" style={{ marginTop: '0px'}}>
                                    <div className="m-0 text-start" style={{fontSize: '24px', fontFamily: 'initial', fontWeight: 'bold', minWidth: '130px', width: '30%'}}>Alternate #:
                                    </div>

                                    {userState.secondaryNumber != null && 
                                        <MDBTypography style={{marginTop: '5px'}} tag="h4">{userState.secondaryNumber}</MDBTypography>
                                    }
                                </div>

                                <div className="p-2 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex justify-content-end text-center py-1" style={{marginTop: '2px'}}>
                                    </div>
                                </div>
                    
                              </MDBCard>
                            </MDBCol>
                          </MDBRow>
                        </MDBContainer>

      </div>
    )

}

export default ProfilePrivateDetails 