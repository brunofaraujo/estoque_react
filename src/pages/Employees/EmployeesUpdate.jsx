import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  message,
} from "antd";
import useTrim from "../../hooks/useTrim";
import { departments } from "./departments";

const EmployeesUdate = () => {
  const [error, setError] = useState(false);
  const [employee, setEmployee] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleEmployeeSubmit = (employeeData) => {
    if (submitting) return;
    setSubmitting(true);
    Object.keys(employeeData).map(
      (key) =>
        typeof employeeData[key] === "string" &&
        (employeeData[key] = employeeData[key].trim())
    );
    axios
      .patch(`${import.meta.env.VITE_API_URL}/employees/${id}`, employeeData)
      .then((response) => {
        message.success("Colaborador atualizado com sucesso");
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

  const handleCancel = () => {
    setSubmitting(false);
    setOpenConfirmWindow(false);
  };

  const showConfirmation = () => {
    setSubmitting(true);
    setOpenConfirmWindow(true);
  };
  const handleDelete = () => {
    setConfirmLoading(true);
    setSubmitting(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/employees/${id}`)
      .then((response) => {
        message.success("Colaborador excluído com sucesso");
        setTimeout(() => {
          navigate("../employees");
        }, 2000);
      })
      .catch((error) => {
        if (error.response.data.code && error.response.data.code === "P2003") {
          message.error(
            "Erro! Colaboradores com movimentações associadas não podem ser removidos"
          );
        } else {
          message.error("Falha ao remover colaborador");
        }
        setSubmitting(false);
        setConfirmLoading(false);
      });
  };


  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees/${id}`)
      .then((response) => {
        if (response.data) {
          setEmployee(response.data);
          form.setFieldsValue({
            name: response.data.name,
            register: response.data.register,
            department: response.data.department,
          });
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {employee && !error && (
        <Card style={{ width: "50dvw" }}>
          <Divider orientation="left">
            Editando informações do colaborador
          </Divider>
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
                  normalize={(text) => useTrim(text)}
                >
                  <Input
                    placeholder="Nome do item"
                    style={{ width: "700px" }}
                  />
                </Form.Item>
              </Space>
              <Space>
                <Form.Item
                  labelAlign="left"
                  label={"Chapa"}
                  name={"register"}
                  rules={[{ required: true, message: "Digite o número" }]}
                  style={{ paddingRight: "40px" }}
                  normalize={(text) => useTrim(text)}
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
                Excluir colaborador
              </Button>
            </Popconfirm>
          </Divider>
        </Card>
      )}
    </>
  );
};

export default EmployeesUdate;
