import { Spin } from "antd";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <Spin tip={"Carregando..."} size="large">
      <div className={styles.spinner} />
    </Spin>
  );
};

export default LoadingSpinner;
