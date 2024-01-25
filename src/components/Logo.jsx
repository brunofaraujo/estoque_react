import styles from "./Logo.module.css";
import { ReconciliationOutlined } from "@ant-design/icons";
const Logo = () => {
  return (
    <div className={styles.logo}>
      <div className={styles.logo_icon}>
        <ReconciliationOutlined />
      </div>
    </div>
  );
};

export default Logo;
