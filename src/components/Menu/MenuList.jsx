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
  LogoutOutlined,
  DiffOutlined
} from "@ant-design/icons";

import styles from "./MenuList.module.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const MenuList = ({ darkTheme }) => {
  const menuKeys = [
    "home",
    "inventory",
    "users",
    "volumes",
    "employees",
    "categories",
    "brands",
    "moves",
  ];
  const [openKeys, setOpenKeys] = useState(["home"]);
  const onOpenChange = (keys) => {
    const lastOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (lastOpenKey && menuKeys.indexOf(lastOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(lastOpenKey ? [lastOpenKey] : []);
    }
  };

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className={styles.sidemenu}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <NavLink to={"/dashboard"}>Painel</NavLink>
      </Menu.Item>

      <Menu.SubMenu key="inventory" title="Inventário" icon={<ReadOutlined />}>
        <Menu.Item key="inventory-list" icon={<OrderedListOutlined />}>
          <NavLink to={"items"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item key="inventory-new" icon={<PlusSquareOutlined />}>
          <NavLink to={"items/create"}>Novo item</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="users"
        title="Usuários"
        icon={<SecurityScanOutlined />}
      >
        <Menu.Item key="users-list" icon={<OrderedListOutlined />}>
          <NavLink to={"users"}>Mostrar todos</NavLink>
        </Menu.Item>
        <Menu.Item key="users-new" icon={<UserAddOutlined />}>
          <NavLink to={"users/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="volumes" title="Volumes" icon={<GoldOutlined />}>
        <Menu.Item key="volumes-list" icon={<ProfileOutlined />}>
          <NavLink to={"volumes"}>Tipos</NavLink>
        </Menu.Item>
        <Menu.Item key="volumes-new" icon={<PlusSquareOutlined />}>
          <NavLink to={"volumes/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="employees"
        title="Colaboradores"
        icon={<TeamOutlined />}
      >
        <Menu.Item key="employees-list" icon={<OrderedListOutlined />}>
          <NavLink to={"employees"}>Mostrar todos</NavLink>
        </Menu.Item>
        <Menu.Item key="employees-new" icon={<UserAddOutlined />}>
          <NavLink to={"employees/create"}>Cadastrar</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="categories" title="Categorias" icon={<AppstoreAddOutlined />}>
        <Menu.Item key="categories-list" icon={<OrderedListOutlined />}>
          <NavLink to={"categories"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item key="categories-new" icon={<PlusSquareOutlined />}>
          <NavLink to={"categories/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu key="brands" title="Marcas" icon={<BarcodeOutlined />}>
        <Menu.Item key="brands-list" icon={<OrderedListOutlined />}>
          <NavLink to={"brands"}>Listar</NavLink>
        </Menu.Item>
        <Menu.Item key="brands-new" icon={<PlusSquareOutlined />}>
          <NavLink to={"brands/create"}>Novo</NavLink>
        </Menu.Item>
      </Menu.SubMenu>

      <Menu.SubMenu
        key="moves"
        title="Movimentações"
        icon={<BranchesOutlined />}
      >
        <Menu.Item key="move-in" icon={<LoginOutlined />}>
          <NavLink to={"moves/create"}>Nova entrada</NavLink>
        </Menu.Item>
        <Menu.Item key="move-out" icon={<LogoutOutlined />}>
        <NavLink to={"moves/create"}>Nova saída</NavLink>
        </Menu.Item>
        <Menu.Item key="moves-report" icon={<DiffOutlined />}>
        <NavLink to={"moves"}>Relatórios</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;
