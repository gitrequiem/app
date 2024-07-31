import React, { useEffect, useState } from 'react';
import { Modal, Button, Form as BootstrapForm, Spinner } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { NuevoPaciente as INuevoPaciente } from './Types';
import axiosInstance from '../axiosConfig';

interface NuevoPacienteProps {
  show: boolean;
  handleClose: () => void;
  handleAdd: (paciente: INuevoPaciente) => void;
}

interface DocTipos {
  id_doc_tipo: number;
  doc_tipo: string;
}

interface Provincias {
  id_provincia: number;
  provincia: string;
}

interface Localidades {
  id_localidad: number;
  localidad: string;
}

interface Nacionalidades {
  id_nacionalidad: number;
  nacionalidad: string;
}

const NuevoPaciente: React.FC<NuevoPacienteProps> = ({ show, handleClose, handleAdd }) => {
  const [docTipos, setDocTipos] = useState<DocTipos[]>([]);
  const [provincias, setProvincias] = useState<Provincias[]>([]);
  const [localidades, setLocalidades] = useState<Localidades[]>([]);
  const [nacionalidades, setNacionalidades] = useState<Nacionalidades[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //const BASE_URL = 'http://192.168.1.44:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoading(true);
      try {
        const [docTiposResponse, provinciasResponse, localidadesResponse, nacionalidadesResponse] = await Promise.all([
          //axios.get(`${BASE_URL}/doctipos/get/all`, { headers: { Authorization: `Bearer ${token}` }}),
          //axios.get(`${BASE_URL}/provincias/get/all`, { headers: { Authorization: `Bearer ${token}` }}),
          //axios.get(`${BASE_URL}/localidades/get/all`, { headers: { Authorization: `Bearer ${token}` }}),
          //axios.get(`${BASE_URL}/nacionalidades/get/all`, { headers: { Authorization: `Bearer ${token}` }}),
        
          axiosInstance.get('/doctipos/get/all', { headers: { Authorization: `Bearer ${token}` }}),
          axiosInstance.get('/provincias/get/all', { headers: { Authorization: `Bearer ${token}` }}),
          axiosInstance.get('/localidades/get/all', { headers: { Authorization: `Bearer ${token}` }}),
          axiosInstance.get('/nacionalidades/get/all', { headers: { Authorization: `Bearer ${token}` }})
        
        ]);

        setDocTipos(docTiposResponse.data.data.sort((a: DocTipos, b: DocTipos) => a.doc_tipo.localeCompare(b.doc_tipo)));
        setProvincias(provinciasResponse.data.data.sort((a: Provincias, b: Provincias) => a.provincia.localeCompare(b.provincia)));
        setLocalidades(localidadesResponse.data.data.sort((a: Localidades, b: Localidades) => a.localidad.localeCompare(b.localidad)));
        setNacionalidades(nacionalidadesResponse.data.data.sort((a: Nacionalidades, b: Nacionalidades) => a.nacionalidad.localeCompare(b.nacionalidad)));

      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, [token]);

  const fetchProvincias = async (id_provincia: number) => {
    try {
      const response = await axiosInstance.post(
        '/localidades/get/provincias/id',
        { id_provincia },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLocalidades(response.data.data.sort((a: Localidades, b: Localidades) => a.localidad.localeCompare(b.localidad)));
    } catch (error) {
      console.error('Error fetching localidades:', error);
    }
  };

  const handleSave = async (values: any, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/pacientes/post', values, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        handleAdd(response.data.data);
        handleClose();
      } else {
        console.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          console.error(`Server Error: ${error.response.data.message}`);
        } else if (error.request) {
          console.error('Network Error: No response received from server');
        } else {
          console.error(`Error: ${error.message}`);
        }
      } else {
        console.error(`Unexpected Error: ${error}`);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            nombre: '',
            apellidos: '',
            doc_numero: '',
            id_doc_tipo: '',
            id_provincia: '',
            id_localidad: '',
            id_nacionalidad: ''
          }}
          validationSchema={Yup.object({
            nombre: Yup.string().required('Nombre es requerido'),
            apellidos: Yup.string().required('Apellidos es requerido'),
            doc_numero: Yup.number().required('Número de documento es requerido').positive().integer(),
            id_doc_tipo: Yup.number().required('Tipo de documento es requerido'),
            id_provincia: Yup.number().required('Provincia es requerida'),
            id_localidad: Yup.number().required('Localidad es requerida'),
            id_nacionalidad: Yup.number().required('Nacionalidad es requerida')
          })}
          onSubmit={(values, { setSubmitting }) => handleSave(values, setSubmitting)}
        >
          {({ isSubmitting, setFieldValue }) => (
            <FormikForm>
              {isLoading ? (
                <Spinner animation="border" />
              ) : (
                <>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Nombre</BootstrapForm.Label>
                    <Field name="nombre" type="text" className="form-control" />
                    <ErrorMessage name="nombre" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Apellidos</BootstrapForm.Label>
                    <Field name="apellidos" type="text" className="form-control" />
                    <ErrorMessage name="apellidos" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Número de Documento</BootstrapForm.Label>
                    <Field name="doc_numero" type="number" className="form-control" />
                    <ErrorMessage name="doc_numero" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Tipo de Documento</BootstrapForm.Label>
                    <Field as="select" name="id_doc_tipo" className="form-control">
                      <option value="">Seleccione...</option>
                      {docTipos.map((option) => (
                        <option key={option.id_doc_tipo} value={option.id_doc_tipo}>{option.doc_tipo}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="id_doc_tipo" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Provincia</BootstrapForm.Label>
                    <Field as="select" name="id_provincia" className="form-control" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const idProvincia = parseInt(e.target.value, 10);
                      setFieldValue('id_provincia', idProvincia);
                      fetchProvincias(idProvincia);
                    }}>
                      <option value="">Seleccione...</option>
                      {provincias.map((provincia) => (
                        <option key={provincia.id_provincia} value={provincia.id_provincia}>{provincia.provincia}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="id_provincia" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Localidad</BootstrapForm.Label>
                    <Field as="select" name="id_localidad" className="form-control">
                      <option value="">Seleccione...</option>
                      {localidades.map((option) => (
                        <option key={option.id_localidad} value={option.id_localidad}>{option.localidad}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="id_localidad" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                  <BootstrapForm.Group>
                    <BootstrapForm.Label>Nacionalidad</BootstrapForm.Label>
                    <Field as="select" name="id_nacionalidad" className="form-control">
                      <option value="">Seleccione...</option>
                      {nacionalidades.map((option) => (
                        <option key={option.id_nacionalidad} value={option.id_nacionalidad}>{option.nacionalidad}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="id_nacionalidad" component="div" className="text-danger" />
                  </BootstrapForm.Group>
                </>
              )}
              <Modal.Footer>
                <Button variant="secondary"
                onClick={handleClose}>
                Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Guardar'}
                </Button>
                </Modal.Footer>
                </FormikForm>
                )}
                </Formik>
                </Modal.Body>
                </Modal>
                );
                };
                
                export default NuevoPaciente;