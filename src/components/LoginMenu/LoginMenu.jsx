import { Button, Divider, Popover } from "antd";
import { useContext, useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import useAuth from "../../hooks/useAuth";
import ToggleThemeBtn from "../Menu/ToggleThemeBtn";
import { ThemeContext } from "../../context/ThemeContext";

const LoginMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const {darkTheme, toggleTheme} = useContext(ThemeContext)

  const hideMenu = () => {
    setOpen(false);
    logout();
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const content = (
    <div style={{minWidth: 150}}>
      <h3>{user.name.split(" ")[0]}</h3>
      <a onClick={hideMenu}>Sair</a>
      <Divider />
      <ToggleThemeBtn darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </div>
  );

  return (
    <>
      <Popover
        content={content}
        placement="bottomRight"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button
          type="primary"
          shape="round"
          icon={<RiAccountPinCircleFill size={25} />}
          size="middle"
        />
      </Popover>
    </>
  );
};

export default LoginMenu;
