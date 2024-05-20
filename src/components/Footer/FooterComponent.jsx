import styles from "./FooterComponent.module.css";
import { Layout, Row, Col } from "antd";
import escola_sesi_logo from "../../assets/escola_sesi_logo_sm.png"
const FooterComponent = () => {
  const { Footer } = Layout;

  return (
    <Footer className={styles.footer} theme="dark">
      <Row align="middle" justify="center" gutter={10}>
        <Col className={styles.escola_sesi_logo_container}>
        <img src={escola_sesi_logo} className={styles.escola_sesi_logo} />
        </Col>
        <Col className={styles.footer_text}>
          <span>&copy; {new Date().getFullYear()} - Escola SESI Paraíba</span>
          <br />
          <small>Desenvolvido por Bruno F. Araújo</small>{" "}
        </Col>
      </Row>
    </Footer>
  );
};

export default FooterComponent;
