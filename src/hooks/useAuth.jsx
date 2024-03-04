import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const { updateUser, user } = useContext(UserContext);
  const [cancelled, setCancelled] = useState(false);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [isAuthenticated, token]);

  const fetchUser = async () => {
    return await axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`)
      .then(async (response) => {
        await updateUser(response.data);
        const authUser = await user;
        setisAuthenticated(true);
        return authUser;
      })
      .catch((err) => {
        setisAuthenticated(false);
        navigate("/");
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

export default useAuth;