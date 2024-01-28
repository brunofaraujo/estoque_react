import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ErrorPage from "./pages/Error/Error.jsx";
import ItemsPage from "./pages/Items/ItemsPage.jsx";
import ItemPage from "./pages/Item/ItemPage.jsx";
import AuthLoginPage from "./pages/Auth/AuthLogin.jsx";
import RegisterPage from "./pages/Auth/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import App from "./App.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Logout from "./pages/Auth/AutLogout.jsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserProvider } from "./context/UserContext.jsx";

const queryClient = new QueryClient();

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "accessToken"
)}`;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard  />,

    children: [
      {
        path: "/dashboard",
        element: <DashboardHome />,
      },
      {
        path: "items",
        element: <ItemsPage />,
      },
      {
        path: "item/:id",
        element: <ItemPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "signin",
        element: <AuthLoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </UserProvider>
  </React.StrictMode>
);
