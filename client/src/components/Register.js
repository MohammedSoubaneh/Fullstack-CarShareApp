import React, { useState } from 'react';
import { axiosInstance } from './axios';
import {
  Form,
  Input,
  Button,
  Alert,
  Typography
} from 'antd';

import { useNavigate } from "react-router-dom";


const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Error = () => (
  <Alert style={{marginBottom: 10}} type="error" message="User already exist." banner />
)

export const RegistrationForm = () => {

  const { Title } = Typography;

  let navigation = useNavigate()

  const [error, setError] = useState(false)

  const [form] = Form.useForm();

  const [usernameError, setUsernameError] = useState(false)
  const [emailError, setEmailError] = useState(false)



  const onFinish = async (values) => {
    setError(false)
    const result = fetch('http://127.0.0.1:8000/api/auth/register/', {
      method: "POST",
      credentials: "same-origin",
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        email: values.email,
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password
      })
    })
    .then((res) => {
      if (!res.ok){
          throw res
      }
      navigation('/')
      return res.json()
      })
      .catch(err => {
          setError(true)
      })
    // if ((await result).ok) {
    //   console.log('working')
    //   navigation('/')
    // } else {
    //     setError(true)
    // }
  };

  return (
    <div id="outerContainer">
      <div id="CenterContainer">
        <Title className="title" level={2}>Registration Form</Title>
        <Form 
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
          data-testid="form-field"
          >
          {error ? <Error /> : null}
          <Form.Item
            data-testid="email-field"
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="first_name"
            label="First Name"
            data-testid="first-name-field"
            rules={[
              {
                type: 'string',
                message: 'The input is not valid First Name!',
              },
              {
                required: true,
                message: 'Please input your First Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            data-testid="last-name-field"
            rules={[
              {
                type: 'string',
                message: 'The input is not valid Last name!',
              },
              {
                required: true,
                message: 'Please input your Last name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            data-testid="username-field"
            rules={[
              {
                type: 'string',
                message: 'The input is not valid Username!',
              },
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            data-testid="password-field"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
          <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            data-testid="confirm-password-field"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
          <Input.Password />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button data-testid="submit-button" type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};


export const Register = () => {
  
}