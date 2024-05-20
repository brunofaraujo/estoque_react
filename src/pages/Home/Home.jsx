import { Button, Flex, Layout, Space, Row, Col, ConfigProvider } from "antd";
import styles from "./Home.module.css";
import FooterComponent from "../../components/Footer/FooterComponent";
import sesi_logo from "../../assets/SESI-home.svg";
import { useState, useEffect, useMemo } from "react";
import LoginModal from "../../components/Auth/LoginModal";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Tb3DRotate, TbLockCog } from "react-icons/tb";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { TinyColor } from "@ctrl/tinycolor";
import { particlesOptions } from "./particles";

const Home = () => {
  const { Header, Content } = Layout;
  const [openModal, setOpenModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const colors = ["#c85129", "#ff9a44", "#ef9d43", "#c85129"];
  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const setCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModal = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    setOpenModal(true);
  };

  const options = useMemo(() => particlesOptions);

  return (
    <Flex gap="middle" wrap="wrap" className={styles.home_container}>
      <Layout>
        <Header className={styles.header_style}>
          <div className={styles.header_logo_box}>
            <img src={sesi_logo} width={250} />
          </div>
        </Header>
        <Content className={styles.content_style}>
          <Row
            className={styles.particles_container}
            wrap={false}
            align="middle"
            justify="center"
          >
            {init && (
              <Col xs={23} sm={18} md={15} lg={15} xl={9}>
                <Particles
                  options={options}
                  particlesLoaded={particlesLoaded}
                  id="linkTriangles"
                  className={styles.particles}
                />
                <h3>Sistema de Controle de Estoque</h3>
                <h4>Escola SESI Prata</h4>
              </Col>
            )}
          </Row>
          <Space className={styles.access_container} direction="vertical">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(90deg,  ${colors.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                      colors
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                      colors
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                icon={<Tb3DRotate />}
                size={"large"}
                className={styles.access_btn}
                href="/estoque/request"
              >
                Solicitar material
              </Button>
            </ConfigProvider>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(90deg,  ${colors.join(
                      ", "
                    )})`,
                    colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                      colors
                    ).join(", ")})`,
                    colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                      colors
                    ).join(", ")})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                icon={<TbLockCog />}
                size={"large"}
                className={styles.access_btn}
                onClick={handleOpenModal}
              >
                Gerenciar (restrito)
              </Button>
            </ConfigProvider>
          </Space>
        </Content>
        <LoginModal isOpen={openModal} setCloseModal={setCloseModal} />
        <FooterComponent />
      </Layout>
    </Flex>
  );
};

export default Home;
