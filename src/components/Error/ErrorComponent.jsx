import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";

const ErrorComponent = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <Result status={"warning"} title={"A requisição falhou"} />
      <Button type={"primary"}>
        <NavLink to={"/"}>Voltar para o início</NavLink>
      </Button>
    </div>
  );
};

export default ErrorComponent;
