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
  MergeOutlined
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
    "reports"
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

      <Menu.SubMenu
        key="categories"
        title="Categorias"
        icon={<AppstoreAddOutlined />}
      >
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
        <Menu.Item key="move-new" icon={<LoginOutlined />}>
          <NavLink to={"moves/create"}>Nova movimentação</NavLink>
        </Menu.Item>
        <Menu.Item key="moves-history" icon={<MergeOutlined />}>
          <NavLink to={"moves"}>Histórico</NavLink>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu
        key="reports"
        title="Relatórios"
        icon={<SnippetsOutlined />}
      >
        <Menu.Item key="report-category" icon={<FileTextOutlined />}>
          <NavLink to={"reports/category"}>Por categoria</NavLink>
        </Menu.Item>
         <Menu.Item key="report-employee" icon={<FileTextOutlined />}>
          <NavLink to={"reports/employee"}>Por colaborador</NavLink>
        </Menu.Item>
        {/* <Menu.Item key="report-employee" icon={<FileTextOutlined />}>
          <NavLink to={"reports/employee"}>Por colaborador</NavLink>
        </Menu.Item>
        <Menu.Item key="report-item" icon={<FileTextOutlined />}>
          <NavLink to={"reports/item"}>Por item</NavLink>
        </Menu.Item>
        <Menu.Item key="report-brand" icon={<FileTextOutlined />}>
          <NavLink to={"reports/brand"}>Por marca</NavLink>
        </Menu.Item>
        <Menu.Item key="report-user" icon={<FileTextOutlined />}>
          <NavLink to={"reports/user"}>Por usuário</NavLink>
        </Menu.Item>
        <Menu.Item key="report-volume" icon={<FileTextOutlined />}>
          <NavLink to={"reports/volume"}>Por volume</NavLink>
        </Menu.Item> */}
      </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;
