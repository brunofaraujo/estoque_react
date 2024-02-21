import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../../components/Error/ErrorComponent";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Space,
  message,
} from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const EmployeesCreate = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEmployeeSubmit = (employeeData) => {
    if (submitting) return;
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/employees`, employeeData)
      .then((response) => {
        message.success("Colaborador cadastrado com sucesso");
        setTimeout(() => {
          navigate("../employees");
        }, 1000);
      })
      .catch((err) => {
        if (
          err.response.data.message &&
          err.response.data.message[0].includes("number")
        ) {
          message.error("O formato da chapa digitada é inválido");
        } else {
          message.error(
            "Falha ao registrar colaborador. Verifique as informações digitadas e tente novamente"
          );
        }

        if (err.response.data.code === "P2002") {
          if (err.response.data.meta.target[0] === "register") {
            message.error(
              "Já existe um colaborador com o número da chapa informada"
            );
          }
        }
        setSubmitting(false);
      });
  };

  const departments = [
    {
      value: "Administrativo",
      label: "Administrativo",
    },
    {
      value: "Pedagógico",
      label: "Pedagógico",
    },
    {
      value: "Terceirizado",
      label: "Terceirizado",
    },
    {
      value: "DR",
      label: "DR",
    },
    {
      value: "DN",
      label: "DN",
    },
    {
      value: "Financeiro",
      label: "Financeiro",
    },
    {
      value: "Professor",
      label: "Professor",
    },
    {
      value: "Secretaria",
      label: "Secretaria",
    },
  ];

  const checkAuth = async (isAuthenticated) => {
    (await isAuthenticated) ? true : false;
  };

  return (
    <>
      {checkAuth(isAuthenticated) ? (
        <Card style={{ width: "50dvw" }}>
          <Divider orientation="left">Cadastrar novo colaborador</Divider>
          <br />
          <Space direction="vertical">
            <Form
              variant={"filled"}
              name={"employee"}
              onFinish={(e) => handleEmployeeSubmit(e)}
              disabled={submitting}
              form={form}
              style={{ display: "flex", flexDirection: "column", gap: "30px" }}
            >
              <Space>
                <Form.Item
                  labelAlign="left"
                  label={"Nome"}
                  name={"name"}
                  rules={[{ required: true, message: "Digite um nome" }]}
                  style={{ paddingRight: "40px" }}
                >
                  <Input style={{ width: "600px" }} />
                </Form.Item>
              </Space>
              <Space>
                <Form.Item
                  labelAlign="left"
                  label={"Chapa"}
                  name={"register"}
                  rules={[{ required: true, message: "Digite o número" }]}
                  style={{ paddingRight: "40px" }}
                >
                  <Input placeholder="Ex.: 01234" style={{ width: "250px" }} />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  label={"Setor"}
                  name={"department"}
                  rules={[{ required: true, message: "Selecione um setor" }]}
                  style={{ paddingRight: "60px" }}
                >
                  <Select style={{ width: "150px" }} options={departments} />
                </Form.Item>
              </Space>
              <Space direction="vertical" style={{ alignSelf: "center" }}>
                <Form.Item>
                  <Button
                    type={"primary"}
                    htmlType="submit"
                    disabled={submitting}
                    icon={<FileProtectOutlined />}
                    style={{ width: "200px", fontWeight: "600" }}
                  >
                    Atualizar informações
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Space>
        </Card>
      ) : (
        <ErrorComponent />
      )}
    </>
  );
};

export default EmployeesCreate;
