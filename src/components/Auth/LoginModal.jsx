import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, setCloseModal }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const queryLogin = useMutation({
    mutationFn: async () => {
      return await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username: username,
        password: password,
      });
    },
    onSuccess: async (data) => {
      localStorage.setItem("accessToken", data.data.accessToken);
      navigate("/dashboard");
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleLoginPost = () => {
    queryLogin.mutate();
  };

  // const handleOk = () => {
  //   setModalText("The modal will be closed after two seconds");
  //   setConfirmLoading(true);
  //   setTimeout(() => {
  //     setCloseModal();
  //     setConfirmLoading(false);
  //   }, 2000);
  // };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
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
