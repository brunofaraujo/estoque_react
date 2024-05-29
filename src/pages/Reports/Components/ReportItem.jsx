import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import ptBR from "antd/locale/pt_BR";
import axios from "axios";
import { FileProtectOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../../components/Error/ErrorComponent";
import { UserContext } from "../../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";

const ReportItem = () => {
  const [items, setItems] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportData, setReportData] = useState(undefined);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const { user } = useContext(UserContext);
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const fetchData = async () => {
    itemId ? await getItem(itemId) : setReportData(undefined);
    await getItems();
  };

  const getItem = async (itemId) => {
    await handleSubmit({ itemId: parseInt(itemId) });
  };

  const getItems = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items?includeDeleted=true`)
      .then((response) => {
        const itemsObj = [];
        response.data.map((item) =>
          itemsObj.push({
            ...itemsObj,
            value: item.id,
            label: `${item.title} ${item.deleted ? "(Deletado)" : ""}`,
          })
        );
        setItems(itemsObj);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    setSearchText("");
    setLoading(true);
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/reports/item`, e)
      .then((response) => {
        setReportData(response.data);
        setLoading(false);
        setSubmitting(false);
      })
      .catch((error) => {
        setLoading(false);
        setSubmitting(false);
        setError(true);
      });
  };

  const tableColumns = [
    {
      title: "Histórico de movimentações",
      children: [
        {
          title: "Tipo",
          dataIndex: "type",
          key: "type",
          width: "5%",
          sorter: (a, b) => a.type.localeCompare(b.type),
          sortDirections: ["ascend", "descend", "ascend"],
          render: (type) =>
            type === "I" ? (
              <Tag color="green">Entrada</Tag>
            ) : (
              <Tag color="volcano">Saída</Tag>
            ),
        },
        {
          title: "Quantidade",
          dataIndex: "amount",
          key: "amount",
          width: "5%",
          sorter: (a, b) => a.amount - b.amount,
          sortDirections: ["ascend", "descend", "ascend"],
        },

        {
          title: "Data",
          dataIndex: "createdAt",
          key: "createdAt",
          width: "10%",
          sorter: (a, b) =>
            dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
          sortDirections: ["ascend", "descend", "ascend"],
          render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
          defaultSortOrder: "ascend",
        },
        {
          title: "Observação",
          key: "description",
          dataIndex: "description",
          width: "35%",
          sorter: (a, b) =>
            (a.description ? a.description : "") <
            (b.description ? b.description : "")
              ? -1
              : 1,
          sortDirections: ["ascend", "descend", "ascend"],
        },
        {
          title: "Solicitante",
          key: "requester",
          dataIndex: ["requester", "name"],
          sorter: (a, b) =>
            (a.requester ? a.requester.name : "") <
            (b.requester ? b.requester.name : "")
              ? -1
              : 1,
          sortDirections: ["ascend", "descend", "ascend"],
        },
        {
          title: "Operador",
          key: "user",
          dataIndex: ["user", "name"],
          sorter: (a, b) => a.user.name.localeCompare(b.user.name),
          sortDirections: ["ascend", "descend", "ascend"],
          render: (name) => name.split(" ")[0],
        },
      ],
    },
  ];

  const parseTableData = () => {
    return reportData.supply.history.map((move) => {
      return {
        ...move,
        key: move.id,
      };
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const reactivateItem = () => {
    if (submitting) return;
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/items/restore`, {
        itemId: reportData.id,
      })
      .then((res) => {
        message.success("O foi reintegrado ao inventário com saldo zerado");
        setTimeout(() => {
          navigate("/dashboard/items");
        }, 1500);
      })
      .catch((err) => {
        setSubmitting(false);
        setLoading(false);
        message.error("Falha ao restaurar item no inventário");
      });
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {!loading && !error && items && (
        <>
          {!itemId && (
            <Form
              variant={"filled"}
              form={form}
              onFinish={handleSubmit}
              disabled={submitting}
            >
              <Space size="middle" wrap>
                <Form.Item
                  labelAlign="left"
                  label={"Selecione o item"}
                  name={"itemId"}
                  rules={[
                    { required: true, message: "Preencha o campo necessário" },
                  ]}
                  style={{ paddingRight: "60px" }}
                >
                  <Select
                    style={{ width: "300px" }}
                    options={items}
                    showSearch
                    filterOption={filterOption}
                    optionFilterProp="children"
                    onChange={() => setReportData(undefined)}
                  />
                </Form.Item>
              </Space>
              <Space style={{ margin: "auto 0", alignSelf: "center" }}>
                <Form.Item noStyle>
                  <Button
                    type={"primary"}
                    htmlType="submit"
                    disabled={submitting}
                    icon={<FileProtectOutlined />}
                    style={{ width: "150px", fontWeight: "600" }}
                  >
                    Gerar relatório
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          )}
          {reportData && (
            <>
              <Col span={24}>
                <Card bordered={true}>
                  <Descriptions title={reportData.title}>
                    <Descriptions.Item label={"Marca"}>
                      {reportData.brand.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Volume"}>
                      {reportData.volume.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Categoria"}>
                      {reportData.category.name}
                    </Descriptions.Item>
                    {reportData.description && (
                      <Descriptions.Item label={"Descrição"} span={12}>
                        {reportData.description}
                      </Descriptions.Item>
                    )}
                    {reportData.register && (
                      <Descriptions.Item label={"Patrimônio"}>
                        {reportData.register}
                      </Descriptions.Item>
                    )}
                    {reportData.serial && (
                      <Descriptions.Item label={"N° Série"}>
                        {reportData.serial}
                      </Descriptions.Item>
                    )}
                    {reportData.batch && (
                      <Descriptions.Item label={"Lote"}>
                        {reportData.batch}
                      </Descriptions.Item>
                    )}
                    {reportData.expiration && (
                      <Descriptions.Item label={"Validade"}>
                        {dayjs(reportData.expiration).format("DD/MM/YYYY")}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label={"Inativo/Deletado"}>
                      {reportData.deleted ? "Sim" : "Não"}
                      {reportData.deleted && (
                        <Button
                          size="small"
                          style={{ marginLeft: 15, padding: 0 }}
                          onClick={reactivateItem}
                          disabled={submitting}
                        >
                          <Tag
                            color="green-inverse"
                            style={{
                              width: "100%",
                              height: "100%",
                              textAlign: "center",
                            }}
                          >
                            Reativar
                          </Tag>
                        </Button>
                      )}
                    </Descriptions.Item>
                    {!reportData.deleted && (
                      <Descriptions.Item label={"Disponibilidade"}>
                        {reportData.supply.current === 0 && (
                          <Tag color="orange-inverse">Indisponível</Tag>
                        )}
                        {reportData.supply.current === 1 &&
                          `${
                            reportData.supply.current
                          } ${reportData.volume.name.toLowerCase()}`}
                        {reportData.supply.current > 1 &&
                          `${
                            reportData.supply.current
                          } ${reportData.volume.name.toLowerCase()}s`}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label={"Data cadastro"}>
                      {dayjs(reportData.supply.createdAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Última movimentação"}>
                      {dayjs(reportData.supply.updatedAt).format(
                        "DD/MM/YYYY HH:mm"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Movimentações associadas"}>
                      {reportData.supply._count.history}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Flex gap={30} style={{ marginTop: 30 }}>
                <Table
                  style={{ width: "80dvw" }}
                  columns={tableColumns}
                  dataSource={parseTableData()}
                  locale={ptBR}
                  size="large"
                  bordered
                  footer={() =>
                    `Relatório gerado por ${user.name} em ${dayjs().format(
                      "DD/MM/YYYY - HH:mm"
                    )}`
                  }
                />
              </Flex>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ReportItem;
