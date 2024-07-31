import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Container, Col, Row } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, FormikProps } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import './Cirugias.css';
import { useLocation } from 'react-router-dom';
import ResponseModal from './ResponseModal';
import WarningModal from './WarningModal';
import axiosInstance from '../axiosConfig';

interface Staff {
  apellidos: string;
  id_staff: number;
  nombres: string;
}
interface StaffRole {
  id_staff_rol_cirugia: number;
  rol_cirugia: string;
}
interface SavedStaff {
  id_staff: number;
  id_staff_rol_cirugia: number;
  nombres: string;
  apellidos: string;
  rol_cirugia: string;
}

const CirugiaStaff: React.FC = () => {
  const location = useLocation();

  const { id_cirugia } = location.state || { id_cirugia: null }; 
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [, setSelectedStaff] = useState<number | null>(null);
  const [, setSelectedRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [savedStaff, setSavedStaff] = useState<SavedStaff[]>([]);
  const [modalData, setModalData] = useState({ show: false, title: '', message: '' });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStaffsAndRoles = async () => {
      setIsLoading(true);
      try {
        //console.log('Fetching staffs and roles...');

        const staffResponse = await axiosInstance({
          method: 'GET',
          url: '/staffs/get/all',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        });

        //console.log('Staffs response:', staffResponse.data);
        if (staffResponse.data.status === 'success') {
          const sortedStaffs = staffResponse.data.data.sort((a: Staff, b: Staff) =>
            a.apellidos.localeCompare(b.apellidos)
          );
          setStaffs(sortedStaffs);
        } else {
          setModalData({
            show: true,
            title: 'Error',
            message: `Error: ${staffResponse.data.message}`
          });
        }

        const rolesResponse = await axiosInstance.get('/staffrolescirugias/get/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        //console.log('Roles response:', rolesResponse.data);
        if (rolesResponse.data.status === 'success') {
          setRoles(rolesResponse.data.data);
        } else {
          setModalData({
            show: true,
            title: 'Error',
            message: `Error: ${rolesResponse.data.message}`
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
        console.error('Error fetching intervenciones data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffsAndRoles();
  }, [token]);

  const handleSave = async (values: { id_staff: string; id_staff_rol_cirugia: string }, setSubmitting: (isSubmitting: boolean) => void) => {
    const selectedStaff = parseInt(values.id_staff, 10);
    const selectedRole = parseInt(values.id_staff_rol_cirugia, 10);
    const requestDataStaff = {
      id_cirugia,
      id_staff: selectedStaff,
      id_staff_rol_cirugia: selectedRole
    };
    setIsLoading(true);
    //console.log('Sending save request:', requestDataStaff);

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: '/cirugiastaffs/post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: requestDataStaff
      });

      //console.log('Save response:', response.data);
      if (response.data.status === 'success') {
        setModalData({
          show: true,
          title: 'Éxito',
          message: 'Personal guardado con éxito'
        });
        const staff = staffs.find(s => s.id_staff === selectedStaff);
        const role = roles.find(r => r.id_staff_rol_cirugia === selectedRole);

        if (staff && role) {
          const newSavedStaff: SavedStaff = {
            id_staff: selectedStaff,
            id_staff_rol_cirugia: selectedRole,
            nombres: staff.nombres,
            apellidos: staff.apellidos,
            rol_cirugia: role.rol_cirugia
          };
          setSavedStaff(prev => [...prev, newSavedStaff]);
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
      console.error('Error al guardar la informacion de la intervención:', error);
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
  const handleFinalize = () => {
    setShowWarning(true);
  };

  return (
    <div className="navbar-container">
        <Container className="d-flex align-items-center justify-content-center vh-100">
          <Row className="justify-content-md-center">
            <Col className="p-3 border rounded bg-light shadow-sm">
              <h3 className="form-title">FORMULARIO DE CIRUGÍA – PERSONAL</h3>
              <Formik
                initialValues={{ id_staff: '', id_staff_rol_cirugia: '' }}
                validationSchema={Yup.object({
                  id_staff: Yup.string().required('Requerido'),
                  id_staff_rol_cirugia: Yup.string().required('Requerido')
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setSelectedStaff(parseInt(values.id_staff, 10));
                  setSelectedRole(parseInt(values.id_staff_rol_cirugia, 10));
                  handleSave(values, setSubmitting);
                }}
              >
                {({ isSubmitting, isValid, values }: FormikProps<{ id_staff: string; id_staff_rol_cirugia: string }>) => (
                  <FormikForm>
                    
                      {isLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Personal</th>
                              <th>Rol</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <Field as="select" name="id_staff" className="form-control">
                                  <option value="" label="Seleccione personal" />
                                  {staffs.map(staff => (
                                    <option key={staff.id_staff} value={staff.id_staff}>
                                      {`${staff.apellidos}, ${staff.nombres}`}
                                    </option>
                                  ))}
                                </Field>
                              </td>
                              <td>
                                <Field as="select" name="id_staff_rol_cirugia" className="form-control">
                                  <option value="" label="Seleccione rol" />
                                  {roles.map(role => (
                                    <option key={role.id_staff_rol_cirugia} value={role.id_staff_rol_cirugia}>
                                      {role.rol_cirugia}
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
                        disabled={isSubmitting || isLoading || !isValid || !values.id_staff || !values.id_staff_rol_cirugia}
                      >
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        disabled={savedStaff.length === 0}
                        onClick={handleFinalize}
                        className="ml-2"
                      >
                        Finalizar
                      </Button>
                    </div>
                  </FormikForm>
                )}
              </Formik>
              <br></br>
                {savedStaff.length > 0 && (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Personal guardado</th>
                      </tr>
                    </thead>
                    <tbody>
                        {savedStaff.map((staff, index) => (
                            <tr key={index}>
                                <td>{`${staff.apellidos}, ${staff.nombres} - ${staff.rol_cirugia}`}</td>
                            </tr>
                      ))}
                    </tbody>
                  </Table>
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
                message="¿Está seguro de cerrar el formulario?."
              />
            </Col>
          </Row>
        </Container>
          <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Nueva Cirugía"/>
          </div>
      );
    };

export default CirugiaStaff;
