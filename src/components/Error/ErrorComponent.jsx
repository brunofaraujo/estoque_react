import { Button, Card, Result } from "antd";
import { NavLink } from "react-router-dom";

const ErrorComponent = () => {
  return (
    <Card
      bordered={true}
      style={{ width: "max-content", minWidth: "100%", overflow: "auto" }}
    >
      <div style={{ textAlign: "center" }}>
        <Result status={"warning"} title={"A requisição falhou"} />
        <Button type={"primary"}>
          <NavLink to={"/"}>Voltar para o início</NavLink>
        </Button>
      </div>
    </Card>
  );
};

export default ErrorComponent;
