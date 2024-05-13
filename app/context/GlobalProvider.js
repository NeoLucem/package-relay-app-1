import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/firebaseConfig";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);




const GlobalProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isUser, setIsUser] = useState(null);

    useEffect(() => {
      getCurrentUser().then((user) => {
        if (user) {
          setIsAuth(true);
          setIsUser(user);
        }else{
          setIsAuth(false);
          setIsUser(null);
        }
      });
    }, []);
  
    return (
        <GlobalContext.Provider
          value={{
            isAuth,
            setIsAuth,
            isUser,
            setIsUser
          }}
        >
          {children}
        </GlobalContext.Provider>
      )
}

export default GlobalProvider