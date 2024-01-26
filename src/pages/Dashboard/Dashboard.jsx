import { Button, Flex, Layout, theme } from "antd";
import styles from "./Dashboard.module.css";
import Logo from "../../components/Logo";
import MenuList from "../../components/MenuList";
import { useState } from "react";
import ToggleThemeBtn from "../../components/ToggleThemeBtn";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";
import FooterComponent from "../../components/Footer/FooterComponent";

function Dashboard() {
  const { Header, Sider } = Layout;

  const [darkTheme, setdarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setdarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const { user } = useAuthValue();
  const user = {
    name: "Bruno Araujo",
    email: "bruno@fakemail.com",
  };

  return (
    <AuthProvider value={user}>
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
    </AuthProvider>
  );
}
export default Dashboard;
