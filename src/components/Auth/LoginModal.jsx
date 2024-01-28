import { useState } from "react";
import { Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const LoginModal = ({ isOpen, setCloseModal }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { fetchLogin } = useAuth();
  const navigate = useNavigate();
  let errorMsg = "";
  const { error: alert } = Modal;
  const showAlert = () => {
    alert({
      title: errorMsg,
      icon: <ExclamationCircleFilled />,
      centered: true,
      onOk: (errorMsg = ""),
      destroyOnClose: true,
    });
  };

  const handleLoginPost = async () => {
    setConfirmLoading(true)
    if (await fetchLogin(username, password)) {
      setConfirmLoading(false)
      navigate("/dashboard");
    } else {
      setConfirmLoading(false)
      errorMsg = "Falha na autenticação";
      showAlert();
    }
  };

  const handleCancel = () => {
    setPassword("");
    setUsername("");
    setCloseModal();
  };

  return (
    <Modal
      title="Login"
      open={isOpen}
      onOk={handleLoginPost}
      confirmLoading={confirmLoading}
      destroyOnClose={true}
      onCancel={handleCancel}
      okText="Enviar"
      cancelText="Cancelar"
      okButtonProps={{
        disabled: !username || !password ? true : false,
      }}
      centered
    >
      <Form
        name="login"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="on"
      >
        <Form.Item
          label="Chapa"
          name="username"
          rules={[
            {
              required: true,
              message: "Digite o número de sua chapa",
            },
          ]}
        >
          <Input
            placeholder="Ex: 01234"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[
            {
              required: true,
              message: "Digite uma senha",
            },
          ]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default LoginModal;
