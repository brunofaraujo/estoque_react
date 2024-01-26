import { Button, Flex, Layout, Space } from "antd";
import styles from "./Home.module.css";
import FooterComponent from "../../components/Footer/FooterComponent";
import sesi_logo from "../../assets/SESI-home.svg";
import { SendOutlined } from '@ant-design/icons';
import { useState } from "react";
import LoginModal from "../../components/Auth/LoginModal";

const Home = () => {
  const { Header, Content } = Layout;
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const setCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <Flex gap="middle" wrap="wrap" className={styles.home_container}>
      <Layout className={styles.layout_style}>
        <Header className={styles.header_style}>
          <img src={sesi_logo} width={160} />
        </Header>
        <Content className={styles.content_style}>
          <h1>SCE</h1>
          <h2>Sistema de Controle Estoque</h2>
          <h3>Escola SESI Prata</h3>
          <Space className={styles.access_container}>
          <Button type="primary" icon={<SendOutlined />} size={"large"} className={styles.access_btn} onClick={handleOpenModal}>
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
