import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import { Button, Card, Divider, List, Space } from "antd";
import { useNavigate } from "react-router-dom";

const Volumes = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [volumes, setVolumes] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/volumes`)
      .then((response) => {
        if (response.data) {
          setVolumes(response.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (v) => {
   navigate(`update/${v}`)
  }

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {volumes && !error && (
        <Card direction={"vertical"} style={{ width: "25dvw" }}>
          <Divider orientation="left">
            Tipos de volumes registrados
          </Divider>
          <br />
          <Space
            direction={"vertical"}
            style={{ display: "flex", alignItems: "center" }}
          >
            <List
              size="large"
              itemLayout="vertical"
              bordered
              dataSource={volumes}
              renderItem={(volume) => (
                <List.Item
                  extra={
                    <>
                      <Button
                        type="primary"
                        ghost
                        size={"small"}
                        style={{ marginRight: 10 }}
                        onClick={() => handleEdit(volume.id)}
                      >
                        Editar
                      </Button>
                    </>
                  }
                  style={{ width: "20dvw", fontWeight: "500" }}
                >
                  {volume.name}
                </List.Item>
              )}
            />
          </Space> 
        </Card>
      )}
    </>
  );
};

export default Volumes;
