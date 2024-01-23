import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:0080";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class FastApi {

    // the token for interactive with the API will be stored here.
    static token;
    static socket;

    
    static async request(endpoint = "", data = {}, method = "get") {

        console.debug("API Call:", endpoint, data, method);
        console.debug("API CALL endpoint", endpoint)
        console.debug("API CALL data", data)
        console.debug("API CALL method", method)
        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${FastApi.token}` };
        // *This is our authorization for our request
        // console.log("header in api:", headers)
        const params = (method === "get")
            ? data
            : {};
    
        try {
            
          return (await axios({ url, method, data, params, headers })).data;
        // return (await axios({ url, method })).data;
        } catch (err) {
          console.error("API Error:", err);
        //   let message = err.response.data.error.message;
        // let message = err.response.message;
        if(err.response) {
          let message = err.response.data.detail; 
          if(err.response.data) {
          throw Array.isArray(message) ? message : [message];
          }
        }
        // console.log("err in api.js!!!!", err)
        // console.log("message in api.js!!!!", message)
      
        }
      }

    /** Post user by data*/

    static async signup(data) {
      console.log("!!!!data in Api.js:", data)
      // let testData = {derby_name: "happyJack", email: "happyJack@gmail.com", password: "password"}
      // ! note must have a user_id of 0  on your user obect to post and be sucessful 
      
      data["user_id"] = 0
      let res = await this.request('users', data, "post");
      return res;
    }

       /** Post login user by data*/

       static async login(data) {
        // !This is breaking with in case be aware of that. I believe its becasuse I
        // ! am submitting the data in a multiform

        console.log("!!!!data in login Api.js:", data)
        
        console.log("data in login:", data)
        // note this is the type of form that you have to submit for login 

        let formData = new FormData();
        console.log("formData1 in login:", formData)
        formData.append("username", data.username)
        // formData.set("username", data.username)
        console.log(formData.entries())
        console.log("data.username:", data.username)
        console.log("formData2 in login:", formData)
        formData.append("password", data.password)
        console.log("formData3 in login:", formData)

        let res = await this.request('token', formData, "post");

        // let res = await this.request('token', data, "post");
        console.log("res in login:", res)
        // !note will need to change this most likely to accessToken after you get inCase working
        // ! note that was an issue with not running inside of venv
        return res.accessToken;
      }

  /** Adding websocket to my api call */
  // ! this is where you are at.... 

  // static socket;


  static connectSocket(userId) {
    console.log("hitting connect Socket in FastApi")
    if (!FastApi.socket || FastApi.socket.readyState !== WebSocket.OPEN) {
      try {
        FastApi.socket = new WebSocket(`ws://localhost:8000/ws/${userId}`);

        /** Wait until websocket is open initially before sending first message */
        FastApi.socket.addEventListener('open', () => {

          let messageData = {
            "first_message": true,
            "token": FastApi.token,
            // "token": "fake token",
          }

          FastApi.sendMessage(messageData)
        })
        } catch (error) {
        console.error("Error connection to webSocket :", error);
      }

    }
  }

  static sendMessage(messageData) {
    console.log("hitting send MEssage n FastApi working")
    console.log("FastApi.socket:", FastApi.socket)
    console.log("FastApi.socket.readyState:", FastApi.socket.readyState)
    if (FastApi.socket && FastApi.socket.readyState === WebSocket.OPEN) {
      console.log("making it past first if")
      try {
        // const headers = FastApi.token ? { Authorization: `Bearer ${FastApi.token}` } : {};
        
        FastApi.socket.send(JSON.stringify(messageData));
        // ! line above appears to not be hitting the rout 
        console.log("apparently it sent wth hitting the route???")
      } catch (error) {
        console.error("Error sending socket message:", error);
      }
    } else {
      console.error("Socket is not open. Unable to send message.");
    }
  }




  /** Get all users*/

    // static async getUsers(handle) {
    //     let res = await this.request(`users`);
    //     console.log("res:", res)
    //     return res
    // }
    static async getUsers(data) {
      console.log("data in getusers", data)
      let res = await this.request(`users`, data, "get");
      console.log("res:", res)
      return res
  }

      /** Get one user by username */

    static async getUser(username) {
        console.log("you are hitting the get user route in Api.js")
        let res = await this.request(`users/${username}`);
        console.log("res:", res)
        if(res.ruleset === null) {
          res.ruleset = 0; 
          console.log("res in api.js", res)
        }
        return res
    }

    static async getOtherUser(userId) {
      console.log("you are hitting the get OTHER user route in Api.js")
      console.log("!!!! userId in api.js !!!!", userId)
      console.log("type of userId in api.js", typeof userId)
      let res = await this.request(`users/${userId}`);
      console.log("res:", res)
      if(res.ruleset === null) {
        res.ruleset = 0; 
        console.log("res in api.js", res)
      }
      return res
    }

    static async getUserById(id) {
      console.log("you are hitting the get user by id route in Api.js")
      let res = await this.request(`login/${id}`);
      console.log("res:", res)
      // if(res.ruleset === null) {
      //   res.ruleset = 0; 
      //   console.log("res in api.js", res)
      // }
      return res
  }

        /** Update user by data */

    static async updateUser(derby_id, data) {
    console.log("data: in api.js", data)
    // console.log("derbyName!!!:", derbyName)
    console.log("updateUser in api.js is running which means the error is after that")
    // let testData = {user_id: "8e56618d-8092-4f35-a452-b90324f2219b", derby_name: "TESTING", email: "TESTING@gmail.com", first_name: "testFirstName", last_name: "testLastName", facebook_name: "TESTING fb", about: "I am a derby player that has been bouting since 2019. Blah blah blah blah", primary_number: 12, secondary_number: 14, level: "B", insurance: {WFTDA: "ABCDE", USARS: "EFGHI"}, location: {city: "Denver", state: "CO"}, associated_leagues: ["TESTING Roller Derby", "TEST2 Roller Derby Leagues"], ruleset: {WFTDA: true, USARS: true, bankedTrack: false, shortTrack: false}, position: {jammer: true, pivot: true, blocker: false}}
    // let res = await this.request(`users/happyJack`, testData, "patch");
    let res = await this.request(`users/{user_id}`, data, "patch");
    return res;
    // return "hello"
    }

    /** Update user profile by data */

    static async updateUserProfile(userId, data) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!data: in api.js", data)
      // console.log("derbyName!!!:", derbyName)
      console.log("updateUser in api.js is running which means the error is after that")

    
      let res = await this.request(`users/profile/${userId}`, data, "put");
      return res;
    }

      /** Update user private details by data */

      static async updateUserPrivate(userId, data) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!data: in api.js", data)
        console.log("updateUserPrivate in api.js is running")
  
        let res = await this.request(`users/private/${userId}`, data, "put");
        return res;
      }

  /** Delete user */

  static async deleteUser(userId) {
  let res = await this.request(`users/${userId}`, {}, "delete");
  return res;
  } 
  
  /** Get all bouts*/

  static async getBouts(handle) {
    let res = await this.request(`bouts`);
    console.log("res:", res)
    return res
  }

  /** Get a specific bout*/

  static async getBout(eventId) {
    console.log("hitting the getBout in api.js")
    let res = await this.request(`bouts/${eventId}`);
    console.log("res:", res)
    return res
  }

    /** Add bout*/

    static async addBout(data) {
      console.log("hitting the addBout in api.js")
      console.log("!!!! data in addBout !!!!!", data)
      data["bout"]["type"] = "bout";
     
      data["bout"]["group_id"] = 0; 
      data["bout"]["chat_id"] = 0; 
      console.log("!!!! data AGAIN in addBout !!!!!", data)

      let res = await this.request(`bouts/`, data, "post");

      console.log("res:", res)
      return res
    }

    /** Updates a specific bout*/

  static async updateBout(eventId, data) {

    let res = await this.request(`bouts/${eventId}`, data, "put");
    return res;

  }

  /** Delete bout */

  static async deleteBout(eventId) {
  let res = await this.request(`bouts/${eventId}`, {}, "delete");
  return res;
  } 

  /** Get all mixers*/

  static async getMixers(handle) {
    let res = await this.request(`mixers`);
    console.log("res:", res)
    return res
  }

  /** Get a specific mixer*/

  static async getMixer(mixerId) {
    let res = await this.request(`mixers/${mixerId}`);
    console.log("res:", res)
    return res
  }

    /** Add mixer*/

    static async addMixer(data) {
      console.log("hitting the addMixer in api.js")
      console.log("!!!!!!!!!!!!!! data !!!!!!!!!!!!!", data)
      data["mixer"]["type"] = "mixer";
      data["mixer"]["group_id"] = 0; 
      data["mixer"]["chat_id"] = 0; 
      let res = await this.request(`mixers/`, data, "post");
      console.log("res:", res)
      return res
    }

  /** Updates a specific mixer*/

  static async updateMixer(eventId, data) {

    let res = await this.request(`mixers/${eventId}`, data, "put");
    return res;
  }

  /** Delete mixer */

  static async deleteMixer(eventId) {
    let res = await this.request(`mixers/${eventId}`, {}, "delete");
    return res;
  } 

  /** Get a specific address by ID*/

  static async getAddress(addressId) {
    console.log("hitting the getAddress in api.js")
    console.log("addressId in getAddress:", addressId)
    let res = await this.request(`address/${addressId}`);
    console.log("res:", res)
    return res
  }

    /** Get specific rulesets by ID*/

  static async getRuleset(rulesetId) {
    console.log("rulesetId in get ruleset:", rulesetId)
    // console.log("hitting the getAddress in api.js")
    let res = await this.request(`rulesets/${rulesetId}`);
    // console.log("res:", res)
    return res
  }

  /** Get specific positions by ID*/
  
  static async getPosition(positionId) {
    let res = await this.request(`positions/${positionId}`);
    // console.log("res:", res)
    return res
  }

  /** Get specific positions by ID*/
  
  static async getLocation(locationId) {
    let res = await this.request(`locations/${locationId}`);
    // console.log("res:", res)
  return res
  }

  /** Get specific positions by ID*/
  
  static async getInsurance(insuranceId) {
    let res = await this.request(`insurances/${insuranceId}`);
    console.log("res:", res)
  return res
  }

   /** Get specific positions by ID*/
  
   static async getInsurance(insuranceId) {
    let res = await this.request(`insurances/${insuranceId}`);
    console.log("res:", res)
  return res
  }
 
  /** Get specific positions by city, state, zip code, start date and end date */

  static async getEvents(type, data) {
    console.log("getEvents in API.JS is running")
    console.log("data in getEvents:", data)
    let res = await this.request(`events/${type}`, data, "get");
    console.log("res:", res)
  return res
  }

  static async getChatHistory(participant_ids) {
    console.log("getChatHIstory in API.JS is running")

    let res = await this.request(`messages/${participant_ids}`);
    console.log("res:", res)
  return res
  }

  static async getChats(userId) {
    console.log("getChat in API.JS is running")

    let res = await this.request(`chats/${userId}`);
    console.log("res:", res)
  return res
  }

  /** Get chat participants usernames of one chat by chat id*/

  static async getChatParticipants(chatId) {
    console.log("getChatById in API.JS is running")
    console.log("chatId in api.js", chatId)

    let res = await this.request(`chats/${chatId}/participants/usernames`);
    console.log("res:", res)
  return res
  }
  
  /** Get a single chat participant ids by chat id*/

  static async getChatParticipantIds(chatId) {
    console.log("getChatById in API.JS is running")
    console.log("chatId in api.js", chatId)

    let res = await this.request(`chats/${chatId}/participants/ids`);
    console.log("res:", res)
  return res
  }

      /** Get group name by chat id*/

  static async getGroupNameByChatId(chatId) {
    console.log("getGroupNameByChatId in API.JS is running", chatId)

    let res = await this.request(`group/name/${chatId}`);
  
    console.log("res:", res)
  return res
  }

  static async getChatHistoryByChatId(chatId) {
    console.log("getChatHistoryById in API.JS is running")

    let res = await this.request(`chats/${chatId}/history`);
    console.log("res:", res)
  return res
  
  }

    /** Add user to group*/

  static async addUserToGroup(data) {
    console.log("addUserToGroup in API.JS is running", data)

    let res = await this.request(`groups/`, data, "post");
  
    console.log("res:", res)
  return res
  }

      /** Get image by user id*/

  static async getImage(userId) {
    console.log("get image by user id in API.JS is running")

    let res = await this.request(`users/image/${userId}`);
    console.log("res:", res)
  return res
  
  }






  // static async testing() {
  //   console.log("hitting testing in api.js")

  //   let fakeData = {

  //     "bout": {
  //       "type": "bout", "date": "2024-02-3", "time": "14:00", "timeZone": " Mountain Time (MT): America/Denver (Denver, Phoenix, Salt Lake City)", "theme": "TESTING CAMELCASE POSt", "description": "blah blah blah", "level": "B", "coEd": true, "ruleset": "WFTDA", "jerseyColors": "white and green", "floorType": "polished wood", "opposingTeam": "Wild Fire", "team": "Wydaho", "addressId": 6
  //     },
    
  //     "address": {
  //     "streetAddress": "513 Main St", "city": "Boise", "state": "ID", "zipCode": "55555"
  //     }
    
  //   }

   
    // let fakeData = {
    //      "type": "bout", "date": "2024-02-3", "time": "14:00", "timeZone": " Mountain Time (MT): America/Denver (Denver, Phoenix, Salt Lake City)", "theme": "TESTING CAMELCASE POSt", "description": "blah blah blah", "level": "B", "coEd": true, "ruleset": "WFTDA", "jerseyColors": "white and green", "floorType": "polished wood", "opposingTeam": "Wild Fire", "team": "Wydaho", "addressId": 6
    //   }
      
    // console.log("fakeData:", fakeData)

    // let res = await this.request(`testing`, fakeData, "post");
    // console.log("res in Api.js:", res)
    // return res
    // }
 

}

export default FastApi