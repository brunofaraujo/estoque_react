import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Divider, Form, Space, Input, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";

const BrandsCreate = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState(undefined);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
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
          .catch((error) => setError(true))
          .finally(() => setLoading(false));
      }, []);

      const handleBrandSubmit = (brandData) => {
        if (submitting) return;
        setSubmitting(true);
        axios
          .post(`${import.meta.env.VITE_API_URL}/brands`, brandData)
          .then((response) => {
            setBrands([...brands, response.data]);
            message.success("Marca cadastrada com sucesso");
            setTimeout(() => {
              navigate("../brands");
            }, 1000);
          })
          .catch((err) => {
            message.error(
              "Falha ao criar a marca. Verifique as informações digitadas e tente novamente"
            );
            setSubmitting(false);
          });
      };

    return ( <>      {error && <ErrorComponent />}
    {loading && <LoadingSpinner />}
    {brands && !error && (
      <Card style={{ width: "25dvw" }}>
        <Divider orientation="left">Cadastrar nova marca</Divider>
        <br />
        <Space direction={"vertical"}>
          <Form
            name={"brand"}
            form={form}
            onFinish={(e) => handleBrandSubmit(e)}
            disabled={submitting}
          >
            <Form.Item
              label={"Nome"}
              name={"name"}
              rules={[{ required: true, message: "Digite o nome da marca" }]}
              required
            >
              <Input style={{ width: "15dvw" }} />
            </Form.Item>
            <Form.Item
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "100px",
              }}
            >
              <Button
                style={{ width: "150px", marginTop: "25px" }}
                type={"primary"}
                htmlType="submit"
                icon={<FileProtectOutlined />}
                disabled={submitting}
              >
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Space>
        <Divider orientation="left" plain>
          Marcas cadastradas
        </Divider>
        {brands.map((brand) => (
          <Tag key={brand.id} style={{margin: "5px"}}>{brand.name}</Tag>
        ))}
      </Card>
    )}</> );
}
 
export default BrandsCreate; 