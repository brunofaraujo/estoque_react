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

  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(location.pathname.includes("/reports/") ? ["/reports"] : [location.pathname.split("/dashboard")[1]]);
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
      const openKeyName = `/${location.pathname.split("/")[2]}`
      setOpenKeys([openKeyName])
    }
    if (location.pathname === "/dashboard") {
      setOpenKeys([])
    }
  },[location.pathname])

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className={styles.sidemenu}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      defaultOpenKeys={[location.pathname]}
      defaultSelectedKeys={[location.pathname]}
    >
      <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
        <NavLink to={"/dashboard"}>Painel</NavLink>
      </Menu.Item>

      <Menu.SubMenu key="/items" title="Inventário" icon={<ReadOutlined />}>
        <Menu.Item key="/dashboard/items" icon={<OrderedListOutlined />}>
          <NavLink to={"items"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/items/create" icon={<PlusSquareOutlined />}>
          <NavLink to={"items/create"}>Novo item</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="/users"
        title="Usuários"
        icon={<SecurityScanOutlined />}
      >
        <Menu.Item key="/dashboard/users" icon={<OrderedListOutlined />}>
          <NavLink to={"users"}>Mostrar todos</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/users/create" icon={<UserAddOutlined />}>
          <NavLink to={"users/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="/volumes" title="Volumes" icon={<GoldOutlined />}>
        <Menu.Item key="/dashboard/volumes" icon={<ProfileOutlined />}>
          <NavLink to={"volumes"}>Tipos</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/dashboard/volumes/create"
          icon={<PlusSquareOutlined />}
        >
          <NavLink to={"volumes/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="/employees"
        title="Colaboradores"
        icon={<TeamOutlined />}
      >
        <Menu.Item key="/dashboard/employees" icon={<OrderedListOutlined />}>
          <NavLink to={"employees"}>Mostrar todos</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/employees/create" icon={<UserAddOutlined />}>
          <NavLink to={"employees/create"}>Cadastrar</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="/categories"
        title="Categorias"
        icon={<AppstoreAddOutlined />}
      >
        <Menu.Item key="/dashboard/categories" icon={<OrderedListOutlined />}>
          <NavLink to={"categories"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/dashboard/categories/create"
          icon={<PlusSquareOutlined />}
        >
          <NavLink to={"categories/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="/brands" title="Marcas" icon={<BarcodeOutlined />}>
        <Menu.Item key="/dashboard/brands" icon={<OrderedListOutlined />}>
          <NavLink to={"brands"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/brands/create" icon={<PlusSquareOutlined />}>
          <NavLink to={"brands/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="/moves"
        title="Movimentações"
        icon={<BranchesOutlined />}
      >
        <Menu.Item key="/dashboard/moves/create" icon={<LoginOutlined />}>
          <NavLink to={"moves/create"}>Nova movimentação</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/moves" icon={<MergeOutlined />}>
          <NavLink to={"moves"}>Histórico</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="/reports"
        title="Relatórios"
        icon={<SnippetsOutlined />}
      >
        <Menu.Item
          key="/dashboard/reports/category"
          icon={<FileTextOutlined />}
        >
          <NavLink to={"reports/category"}>Por categoria</NavLink>
        </Menu.Item>
        <Menu.Item
          key="/dashboard/reports/employee"
          icon={<FileTextOutlined />}
        >
          <NavLink to={"reports/employee"}>Por colaborador</NavLink>
        </Menu.Item>
        <Menu.Item key="/dashboard/reports/item" icon={<FileTextOutlined />}>
          <NavLink to={"reports/item"}>Por item</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="/requests"
        title="Solicitações"
        icon={<BarcodeOutlined />}
      >
        <Menu.Item key="/dashboard/requests" icon={<OrderedListOutlined />}>
          <NavLink to={"requests"}>Listar</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;
