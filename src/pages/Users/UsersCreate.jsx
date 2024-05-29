import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Space,
  Form,
  Input,
  Button,
  message,
  Divider,
  Layout,
  Flex,
  Row,
  Col,
} from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import useTrim from "../../hooks/useTrim";
import { UserContext } from "../../context/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const UsersCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useContext(UserContext);

  const handleSubmit = (userData) => {
    if (submitting) return;
    setSubmitting(true);
    Object.keys(userData).map(
      (key) =>
        userData[key] !== "password" &&
        userData[key] !== "password2" &&
        typeof userData[key] === "string" &&
        (userData[key] = userData[key].trim())
    );
    const { password2, ...restUserData } = userData;
    axios
      .post(`${import.meta.env.VITE_API_URL}/users/`, restUserData)
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
          if (err.response.data.meta.target[0] === "name") {
            message.error("Já existe um usuário com nome informado");
          }
        }
        if (
          err.response.data.message &&
          err.response.data.message[0].includes("username must")
        ) {
          message.error("O número da chapa deve conter 5 dígitos");
        } else {
          message.error(
            "Erro! Verifique as informações digitadas e tente novamente"
          );
        }
        setSubmitting(false);
      });
  };

  const getAuthStatus = async () => {
    const isAuthenticated = await user;
    if (!isAuthenticated) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {!error && !loading && user && (
        <Card
          bordered
          style={{ width: "max-content", minWidth: "100%", overflow: "auto" }}
        >
          <Divider orientation="left">Cadastro de novo usuário</Divider>
          <Layout style={{ backgroundColor: "#fff" }}>
            <Flex vertical>
              <Form
                name={"user"}
                form={form}
                onFinish={(e) => handleSubmit(e)}
                disabled={submitting}
              >
                <Row gutter={20}>
                  <Col xs={12} sm={12} md={14} lg={8} xl={6}>
                    <Form.Item
                      label={"Número da chapa"}
                      name={"username"}
                      normalize={(text) => useTrim(text)}
                      rules={[
                        { required: true, message: "Digite o número da chapa" },
                      ]}
                      required
                    >
                      <Input placeholder={"Ex: 01234"} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={20} md={14} lg={8} xl={10}>
                    <Form.Item
                      label={"Nome"}
                      name={"name"}
                      normalize={(text) => useTrim(text)}
                      rules={[{ required: true, message: "Digite o nome" }]}
                      required
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={20} md={14} lg={8} xl={10}>
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
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={20} md={14} lg={8} xl={10}>
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
                        {
                          whitespace: true,
                          message: "Caractere inválido digitado",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} sm={20} md={14} lg={8} xl={10}>
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
                        {
                          whitespace: true,
                          message: "Caractere inválido digitado",
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
                  </Col>
                </Row>
                <Row justify="start">
                  <Col>
                    <Form.Item>
                      <Button
                        type={"primary"}
                        htmlType="submit"
                        icon={<FileProtectOutlined />}
                        disabled={submitting}
                        style={{ width: "300px", fontWeight: "600" }}
                      >
                        Salvar
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Flex>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default UsersCreate;
