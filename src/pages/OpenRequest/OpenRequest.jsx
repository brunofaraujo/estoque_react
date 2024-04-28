import axios from "axios";
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  Divider,
  ConfigProvider,
  List,
  Tooltip,
  Tag,
  Modal,
  Result,
  Layout,
} from "antd";
import { useEffect, useState } from "react";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styles from "./OpenRequest.module.css";
import FooterComponent from "../../components/Footer/FooterComponent";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { Header } from "antd/es/layout/layout";
import sce_logo from "../../assets/sce.png";

const OpenRequest = () => {
  const [employees, setEmployees] = useState(undefined);
  const [items, setItems] = useState(undefined);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [selectedAmount, setSelectedAmount] = useState(undefined);
  const [selectedEmployee, setSelectedEmployee] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [selectedList, setSelectedList] = useState([]);
  const [modalOpen, setModalOpen] = useState(true);
  const [submissionSuccess, setSubmissionSuccess] = useState(undefined);
  const [requestCode, setRequestCode] = useState(undefined);
  const [requestId, setRequestId] = useState(undefined);
  const [requestStatusAuthorized, setRequestStatusAuthorized] =
    useState(undefined);
  const [requestValidationErrorMessage, setRequestValidationErrorMessage] =
    useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const { Content } = Layout;
  const getEmployees = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/requests/employees`)
      .then((response) => setEmployees(response.data))
      .catch((error) => setError(true));
  };

  const getItems = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/requests/items`)
      .then((response) => setItems(response.data))
      .catch((error) => setError(true));
  };

  const onChangeItem = (itemId) => {
    setSelectedItem(itemId);
  };

  const onChangeAmount = (amount) => {
    setSelectedAmount(amount);
  };

  const onChangeEmployee = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddItem = () => {
    const selected = {
      itemId: selectedItem,
      amount: selectedAmount,
    };
    setSelectedList((prev) => [...prev, selected]);
  };

  const handleRemoveItem = (i) => {
    setSelectedList(selectedList.filter((item) => item.itemId !== i));
  };

  const handleSubmitRequest = () => {
    const requestObject = {
      employeeId: selectedEmployee,
      description: description,
      requestAmounts: selectedList,
    };

    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/requests`, requestObject)
      .then((response) => {
        setRequestId(response.data.id);
        setSubmitting(false);
        setSubmissionSuccess(true);
        setModalOpen(true);
      })
      .catch((err) => {
        setSubmitting(false);
        setSubmissionSuccess(false);
        setModalOpen(true);
      });
  };

  const handleValidateRequest = () => {
    setSubmitting(true);
    setRequestValidationErrorMessage("");
    axios
      .post(`${import.meta.env.VITE_API_URL}/requests/validate`, {
        id: requestId,
        code: requestCode.toUpperCase().trim(),
      })
      .then((response) => {
        setRequestStatusAuthorized(true);
        setTimeout(() => {
          setModalOpen(false), setSubmitting(false), navigate("/");
        }, 10000);
      })
      .catch((error) => {
        if (error.response.data.message.includes("request code")) {
          setRequestValidationErrorMessage(
            "Código inválido. Confira a informação digitada e tente novamente."
          );
        }
        setRequestStatusAuthorized(false);
        setSubmitting(false);
      });
  };

  useEffect(() => {
    getEmployees();
    getItems();
  }, []);

  return (
    <>
      {error ? (
        <ErrorComponent />
      ) : (
        <Layout className={styles.wrapper}>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00948b",
              height: 70,
            }}
          >
            <div className={styles.navbar_logo}>
              <Link to={"/"}>
                <img src={sce_logo} width={100} />
              </Link>
            </div>
          </Header>
          <Content>
            {items && employees && (
              <Form form={form} disabled={submitting}>
                <Row
                  style={{ width: "100dvw", paddingTop: "5rem" }}
                  justify="center"
                >
                  <Col
                    xs={22}
                    sm={18}
                    md={15}
                    lg={13}
                    xl={8}
                    className={styles.col}
                  >
                    <Card title="Solicitante" size="small">
                      <Form.Item
                        name="requesterId"
                        rules={[
                          {
                            required: true,
                            message: "Selecione um colaborador",
                          },
                        ]}
                      >
                        <ConfigProvider
                          theme={{
                            components: {
                              Select: {
                                fontSize: 11,
                              },
                            },
                          }}
                        >
                          <Select
                            showSearch
                            placeholder="Colaborador"
                            allowClear
                            optionFilterProp="children"
                            size="small"
                            onChange={onChangeEmployee}
                            filterOption={(input, option) =>
                              option.children
                                .toUpperCase()
                                .indexOf(input.toUpperCase()) !== -1
                            }
                          >
                            {employees.map((employee) => (
                              <Option
                                value={employee.id}
                                key={`e${employee.id}`}
                              >
                                {employee.name}
                              </Option>
                            ))}
                          </Select>
                        </ConfigProvider>
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
                <Row justify="center" style={{ width: "100dvw" }}>
                  <Col
                    xs={22}
                    sm={18}
                    md={15}
                    lg={13}
                    xl={8}
                    className={styles.col}
                  >
                    <Card title="Justificativa" size="small">
                      <Form.Item
                        name="description"
                        rules={[
                          { required: true, message: "Campo necessário" },
                        ]}
                      >
                        <TextArea
                          autoSize={{
                            minRows: 2,
                            maxRows: 6,
                          }}
                          maxLength={255}
                          showCount
                          size="small"
                          onChange={handleDescriptionChange}
                        />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
                <Row style={{ width: "100dvw" }} justify="center">
                  <Col
                    xs={22}
                    sm={18}
                    md={15}
                    lg={13}
                    xl={8}
                    className={styles.col}
                  >
                    <Card title="Item" size="small">
                      <Form.Item
                        name="itemId"
                        rules={[{ required: true, message: "Defina um item" }]}
                      >
                        <ConfigProvider
                          theme={{
                            components: {
                              Select: {
                                fontSize: 10,
                              },
                            },
                          }}
                        >
                          <Select
                            showSearch
                            placeholder="Escolha o item"
                            allowClear
                            optionFilterProp="children"
                            popupMatchSelectWidth={false}
                            size="small"
                            onChange={onChangeItem}
                            filterOption={(input, option) =>
                              option.children
                                .toUpperCase()
                                .indexOf(input.toUpperCase()) !== -1
                            }
                          >
                            {items.map((item) => (
                              <Option
                                value={item.id}
                                key={`i${item.id}`}
                              >{`${item.title} - ${item.brand.name} - ${item.volume.name}`}</Option>
                            ))}
                          </Select>
                        </ConfigProvider>
                      </Form.Item>
                      <Divider orientation="left" plain>
                        Quantidade
                      </Divider>
                      <Space direction="horizontal" size="small">
                        <Space.Compact>
                          <Form.Item
                            name="amount"
                            rules={[
                              {
                                required: true,
                                message: "Quantidade",
                              },
                              {
                                pattern: new RegExp(/^[1-9]\d*$/g),
                                message: "Inválido",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "4rem" }}
                              size="small"
                              disabled={!selectedItem}
                              onChange={onChangeAmount}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              icon={<PlusCircleOutlined />}
                              size="small"
                              onClick={handleAddItem}
                              disabled={
                                !selectedItem ||
                                selectedAmount < 1 ||
                                !selectedAmount ||
                                selectedList.filter(
                                  (item) => item.itemId === selectedItem
                                ).length > 0
                              }
                            >
                              Adicionar
                            </Button>
                          </Form.Item>
                        </Space.Compact>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                {selectedList.length > 0 && (
                  <>
                    <Row style={{ width: "100dvw" }} justify="center">
                      <Col
                        xs={22}
                        sm={18}
                        md={15}
                        lg={13}
                        xl={8}
                        className={styles.col}
                      >
                        <Card size="small" title="Itens selecionados">
                          <List>
                            {selectedList.map((item) => {
                              const filtered = items.filter(
                                (sel) => sel.id === item.itemId
                              );

                              return (
                                <List.Item
                                  key={`s${filtered[0]["id"]}${Math.floor(
                                    Math.random() * (10000 - 1) + 1
                                  )}`}
                                  actions={[
                                    <Tooltip title="Remover item">
                                      <Button
                                        size="small"
                                        type="primary"
                                        danger
                                        icon={<MinusCircleOutlined />}
                                        onClick={() =>
                                          handleRemoveItem(item.itemId)
                                        }
                                      />
                                    </Tooltip>,
                                  ]}
                                >
                                  <Tag color="#108ee9">{`${item.amount}`}</Tag>{" "}
                                  {`${filtered[0]["title"]} - ${filtered[0]["volume"]["name"]}`}
                                </List.Item>
                              );
                            })}
                          </List>
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ width: "100dvw" }} justify="center">
                      <Col
                        xs={22}
                        sm={18}
                        md={15}
                        lg={13}
                        xl={{ span: 8 }}
                        className={styles.col}
                      >
                        <Button
                          className={styles.btn_send}
                          onClick={handleSubmitRequest}
                          disabled={
                            submitting || !selectedEmployee || !description
                          }
                          type="primary"
                          block
                          icon={<SendOutlined />}
                        >
                          Enviar solicitação
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            )}
            {submissionSuccess && (
              <Modal
                centered
                open={modalOpen}
                closable={false}
                footer={
                  !requestStatusAuthorized && [
                    <Button
                      type="primary"
                      onClick={handleValidateRequest}
                      key={"modal-btn-ok"}
                      disabled={!requestCode || submitting}
                    >
                      Enviar
                    </Button>,
                  ]
                }
              >
                <Result
                  status={
                    requestStatusAuthorized === undefined
                      ? "info"
                      : requestStatusAuthorized === true
                      ? "success"
                      : "error"
                  }
                  title={
                    requestStatusAuthorized === undefined
                      ? "Validação necessária"
                      : requestStatusAuthorized === true
                      ? "Solicitação validada com sucesso!"
                      : "Erro!"
                  }
                  subTitle={
                    requestStatusAuthorized === undefined ? (
                      <h3>Para confirmar a solicitação de material, digite o código de validação que foi enviado para o seu endereço de e-mail.</h3>
                    ) : requestStatusAuthorized === false ? (
                      <h3>{requestValidationErrorMessage}</h3>
                    ) : (
                      <h3>Aguarde até que a a gestão escolar avalie a disponibilidade do material e providencie a logística da entrega.</h3>
                    )
                  }
                />
                <Form name="validate-request-form">
                  <Form.Item
                    label="Código"
                    name="request-code"
                    rules={[
                      {
                        required: true,
                        message: "Digite o código",
                      },
                    ]}
                  >
                    <Input onChange={(e) => setRequestCode(e.target.value)} />
                  </Form.Item>
                </Form>
              </Modal>
            )}

            {submissionSuccess === false && (
              <Modal
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                destroyOnClose={true}
                closable={false}
                footer={[
                  <Button
                    type="primary"
                    onClick={() => setModalOpen(false)}
                    key={"modal-btn-error-ok"}
                  >
                    Ok
                  </Button>,
                ]}
              >
                <Result
                  status="error"
                  title="O envio falhou"
                  subTitle={<h3>Verifique se todos os campos foram preenchidos corretamente e tente novamente</h3>}
                />
              </Modal>
            )}
          </Content>
          <FooterComponent />
        </Layout>
      )}
    </>
  );
};

export default OpenRequest;
