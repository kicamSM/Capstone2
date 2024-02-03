import React, { useEffect } from "react";
import "./About.css"
import { CardGroup, Card, CardBody, CardTitle, CardText } from "reactstrap";

/**  
 * Display about page
 */

function About({ setIsAboutVis }) {

    /** When about page is mounted setIsAboutVis to true - false when unmounted */

    useEffect(() => {
        setIsAboutVis(true);
      return () => {
        setIsAboutVis(false);
      };
      }, []);

    /** render about page */

    return (
       
        <div className="About" style={{paddingTop: '100px', justifyContent: 'center', paddingBottom: '200px'}}>
            <div>
                <span style={{fontSize: '30px'}}>About the Creator:</span>
                <h1> Set Goals, Achieve Dreams, Seek Adventure</h1>
            </div>
            <CardGroup className="About-Cards scroll" style={{width: '88%', marginTop: '50px', paddingLeft: '10.5%'}}>
                <Card className="Work" style={{width: '200px', margin: '1rem', border: '3px solid rgb(221, 221, 221)', borderRadius: '10px', boxShadow: '0 0 2px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)'}}> 
                <img
                alt="Roller Derby Player SockHer Blue"
                src="/work.jpg"/>
            
                    <CardBody >
                        <CardTitle>
                            <h1>Work</h1>
                        </CardTitle>
                        <CardText>
                            <p style={{paddingBottom: '10px'}}>
                            I created Block Party because I realized there was a need for better networking and communication within the roller derby community. My goal is to assist people coming together and playing one of the greatest games on earth.
                            </p>

                            <p style={{paddingBottom: '20px'}}>I am a passioniate software engineer who enjoys solving real world problems with creative solutions. I have spent the past 14 months developing and honing my skills in frontend web development, backend web development and databases. If you appreciate Block Party and believe it has value, please consider sharing my name (Sophia Macik) and my LinkedIn with anyone you know that may be hiring. I am actively job searching. I would also love to connect with you via LinkedIn or gmail.

                            kicamSMM@gmail.com
                            </p> 

                            <div style={{position: 'absolute', marginTop: '10px', bottom: '15px'}}>
                                <a href="https://www.linkedin.com/in/sophiamacik/">
                                    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></img>
                                </a>
                            </div>

                        </CardText>
                    </CardBody>
                </Card>

                <Card className="Play" style={{margin: '1rem', border: '3px solid rgb(221, 221, 221)', borderRadius: '10px', boxShadow: '0 0 2px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)'}}> 
                <img
                alt="Roller Derby Player SockHer Blue"
                src="/play.jpg"/>
            
                    <CardBody>
                        <CardTitle>
                            <h1>Play</h1>
                        </CardTitle>
                        <CardText>
                    
                        <p>I love to spend time in the outdoors. I hike and backpack with my dog Riva who is a Rhodesian Ridgeback. In 2022, I spent a month backpacking through Ireland. I also enjoy kayaking and paddleboarding both on flat water and white water. When I commit to something, I am all in and give 110%. 
                        </p>

                        <p>
                        I enjoy traveling and exploring as well as trying new things. A few fun facts about me are that I barrelman rodeo clowned in the Rodeo Capital of the World. I unicycle and I went ice climbing for the first time in 2023. I also enjoy problem solving and have a fairly large board game collection.
                        </p>

                        </CardText>

                        <img style={{height: '300px', border: '3px solid rgb(221, 221, 221)', borderRadius: '10px', boxShadow: '0 0 2px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)'}}
                        alt="Roller Derby Player SockHer Blue"
                        src="/play2.jpeg"/>
                    </CardBody>
                </Card>

                <Card className="Derby" style={{margin: '1rem', border: '3px solid rgb(221, 221, 221)', borderRadius: '10px', boxShadow: '0 0 2px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)'}}> 
                <img
                alt="Roller Derby Player SockHer Blue"
                src="/SockHer_Blue1.jpg"/>
            
                    <CardBody>
                        <CardTitle>
                            <h1>Derby</h1>
                        </CardTitle>
                        <CardText>

                            <p>
                            Hey there! My name is SockHer Blue I have been actively playing WFTDA roller derby in Wyoming since 2016. I am a dedicated jammer and love to assist other teams and players when possible. I have a goal to bout in all 50 states. To date I have bouted in 18 states. I actively work on bettering myself as a derby player. In 2023, I attended rollercon for the first time, went to USARS Summer Nationals with the Colorado USARS Team, and I skated 64 miles on my quads from Athens to Atlanta in October where I received the skate or die award. In 2024, I attended Winter USARS Nationals with Team Bada**. I am always looking to bout in new places and at a high level. I practice and speed skate each week. If you have an event you are interested in having me attend or just want to connect on facebook or gmail please reach out.

                            sockherblue@gmail.com 
                            </p>

                            {/* <br></br>
                            Teams I have rostered with and bouted with are: 
                            Heart Mountain Wreck on Wheels out of Cody, WY (2017-2019)
                            Black Hills Wild Fire out of Rapid City, SD (2017)
                            Magic City Rollers out of Billings, MT (2018)
                            Copper City Queens out of Butte, MT (2019)
                            Fremont County Cherry Bombs out of Riverton, WY (2019, 2021)
                            Bomber Mountain Derby Devils out of Buffalo, WY (2019)
                            Cheyenne Capidolls out of Cheyenne, WY  (2021-2024)
                            Portneuf Valley Bruisers out of Pocatello, ID (2021)
                            Las Alamos Derby Dames out of Las Alomos, NM (2022) 
                            WYDAHO out of Wyoming and Idaho (2022-2024)
                            Oklahoma A Team out of Tulsa, OK (2023)
                            Flatrock Roller Derby out of North Platte, NE (2023)
                            Bittersweet Bombshells out of Rock Springs, WY (2023)
                            Salina Sirens Roller Derby out of Salina, KS (2023)
                            Colorado USARS Nationals Team out of CO (2023-2024)
                            Sioux Falls Roller Dollz out of Sioux Falls, SD (2023)
                            Team Bada** satelite skaters. (2024)
                            Arizona Skate Club out of AZ (2024) */}
{/* 
                            <div style={{position: 'absolute', bottom: '15px'}}>
                                <a href="https://www.facebook.com/sophia.macik">
                                    <img src="	https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"></img>
                                </a>
                            </div> */}
                            
                            <div style={{position: 'absolute', bottom: '15px'}}>
                                <a href="https://www.facebook.com/sophia.macik">
                                    <img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white"></img>
                                </a>
                            </div>
                        </CardText>
                    </CardBody>
                </Card>
            </CardGroup>
        </div>
    )
}

export default About;