import { Card, Col, Divider, Layout, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { TfiExchangeVertical, TfiAgenda, TfiDirection, TfiViewGrid, TfiDropbox } from "react-icons/tfi";
import { SlPeople, SlUserFollowing  } from "react-icons/sl";

const DashboardHome = () => {
  const [summary, setSummary] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getSummary = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/summary`)
      .then((response) => {
        response.data && setSummary(response.data);
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    getSummary();
    setLoading(false);
  },[]);

  return (
    <>
      {error && <ErrorComponent />}
      {loading && <LoadingSpinner />}
      {summary && !error && (
        <Card bordered style={{ width: "70dvw" }}>
          <Divider orientation="left">Sumário</Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff"}}>
            <Row gutter={16} style={{margin: 20}}>
              <Col span={12}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Movimentações</h3>}
                    value={summary.moves}
                    prefix={<TfiExchangeVertical size={35} style={{marginRight: 20}} />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Itens registrados</h3>}
                    value={summary.items}
                    prefix={<TfiAgenda size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}  style={{margin: 20}}>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Marcas</h3>}
                    value={summary.brands}
                    prefix={<TfiDirection size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Categorias</h3>}
                    value={summary.categories}
                    prefix={<TfiViewGrid size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Tipos de volumes</h3>}
                    value={summary.volumes}
                    prefix={<TfiDropbox  size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={16}  style={{margin: 20}}>

              <Col span={12}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Colaboradores da unidade</h3>}
                    value={summary.employees}
                    prefix={<SlPeople size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={true}>
                  <Statistic
                    title={<h3>Usuários do sistema</h3>}
                    value={summary.users}
                    prefix={<SlUserFollowing size={35} style={{marginRight: 20}}  />}
                    groupSeparator={"."}
                    decimalSeparator={","}
                  />
                </Card>
              </Col>
            </Row>

          </Layout>
        </Card>
      )}
    </>
  );
};

export default DashboardHome;
