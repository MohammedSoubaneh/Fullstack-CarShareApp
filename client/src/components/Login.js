import React, {useState} from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";



const Error = () => (
    <Alert style={{marginBottom: 10}} type="error" message="User doesn't exist." banner />
)

export const Login = () => {

    const { Title } = Typography;

    let navigation = useNavigate()

    const [error, setError] = useState(false)
    
    const onFinish = async (value) => {
            setError(false)
            const result = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                credentials: "same-origin",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    username: value.username,
                    password: value.password
                })
            }
        )
        .then((res) => {
            if (!res.ok){
                throw res
            }
            navigation('/')
            return res.json()
        })
        .then((data) => {
            console.log(data.refresh)
            localStorage.setItem('access_token', data.access)
            localStorage.setItem('refresh_token', data.refresh)
        }).catch(err => {
            setError(true)
        })
    }
    return (
        <div id="outerContainer">
            <div id="CenterContainer">
                <Title className="title" level={2}>Login Form</Title>
                <Form className="login-form" role="form" initialValues={{ remember: true }} onFinish={onFinish} >
                    { error ? <Error /> : null}
                    <Form.Item data-testid="username-formItem" name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} data-testid="username-field" placeholder="Username" />
                    </Form.Item>
                    <Form.Item data-testid="password-formItem" name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
                        <Input data-testid="password-field" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item data-testid="submit-formItem">
                        <Button role='submit' type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}


