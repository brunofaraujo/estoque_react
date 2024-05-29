import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../components/Error/ErrorComponent";
import {
  Card,
  Divider,
  Flex,
  Layout,
  Select,
  Table,
  Tag,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { UserContext } from "../../context/UserContext";

const Requests = () => {
  const [requests, setRequests] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user: authUser } = useContext(UserContext);
  const inputSelect = useRef();

  const getRequests = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/requests`)
      .then((response) => {
        let resObject = [];
        response.data.map((r) => resObject.push({ ...r, key: r.id }));
        setRequests(resObject);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getRequests();
  }, []);

  const handleChangeStatus = (id, value) => {
    return Modal.info({
      centered: true,
      closable: false,
      title: (
        <>
          <p>Confirma a operação?</p>
          <p>O usuário será notificado sobre essa decisão</p>
        </>
      ),
      okCancel: true,
      onOk() {
        axios
          .patch(`${import.meta.env.VITE_API_URL}/requests/${id}`, {
            status: value,
            userId: parseInt(authUser.userId),
          })
          .then((response) => {
            getRequests();
          })
          .catch((error) => setError(true));
      },
    });
  };

  const columns = [
    {
      title: "Solicitante",
      key: "requester",
      sorter: (a, b) => a.requester.name.localeCompare(b.requester.name),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (_, employee) =>
        `${employee.requester.name} - ${employee.requester.register}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (status) => {
        if (status === "W")
          return (
            <Tag color="gold">
              <b>Análise pendente</b>
            </Tag>
          );
        if (status === "A")
          return (
            <Tag color="green">
              <b>Aprovado integralmente</b>
            </Tag>
          );
        if (status === "R")
          return (
            <Tag color="red">
              <b>Rejeitado</b>
            </Tag>
          );
        if (status === "P")
          return (
            <Tag color="purple">
              <b>Aprovado parcialmente</b>
            </Tag>
          );
      },
    },
    {
      title: "Data solicitação",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Última atualização",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      defaultSortOrder: "descend",
      responsive: ["md"],
    },
    {
      title: "Operador",
      dataIndex: ["user", "name"],
      key: "user",
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
      sortDirections: ["ascend", "descend", "ascend"],
      render: (u) => u && u.split(" ")[0],
      responsive: ["md"],
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Select
          ref={inputSelect}
          defaultValue={"Mostrar..."}
          onSelect={(value) => handleChangeStatus(id, value)}
          style={{ width: 180 }}
          options={[
            {
              value: "A",
              label: "Aprovar",
            },
            {
              value: "P",
              label: "Aprovar parcialmente",
            },
            {
              value: "R",
              label: "Rejeitar",
            },
          ]}
        ></Select>
      ),
    },
  ];

  const showExpandedItemRow = (rec) => {
    let parsedList = [];
    rec.map((r) => parsedList.push({ ...r, key: r.id }));

    const cls = [
      {
        title: "Material",
        dataIndex: "item",
        key: "title",
        render: (i) => `${i.title} (${i.brand.name}) - ${i.volume.name}`,
      },
      {
        title: "Quantidade",
        dataIndex: "amount",
        key: "amount",
      },
    ];
    return <Table columns={cls} dataSource={parsedList} pagination={false} size="small" />;
  };

  const showExpandedRow = (record) => {
    const expdColumns = [
      {
        title: "Justificativa",
        dataIndex: "description",
        key: "description",
        hidden: record.description ? false : true,
      },
    ];
    return (
      <Table
        columns={expdColumns}
        dataSource={[record]}
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: (record) =>
            showExpandedItemRow(record.requestAmounts),
        }}
      />
    );
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {requests && !error && (
        <Card
          bordered
          style={{ width: "max-content", minWidth: "100%", overflow: "auto" }}
        >
          <Divider orientation="left">Solicitações</Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Flex>
              <Table
                columns={columns}
                dataSource={requests}
                style={{ width: "100%" }}
                size="large"
                expandable={{
                  expandedRowRender: (record) => showExpandedRow(record),
                }}
                bordered
              />
            </Flex>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default Requests;
