import React, { useState, useEffect, useRef } from "react";
import FastApi from "../Api";
import { Card, CardBody, CardTitle, Form, Input, Button, CardHeader, CardFooter } from "reactstrap";

function Chat({handleMessages, handleChat, chatId }) {

    const [messages, setMessages] = useState([]); 
    const [userId, setUserId] = useState();  
    const [username, setUsername] = useState(); 

    let INITIAL_STATE = { message: ""}; 
    const [formData, setFormData] = useState(INITIAL_STATE); 
    const [otherUser, setOtherUser] = useState({}); 
    const [otherUserId, setOtherUserId] = useState(); //! this diesnt look like it was being utilied in chat details commone to both 
    const [chatIdMessages, setChatIdMessages] = useState(0); // todo messages only 
 
    const messagesEndRef = useRef(null); 

    const [chatParticipants, setChatParticipants] = useState([]) //todo chatDetails
    const [chatParticipantIds, setChatParticipantIds] = useState([]) //todo chatDetails
    const [groupName, setGroupName] = useState(); //todo chatDetails

    const [isMounted, setIsMounted] = useState(false);

    /** On mount, retrieve user from local storage and set user id in state*/

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user.userId);
        setUsername(user.username)
  
        // !messages
        if(!chatId) {
            // async function testing() {
            console.log("hitting !chatId ")
            const pathname = window.location.pathname;
            let formOtherUserId = Number(pathname.split('/')[2]);
            console.log("formOtherUserId:", formOtherUserId)
            setOtherUserId(formOtherUserId);
        }
   
      }, []);


    /** Scroll view to bottom of chat */

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
  
      /** On message change call scroll to bottom */
  
      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      useEffect(() => {
        // ! only running when otherUserId changes and not on MOUNT
        if (isMounted) {

            if(!chatId) {
                async function getOtherUserById() {
                    try {     
                        let otherUser =  await FastApi.getOtherUser(otherUserId);
                        setOtherUser(otherUser);
                    } catch (errors) {
                        console.error("Get Other User failed", errors);
                        return { success: false, errors };
                    }
                }
                getOtherUserById(); 
            }
            
            async function getChatHistory() {
                    try {

                    const chatHistory = chatId ? await FastApi.getChatHistoryByChatId(chatId) : await FastApi.getChatHistory([otherUserId, userId]);
            
                    setMessages(chatHistory)
            
                    } catch (errors) {
                    console.error(" ********** Get chatHistory failed", errors);
                    return { success: false, errors };
                    }
                }
 
            getChatHistory();     

        }
        setIsMounted(true);
      }, [isMounted, otherUserId]);


      useEffect(() => {
        if (isMounted) {

            if(chatId) {

                async function getChat() {
    
                /** Get chat partipants by username */
        
                try {
        
                    let chatParticipants =  await FastApi.getChatParticipants(chatId);
                    const filteredParticipants = chatParticipants.filter(
                    (participant) => participant !== username
                    );
                    const formatParticipants = filteredParticipants.join(", ");
                    setChatParticipants(formatParticipants);
        
                } catch (errors) {
        
                    console.error("Get chat particiapant failed", errors);
                    return { success: false, errors };
                }
        
                /** Get chat group name by chat id */
        
                try {
        
                    let groupName = await FastApi.getGroupNameByChatId(chatId);
                    console.log("groupName:", groupName)
                    setGroupName(groupName);
                } catch (errors) {
        
                    console.error("Get group name failed", errors);
                    return { success: false, errors };
                }
        
                /** Get chat partipant ids by chat id for socket messages  */
        
                    try {
                    
                    let chatParticipantIds =  await FastApi.getChatParticipantIds(chatId);
                    setChatParticipantIds(chatParticipantIds)
                    } catch (errors) {
        
                    console.error("Get chatParticipantIds failed", errors);
                    return { success: false, errors };
                    }
        
                }
        
                getChat()
            }

        /** Connect to websocket  */
          FastApi.connectSocket(userId); 
  
          /** Listen for responses from websocket with event handler  */
          FastApi.socket.addEventListener("message", handleIncomingMessages);
  
          /** Remove event event listener on unmount  */
          return () => {
            FastApi.socket.removeEventListener("message", handleIncomingMessages);
          }
        }
      }, [isMounted, userId])


      function handleIncomingMessages(event) {
        console.log("Socket message received in Api.js :", event.data);
        try {
          const eventData = JSON.parse(event.data);
          console.log("!!!! event.data in chat Details!!!", event.data);
          setMessages((prevMessages) => [...prevMessages, eventData]);
        } catch (error) {
          console.error("Error parsing socket message:", error);
        }
      }
  
    //   useEffect(() => {
  
    //       /** Connect to websocket  */
    //       FastApi.connectSocket(userId); 
  
    //       /** Listen for responses from websocket with event handler  */
    //       FastApi.socket.addEventListener("message", handleIncomingMessages);
  
    //       /** Remove event event listener on unmount  */
    //       return () => {
    //         FastApi.socket.removeEventListener("message", handleIncomingMessages);
    //       }
  
    //   }, []);

      const handleSubmit = async evt => {
        evt.preventDefault();   

        let dateTime = (new Date().toLocaleString()); 

        let messageData;

        let participantIds = chatParticipantIds ? chatParticipantIds : [otherUserId, userId];
        console.log("!!!!!!!!!!!!!!!!!!!!!!! chatID:", chatId)

        if(chatId !== 0) {
            messageData = {
              "messageId": 0,
              "chatId": chatId,
              "senderId": userId, 
              "senderUsername": username,
              "participantIds": participantIds,
              "message": formData.message,
              "dateTime": dateTime
            }
        } 

        console.log("type of OtherUserId", typeof otherUserId)
        console.log("type of userId", typeof userId)
     
        if(!chatId) {
            console.log("hitting chatId == 0")
            messageData = {
              "messageId": 0,
              "chatId": 0,
              "participantIds": [otherUserId, userId],
              "senderId": userId, 
              "senderUsername": username,
              "message": formData.message,
              "dateTime": dateTime,
              "groupId": 0
            }
        }

        console.log("########### MESSAGE DATA ##################", messageData)
          FastApi.sendMessage(messageData)
          
          setFormData(INITIAL_STATE)     
        }

    const handleChange = evt => {
  
        const { name, value }= evt.target;
    
        setFormData(fData => ({
          ...fData,
          [name]: value,
          
        }));
      };


      return (
        <Card className="Messages"  style={{height: '500px', width: '350px', position: 'fixed', bottom: '0px', right: '480px', borderRadius: '20px'}}>
            <CardHeader style={{height: '40px'}}>
              {chatId && <p style={{position: 'absolute', left: '10px', fontWeight: 'bold', fontSize: '18px'}}>{chatParticipants}</p> }
              {otherUser.username && <p style={{position: 'absolute', left: '10px', fontWeight: 'bold', fontSize: '18px'}}>{otherUser.username}</p> }
              <Button onClick={handleChat ? handleChat : handleMessages} style={{ position: 'absolute', right: '4px', top: '0',  backgroundColor: 'transparent', color: 'black', border: 'none', fontSize: '18px'  }}>X</Button>
            </CardHeader>
            <CardBody>
                <CardTitle tag="h5">
                  {groupName}
                </CardTitle>
                <div style={{ overflowY: 'auto', overflowX: 'hidden', height: 300 }}> 
                          {messages.map((message) => (
                        
                        <div key={'history' + message.messageId}>
                            
                          {/* {chatParticipants.length !== 2 && (
                            <div style={{textAlign: 'left'}}>
                            <div style={{ display: 'inline-block', paddingLeft: message.userId == userId ? '80px' : '0px', fontSize: 'smaller', fontStyle: 'italic' }}>
                              {message.senderUsername}
                            </div>
                            </div>
                          )} */}
                          
                          <p style={{textAlign: 'left'}}>
                            <span style={{ display: 'inline-block', paddingLeft: message.userId == userId ? '80px' : '0px', fontSize: 'smaller', fontStyle: 'italic' }}>
                              {message.senderUsername}
                            </span>
                          </p>
                          
                        
                          <p style={{ backgroundColor: message.userId == userId ? 'lightgray' : 'lightblue', borderRadius: '10px', margin: '5px', padding: '5px', width: '210px', marginLeft: message.userId == userId ? '80px' : '0px', textAlign: 'left' }}>
  
                            {message.message} 
                            <br />
                      
  
                            <span ref={messagesEndRef}></span>
  
                          </p>
                        </div>
                      
  
                  ))}
                </div>     
            </CardBody>
            <CardFooter>
                <Form style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px'}}>
                    <Input
                      type="textarea"
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type a message.."
                      style={{ width: '240px', height: '40px', resize: 'none', bottom: '7px'}}
                    />
                    <Button onClick={handleSubmit} style={{width: '63px', height: '36px'}}>
                        Send
                    </Button>
                 </Form>
            </CardFooter>
        </Card>        
      )


//       return (

//       <Card className="Messages"  style={{height: '500px', width: '350px', position: 'fixed', bottom: '0px', right: '95px', borderRadius: '20px'}}>
//         <div> TESTING FOR BOTH COMPONENTS Chat Details and Messages</div>
//     </Card>              
// )

    }; 

    export default Chat;
