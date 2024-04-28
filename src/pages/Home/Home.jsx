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

  const options = useMemo(() => ({
    key: "linkTriangles",
    name: "Link Triangles",
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
        },
      },
      color: {
        value: "#1677ff",
        animation: {
          enable: true,
          speed: 1,
          sync: true,
        },
      },
      shape: {
        type: "square",
      },
      opacity: {
        value: 0.6,
      },
      size: {
        value: {
          min: 1,
          max: 5,
        },
      },
      links: {
        enable: true,
        distance: 100,
        color: "random",
        opacity: 1,
        width: 0.5,
        triangles: {
          enable: true,
          color: "#607d8b",
          opacity: 0.2,
        },
      },
      move: {
        enable: true,
        speed: 0.5,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        grab: {
          distance: 400,
          links: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 200,
          size: 40,
          duration: 2,
          opacity: 1,
        },
        repulse: {
          distance: 60,
        },
        push: {
          quantity: 4,
        },
        remove: {
          quantity: 2,
        },
      },
    },
    fullScreen: { enable: false, zIndex: 100 },
  }));

  return (
    <Flex gap="middle" wrap="wrap" className={styles.home_container}>
      <Layout className={styles.layout_style}>
        <Header className={styles.header_style}>
          <img src={sesi_logo} width={250} />
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
