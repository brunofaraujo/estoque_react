import { Button, Flex, Form, Input, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const RegisterPage = () => {
  const layout = {
    //max 24 units
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 10,
    },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} é necessário",
    types: {
      email: "${label} é inválido",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  /* eslint-enable no-template-curly-in-string */

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["user", "username"]}
        label="Número da chapa"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Ex: 01234" />
      </Form.Item>
      <Form.Item
        name={["user", "name"]}
        label="Nome completo"
        rules={[
          {
            required: true,
            type: "string"
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "email"]}
        label="E-mail"
        rules={[
          {
            type: "email",
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="Senha"
        rules={[
          {
            required: true,
            min: 6,
            message: "Digite uma senha",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirme a senha"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "As senhas devem ser iguais",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("As senhas digitadas não coincidem")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol
        }}
        style={{ textAlign: "center" }}
      >
        <Button type="primary" htmlType="submit" icon={<UploadOutlined />}>
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;

//   <Flex vertical align="center" gap="2rem">
//   <h1>Criar nova conta de usuário</h1>
//   <form>
//     <Flex vertical gap="1rem">
//       <label>
//         <span>Número da chapa:</span>
//         <input
//           type="text"
//           name="username"
//           placeholder="Ex.: 01234"
//           required
//         />
//       </label>
//       <label>
//         <span>Nome completo:</span>
//         <input type="text" name="name" required />
//       </label>
//       <label>
//         <span>E-mail:</span>
//         <input type="email" name="email" required />
//       </label>
//       <label>
//         <span>Senha:</span>
//         <input type="password" name="password" required />
//       </label>
//       <label>
//         <span>Confirme a senha:</span>
//         <input type="password" name="password_confirm" required />
//       </label>
//       <Button type="primary" block>
//         Enviar dados
//       </Button>
//     </Flex>
//   </form>
// </Flex>
