import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Button,
  Card,
  Divider,
  Form,
  Space,
  Input,
  Tag,
  message,
  Popconfirm,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

const VolumesUpdate = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volumes, setVolumes] = useState(undefined);
  const [volume, setVolume] = useState(undefined);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/volumes/${id}`)
      .then((response) => {
        if (response.data) {
          setVolume(response.data);
          form.setFieldValue("name", response.data.name);
        } else {
          setError(true);
        }
      })
      .catch((error) => setError(true))
      .finally(() => setLoading(false));

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
    axios
      .patch(`${import.meta.env.VITE_API_URL}/volumes/${id}`, volumeData)
      .then((response) => {
        message.success("Volume atualizado com sucesso");
        setTimeout(() => {
          navigate("../volumes");
        }, 1000);
      })
      .catch((err) => {
        message.error(
          "Falha ao atualizar o volume. Verifique as informações digitadas e tente novamente"
        );
        setSubmitting(false);
      });
  };

  const handleDelete = () => {
    setConfirmLoading(true);
    setSubmitting(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/volumes/${id}`)
      .then((response) => {
        message.success("Volume excluído com sucesso");
        setTimeout(() => {
          navigate("../volumes");
        }, 2000);
      })
      .catch((error) => {
        if (error.response.data.code && error.response.data.code === "P2003") {
          message.error("Erro! Volumes com items associados não podem ser removidos")
        } else {
          message.error("Falha ao atualizar o volume");
        }        
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

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {volumes && volume && !error && (
        <Card style={{ width: "25dvw" }}>
          <Divider orientation="left">Editar volume</Divider>
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
                Excluir volume
              </Button>
            </Popconfirm>
          </Divider>
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

export default VolumesUpdate;
