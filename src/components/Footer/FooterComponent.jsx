import styles from "./FooterComponent.module.css";
import { Layout } from "antd";
const FooterComponent = () => {
  const { Footer } = Layout;

  return (
    <Footer className={styles.footer} theme="dark">
      <span>&copy; {new Date().getFullYear()}</span> - Escola SESI Prata
    </Footer>
  );
};

export default FooterComponent;
