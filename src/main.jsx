import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ErrorPage from "./pages/Error/Error.jsx";
import Items from "./pages/Items/Items.jsx";
import ItemsCreate from "./pages/Items/ItemsCreate.jsx";
import ItemsUpdate from "./pages/Items/ItemsUpdate.jsx";
import AuthLoginPage from "./pages/Auth/AuthLogin.jsx";
import RegisterPage from "./pages/Auth/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import App from "./App.jsx";
import Auth from "./pages/Auth/Auth.jsx";
import Logout from "./pages/Auth/AutLogout.jsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.jsx";
import axios from "axios";
import { UserProvider } from "./context/UserContext.jsx";
import Users from "./pages/Users/Users.jsx";
import UsersCreate from "./pages/Users/UsersCreate.jsx";
import UsersUpdate from "./pages/Users/UsersUpdate.jsx";
import Volumes from "./pages/Volumes/Volumes.jsx";
import VolumesUpdate from "./pages/Volumes/VolumesUpdate.jsx";
import VolumesCreate from "./pages/Volumes/VolumesCreate.jsx";
import Employees from "./pages/Employees/Employees.jsx";
import EmployeesCreate from "./pages/Employees/EmployeesCreate.jsx";
import EmployeesUpdate from "./pages/Employees/EmployeesUpdate.jsx";
import Brands from "./pages/Brands/Brands.jsx";
import BrandsCreate from "./pages/Brands/BrandsCreate.jsx";
import BrandsUpdate from "./pages/Brands/BrandsUpdate.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import CategoriesCreate from "./pages/Categories/CategoriesCreate.jsx";
import CategoriesUpdate from "./pages/Categories/CategoriesUpdate.jsx";
import Moves from "./pages/Moves/Moves.jsx";
import MovesCreate from "./pages/Moves/MovesCreate.jsx";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner.jsx";
import Reports from "./pages/Reports/Reports.jsx";
import Requests from "./pages/Requests/Requests.jsx";
import OpenRequest from "./pages/OpenRequest/OpenRequest.jsx";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
  "accessToken"
)}`;

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

const router = createBrowserRouter(
  [
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
      element: <Dashboard />,
      errorElement: <ErrorPage />,

      children: [
        {
          path: "/dashboard",
          element: <DashboardHome />,
        },
        {
          path: "items",
          element: <Items />,
        },
        {
          path: "items/create",
          element: <ItemsCreate />,
        },
        {
          path: "items/update/:id",
          element: <ItemsUpdate />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "users/create",
          element: <UsersCreate />,
        },
        {
          path: "users/update/:id",
          element: <UsersUpdate />,
        },
        {
          path: "volumes",
          element: <Volumes />,
        },
        {
          path: "volumes/create",
          element: <VolumesCreate />,
        },
        {
          path: "volumes/update/:id",
          element: <VolumesUpdate />,
        },
        {
          path: "employees",
          element: <Employees />,
        },
        {
          path: "employees/create",
          element: <EmployeesCreate />,
        },
        {
          path: "employees/update/:id",
          element: <EmployeesUpdate />,
        },
        {
          path: "categories",
          element: <Categories />,
        },
        {
          path: "categories/create",
          element: <CategoriesCreate />,
        },
        {
          path: "categories/update/:id",
          element: <CategoriesUpdate />,
        },
        {
          path: "brands",
          element: <Brands />,
        },
        {
          path: "brands/create",
          element: <BrandsCreate />,
        },
        {
          path: "brands/update/:id",
          element: <BrandsUpdate />,
        },
        {
          path: "moves",
          element: <Moves />,
        },
        {
          path: "moves/create",
          element: <MovesCreate />,
        },
        {
          path: "moves/create/:id",
          element: <MovesCreate />,
        },
        {
          path: "reports/:reportType/:itemId?",
          element: <Reports />,
        },
        {
          path: "requests",
          element: <Requests />,
        },
      ],
    },
    {
      path: "/request",
      element: <OpenRequest />,
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
  ],
  {
    basename: "/estoque",
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} fallbackElement={<LoadingSpinner />} />
    </UserProvider>
  </React.StrictMode>
);
