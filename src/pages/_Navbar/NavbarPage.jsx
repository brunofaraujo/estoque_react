import { NavLink } from "react-router-dom";
import styles from "./NavbarPage.module.css";
import { useAuthValue } from "../../context/AuthContext";

const NavbarPage = () => {
  const { user } = useAuthValue(); // PAROU AQUI <<<<<<<

  return (
    <nav className={styles.navbar}>
      {!user && (
        <ul>
          <li>
            <NavLink to="/">Inventário</NavLink>
          </li>
          <li>
            <NavLink to="/items">Movimentação</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Relatórios</NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavbarPage;