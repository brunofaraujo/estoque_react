import { Button, Flex, Layout, Space } from "antd";
import styles from "./Home.module.css";
import FooterComponent from "../../components/Footer/FooterComponent";
import sesi_logo from "../../assets/SESI-home.svg";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import LoginModal from "../../components/Auth/LoginModal";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { Header, Content } = Layout;
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const setCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
    setOpenModal(true);
  };
  return (
    <Flex gap="middle" wrap="wrap" className={styles.home_container}>
      <Layout className={styles.layout_style}>
        <Header className={styles.header_style}>
          <img src={sesi_logo} width={200} />
        </Header>
        <Content className={styles.content_style}>
          <h1>SCE</h1>
          <h2>Sistema Controlador de Estoque</h2>
          <h3>Escola SESI Prata</h3>
          <Space className={styles.access_container}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              size={"large"}
              className={styles.access_btn}
              onClick={handleOpenModal}
            >
              Entrar
            </Button>
          </Space>
        </Content>
        <LoginModal isOpen={openModal} setCloseModal={setCloseModal} />
        <FooterComponent />
      </Layout>
    </Flex>
  );
};

export default Home;
