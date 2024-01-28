import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({children}) => {

    const [user, setUser] = useState(undefined);

    const updateUser = (user) => {
        setUser(user)
    }

    return (<UserContext.Provider value={{user, updateUser}}>{children}</UserContext.Provider>)
}