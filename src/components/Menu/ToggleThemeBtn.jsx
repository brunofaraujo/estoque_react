import { Button } from "antd";
import styles from "./ToggleThemeBtn.module.css";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ToggleThemeBtn = ({ darkTheme, toggleTheme }) => {
  return (
    <div className={styles.toggle_theme}>
      <Button onClick={toggleTheme} className={styles.toggle_theme_btn}>
        {darkTheme ? <HiOutlineSun size={18} /> : <HiOutlineMoon size={18} />}
      </Button>
    </div>
  );
};

export default ToggleThemeBtn;
