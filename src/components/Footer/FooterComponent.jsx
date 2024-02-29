import styles from "./FooterComponent.module.css";
import { Layout } from "antd";
const FooterComponent = () => {
  const { Footer } = Layout;

  return (
    <Footer className={styles.footer} theme="dark">
      <span>&copy; {new Date().getFullYear()}</span> - Escola SESI Paraíba
      <br />
      <small>Desenvolvido por Bruno F. Araújo</small>
    </Footer>
  );
};

export default FooterComponent;
