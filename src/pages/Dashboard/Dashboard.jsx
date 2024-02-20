import { Button, Layout, theme } from "antd";
import styles from "./Dashboard.module.css";
import Logo from "../../components/Logo/Logo";
import MenuList from "../../components/Menu/MenuList";
import { useState } from "react";
import ToggleThemeBtn from "../../components/Menu/ToggleThemeBtn";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import FooterComponent from "../../components/Footer/FooterComponent";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { Header, Sider } = Layout;
  const [darkTheme, setdarkTheme] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setdarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (!isAuthenticated) navigate("/");

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        className={styles.sidebar}
        width={250}
        collapsedWidth={100}
      >
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeBtn darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            className={styles.toggle_btn}
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ></Button>
        </Header>
        <Layout>
          <Content
            // style={{
            //   paddingLeft: 100,
            //   paddingTop: 35,
            //   paddingRight: 100,
            //   margin: 0,
            //   background: colorBgContainer,
            //   borderRadius: borderRadiusLG,
            // }}

            style={{
              display: "flex",
              width: "100%",
              padding: 100,
              justifyContent: "center"
            }}
          >
            <Outlet />
          </Content>
        </Layout>
        <FooterComponent />
      </Layout>
    </Layout>
  );
}
export default Dashboard;
