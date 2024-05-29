import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Select,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useContext, useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useTrim from "../../hooks/useTrim";
import { UserContext } from "../../context/UserContext";

const ItemsCreate = () => {
  dayjs.extend(customParseFormat);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const dateFormat = "DD/MM/YYYY";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [brands, setBrands] = useState(null);
  const [categories, setCategories] = useState(null);
  const [volumes, setVolumes] = useState(null);
  const { user } = useContext(UserContext);

  const handleBrandChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const handleBrandSearch = (value) => {
    console.log(`Searched: ${value}`);
  };

  const handleItemSubmit = async (itemData) => {
    if (submitting) return;

    Object.keys(itemData).map(
      (key) =>
        typeof itemData[key] === "string" &&
        (itemData[key] = itemData[key].trim())
    );

    axios
      .post(`${import.meta.env.VITE_API_URL}/items`, {
        ...itemData,
        userId: parseInt(user.userId),
      })
      .then((response) => {
        setSubmitting(true);
        message.success("Item cadastrado com sucesso");
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

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

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

  const fetchData = async () => {
    await getBrands();
    await getCategories();
    await getVolumes();
  };

  useEffect(() => {
    fetchData() && setLoading(false);
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {brands && categories && volumes && !error && !loading && (
        <Card
          bordered
          style={{ width: "max-content", minWidth: "100%", overflow: "auto" }}
        >
          <Divider orientation="left">Cadastro de novo item</Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Flex vertical>
              <Form
                variant={"filled"}
                form={form}
                name={"item"}
                onFinish={(e) => handleItemSubmit(e)}
                disabled={submitting}
              >
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={20} lg={12}>
                    <Form.Item
                      labelAlign="left"
                      label={"Nome"}
                      name={"title"}
                      normalize={(text) => useTrim(text)}
                      rules={[
                        { required: true, message: "Digite o nome do item" },
                        { type: "string" },
                        { whitespace: true, message: "Nome inválido" },
                        { max: 100, message: "Limite de texto excedido" },
                      ]}
                    >
                      <Input
                        placeholder="Nome do item"
                        count={{
                          show: true,
                          max: 100,
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={20} md={14} lg={10} xl={8}>
                    <Form.Item
                      labelAlign="left"
                      label={"Marca"}
                      name={"brandId"}
                      rules={[{ required: true, message: "Selecione a marca" }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        onSearch={handleBrandSearch}
                        onChange={handleBrandChange}
                        filterOption={filterOption}
                        options={brands}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={12} sm={12} md={12} lg={8} xl={6}>
                    <Form.Item
                      labelAlign="left"
                      label={"Categoria"}
                      name={"categoryId"}
                      rules={[
                        { required: true, message: "Selecione a categoria" },
                      ]}
                    >
                      <Select options={categories} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={8} xl={6}>
                    <Form.Item
                      labelAlign="left"
                      label={"Volume"}
                      name={"volumeId"}
                      rules={[
                        { required: true, message: "Selecione o volume" },
                      ]}
                    >
                      <Select options={volumes} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                <Col xs={24} sm={24} md={20} lg={17} xl={18}>
                    <Form.Item
                      label="Descrição"
                      name={"description"}
                      labelAlign="left"
                      normalize={(text) => useTrim(text)}
                      rules={[
                        { type: "string" },
                        { max: 255, message: "Limite de texto excedido" },
                        {
                          whitespace: true,
                          message: "Remova os espaços em branco",
                        },
                      ]}
                    >
                      <TextArea
                        rows={4}
                        maxLength={255}
                        count={{
                          show: true,
                          max: 255,
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={12} sm={12} md={12} lg={8} xl={6}>
                    <Form.Item
                      labelAlign="left"
                      label={"Patrimônio"}
                      name={"register"}
                      normalize={(text) => useTrim(text)}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={8} xl={6}>
                    <Form.Item
                      labelAlign="left"
                      label={"Validade"}
                      name={"expiration"}
                    >
                      <DatePicker
                        minDate={dayjs()}
                        format={dateFormat}
                        placeholder={"DD/MM/YYYY"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      label={"N° Série"}
                      normalize={(text) => useTrim(text)}
                      name={"serial"}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      label={"Lote"}
                      name={"batch"}
                      normalize={(text) => useTrim(text)}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Item
                      labelAlign="left"
                      label={"Quantidade inicial"}
                      name={"amount"}
                      rules={[
                        { required: true, message: "Especifique a quantidade" },
                        {
                          pattern: new RegExp(/^[1-9]\d*$/g),
                          message:
                            "Digite um número válido (inteiro e positivo)",
                        },
                      ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row justify="start">
                  <Col>
                      <Form.Item>
                        <Button
                          type={"primary"}
                          htmlType="submit"
                          disabled={submitting}
                          icon={<FileProtectOutlined />}
                          style={{ width: "300px", fontWeight: "600" }}
                        >
                          Cadastrar item
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

export default ItemsCreate;
