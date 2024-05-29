import { useEffect, useState } from "react";
import { createContext } from "react";
import { theme } from "antd";

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {

    const [darkTheme, setDarkTheme] = useState(undefined);


    const toggleTheme = async () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("darkTheme", !darkTheme);
    console.log(`Darktheme set to ${darkTheme}`)
  };

  useEffect(() => {
    localStorage.getItem("darkTheme") === "true"
      ? (setDarkTheme(true), theme.darkAlgorithm)
      : setDarkTheme(false);
  }, []);

    return (<ThemeContext.Provider value={{darkTheme, toggleTheme}}>{children}</ThemeContext.Provider>)
}