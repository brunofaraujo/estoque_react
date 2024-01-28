import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export const useAuth = () => {
  const { updateUser } = useContext(UserContext);
  const [cancelled, setCancelled] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);

  useEffect(() => {
    fetchUser();
  },[isAuthenticated]);

  const fetchUser = async () => {
    return await axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`)
      .then((response) => {
        const user = updateUser(response.data);
        setisAuthenticated(true);
        return user;
      })
      .catch((err) => {
        setisAuthenticated(false);
        console.log(err);
        return false;
      })
      .finally(() => setCancelled(true));
  };

  const fetchLogin = async (username, password) => {
    return await axios
      .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password,
      })
      .then(({ data }) => {
        updateLocalStorage(data.accessToken);
        return fetchUser;
      })
      .catch((err) => {
        console.log(err);
        return false;
      })
      .finally(() => setCancelled(true));
  };

  const updateLocalStorage = async (token) => {
    return localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    return updateUser(undefined);
  };

  useEffect(() => {
    if (cancelled) return;
  }, []);

  return { fetchUser, fetchLogin, isAuthenticated, logout };
};
