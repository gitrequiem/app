import React, { useState } from 'react';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import { Button, Col, Container, InputGroup, Alert } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axiosInstance from '../axiosConfig';

const MisDatos: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationSchema = Yup.object().shape({
    current_password: Yup.string().required('Contraseña actual es requerida'),
    newPassword: Yup.string().required('Nueva contraseña es requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), undefined], 'Las contraseñas deben coincidir')
      .required('Confirmar contraseña es requerido'),
  });

  const initialValues = {
    current_password: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setIsSubmitting(true);  // Bloquear el botón "Guardar"
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axiosInstance.put('/users/put/mypassword', {
        current_password: values.current_password,
        password: values.newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     console.log(response); //log para ver el envio de datos
      setSuccessMessage('Cambio de contraseña exitoso');
      setTimeout(() => {
        window.location.reload();
      }, 1500); // temporizador
    } catch (error) {
      console.error(error);
      // Manejar el error, mensaje de error
    }
  };

  return (
    <div className="navbar-container">
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Col>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <FormikForm className="p-3 border rounded bg-light shadow-sm">
                <h1 className="display-6 text-center mb-4">Cambiar contraseña</h1>

                <InputGroup className="mb-3">
                  <Field
                    name="current_password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Ingrese contraseña actual"
                    className={`form-control ${touched.current_password && errors.current_password ? 'is-invalid' : ''}`}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                  <ErrorMessage name="current_password" component="div" className="invalid-feedback" />
                </InputGroup>

                <InputGroup className="mb-3">
                  <Field
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Ingrese su nueva contraseña"
                    className={`form-control ${touched.newPassword && errors.newPassword ? 'is-invalid' : ''}`}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                  <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                </InputGroup>

                <InputGroup className="mb-3">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repita la nueva contraseña"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </Button>
                  <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                </InputGroup>

                <Button className="d-grid gap-2 col-6 mx-auto btn btn-danger" type="submit" disabled={isSubmitting}  
                >
                  Guardar
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Col>
      </Container>
      <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Mis Datos" />
    </div>
  );
};

export default MisDatos;