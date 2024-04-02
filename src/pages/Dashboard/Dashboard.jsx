import { Button, Layout, theme } from "antd";
import styles from "./Dashboard.module.css";
import Logo from "../../components/Logo/Logo";
import MenuList from "../../components/Menu/MenuList";
import { useContext, useEffect, useState } from "react";
import ToggleThemeBtn from "../../components/Menu/ToggleThemeBtn";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import FooterComponent from "../../components/Footer/FooterComponent";
import { Outlet, useNavigate } from "react-router-dom";
import LoginMenu from "../../components/LoginMenu/LoginMenu";
import useAuth from "../../hooks/useAuth";
import { UserContext } from "../../context/UserContext";

function Dashboard() {
  const { Header, Sider } = Layout;
  const [darkTheme, setDarkTheme] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { fetchUser } = useAuth();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const toggleTheme = async () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("darkTheme", !darkTheme);
  };

  useEffect(() => {
    localStorage.getItem("darkTheme") === "true"
      ? setDarkTheme(true)
      : setDarkTheme(false);
  }, []);

  return (
    <>
      {fetchUser && user && (
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
            <Header
              style={{
                padding: 0,
                paddingTop: 10,
                background: colorBgContainer,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="text"
                className={styles.toggle_btn}
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              ></Button>
              <span style={{ marginRight: 30 }}>
                {user && <LoginMenu user={user} />}
              </span>
            </Header>
            <Layout>
              <Content
                style={{
                  display: "flex",
                  width: "100%",
                  padding: 100,
                  justifyContent: "center",
                }}
              >
                <Outlet />
              </Content>
            </Layout>
            <FooterComponent />
          </Layout>
        </Layout>
      )}
    </>
  );
}
export default Dashboard;
