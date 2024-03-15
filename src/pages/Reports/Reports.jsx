import { useParams } from "react-router-dom";
import ReportCategory from "./Components/ReportCategory";
import { useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import { Card, Divider, Flex, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import ReportEmployee from "./Components/ReportEmployee";

const Reports = () => {
  const { reportType } = useParams();
  const [error, setError] = useState(false);
  const parsedWord = (word) => {
    let translated;
    switch (word) {
      case "category":
        translated = "Categoria";
        break;
      case "employee":
        translated = "Colaborador";
        break;
    }
    return translated;
  };

  return (
    <>
      {error && <ErrorComponent />}
      {reportType && !error && (
        <Card bordered style={{ width: "100dvw" }}>
          <Divider orientation="left">
            Relatório: {parsedWord(reportType)}
          </Divider>
          <br />
          <Layout style={{ backgroundColor: "#fff" }}>
            <Content style={{width: "100%"}}>
              <Flex
                align={"baseline"}
                vertical
              >
                {reportType === "category" && (
                  <ReportCategory report={reportType} />
                )}
                {reportType === "employee" && (
                  <ReportEmployee report={reportType} />
                )}
              </Flex>
            </Content>
          </Layout>
        </Card>
      )}
    </>
  );
};

export default Reports;
