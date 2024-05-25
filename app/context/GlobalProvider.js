import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/firebaseConfig";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);




const GlobalProvider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isUser, setIsUser] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [packages, setPackages] = useState([]);

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
            setIsUser,
            user,
            setUser,
            loading,
            setLoading,
            packages, 
            setPackages
          }}
        >
          {children}
        </GlobalContext.Provider>
      )
}

export default GlobalProvider