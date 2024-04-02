import { useContext, useEffect, useState } from "react";
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
import { UserContext } from "../../context/UserContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useTrim from "../../hooks/useTrim";
import { departments } from "./departments";

const EmployeesCreate = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleEmployeeSubmit = (employeeData) => {
    if (submitting) return;
    setSubmitting(true);
    Object.keys(employeeData).map(
      (key) =>
        typeof employeeData[key] === "string" &&
        (employeeData[key] = employeeData[key].trim())
    );
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
          };
          if (err.response.data.meta.target[0] === "name") {
            message.error(
              "Já existe um colaborador com o nome informado"
            );
          }
        }
        setSubmitting(false);
      });
  };

  useEffect(() => {
    user && setLoading(false)
  },[])

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {user && !error && (
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
                  normalize={(text) => useTrim(text)}
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
                  normalize={(text) => useTrim(text)}
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
      )}
    </>
  );
};

export default EmployeesCreate;
