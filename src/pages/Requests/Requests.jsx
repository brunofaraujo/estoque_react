import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { Card, Divider, Flex, Layout } from "antd";
import { Content } from "antd/es/layout/layout";

const Requests = () => {
  const [requests, setRequests] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getRequests = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/requests`)
      .then((response) => {
        setRequests(response.data);
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

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {requests && !error && (
        <Card bordered style={{ width: "80dvw" }}>
          <Divider orientation="left">Solicitações</Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Content>
              <Flex
                justify={"flex-start"}
                align={"flex-start"}
                style={{ marginLeft: -200 }}
              >
                {console.table(requests)}
              </Flex>
            </Content>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default Requests;
