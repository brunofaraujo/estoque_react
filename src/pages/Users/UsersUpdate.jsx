import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Space,
  Form,
  Input,
  Button,
  Switch,
  message,
  Divider,
  Popconfirm,
} from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { DeleteOutlined } from "@ant-design/icons";
import { UserContext } from "../../context/UserContext";
import useTrim from "../../hooks/useTrim";

const UsersUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useContext(UserContext);

  const getUser = (id) => {
    if (submitting) return;
    setSubmitting(true);
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${id}`)
      .then((response) => {
        setUser(response.data);
        form.setFieldsValue({
          username: response.data.username,
          name: response.data.name,
          email: response.data.email,
        });
        setSubmitting(false);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  const handleChangePassword = (checked) => {
    if (checked) {
      setShowPasswordFields(true);
    } else {
      setShowPasswordFields(false);
      form.setFieldsValue({
        password: undefined,
        password2: undefined,
      });
    }
  };

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
      .patch(`${import.meta.env.VITE_API_URL}/users/${id}`, restUserData)
      .then((response) => {
        message.success("Informações atualizadas");
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

  const handleDelete = () => {
    setConfirmLoading(true);
    setSubmitting(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/users/${id}`)
      .then((response) => {
        message.success("Usuário excluído com sucesso");
        setTimeout(() => {
          navigate("../users");
        }, 2000);
      })
      .catch((error) => {
        message.error("Erro! Falha ao excluir o usuário");
        setSubmitting(false);
        setConfirmLoading(false);
      });
  };

  const handleCancel = () => {
    setSubmitting(false);
    setOpenConfirmWindow(false);
  };

  const showConfirmation = () => {
    setSubmitting(true);
    setOpenConfirmWindow(true);
  };

  useEffect(() => {
    getUser(id);
  }, []);

  const showUserForm = () => {
    return (
      <Card style={{ width: "25dvw" }}>
        <Divider orientation="left">Editando informações do usuário</Divider>
        <br />
        <Space direction="vertical">
          <Form
            name={"user"}
            form={form}
            disabled={submitting}
            onFinish={(e) => handleSubmit(e)}
          >
            <Form.Item
              label={"Número da chapa"}
              name={"username"}
              normalize={(text) => useTrim(text)}
              rules={[{ required: true, message: "Digite o número da chapa" }]}
              required
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"Nome"}
              name={"name"}
              normalize={(text) => useTrim(text)}
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
            <Form.Item label={"Alterar senha"}>
              <Switch onChange={handleChangePassword} />
            </Form.Item>
            {showPasswordFields && (
              <>
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
              </>
            )}
            <Form.Item>
              <Button
                type={"primary"}
                htmlType="submit"
                disabled={submitting}
                icon={<FileProtectOutlined />}
              >
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Space>
        {parseInt(authUser.userId) !== user.id && (
          <Divider orientation="right" style={{ marginTop: "60px" }}>
            <Popconfirm
              title="Atenção!"
              description={
                <>
                  <p>Essa operaçao não poderá ser desfeita.</p>
                  <p>Deseja continuar?</p>
                </>
              }
              open={openConfirmWindow}
              onConfirm={handleDelete}
              onCancel={handleCancel}
              okText="Confirmar"
              cancelText="Cancelar"
              okButtonProps={{
                loading: confirmLoading,
              }}
              showCancel={!confirmLoading}
            >
              <Button
                onClick={showConfirmation}
                type="primary"
                danger
                size="small"
                ghost
                icon={<DeleteOutlined />}
                disabled={submitting}
              >
                Excluir usuário
              </Button>
            </Popconfirm>
          </Divider>
        )}
      </Card>
    );
  };

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {user && !error && showUserForm()}
    </>
  );
};

export default UsersUpdate;
