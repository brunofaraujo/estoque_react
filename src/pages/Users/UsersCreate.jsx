import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Space, Form, Input, Button, message } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ErrorComponent from "../../components/Error/ErrorComponent";

const UsersCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      let userObject = {};
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "password2") {
          userObject[key] = value;
        }
      });
      axios
        .post(`${import.meta.env.VITE_API_URL}/users/`, userObject)
        .then((response) => {
          message.success("Usuário criado com sucesso");
          setTimeout(() => {
            navigate("../users");
          }, 1500);
        })
        .catch((err) => {
          if (err.response.data.code === "P2002") {
            if (err.response.data.meta.target[0] === "username") {
              message.error(
                "Já existe um usuário com o número da chapa informada"
              );
            }
            if (err.response.data.meta.target[0] === "email") {
              message.error("Já existe um usuário com o e-mail informado");
            }
          }
          if (
            err.response.data.message &&
            err.response.data.message[0].includes("username must be shorter")
          ) {
            message.error("O número da chapa deve conter 5 dígitos");
          } else {
            message.error(
              "Erro! Verifique as informações digitadas e tente novamente"
            );
          }
        });
    } catch (err) {
      console.log(err.errorFields);
    }
  };

  const showUserForm = () => {
    return (
      <Space direction={"vertical"} size={"large"} style={{ minWidth: "30%" }}>
        <Card
          title="Cadastro de novo usuário do sistema"
          size={"large"}
          direction={"vertical"}
        >
          <Form name={"updated_user"} form={form}>
            <Form.Item
              label={"Número da chapa"}
              name={"username"}
              rules={[{ required: true, message: "Digite o número da chapa" }]}
              required
            >
              <Input placeholder={"Ex: 01234"} />
            </Form.Item>
            <Form.Item
              label={"Nome"}
              name={"name"}
              rules={[{ required: true, message: "Digite o nome" }]}
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"E-mail"}
              name={"email"}
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Digite um e-mail válido",
                },
              ]}
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"Senha"}
              type={"password"}
              name={"password"}
              rules={[
                { required: true, message: "Digite uma senha" },
                {
                  min: 6,
                  message: "A senha deve ter pelo menos 6 caracteres",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={"Confirme a senha"}
              type={"password"}
              name={"password2"}
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Repita a senha digitada",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("As senhas devem ser iguais")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type={"primary"}
                htmlType="submit"
                onClick={handleSubmit}
                icon={<FileProtectOutlined />}
              >
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    );
  };

  const checkAuth = async (isAuthenticated) => {
    await isAuthenticated ? true : false
  }

  return (
    <>
    {checkAuth(isAuthenticated) ? showUserForm() : <ErrorComponent/>}
    </>
  );
};

export default UsersCreate;
