import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";

const LoginModal = ({ isOpen, setCloseModal }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let errorMsg = "";

  const { error: alert } = Modal;

  const showAlert = () => {
    alert({
      title: errorMsg,
      icon: <ExclamationCircleFilled />,
      centered: true,
      onOk: (errorMsg = ""),
      destroyOnClose: true
    });
  };

  const navigate = useNavigate();

  const queryLogin = useMutation({
    mutationFn: async () => {
      setConfirmLoading(true);
      return await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username: username,
        password: password,
      });
    },
    onSuccess: async (data) => {
      await localStorage.setItem("accessToken", data.data.accessToken);
      await onFinish();
      setConfirmLoading(false);
    },
    onError: async (err) => {
      console.log(err); // Remove it afterwards!
      errorMsg = "Falha na autenticação";
      setConfirmLoading(false);
      showAlert();
    },
  });

  const handleLoginPost = () => {
    queryLogin.mutate();
  };

  const onFinish = () => {
    navigate("/dashboard");
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
