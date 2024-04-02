import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import { Button, Card, Divider, Form, Space, Input, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import useTrim from "../../hooks/useTrim";

const CategoriesCreate = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(undefined);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/categories`)
          .then((response) => {
            if (response.data) {
              setCategories(response.data);
            } else {
              setError(true);
            }
          })
          .catch((error) => setError(true))
          .finally(() => setLoading(false));
      }, []);

      const handleCategorySubmit = (categoryData) => {
        if (submitting) return;
        setSubmitting(true);

        axios
          .post(`${import.meta.env.VITE_API_URL}/categories`, {...categoryData, name: categoryData.name.trim()})
          .then((response) => {
            setCategories([...categories, response.data]);
            message.success("Categoria cadastrada com sucesso");
            setTimeout(() => {
              navigate("../categories");
            }, 1000);
          })
          .catch((err) => {
            message.error(
              "Falha ao criar a categoria. Verifique as informações digitadas e tente novamente"
            );
            if (err.response.data.code === "P2002") {
              if (err.response.data.meta.target[0] === "name") {
                message.error(
                  "Já existe uma categoria com o nome informado"
                );
              }
            }
            setSubmitting(false);
          });
      };

    return ( <>      {error && <ErrorComponent />}
    {loading && <LoadingSpinner />}
    {categories && !error && (
      <Card style={{ width: "25dvw" }}>
        <Divider orientation="left">Cadastrar novo tipo de categoria</Divider>
        <br />
        <Space direction={"vertical"}>
          <Form
            name={"category"}
            form={form}
            onFinish={(e) => handleCategorySubmit(e)}
            disabled={submitting}
          >
            <Form.Item
              label={"Nome"}
              name={"name"}
              normalize={(text) => useTrim(text)}
              rules={[{ required: true, message: "Digite o nome da categoria" }]}
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
          Categorias cadastradas
        </Divider>
        {categories.map((category) => (
          <Tag key={category.id} style={{margin: "5px"}}>{category.name}</Tag>
        ))}
      </Card>
    )}</> );
}
 
export default CategoriesCreate; 