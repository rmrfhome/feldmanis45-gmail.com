import React, {useState} from 'react';
import { Form, Row, Col, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Button from 'components/Button';
import { NavLink } from 'react-router-dom';
import Input from 'components/Input';
import APIClient from 'utils/apiClient';
import jwt from 'utils/jwt';
import './styles.scss';


const WishRegister = () => {


  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let response = await APIClient.request(
        '/api/test/register-wish',
        {wish: values.username}, // it gives wish
        'POST'
      );
      message.info("wish registered");
      setLoading(false);

    } catch (err) {
      message.error("Wish is not registered");
      console.log(err);
      setLoading(false);
    }
  };



  return (
    <>    <Row align="middle" justify="center" className="h-100" >
    <Col xs={22} sm={16} md={12} lg={8}>
      <div className="login-card">
        <img src="betit-logo-dark.svg" alt="betit logo" className="betit-logo" height={25} />
        <h3>Please register a wish</h3>
        <Form
          name="normal_login"
          className="login-form"
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
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
         
          <Form.Item>
            <Button loading={loading} block type="primary" htmlType="submit" className="login-form-button">
              Register a wish
            </Button>
      
            
          </Form.Item>
        </Form>
      </div>
    </Col>
  </Row>
    </>

  )
}

export default WishRegister;