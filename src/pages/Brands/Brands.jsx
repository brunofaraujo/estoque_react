import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import { Button, Card, Divider, List, Space } from "antd";
import { useNavigate } from "react-router-dom";

const Brands = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState(undefined);
    const navigate = useNavigate();
  
    useEffect(() => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/brands`)
        .then((response) => {
          if (response.data) {
            setBrands(response.data);
          } else {
            setError(true);
          }
        }) 
        .catch((error) => {
          setError(true);
        })
        .finally(() => setLoading(false));
    });
  
    const handleEdit = (b) => {
      navigate(`update/${b}`);
    };
  
    return (
      <>
        {error && <ErrorComponent />}
        {loading && <LoadingSpinner />}
        {brands && !error && (
          <Card style={{ width: "25dvw" }}>
            <Divider orientation="left">Marcas registradas</Divider>
            <br />
            <Space
              direction={"vertical"}
              style={{ display: "flex", alignItems: "center" }}
            >
              <List
                size="large"
                itemLayout="vertical"
                bordered
                dataSource={brands}
                renderItem={(brand) => (
                  <List.Item
                    style={{ width: "20dvw", fontWeight: "500" }}
                    extra={
                      <>
                        <Button
                          type="primary"
                          ghost
                          size="small"
                          style={{ marginRight: 10 }}
                          onClick={() => handleEdit(brand.id)}
                        >
                          Editar
                        </Button>
                      </>
                    }
                  >
                    {brand.name}
                  </List.Item>
                )}
              ></List>
            </Space>
          </Card>
        )}
      </>
    );
  };
 
export default Brands;