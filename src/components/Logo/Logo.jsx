import styles from "./Logo.module.css";
import EscolaSesiLogo from "../../assets/escola_sesi_logo_sm.png"
const Logo = () => {
  return (
    <div className={styles.logo}>
      <div className={styles.logo_icon}>
        <img src={EscolaSesiLogo} alt="Escola SESI" />
        </div>
    </div>
  );
};

export default Logo;
