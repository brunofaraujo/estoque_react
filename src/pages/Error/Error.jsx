import { Link, Navigate } from "react-router-dom";
import styles from "./Error.module.css";
import { Button } from "antd";

const ErrorPage = () => {
  // return <Navigate to="/dashboard" />
  return (
    <div className={styles.error_container}>
      <h2>Opa! Página não encontrada</h2>
      <Button type="dashed" size="large">
        <Link to={"/"}>Retornar ao site</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
