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

const UsersUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useContext(UserContext);

  const getUser = (id) => {
    if (done) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${id}`)
      .then((response) => {
        setUser(response.data);
        form.setFieldsValue({
          username: response.data.username,
          name: response.data.name,
          email: response.data.email,
        });
      })
      .finally(() => {
        setLoading(false);
        setDone(true);
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let userObject = {};
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "password2") {
          userObject[key] = value;
        }
      });
      axios
        .patch(`${import.meta.env.VITE_API_URL}/users/${id}`, userObject)
        .then((response) => {
          message.success("Informações atualizadas");
          setTimeout(() => {
            navigate("/dashboard/users");
          }, 1300);
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
      console.log("Error: ", err);
    }
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
          <Form name={"updated_user"} form={form} disabled={submitting}>
            <Form.Item
              label={"Número da chapa"}
              name={"username"}
              rules={[{ required: true, message: "Digite o número da chapa" }]}
              required
            >
              <Input />
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
              </>
            )}
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
