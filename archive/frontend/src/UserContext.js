import React from "react";
import { createContext } from 'react'; 

// ! note I think this is not necessary now because you put user in local storage.

/** Create user context */

// let user = {derbyName: "happyJack", email: "happyJack@gmail.com"}
// // const UserContext = React.createContext();
// const UserContext = createContext(user);
const UserContext = createContext();
// // export default UserContext; 
// export default UserContext; 


// export const UserContext = createContext(user);
export default UserContext;