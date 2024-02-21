import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import { Button, Card, Divider, List, Space } from "antd";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => {
        if (response.data) {
          setCategories(response.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => setLoading(false));
  });

  const handleEdit = (c) => {
    navigate(`update/${c}`);
  };

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {categories && !error && (
        <Card style={{ width: "25dvw" }}>
          <Divider orientation="left">Tipos de categorias registradas</Divider>
          <br />
          <Space
            direction={"vertical"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <List
              size="large"
              itemLayout="vertical"
              bordered
              dataSource={categories}
              renderItem={(category) => (
                <List.Item
                  style={{ width: "20dvw", fontWeight: "500" }}
                  extra={
                    <>
                      <Button
                        type="primary"
                        ghost
                        size="small"
                        style={{ marginRight: 10 }}
                        onClick={() => handleEdit(category.id)}
                      >
                        Editar
                      </Button>
                    </>
                  }
                >
                  {category.name}
                </List.Item>
              )}
            ></List>
          </Space>
        </Card>
      )}
    </>
  );
};

export default Categories;
