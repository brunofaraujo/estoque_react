import { Button, Form, Input } from "antd";
import styles from "./AuthLoginPage.module.css";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const AuthLoginPage = () => {
    const onFinish = values => {
      console.log('Received values of form: ', values);
    };
  
    return (
      <Form
        name="signin"
        className={styles.login_form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Digite o número de sua chapa',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Chapa" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Digite uma senha',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Senha"
          />
        </Form.Item>
        <Form.Item>
          <a className={styles.login_form_forgot} href="">
            Esqueci a senha
          </a>
        </Form.Item>
  
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.login_form_button}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    );
  };
  export default AuthLoginPage;