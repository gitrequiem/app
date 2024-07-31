import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import './Cirugias.css';
import ResponseModal from './ResponseModal';
import { useLocation, useNavigate } from 'react-router-dom';
import WarningModal from './WarningModal';
import axiosInstance from '../axiosConfig';

interface Intervencion {
  intervencion: string;
  id_intervencion: number;
}

const CirugiaIntervencion: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id_cirugia } = location.state || { id_cirugia: null };
  const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);
  const [intervencionesSeleccionadas, setIntervencionesSeleccionadas] = useState<Intervencion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ , setSavedIntervencion] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalData, setModalData] = useState({ show: false, title: '', message: '' });
  const [showWarning, setShowWarning] = useState(false);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchIntervenciones = async () => {
      setIsLoading(true);
      const requestDataIntervenciones = { id_cirugia: id_cirugia };

      try {
        const response = await axiosInstance({
          method: 'POST',
          url: '/intervenciones/get/diagnosticos/cirugias/id',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          data: requestDataIntervenciones
        });

        if (response.data.status === 'success') {
          // Ordenar las intervenciones alfabéticamente antes de establecer el estado
          const sortedIntervenciones = response.data.data.sort((a: Intervencion, b: Intervencion) =>
            a.intervencion.localeCompare(b.intervencion)
          );
          setIntervenciones(sortedIntervenciones);
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

    fetchIntervenciones();
  }, [id_cirugia, token]);

  const handleSave = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    const formattedValues = {
      id_cirugia,
      id_intervencion: parseInt(values.id_intervencion, 10)
    };
    setIsLoading(true);

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: '/cirugiaintervenciones/post',
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
          message: 'Intervención guardado con éxito'
        });
        setSavedIntervencion(response.data.data.id_cirugia_intervencion);

        const nuevaIntervencion = intervenciones.find(d => d.id_intervencion === formattedValues.id_intervencion);
        if (nuevaIntervencion) {
          setIntervencionesSeleccionadas(prev => [...prev, nuevaIntervencion]);
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

  const handleShowStaff = (idCirugia: number) => {
    navigate('/cirugiastaff', { state: { id_cirugia: idCirugia } });
  };

  return (
    <div className="navbar-container">
        <Container className="d-flex align-items-center justify-content-center vh-100">
          <Row className="justify-content-md-center">
            <Col className="p-3 border rounded bg-light shadow-sm">
              <h3 className="form-title">FORMULARIO DE CIRUGÍA - INTERVENCIONES</h3>
              <Formik
                initialValues={{ id_intervencion: '', id_cirugia }}
                validationSchema={Yup.object().shape({
                  id_intervencion: Yup.string().required('Required')
                })}
                onSubmit={(values, { setSubmitting }) => handleSave(values, setSubmitting)}
              >
                {({ isSubmitting }) => (
                  <FormikForm>
                    
                      {isLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Seleccione la intervención realizada:</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Field as="select" name="id_intervencion" className="form-control">
                                  <option value="" label="Seleccione una intervención" />
                                  {intervenciones.map(d => (
                                    <option key={d.id_intervencion} value={d.id_intervencion}>
                                      {d.intervencion}
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
                        disabled={intervencionesSeleccionadas.length === 0}
                        onClick={ () => handleShowStaff (id_cirugia) }
                      >
                        Siguiente
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
              <br></br>
              {intervencionesSeleccionadas.length > 0 && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Intervenciones seleccionadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intervencionesSeleccionadas.map((d, index) => (
                      <tr key={index}>
                        <td>{d.intervencion}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Col>
          </Row>
        </Container>
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
          message="Si cierra el formulario no podrá asociar Staff a la cirugía."
        />
      <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Nueva Cirugía"/>
      </div>
  );
};

export default CirugiaIntervencion;