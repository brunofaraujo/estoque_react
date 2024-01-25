import { Menu } from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  BranchesOutlined,
  BarcodeOutlined,
  TeamOutlined,
  NodeCollapseOutlined,
  NodeExpandOutlined,
} from "@ant-design/icons";

import styles from "./MenuList.module.css";
import { NavLink } from "react-router-dom";

const MenuList = ({ darkTheme }) => {
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className={styles.sidemenu}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <NavLink to={"/dashboard"}>Home</NavLink>
      </Menu.Item>
      <Menu.Item key="inventory" icon={<ReadOutlined />}>
        <NavLink to={"items"}>Inventário</NavLink>
      </Menu.Item>
      <Menu.SubMenu
        key="moves"
        title="Movimentação"
        icon={<BranchesOutlined />}
      >
        <Menu.Item key="move-in" icon={<NodeCollapseOutlined />}>
          Entrada
        </Menu.Item>
        <Menu.Item key="move-out" icon={<NodeExpandOutlined />}>
          Saída
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="brands" icon={<BarcodeOutlined />}>
        <NavLink to={"/auth/register"}>Marcas</NavLink>
      </Menu.Item>
      <Menu.Item key="employees" icon={<TeamOutlined />}>
        <NavLink to={"/auth/signin"}>Colaboradores</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;