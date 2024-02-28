import ErrorComponent from "../../components/Error/ErrorComponent";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { Button, Divider, Table } from "antd";
import ptBR from "antd/locale/pt_BR";
import axios from "axios";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Employees = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(undefined);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`update/${id}`)
  };
  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: "40%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "ascend",
    },
    {
      title: "Chapa",
      dataIndex: "register",
      key: "register",
      sorter: (a, b) => a.register.localeCompare(b.register),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Setor",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortDirections: ["ascend", "descend", "ascend"],
    },
    {
      title: "Ações",
      dataIndex: "id",
      render: (id) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="primary"
            ghost
            size={"small"}
            onClick={()=>handleEdit(id)}
            icon={<PlusCircleOutlined />}
          >
            Mais opções
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employees`)
      .then((response) => {
        const employeesObj = []
        response.data.map((emp) => employeesObj.push({...emp, key: emp.id}))
        setEmployees(employeesObj);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
      });
  },[]);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {(employees && !error) && (
        <Table
          title={() => (
            <Divider orientation="left">Relação de colaboradores</Divider>
          )}
          locale={ptBR}
          style={{ minWidth: "70vw" }}
          columns={columns}
          dataSource={employees}
          size={"large"}
          bordered
        />
      )}
    </>
  );
};

export default Employees;
