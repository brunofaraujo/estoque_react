
import { NavLink } from "react-router-dom";
import styles from "./HeaderPage.module.css";

const HeaderPage = () => {
  return (
    <header className={styles.header_page}>
      <div className={styles.header_logo}>
        <NavLink to="/">
        <h2>SCE</h2>
        <p>Sistema de Controle de Estoque</p>
        <p>Escola SESI Prata</p>
        </NavLink>
      </div>
      <div className={styles.header_auth}>
        <NavLink to="/signin" className={({isActive}) => (isActive ? styles.active : "")}><h3>Entrar</h3></NavLink>
      </div>
    </header>
  );
};
export default HeaderPage;
 