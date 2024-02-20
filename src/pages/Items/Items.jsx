import { Button, Divider, Input, Popconfirm, Radio, Space, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ptBR from "antd/locale/pt_BR";
import dayjs from 'dayjs';

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
          // placeholder={`Pesquisar ${dataIndex}`}
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

          {/* <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Limpar
          </Button> */}

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

          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>

          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
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
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => setLoading(false));
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
      fixed: "left",
      width: "25%",
      ...getColumnSearchProps("title"),
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Marca",
      dataIndex: ["brand", "name"],
      key: "brand",
      sorter: (a, b) => a.brand.name.localeCompare(b.brand.name),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Volume",
      dataIndex: ["volume", "name"],
      key: "volume",
      sorter: (a, b) => a.volume.name.localeCompare(b.volume.name),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Categoria",
      dataIndex: ["category", "name"],
      key: "category",
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Quantidade",
      dataIndex: ["supply", "current"],
      key: "supply",
      sorter: (a, b) => a.supply.current - b.supply.current,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Última atualização",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (date) => (dayjs(date).format("DD/MM/YYYY HH:mm"))
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Radio.Group
          buttonStyle={"outline"}
          style={{ whiteSpace: "nowrap" }}
          size={"small"}
        >
          <Radio.Button
            disabled={disabled}
            onClick={() => navigate(`../moves/update/${id}`)}
            style={{ color: "#1d39c4", fontWeight: 500 }}
          >
            Movimentar
          </Radio.Button>
          <Radio.Button
            disabled={disabled}
            onClick={() => navigate(`update/${id}`)}
            style={{ color: "#08979c", fontWeight: 500 }}
          >
            Editar
          </Radio.Button>
          <Radio.Button
            disabled={disabled}
            onClick={() => showConfirmDialog(id)}
            style={{ color: "#f5222d", fontWeight: 600 }}
          >
            Excluir
          </Radio.Button>
        </Radio.Group>
      ),
      width: "10%",
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
        render: (date) => (dayjs(date).format("DD/MM/YYYY")),
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {data && (
        <Popconfirm
          title="Exclusão de item"
          description="Tem certeza que deseja excluir o item?"
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
            style={{ minWidth: "85vw" }}
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
