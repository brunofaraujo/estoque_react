import { Button, Flex, Layout, theme } from "antd";
import styles from "./Dashboard.module.css";
import Logo from "../../components/Logo";
import MenuList from "../../components/MenuList";
import { useState } from "react";
import ToggleThemeBtn from "../../components/ToggleThemeBtn";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import FooterComponent from "../../components/Footer/FooterComponent";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { Header, Sider } = Layout;
  const [darkTheme, setdarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const {isAuthenticated} = useAuth()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setdarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (!isAuthenticated) {
    navigate("/")
  }
  return (
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          theme={darkTheme ? "dark" : "light"}
          className={styles.sidebar}
        >
          <Logo />
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeBtn darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              className="toggle"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            ></Button>
          </Header>
          <Content>
            <Flex gap={"small"} align={"center"} justify={"space-around"} vertical className={styles.content_container}>
           <Outlet />
            </Flex>
          </Content>
          <FooterComponent/>
        </Layout>
      </Layout>
  );
}
export default Dashboard;
