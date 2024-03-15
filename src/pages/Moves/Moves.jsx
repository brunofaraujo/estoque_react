import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { Content } from "antd/es/layout/layout";
import ErrorComponent from "../../components/Error/ErrorComponent";
import {
  Badge,
  Card,
  Descriptions,
  Divider,
  Flex,
  Layout,
  List,
  Tag,
  Timeline,
} from "antd";
import dayjs from "dayjs";

const History = () => {
  const [moves, setMoves] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getMoves = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/moves`)
      .then((response) => {
        let movesObj = [];
        response.data.map((item) =>
          movesObj.push({
            label: (
              <>
                {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                <span>{" - "}</span>
                <Tag color={item.type === "I" ? "green" : "red"}>
                  {item.type === "I" ? `Entrada` : `Saída`}
                </Tag>
              </>
            ),
            children: (
              <>
                <Badge.Ribbon
                  text={
                    item.type === "I" ? `+ ${item.amount}` : `- ${item.amount}`
                  }
                  color={item.type === "I" ? "green" : "red"}
                >
                  <Card size="small" title={item.supply.item.title}>
                    <Descriptions
                      layout="vertical"
                      bordered
                      size="small"
                      title={
                        item.description ? (
                          <List>
                            <List.Item>{item.description}</List.Item>
                          </List>
                        ) : null
                      }
                    >
                      {item.supply.item.brand && (
                        <Descriptions.Item label={"Marca"} span={6}>
                          {item.supply.item.brand.name}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.volume && (
                        <Descriptions.Item label={"Volume"}>
                          {item.supply.item.volume.name}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.category && (
                        <Descriptions.Item label={"Categoria"}>
                          {item.supply.item.category.name}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.expiration && (
                        <Descriptions.Item label={"Validade"}>
                          {dayjs(item.supply.item.expiration).format(
                            "DD/MM/YYYY"
                          )}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.description && (
                        <Descriptions.Item label={"Descrição"} span={12}>
                          {item.supply.item.description}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.serial && (
                        <Descriptions.Item label={"Serial"}>
                          {item.supply.item.serial}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.register && (
                        <Descriptions.Item label={"Patrimônio"}>
                          {item.supply.item.register}
                        </Descriptions.Item>
                      )}
                      {item.supply.item.batch && (
                        <Descriptions.Item label={"Lote"}>
                          {item.supply.item.batch}
                        </Descriptions.Item>
                      )}
                      {item.requester && (
                        <Descriptions.Item label={"Solicitante"} span={12}>
                          {item.requester.name}
                        </Descriptions.Item>
                      )}
                      {item.user && (
                        <Descriptions.Item label={"Operador"} span={12}>
                          {item.user.name}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </Card>
                </Badge.Ribbon>
              </>
            ),
            color: item.type === "I" ? "green" : "red",
          })
        );
        setMoves(movesObj);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    getMoves();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      {error && <ErrorComponent />}
      {moves && !error && (
        <Card bordered style={{ width: "50dvw" }}>
          <Divider orientation="left">Histórico de movimentações</Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Content>
              <Flex
                justify={"flex-start"}
                align={"flex-start"}
                style={{ marginLeft: -200 }}
              >
                <Timeline mode="left" items={moves} style={{ width: "100%" }} />
              </Flex>
            </Content>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default History;
