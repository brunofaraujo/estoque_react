import { Button } from "antd";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ToggleThemeBtn = ({ darkTheme, toggleTheme }) => {
  return (
    <div>
      <Button
        onClick={toggleTheme}
        style={
          !darkTheme
            ? {
                backgroundColor: "#001529",
                color: "#a6adb4",
                borderColor: "#a6adb4",
                width: "100%"
              }
            : {width: "100%"}
        }
        size="small"
      >
        {darkTheme ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              verticalAlign: "bottom",
            }}
          >
            <HiOutlineSun size={20} />
            <span> Tema claro</span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              verticalAlign: "bottom",
            }}
          >
            <HiOutlineMoon size={20} />
            <span> Tema escuro</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default ToggleThemeBtn;
