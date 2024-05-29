import {
  Button,
  Divider,
  Input,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  message,
} from "antd";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ptBR from "antd/locale/pt_BR";
import dayjs from "dayjs";

const Items = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handSelectedAction = (id, value) => {
    switch (value) {
      case "M":
        navigate(`../moves/create/${id}`);
        break;
      case "E":
        navigate(`update/${id}`);
        break;
      case "X":
        showConfirmDialog(id);
        break;
    }
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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

  const getData = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/items`)
      .then((response) => {
        let resObject = [];
        response.data.map((value) =>
          resObject.push({ ...value, key: value.id })
        );
        setData(resObject);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  const showConfirmDialog = (id) => {
    setDisabled(true);
    setItemId(id);
    setOpen(true);
  };

  const handleCancel = () => {
    setItemId(null);
    setOpen(false);
    setDisabled(false);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/items/${itemId}`)
      .then((response) => {
        message.success("O item foi removido com sucesso");
      })
      .catch((err) => {
        message.error("Erro ao excluir o item selecionado");
      })
      .finally(() => {
        setOpen(false);
        setDisabled(false);
        setConfirmLoading(false);
        getData();
      });
  };

  const columns = [
    {
      title: "Item",
      dataIndex: "title",
      key: "title",
      // width: "25%",
      ...getColumnSearchProps("title"),
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (title, i) => (
        <NavLink to={`/dashboard/reports/item/${i.id}`}>{title}</NavLink>
      ),
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Marca",
      dataIndex: ["brand", "name"],
      key: "brand",
      sorter: (a, b) => a.brand.name.localeCompare(b.brand.name),
      sortDirections: ["ascend", "descend", "ascend"],
      responsive: ["md", "lg"],
    },
    {
      title: "Volume",
      dataIndex: ["volume", "name"],
      key: "volume",
      sorter: (a, b) => a.volume.name.localeCompare(b.volume.name),
      sortDirections: ["ascend", "descend", "ascend"],
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Categoria",
      dataIndex: ["category", "name"],
      key: "category",
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
      sortDirections: ["ascend", "descend", "ascend"],
      responsive: ["md", "lg"],
    },
    {
      title: "Qtd.",
      dataIndex: ["supply", "current"],
      key: "supply",
      sorter: (a, b) => a.supply.current - b.supply.current,
      sortDirections: ["ascend", "descend", "ascend"],
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Última atualização",
      dataIndex: ["supply", "updatedAt"],
      key: "updatedAt",
      sorter: (a, b) =>
        dayjs(a.supply.updatedAt).unix() - dayjs(b.supply.updatedAt).unix(),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      defaultSortOrder: "descend",
      responsive: ["md", "lg"],
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Select
          defaultValue={"Mostrar..."}
          onSelect={(value) => handSelectedAction(id, value)}
          style={{ width: 110 }}
          options={[
            {
              value: "M",
              label: "Movimentar",
              disabled: disabled,
            },
            {
              value: "E",
              label: "Editar",
              disabled: disabled,
            },
            {
              value: "X",
              label: "Excluir",
              disabled:
                disabled ||
                data.filter((item) => item.id === id && item.supply.current > 0)
                  .length,
            },
          ]}
        />
      ),
      responsive: ["xs", "sm", "md", "lg"],
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
        size="small"
      />
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {data && (
        <Popconfirm
          title="Atenção"
          description={
            <>
              <p style={{ fontWeight: "bold" }}>
                Tem certeza que deseja excluir o item?
              </p>
              <p>Essa operação não poderá ser revertida</p>
            </>
          }
          placement={{ arrow: { pointAtCenter: true } }}
          showCancel={!confirmLoading}
          okText={"Confirmar"}
          cancelText={"Cancelar"}
          open={open}
          onConfirm={handleOk}
          onCancel={handleCancel}
          okButtonProps={{
            loading: confirmLoading,
          }}
        >
          {" "}
          <Table
            title={() => <Divider orientation="left">Inventário</Divider>}
            locale={ptBR}
            scroll={{ x: "max-content" }}
            tableLayout="auto"
            columns={columns}
            expandable={{
              expandedRowRender: (record) => showExpandedRow(record),
            }}
            dataSource={data}
            size="large"
            bordered
          />
        </Popconfirm>
      )}
    </>
  );
};

export default Items;
