import axios from "axios";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../../components/Error/ErrorComponent";
import Highlighter from "react-highlight-words";
import { RiSurveyLine, RiFileWarningFill, RiFileAddFill } from "react-icons/ri";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Select,
  Space,
  Statistic,
  Table,
  Input,
  Tag,
} from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ptBR from "antd/locale/pt_BR";
import { SearchOutlined } from "@ant-design/icons";

const ReportCategory = ({ report }) => {
  const [categories, setCategories] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportData, setReportData] = useState(undefined);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    getData();
  }, []);

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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={"Pesquisar item"}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 100,
            }}
          >
            Pesquisar
          </Button>

          <Button
            onClick={() => {
              confirm({ closeDropdown: true });
              handleReset(clearFilters);
              handleSearch("", confirm, "");
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Limpar
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const tableColumns = [
    {
      title: "Informações",
      children: [
        {
          title: "Item",
          dataIndex: "title",
          key: "title",
          width: "50%",
          ...getColumnSearchProps("title"),
          sorter: (a, b) => a.title.localeCompare(b.title),
          sortDirections: ["ascend", "descend", "ascend"],
          defaultSortOrder: "ascend",
        },
        {
          title: "Quantidade",
          dataIndex: ["supply", "current"],
          key: "supply",
          width: "10%",
          sorter: (a, b) => a.supply.current - b.supply.current,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (_, item) => (
            <Tag
              color={item.supply.current > 0 ? "green" : "volcano"}
              key={item.supply.current + Math.random() * 1001}
            >
              {item.supply.current}
            </Tag>
          ),
        },
      ],
    },
    {
      title: "Última movimentação",
      children: [
        {
          title: "Data",
          dataIndex: "updatedAt",
          key: "updatedAt",
          sorter: (a, b) => a.supply.current - b.supply.current,
          sortDirections: ["ascend", "descend", "ascend"],
          sorter: (a, b) =>
            dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
          sortDirections: ["ascend", "descend", "ascend"],
          render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
          title: "Tipo",
          dataIndex: ["supply", "history"],
          key: "type",
          sorter: (a, b) => a.supply.current - b.supply.current,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (data) =>
            data && data[0].type === "I" ? "Entrada" : "Saída",
        },
        {
          title: "Operador",
          dataIndex: ["supply", "history"],
          sorter: (a, b) => a.supply.current - b.supply.current,
          sortDirections: ["ascend", "descend", "ascend"],
          key: "user",
          render: (data) => data && data[0].user.name.split(" ")[0],
        },
      ],
    },
  ];

  const showExpandedRow = (record) => {
    const expdColumns = [
      {
        title: "Descrição",
        dataIndex: "description",
        key: "description",
        hidden: record.description ? false : true,
      },
      {
        title: "Patrimônio",
        dataIndex: "register",
        key: "register",
        hidden: record.register ? false : true,
      },
      {
        title: "N° Série",
        dataIndex: "serial",
        key: "serial",
        hidden: record.serial ? false : true,
      },
      {
        title: "Validade",
        dataIndex: "expiration",
        key: "expiration",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
        hidden: record.expiration ? false : true,
      },
      {
        title: "Lote",
        dataIndex: "batch",
        key: "batch",
        hidden: record.batch ? false : true,
      },
    ];
    return (
      <Table
        columns={expdColumns}
        dataSource={Array(record)}
        pagination={false}
      />
    );
  };

  const getData = async () => {
    await getCategories();
    setLoading(false);
  };

  const parseTableData = () => {
    return reportData.items.map((item) => {
      return {
        ...item,
        key: item.id,
        title: `${item.title} - ${item.brand.name} - ${item.volume.name}`,
      };
    });
  };

  const handleSubmit = (e) => {
    setSearchText("");
    setLoading(true);
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/reports/category`, e)
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

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {!loading && !error && categories && (
        <>
          <Form
            variant={"filled"}
            form={form}
            onFinish={handleSubmit}
            disabled={submitting}
          >
            <Space size="middle" wrap>
              <Form.Item
                labelAlign="left"
                label={"Selecione o tipo"}
                name={"categoryId"}
                rules={[
                  { required: true, message: "Preencha o campo necessário" },
                ]}
                style={{ paddingRight: "60px" }}
              >
                <Select style={{ width: "300px" }} options={categories} />
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
          {reportData && (
            <>
              <Flex gap={30} justify="space-between" style={{ marginTop: 20 }}>
                <Col span={12}>
                  <Card bordered={true}>
                    <Statistic
                      title="Itens registrados"
                      value={reportData._count.items}
                      precision={0}
                      valueStyle={{
                        color: "#001529",
                      }}
                      prefix={<RiSurveyLine />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={true}>
                    <Statistic
                      title="Disponíveis"
                      value={
                        reportData.items.filter(
                          (item) => !item.deleted & (item.supply.current > 0)
                        ).length
                      }
                      precision={0}
                      valueStyle={{
                        color: "#3f8600",
                      }}
                      prefix={<RiFileAddFill />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bordered={true}>
                    <Statistic
                      title="Indisponíveis"
                      value={
                        reportData.items.filter(
                          (item) => item.supply.current === 0
                        ).length
                      }
                      precision={0}
                      valueStyle={{
                        color: "#cf1322",
                      }}
                      prefix={<RiFileWarningFill />}
                    />
                  </Card>
                </Col>
              </Flex>
              <Flex gap={30} style={{ marginTop: 30 }}>
                <Table
                  style={{ width: "80dvw" }}
                  columns={tableColumns}
                  dataSource={parseTableData()}
                  locale={ptBR}
                  expandable={{
                    expandedRowRender: (record) => showExpandedRow(record),
                  }}
                  size="large"
                  bordered
                  footer={() =>
                    `Relatório gerado em ${dayjs().format(
                      "DD/MM/YYYY - HH:mm:ss"
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

export default ReportCategory;
