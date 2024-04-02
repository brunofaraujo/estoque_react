import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Divider, Form, Space, Input, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import useTrim from "../../hooks/useTrim";

const VolumesCreate = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volumes, setVolumes] = useState(undefined);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/volumes`)
      .then((response) => {
        if (response.data) {
          setVolumes(response.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleVolumeSubmit = (volumeData) => {
    if (submitting) return;
    setSubmitting(true);
    Object.keys(volumeData).map(
      (key) =>
        typeof volumeData[key] === "string" &&
        (volumeData[key] = volumeData[key].trim())
    );
    axios
      .post(`${import.meta.env.VITE_API_URL}/volumes`, volumeData)
      .then((response) => {
        setVolumes([...volumes, response.data]);
        message.success("Volume cadastrado com sucesso");
        setTimeout(() => {
          navigate("../volumes");
        }, 1000);
      })
      .catch((err) => {
        message.error(
          "Falha ao criar o volume. Verifique as informações digitadas e tente novamente"
        );
        if (err.response.data.code === "P2002") {
          if (err.response.data.meta.target[0] === "name") {
            message.error("Já existe um volume com o nome informado");
          }
        }
        setSubmitting(false);
      });
  };

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {volumes && !error && (
        <Card style={{ width: "25dvw" }}>
          <Divider orientation="left">Cadastrar novo tipo de volume</Divider>
          <br />
          <Space direction={"vertical"}>
            <Form
              name={"volume"}
              form={form}
              onFinish={(e) => handleVolumeSubmit(e)}
              disabled={submitting}
            >
              <Form.Item
                label={"Nome"}
                name={"name"}
                rules={[{ required: true, message: "Digite o nome do volume" }]}
                normalize={(text) => useTrim(text)}
                required
              >
                <Input style={{ width: "15dvw" }} />
              </Form.Item>
              <Form.Item
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "100px",
                }}
              >
                <Button
                  style={{ width: "150px", marginTop: "25px" }}
                  type={"primary"}
                  htmlType="submit"
                  icon={<FileProtectOutlined />}
                  disabled={submitting}
                >
                  Salvar
                </Button>
              </Form.Item>
            </Form>
          </Space>
          <Divider orientation="left" plain>
            Volumes cadastrados
          </Divider>
          {volumes.map((volume) => (
            <Tag key={volume.id} style={{ margin: "5px" }}>
              {volume.name}
            </Tag>
          ))}
        </Card>
      )}
    </>
  );
};

export default VolumesCreate;
