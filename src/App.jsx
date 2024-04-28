import { Outlet } from "react-router-dom";
import ptBR from "antd/locale/pt_BR";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
