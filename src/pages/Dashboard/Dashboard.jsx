import { Button, Layout } from "antd";
import Logo from "../../components/Logo/Logo";
import MenuList from "../../components/Menu/MenuList";
import { useContext, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import FooterComponent from "../../components/Footer/FooterComponent";
import { Outlet } from "react-router-dom";
import LoginMenu from "../../components/LoginMenu/LoginMenu";
import useAuth from "../../hooks/useAuth";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";

function Dashboard() {
  const { Header, Sider } = Layout;
  const { darkTheme } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useContext(UserContext);
  const { fetchUser } = useAuth();

  return (
    <>
      {fetchUser && user && (
        <Layout style={{ minHeight: "100dvh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            trigger={null}
            theme={darkTheme ? "dark" : "light"}
            width={250}
            breakpoint="lg"
            collapsedWidth={80}
            onBreakpoint={(broken) => {
              setCollapsed(broken);
            }}
          >
            <Logo />
            <MenuList darkTheme={darkTheme} />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                paddingTop: 10,
                background: darkTheme ? "#001529" : "#ffffff",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="text"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={{color: darkTheme ? "#a6adb4" : "#1f1f1f"}}
              ></Button>
              <span style={{ marginRight: 30 }}>
                {user && <LoginMenu user={user} />}
              </span>
            </Header>
            <Layout>
              <Content
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  overflow: "auto",
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
