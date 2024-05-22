import { Menu } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  BranchesOutlined,
  BarcodeOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  OrderedListOutlined,
  UserAddOutlined,
  PlusSquareOutlined,
  GoldOutlined,
  ProfileOutlined,
  AppstoreAddOutlined,
  LoginOutlined,
  SnippetsOutlined,
  FileTextOutlined,
  MergeOutlined,
} from "@ant-design/icons";

import styles from "./MenuList.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const MenuList = ({ darkTheme }) => {
  const menuKeys = [
    "/dashboard",
    "/items",
    "/dashboard/items",
    "/dashboard/items/create",
    "/users",
    "/dashboard/users",
    "/dashboard/users/create",
    "/volumes",
    "/dashboard/volumes",
    "/dashboard/volumes/create",
    "/employees",
    "/dashboard/employees",
    "/dashboard/employees/create",
    "/categories",
    "/dashboard/categories",
    "/dashboard/categories/create",
    "/brands",
    "/dashboard/brands",
    "/dashboard/brands/create",
    "/moves",
    "/dashboard/moves/create",
    "/dashboard/moves/history",
    "/reports",
    "/dashboard/reports/category",
    "/dashboard/reports/employee",
    "/dashboard/reports/item",
    "/requests",
    "/dashboard/requests",
  ];

  const items = [
    {
      key: "/dashboard",
      label: <NavLink to={"/dashboard"}>Painel</NavLink>,
      icon: <HomeOutlined />,
    },
    {
      key: "/items",
      label: "Inventário",
      icon: <ReadOutlined />,
      children: [
        {
          key: "/dashboard/items",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"items"}>Listar inventário</NavLink>,
        },
        {
          key: "/dashboard/items/create",
          icon: <PlusSquareOutlined />,
          label: <NavLink to={"items/create"}>Novo item</NavLink>,
        },
      ],
    },
    {
      key: "/users",
      label: "Usuários",
      icon: <SecurityScanOutlined />,
      children: [
        {
          key: "/dashboard/users",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"users"}>Mostrar usuários</NavLink>,
        },
        {
          key: "/dashboard/users/create",
          icon: <UserAddOutlined />,
          label: <NavLink to={"users/create"}>Novo usuário</NavLink>,
        },
      ],
    },
    {
      key: "/volumes",
      label: "Volumes",
      icon: <GoldOutlined />,
      children: [
        {
          key: "/dashboard/volumes",
          icon: <ProfileOutlined />,
          label: <NavLink to={"volumes"}>Mostrar volumes</NavLink>,
        },
        {
          key: "/dashboard/volumes/create",
          icon: <PlusSquareOutlined />,
          label: <NavLink to={"volumes/create"}>Novo volume</NavLink>,
        },
      ],
    },
    {
      key: "/employees",
      label: "Colaboradores",
      icon: <TeamOutlined />,
      children: [
        {
          key: "/dashboard/employees",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"employees"}>Listar colaboradores</NavLink>,
        },
        {
          key: "/dashboard/employees/create",
          icon: <UserAddOutlined />,
          label: <NavLink to={"employees/create"}>Novo colaborador</NavLink>,
        },
      ],
    },
    {
      key: "/categories",
      label: "Categorias",
      icon: <AppstoreAddOutlined />,
      children: [
        {
          key: "/dashboard/categories",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"categories"}>Listar categorias</NavLink>,
        },
        {
          key: "/dashboard/categories/create",
          icon: <PlusSquareOutlined />,
          label: <NavLink to={"categories/create"}>Nova categoria</NavLink>,
        },
      ],
    },
    {
      key: "/brands",
      label: "Marcas",
      icon: <BarcodeOutlined />,
      children: [
        {
          key: "/dashboard/brands",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"brands"}>Listar marcas</NavLink>,
        },
        {
          key: "/dashboard/brands/create",
          icon: <PlusSquareOutlined />,
          label: <NavLink to={"brands/create"}>Nova marca</NavLink>,
        },
      ],
    },
    {
      key: "/moves",
      label: "Movimentações",
      icon: <BranchesOutlined />,
      children: [
        {
          key: "/dashboard/moves/create",
          icon: <LoginOutlined />,
          label: <NavLink to={"moves/create"}>Nova movimentação</NavLink>,
        },
        {
          key: "/dashboard/moves",
          icon: <MergeOutlined />,
          label: <NavLink to={"moves"}>Histórico</NavLink>,
        },
      ],
    },
    {
      key: "/reports",
      label: "Relatórios",
      icon: <SnippetsOutlined />,
      children: [
        {
          key: "/dashboard/reports/category",
          icon: <FileTextOutlined />,
          label: <NavLink to={"reports/category"}>Por categoria</NavLink>,
        },
        {
          key: "/dashboard/reports/employee",
          icon: <FileTextOutlined />,
          label: <NavLink to={"reports/employee"}>Por colaborador</NavLink>,
        },
        {
          key: "/dashboard/reports/item",
          icon: <FileTextOutlined />,
          label: <NavLink to={"reports/item"}>Por item</NavLink>,
        },
      ],
    },
    {
      key: "/requests",
      label: "Solicitações",
      icon: <BarcodeOutlined />,
      children: [
        {
          key: "/dashboard/requests",
          icon: <OrderedListOutlined />,
          label: <NavLink to={"requests"}>Mostrar solicitações</NavLink>,
        },
      ],
    },
  ];

  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(
    location.pathname.includes("/reports/")
      ? ["/reports"]
      : [location.pathname.split("/dashboard")[1]]
  );
  const onOpenChange = (keys) => {
    const lastOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (lastOpenKey && menuKeys.indexOf(lastOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(lastOpenKey ? [lastOpenKey] : ["/dashboard"]);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("create")) {
      const openKeyName = `/${location.pathname.split("/")[2]}`;
      setOpenKeys([openKeyName]);
    }
    if (location.pathname === "/dashboard") {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className={styles.sidemenu}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultOpenKeys={[location.pathname]}
      defaultSelectedKeys={[location.pathname]}
      items={items}
    />
  );
};

export default MenuList;
