import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useEffect, useState, useRef, useContext } from "react";
import dayjs from "dayjs";
import ptBR from "antd/locale/pt_BR";
import axios from "axios";
import { FileProtectOutlined } from "@ant-design/icons";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../../components/Error/ErrorComponent";
import Highlighter from "react-highlight-words";
import { UserContext } from "../../../context/UserContext";
import { SearchOutlined } from "@ant-design/icons";

const ReportEmployee = () => {
  const [employees, setEmployees] = useState(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reportData, setReportData] = useState(undefined);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await getEmployees();
    setLoading(false);
  };

  const getEmployees = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees?filterMoves=true`)
      .then((response) => {
        const employeesObj = [];
        response.data.map((employee) =>
          employeesObj.push({
            ...employeesObj,
            value: employee.id,
            label: employee.name,
          })
        );
        setEmployees(employeesObj);
      })
      .catch((err) => {
        setError(true);
      });
  };

  const handleSubmit = (e) => {
    setSearchText("");
    setLoading(true);
    setSubmitting(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/reports/employee`, e)
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
          placeholder={"Pesquisar colaborador"}
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
          width: "45%",
          ...getColumnSearchProps("title"),
          sorter: (a, b) =>
            a.supply.item.title.localeCompare(b.supply.item.title),
          sortDirections: ["ascend", "descend", "ascend"],
        },
        {
          title: "Quantidade",
          dataIndex: "amount",
          key: "amount",
          width: "5%",
          sorter: (a, b) => a.amount - b.amount,
          sortDirections: ["ascend", "descend", "ascend"],
          render: (_, item) => (
            <Tag
              color={item.type === "I" ? "green" : "volcano"}
              key={item.id + Math.random() * 1001}
            >
              {item.amount}
            </Tag>
          ),
        },
        {
          title: "Tipo",
          dataIndex: "type",
          key: "type",
          width: "5%",
          sorter: (a, b) => a.type.localeCompare(b.type),
          sortDirections: ["ascend", "descend", "ascend"],
          render: (type) => (type === "I" ? "Entrada" : "Saída"),
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
          defaultSortOrder: "descend",
        },
        {
          title: "Operador",
          dataIndex: ["user", "name"],
          sorter: (a, b) => a.user.name.localeCompare(b.user.name),
          sortDirections: ["ascend", "descend", "ascend"],
          key: "user",
          render: (data) => data && data.split(" ")[0],
        },
        {
          title: "Observação",
          key: "description",
          dataIndex: "description",
          sorter: (a, b) =>
            (a.description ? a.description : (a.description = "")) <
            (b.description ? b.description : (b.description = ""))
              ? -1
              : 1,
          sortDirections: ["ascend", "descend", "ascend"],
        },
      ],
    },
  ];

  const showExpandedRow = (record) => {
    const expdColumns = [
      {
        title: "Descrição do item",
        dataIndex: ["supply", "item", "description"],
        key: "description",
        hidden: record.supply.item.description ? false : true,
      },
      {
        title: "Categoria",
        dataIndex: ["supply", "item", "category", "name"],
        key: "register",
        hidden: record.supply.item.category.name ? false : true,
      },
      {
        title: "Patrimônio",
        dataIndex: ["supply", "item", "register"],
        key: "register",
        hidden: record.supply.item.register ? false : true,
      },
      {
        title: "N° Série",
        dataIndex: ["supply", "item", "serial"],
        key: "serial",
        hidden: record.supply.item.serial ? false : true,
      },
      {
        title: "Validade",
        dataIndex: ["suppy", "item", "expiration"],
        key: "expiration",
        render: (date) => dayjs(date).format("DD/MM/YYYY"),
        hidden: record.supply.item.expiration ? false : true,
      },
      {
        title: "Lote",
        dataIndex: ["supply", "item", "batch"],
        key: "batch",
        hidden: record.supply.item.batch ? false : true,
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

  const parseTableData = () => {
    return reportData.moves.map((item) => {
      return {
        ...item,
        key: item.id,
        title: `${item.supply.item.title} - ${item.supply.item.brand.name} - ${item.supply.item.volume.name}`,
      };
    });
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {!loading && !error && employees && (
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
                label={"Selecione o colaborador"}
                name={"employeeId"}
                rules={[
                  { required: true, message: "Preencha o campo necessário" },
                ]}
                style={{ paddingRight: "60px" }}
              >
                <Select style={{ width: "300px" }} options={employees} />
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
              <Col span={24}>
                <Card bordered={true}>
                  <Descriptions title={reportData.name}>
                    <Descriptions.Item label={"Chapa"}>
                      {reportData.register}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Setor"}>
                      {reportData.department}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Inativo"}>
                      {reportData.deleted ? "Sim" : "Não"}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Movimentações associadas"}>
                      {reportData._count.moves}
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
                  expandable={{
                    expandedRowRender: (record) => showExpandedRow(record),
                  }}
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

export default ReportEmployee;
