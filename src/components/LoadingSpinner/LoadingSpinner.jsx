import { Card, Spin } from "antd";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <Card
    bordered={true}
    style={{ width: "max-content", minWidth: "100%", overflow: "auto" }}
  >
    <Spin tip={"Carregando..."} size="large">
      <div className={styles.spinner} />
    </Spin>
    </Card>
  );
};

export default LoadingSpinner;
