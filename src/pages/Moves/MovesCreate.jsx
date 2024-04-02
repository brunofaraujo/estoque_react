import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorComponent from "../../components/Error/ErrorComponent";
import {
  Form,
  Card,
  Divider,
  Radio,
  Space,
  Button,
  Select,
  Descriptions,
  InputNumber,
  Input,
  message,
  Layout,
} from "antd";
import { GrDirections } from "react-icons/gr";
import { VscRepoForcePush, VscRepoPull } from "react-icons/vsc";
import { UserContext } from "../../context/UserContext";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import useTrim from "../../hooks/useTrim";

const MovesCreate = () => {
  const { id } = useParams();
  const [item, setItem] = useState(undefined);
  const [items, setItems] = useState(undefined);
  const [employees, setEmployees] = useState(undefined);
  const [details, setDetails] = useState(undefined);
  const [error, setError] = useState(false);
  const [moveType, setMoveType] = useState(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const getItem = (itemId) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items/${itemId}`)
      .then((response) => {
        if (response.data) {
          const detailsObj = [];
          Object.keys(response.data).forEach((field) => {
            field === "batch" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Lote",
                children: response.data[field],
                span: 3,
              });
            field === "category" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Categoria",
                children: response.data[field].name,
              });
            field === "description" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Descrição",
                children: response.data[field],
                span: 4,
              });
            field === "expiration" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Validade",
                children: dayjs(response.data[field]).format("DD/MM/YYYY"),
              });
            field === "register" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Patrimônio",
                children: response.data[field],
                span: 3,
              });
            field === "serial" &&
              response.data[field] &&
              detailsObj.push({
                key: field,
                label: "Serial",
                children: response.data[field],
                span: 3,
              });
          });

          setDetails(detailsObj);
          setItem(response.data);
          form.setFieldValue("supplyId", response.data.supply.id);
        } else {
          setItem(undefined);
          setDetails(undefined);
          form.setFieldValue("supplyId", undefined);
        }
      })
      .catch((error) => setError(true));
  };

  const getItems = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items`)
      .then((response) => {
        const responseObj = [];
        response.data.map((item) =>
          responseObj.push({ ...item, value: item.title })
        );
        setItems(responseObj);
      })
      .catch((error) => setError(true));
  };

  const getEmployees = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees`)
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => setError(true));
  };

  const handleMoveTypeChange = (e) => {
    e.target.value === "I" && form.setFieldValue("requesterId", undefined);
    setMoveType(e.target.value);
    form.validateFields();
  };

  const handleMoveSubmit = (e) => {
    setSubmitting(true);
    const moveObj = { ...e, userId: parseInt(user.userId) };
    axios
      .post(`${import.meta.env.VITE_API_URL}/items/move`, moveObj)
      .then((response) => {
        message.success("Movimentação realizada com sucesso!");
        setTimeout(() => {
          navigate("/dashboard/items");
        }, 1000);
      })
      .catch((error) => {
        message.error(
          "Falha ao movimentar o item. Verifique as informações digitadas e tente novamente"
        );
        setSubmitting(false);
        console.log(error);
      });
  };

  const onChangeItem = (itemId) => {
    itemId && getItem(itemId);
  };

  useEffect(() => {
    id && getItem(id);
    getItems();
    getEmployees();
    setLoading(false);
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {!error && items && (
        <Card bordered style={{ width: "70dvw" }}>
          <Divider orientation="left">
            Registrar movimentação do estoque
          </Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Content>
              <Space direction="vertical">
                <Form
                  variant={"outlined"}
                  form={form}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                  name="move"
                  onFinish={handleMoveSubmit}
                  disabled={submitting}
                >
                  <Space direction="horizontal">
                    <Card
                      size="small"
                      title="Tipo do movimento"
                      style={{ width: 200, height: 150 }}
                    >
                      <Form.Item
                        name="type"
                        rules={[{ required: true, message: "Marque um tipo" }]}
                      >
                        <Radio.Group
                          onChange={handleMoveTypeChange}
                          value={moveType}
                          optionType="button"
                        >
                          <Space
                            direction="vertical"
                            style={{ display: "grid", placeItems: "center" }}
                          >
                            <Radio
                              value="I"
                              style={{
                                width: 170,
                                height: 40,
                                display: "flex",
                                flexWrap: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: 20,
                                  fontWeight: "bold",
                                  alignItems: "center",
                                }}
                              >
                                <VscRepoForcePush
                                  size={35}
                                  style={{ paddingTop: 5 }}
                                />
                                Entrada
                              </span>
                            </Radio>
                            <Radio
                              value="O"
                              style={{
                                width: 170,
                                height: 40,
                                display: "flex",
                                flexWrap: "nowrap",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  gap: 20,
                                  fontWeight: "bold",
                                  alignItems: "center",
                                }}
                              >
                                <VscRepoPull
                                  size={35}
                                  style={{ paddingTop: 5 }}
                                />
                                Saída
                              </span>
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Card>
                    <Card
                      size="small"
                      title="Selecione o item"
                      style={{ width: 700, height: 150 }}
                    >
                      <Form.Item
                        name="supplyId"
                        rules={[
                          { required: true, message: "Selecione um item" },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Escolha o item"
                          optionFilterProp="children"
                          onChange={onChangeItem}
                          allowClear
                          filterOption={(input, option) =>
                            option.children
                              .toUpperCase()
                              .indexOf(input.toUpperCase()) !== -1
                          }
                        >
                          {items.map((item) => (
                            <Option
                              value={item.supply.id}
                              key={item.id}
                            >{`${item.title} - ${item.brand.name} - ${item.volume.name}`}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Card>
                  </Space>

                  {item && moveType && employees && (
                    <>
                      <Space direction="horizontal">
                        <Card
                          size="small"
                          title="Quantidade"
                          bordered
                          style={{ width: 400 }}
                        >
                          <Descriptions
                            size="small"
                            layout="vertical"
                            bordered
                            items={[
                              {
                                label: "Em estoque",
                                children: (
                                  <span style={{ fontWeight: "bold" }}>
                                    {item.supply.current}
                                  </span>
                                ),
                                span: 1,
                              },
                              {
                                label: "Volume",
                                children: item.volume.name,
                                span: 2,
                              },
                              {
                                label: "Total a mover",
                                children: (
                                  <Form.Item
                                    name="amount"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Especifique a quantidade",
                                      },
                                      {
                                        pattern: new RegExp(/^[1-9]\d*$/g),
                                        message:
                                          "Digite um número válido (inteiro e positivo)",
                                      },
                                      {
                                        type: "number",
                                        max:
                                          moveType === "O" &&
                                          item.supply.current,
                                        message: "Limite máximo excedido",
                                      },
                                    ]}
                                  >
                                    <InputNumber style={{ width: "100px" }} />
                                  </Form.Item>
                                ),
                              },
                            ]}
                          />
                        </Card>
                        <Card
                          size="small"
                          title="Solicitante"
                          style={{ width: 500, height: 100, marginTop: -126 }}
                        >
                          <Form.Item
                            name="requesterId"
                            rules={[
                              {
                                required: moveType === "O",
                                message: "Selecione um colaborador",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Escolha o colaborador"
                              allowClear
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.children
                                  .toUpperCase()
                                  .indexOf(input.toUpperCase()) !== -1
                              }
                            >
                              {employees.map((employee) => (
                                <Option value={employee.id} key={employee.id}>
                                  {employee.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Card
                            size="small"
                            title="Observações"
                            style={{ width: 500, height: 147, marginLeft: -12 }}
                          >
                            <Form.Item
                              name={"description"}
                              labelAlign="left"
                              normalize={(text) => useTrim(text)}
                              rules={[
                                { type: "string" },
                                {
                                  max: 255,
                                  message: "Limite de texto excedido",
                                },
                                {
                                  whitespace: true,
                                  message: "Remova os espaços em branco",
                                },
                              ]}
                            >
                              <TextArea
                                rows={3}
                                maxLength={255}
                                count={{
                                  show: true,
                                  max: 255,
                                }}
                              />
                            </Form.Item>
                          </Card>
                        </Card>
                      </Space>

                      <Space>
                        <Button
                          type={"primary"}
                          htmlType="submit"
                          disabled={submitting}
                          loading={submitting}
                          style={{ width: "200px", fontWeight: "600" }}
                          icon={<GrDirections size={18} />}
                        >
                          Gerar movimentação
                        </Button>
                      </Space>
                    </>
                  )}
                </Form>
              </Space>
            </Content>
            <Sider theme="light" width={"29%"} style={{ marginTop: 7 }}>
              <Space direction="vertical">
                <Descriptions
                  bordered
                  size="small"
                  items={details}
                  layout="vertical"
                />
              </Space>
            </Sider>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default MovesCreate;
