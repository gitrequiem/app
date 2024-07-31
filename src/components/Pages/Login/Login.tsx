import React, { useState } from 'react';
import { Button, Form, FormControl, InputGroup, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../axiosConfig';
import logo from './background.png';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            dni: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().max(15, 'Debe tener 15 caracteres o menos').required('Requerido'),
            dni: Yup.string()
                .matches(/^\d+$/, 'Debe contener solo números')
                .required('Requerido'),
            password: Yup.string().required('Requerido'),
        }),
        onSubmit: async (values) => {
            try {
                //console.log('Sending request with values:', values);
                const response = await axiosInstance.post('/login', {
                    username: values.username,
                    usernumdoc: values.dni,
                    password: values.password,
                });
                //console.log('Received response:', response);

                if (response.status === 200) {
                    const token = response.data.access_token;
                    const userId = response.data.user_id;
                    
                    localStorage.setItem('token', token); // Almacena el token en localStorage
                    localStorage.setItem('userId', userId); // Almacena el userId en localStorage
                    
                    navigate('/inicio'); // Redirige a la página de inicio si es correcto
                } else {
                    setErrorMessage(response.data.message);
                }
            } catch (error) {
                console.error('Error during login request:', error);
                setErrorMessage('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
            }
        },
    });

    return (
        <div>
            <img src={logo} alt="Background" className="bg-image" />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card className="shadow bg-dark">
                            <Card.Header className="text-center bg-info">
                                <h1 className="title">REQUIEM</h1>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title className="text-center mb-4 text-light">Iniciar sesión</Card.Title>
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <Form noValidate onSubmit={formik.handleSubmit}>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type="text"
                                            placeholder="Ingrese su usuario"
                                            {...formik.getFieldProps('username')}
                                            isInvalid={!!formik.errors.username && formik.touched.username}
                                            className="bg-light"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.username}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type="text"
                                            placeholder="DNI"
                                            {...formik.getFieldProps('dni')}
                                            isInvalid={!!formik.errors.dni && formik.touched.dni}
                                            className="bg-light"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.dni}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Contraseña"
                                            {...formik.getFieldProps('password')}
                                            isInvalid={!!formik.errors.password && formik.touched.password}
                                            className="bg-light"
                                        />
                                        <Button variant="btn btn-secondary" onClick={togglePasswordVisibility}>
                                            {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                                        </Button>
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.password}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <Button type="submit" className="btn btn-info w-100 py-2">
                                        Ingresar
                                    </Button>
                                </Form>
                                <p className="text-center mt-5 text-light">@2024</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;