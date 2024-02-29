import { useEffect, useState } from "react";
import ErrorComponent from "../../components/Error/ErrorComponent";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { FileProtectOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Button,
  Card,
  Divider,
  Form,
  Space, 
  Input,
  Tag,
  message,
  Popconfirm,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import useTrim from "../../hooks/useTrim";

const CategoriesUpdate = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState(undefined);
    const [category, setCategory] = useState(undefined);
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        axios
          .get(`${import.meta.env.VITE_API_URL}/categories/${id}`)
          .then((response) => {
            if (response.data) {
              setCategory(response.data);
              form.setFieldValue("name", response.data.name);
            } else {
              setError(true);
            }
          })
          .catch((error) => setError(true))
          .finally(() => setLoading(false));
    
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
          .patch(`${import.meta.env.VITE_API_URL}/categories/${id}`, categoryData)
          .then((response) => {
            message.success("Categoria atualizada com sucesso");
            setTimeout(() => {
              navigate("../categories");
            }, 1000);
          })
          .catch((err) => {
            message.error(
              "Falha ao atualizar a categoria. Verifique as informações digitadas e tente novamente"
            );
            setSubmitting(false);
          });
      };

      const handleDelete = () => {
        setConfirmLoading(true);
        setSubmitting(true);
        axios
          .delete(`${import.meta.env.VITE_API_URL}/categories/${id}`)
          .then((response) => {
            message.success("Categoria excluída com sucesso");
            setTimeout(() => {
              navigate("../categories");
            }, 2000);
          })
          .catch((error) => {
            if (error.response.data.code && error.response.data.code === "P2003") {
              message.error("Erro! Categorias com items associados não podem ser removidas")
            } else {
              message.error("Falha ao atualizar a categoria");
            }        
            setSubmitting(false);
            setConfirmLoading(false);
          });
      };

      const handleCancel = () => {
        setSubmitting(false);
        setOpenConfirmWindow(false);
      };
    
      const showConfirmation = () => {
        setSubmitting(true);
        setOpenConfirmWindow(true);
      };

    return ( <>
            {error && <ErrorComponent/>}
            {loading && <LoadingSpinner/>}
            {categories && category && !error && (
               <Card style={{ width: "25dvw" }}>
               <Divider orientation="left">Editar categoria</Divider>
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
               <Divider orientation="right" style={{ marginTop: "60px" }}>
                 <Popconfirm
                   title="Atenção!"
                   description={
                     <>
                       <p>Essa operaçao não poderá ser desfeita.</p>
                       <p>Deseja continuar?</p>
                     </>
                   }
                   open={openConfirmWindow}
                   onConfirm={handleDelete}
                   onCancel={handleCancel}
                   okText="Confirmar"
                   cancelText="Cancelar"
                   okButtonProps={{
                     loading: confirmLoading,
                   }}
                   showCancel={!confirmLoading}
                 >
                   <Button
                     onClick={showConfirmation}
                     type="primary"
                     danger
                     size="small"
                     ghost
                     icon={<DeleteOutlined />}
                   >
                     Excluir categoria
                   </Button>
                 </Popconfirm>
               </Divider>
               <Divider orientation="left" plain>
                 Categorias cadastradas
               </Divider>
               {categories.map((category) => (
                 <Tag key={category.id} style={{ margin: "5px" }}>
                   {category.name}
                 </Tag>
               ))}
             </Card>  
            )}
    </> );
}
 
export default CategoriesUpdate;