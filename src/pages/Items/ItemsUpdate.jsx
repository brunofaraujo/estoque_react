import {
  Card,
  DatePicker,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Button,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileProtectOutlined } from "@ant-design/icons";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const ItemsUpdate = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const navigate = useNavigate();

  const [item, setItem] = useState(undefined);
  const [brands, setBrands] = useState(undefined);
  const [categories, setCategories] = useState(undefined);
  const [volumes, setVolumes] = useState(undefined);

  useEffect(() => {
    if (item) return;
    fetchData();
  }, []);

  const fetchData = async () => {
    await getBrands();
    await getCategories();
    await getVolumes();
    await getItem();
    setLoading(false);
  };

  const handleItemSubmit = async (itemData) => {
    console.log(itemData)
    if (submitting) return;
    await axios
      .patch(`${import.meta.env.VITE_API_URL}/items/${id}`, itemData)
      .then((response) => {
        setSubmitting(true);
        message.success("Item atualizado com sucesso");
        setTimeout(() => {
          navigate("../items");
        }, 1000);
      })
      .catch((error) => {
        if (error.response.data.message) {
          let customErrorMessage = "Erro! Verifique os campos digitados: \n";
          let messageSuffix = "";
          error.response.data.message.forEach(async (errorMessage) => {
            if (errorMessage.includes("title"))
              messageSuffix = messageSuffix.concat("Nome; \n");
            if (errorMessage.includes("brand"))
              messageSuffix = messageSuffix.concat("Marca; \n");
            if (errorMessage.includes("category"))
              messageSuffix = messageSuffix.concat("Categoria; \n");
            if (errorMessage.includes("volume"))
              messageSuffix = messageSuffix.concat("Volume; \n");
            if (errorMessage.includes("description"))
              messageSuffix = messageSuffix.concat("Descrição; \n");
            if (errorMessage.includes("register"))
              messageSuffix = messageSuffix.concat("Patrimônio; \n");
            if (errorMessage.includes("title"))
              messageSuffix = messageSuffix.concat("Nome; \n");
            if (errorMessage.includes("expiration"))
              messageSuffix = messageSuffix.concat("Data de validade; \n");
            if (errorMessage.includes("serial"))
              messageSuffix = messageSuffix.concat("Número de série; \n");
            if (errorMessage.includes("batch"))
              messageSuffix = messageSuffix.concat("Lote; \n");
            if (errorMessage.includes("amount"))
              messageSuffix = messageSuffix.concat("Quantidade; \n");
          });
          message.error(customErrorMessage + messageSuffix);
        } else {
          message.error(
            "Falha ao salvar o item. Verifique as informações digitadas e tente novamente"
          );
        }
      });
  };

  const getBrands = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/brands`)
      .then((response) => {
        const brandsObj = [];
        response.data.map((brand) =>
          brandsObj.push({ ...brandsObj, value: brand.id, label: brand.name })
        );
        setBrands(brandsObj);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const getCategories = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => {
        const categoriesObj = [];
        response.data.map((category) =>
          categoriesObj.push({
            ...categoriesObj,
            value: category.id,
            label: category.name,
          })
        );
        setCategories(categoriesObj);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const getVolumes = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/volumes`)
      .then((response) => {
        const volumesObj = [];
        response.data.map((volume) =>
          volumesObj.push({
            ...volumesObj,
            value: volume.id,
            label: volume.name,
          })
        );
        setVolumes(volumesObj);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const getItem = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items/${id}`)
      .then((response) => {
        if (response.data) {
          setItem(response.data);
          form.setFieldsValue({
            title: response.data.title,
            brandId: response.data.brand.deleted
              ? null
              : response.data.brand.id,
            categoryId: response.data.category.deleted
              ? null
              : response.data.category.id,
            volumeId: response.data.volume.deleted
              ? null
              : response.data.volume.id,
            description: response.data.description,
            register: response.data.register,
            serial: response.data.serial,
            batch: response.data.batch,
          });
          if (response.data.expiration) {
            form.setFieldValue("expiration", dayjs(response.data.expiration));
          }
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setError(true);
      });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {brands && categories && volumes && item && !error && (
        <Card direction={"vertical"} style={{ width: "80dvw" }}>
          <Divider orientation="left">Editando informações do item</Divider>
          <br />
          <Space direction={"vertical"}>
            <Form
              variant={"filled"}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              name={"item"}
              onFinish={(e) => handleItemSubmit(e)}
              disabled={submitting}
              form={form}
            >
              <Space size="middle" wrap>
                <Form.Item
                  labelAlign="left"
                  label={"Nome"}
                  name={"title"}
                  rules={[
                    { required: true, message: "Digite o nome do item" },
                    { type: "string" },
                    { whitespace: true, message: "Nome inválido" },
                    { max: 100, message: "Limite de texto excedido" },
                  ]}
                  style={{ paddingRight: "40px" }}
                >
                  <Input
                    placeholder="Nome do item"
                    style={{ width: "750px" }}
                    count={{
                      show: true,
                      max: 100,
                    }}
                  />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  label={"Marca"}
                  name={"brandId"}
                  rules={[{ required: true, message: "Selecione a marca" }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    // onSearch={handleBrandSearch}
                    // onChange={handleBrandChange}
                    filterOption={filterOption}
                    style={{
                      width: "250px",
                    }}
                    options={brands}
                  />
                </Form.Item>
              </Space>
              <Space size="middle" wrap>
                <Form.Item
                  labelAlign="left"
                  label={"Categoria"}
                  name={"categoryId"}
                  rules={[{ required: true, message: "Selecione a categoria" }]}
                  style={{ paddingRight: "60px" }}
                >
                  <Select style={{ width: "150px" }} options={categories} />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  label={"Volume"}
                  name={"volumeId"}
                  rules={[{ required: true, message: "Selecione o volume" }]}
                >
                  <Select style={{ width: "150px" }} options={volumes} />
                </Form.Item>
              </Space>
              <Space size="middle">
                <Form.Item
                  label="Descrição"
                  name={"description"}
                  labelAlign="left"
                  rules={[
                    { type: "string" },
                    { max: 255, message: "Limite de texto excedido" },
                    {
                      whitespace: true,
                      message: "Remova os espaços em branco",
                    },
                  ]}
                  normalize={(value) => value.trim()}
                >
                  <TextArea
                    rows={4}
                    maxLength={255}
                    style={{ width: "720px" }}
                    count={{
                      show: true,
                      max: 255,
                    }}
                  />
                </Form.Item>
              </Space>
              <Space wrap size="middle">
                <Form.Item
                  labelAlign="left"
                  label={"Patrimônio"}
                  name={"register"}
                  style={{ paddingRight: "40px" }}
                >
                  <Input style={{ width: "150px" }} />
                </Form.Item>

                <Form.Item
                  labelAlign="left"
                  label={"Validade"}
                  name={"expiration"}
                  style={{ paddingRight: "40px" }}
                >
                  <DatePicker
                    minDate={dayjs()}
                    format={dateFormat}
                    placeholder={"DD/MM/YYYY"}
                  />
                </Form.Item>
                <Form.Item
                  labelAlign="left"
                  label={"N° Série"}
                  name={"serial"}
                  style={{ paddingRight: "40px" }}
                >
                  <Input style={{ width: "150px" }} />
                </Form.Item>

                <Form.Item
                  labelAlign="left"
                  label={"Lote"}
                  name={"batch"}
                  style={{ paddingRight: "40px" }}
                >
                  <Input style={{ width: "150px" }} />
                </Form.Item>
              </Space>
              <Space style={{ alignSelf: "center" }}>
                <Form.Item noStyle>
                  <Button
                    type={"primary"}
                    htmlType="submit"
                    disabled={submitting}
                    icon={<FileProtectOutlined />}
                    style={{ width: "150px", fontWeight: "600" }}
                  >
                    Salvar item
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

export default ItemsUpdate;
