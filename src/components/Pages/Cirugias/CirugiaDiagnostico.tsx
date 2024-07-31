import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import ResponseModal from './ResponseModal';
import { useLocation, useNavigate } from 'react-router-dom';
import WarningModal from './WarningModal';
import axiosInstance from '../axiosConfig';

interface Diagnostico {
  diagnostico: string;
  id_diagnostico: number;
}

const CirugiaDiagnostico: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_cirugia } = location.state || { id_cirugia: null };
  const { especialidad } = location.state || { especialidad: null };
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [diagnosticosSeleccionados, setDiagnosticosSeleccionados] = useState<Diagnostico[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ , setSavedDiagnostico] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalData, setModalData] = useState({ show: false, title: '', message: '' });
  const [showWarning, setShowWarning] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      setIsLoading(true);
      const requestData = { id_cirugia_solicitada: id_cirugia };

      try {
        const response = await axiosInstance({
          method: 'POST',
          url: '/diagnosticos/get/especialidades/cirugias/id',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          data: requestData
        });

        if (response.data.status === 'success') {
          // Ordenar los diagnósticos alfabéticamente antes de establecer el estado
          const sortedDiagnosticos = response.data.data.sort((a: Diagnostico, b: Diagnostico) =>
            a.diagnostico.localeCompare(b.diagnostico)
          );
          setDiagnosticos(sortedDiagnosticos);
        } else {
          setModalData({
            show: true,
            title: 'Error',
            message: `Error: ${response.data.message}`
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            setModalData({
              show: true,
              title: 'Server Error',
              message: `Server Error: ${error.response.data.message}`
            });
          } else if (error.request) {
            setModalData({
              show: true,
              title: 'Network Error',
              message: 'Network Error: No response received from server'
            });
          } else {
            setModalData({
              show: true,
              title: 'Error',
              message: `Error: ${error.message}`
            });
          }
        } else {
          setModalData({
            show: true,
            title: 'Unexpected Error',
            message: `Unexpected Error: ${error}`
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosticos();
  }, [id_cirugia, token]);

  const handleSave = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    const formattedValues = {
      id_cirugia,
      id_diagnostico: parseInt(values.id_diagnostico, 10)
    };
    setIsLoading(true);

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: '/cirugiadiagnosticos/post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: formattedValues
      });

      if (response.data.status === 'success') {
        setModalData({
          show: true,
          title: 'Éxito',
          message: 'Diagnostico guardado con éxito'
        });
        setSavedDiagnostico(response.data.data.id_diagnostico);

        const nuevoDiagnostico = diagnosticos.find(d => d.id_diagnostico === formattedValues.id_diagnostico);
        if (nuevoDiagnostico) {
          setDiagnosticosSeleccionados(prev => [...prev, nuevoDiagnostico]);
        }

      } else {
        setModalData({
          show: true,
          title: 'Error',
          message: `Error: ${response.data.message}`
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setModalData({
            show: true,
            title: 'Server Error',
            message: `Server Error: ${error.response.data.message}`
          });
        } else if (error.request) {
          setModalData({
            show: true,
            title: 'Network Error',
            message: 'Network Error: No se recibió respuesta del servidor'
          });
        } else {
          setModalData({
            show: true,
            title: 'Error',
            message: `Error: ${error.message}`
          });
        }
      } else {
        setModalData({
          show: true,
          title: 'Unexpected Error',
          message: `Error inesperado: ${error}`
        });
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleWarningClose = () => {
    setShowWarning(false);
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
  };
  
  const handleShowIntervenciones = (idCirugia: number) => {
    navigate('/cirugiaintervenciones', { state: { id_cirugia: idCirugia } });
  };

  return (
    <div className="navbar-container">
        <Container className="d-flex align-items-center justify-content-center vh-100">
          <Row className="justify-content-md-center">
            <Col className="p-3 border rounded bg-light shadow-sm">
              <h3>FORMULARIO DE CIRUGÍA - DIAGNÓSTICOS</h3>
              <Formik
                initialValues={{ id_diagnostico: '', id_cirugia }}
                validationSchema={Yup.object().shape({
                  id_diagnostico: Yup.string().required('Required')
                })}
                onSubmit={(values, { setSubmitting }) => handleSave(values, setSubmitting)}
              >
                {({ isSubmitting }) => (
                  <FormikForm className="p-3 border rounded bg-light shadow-sm">
                    <h5>Especialidad seleccionada: {especialidad}</h5>
                    {isLoading ? (
                      <Spinner animation="border" />
                    ) : (
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Diagnóstico</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Field as="select" name="id_diagnostico" className="form-control">
                                  <option value="" label="Seleccione un diagnóstico" />
                                  {diagnosticos.map(d => (
                                    <option key={d.id_diagnostico} value={d.id_diagnostico}>
                                      {d.diagnostico}
                                    </option>
                                  ))}
                                </Field>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                    )}
                    <div className="form-footer">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isSubmitting || isLoading}
                      >
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={diagnosticosSeleccionados.length === 0}
                        onClick={() => handleShowIntervenciones(id_cirugia)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
              <br></br>
              {diagnosticosSeleccionados.length > 0 && (
                <div className="form-body">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Diagnosticos guardados:</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnosticosSeleccionados.map((d, index) => (
                        <tr key={index}>
                          <td>{d.diagnostico}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              <ResponseModal 
                show={modalData.show} 
                handleClose={() => setModalData({ ...modalData, show: false })} 
                title={modalData.title} 
                message={modalData.message} 
              />
              <WarningModal
                show={showWarning}
                handleClose={handleWarningClose}
                handleConfirm={handleWarningConfirm}          
                message="Si cierra el formulario no podrá asociar Intervenciones a la cirugía."
              />
            </Col>
          </Row>
        </Container>
        <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Nueva Cirugía"/>
        </div>
    );
};

export default CirugiaDiagnostico;