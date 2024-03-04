import { Button, Popover } from "antd";
import { useState } from "react";
import { RiAccountPinCircleFill } from "react-icons/ri";
import useAuth from "../../hooks/useAuth";

const LoginMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const hideMenu = () => {
    setOpen(false);
    logout()
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <>
      <Popover
        content={<a onClick={hideMenu}>Sair</a>}
        title={user.name.split(" ")[0]}
        placement="bottomRight"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button
          type="primary"
          shape="round"
          icon={<RiAccountPinCircleFill  size={25} />}
          size="middle"
        />
      </Popover>
    </>
  );
};

export default LoginMenu;
