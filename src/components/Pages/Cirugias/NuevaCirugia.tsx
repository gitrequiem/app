import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Col, Row, Spinner, Container } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import ResponseModal from './ResponseModal';
import WarningModal from './WarningModal';
import './NuevaCirugia.css'
import axiosInstance from '../axiosConfig';
interface Finalizacion {
  id_finalizacion: number;
  finalizacion: string;
}
interface Programacion {
  id_programacion: number;
  programacion: string;
  es_urgencia: boolean;
}
interface Unidad {
  id_unidad: number;
  unidad: string;
}
interface Quirofano {
  id_quirofano: number;
  quirofano: string;
}
interface Especialidad {
  id_especialidad: number;
  especialidad: string;
}
interface TipoAnestesia {
  id_tipo_anestesia: number;
  tipo_anestesia: string;
}
interface Complejidad {
  id_complejidad: number;
  complejidad: string;
}
const NuevaCirugia: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pacienteId } = location.state || { pacienteId: null };
  const [finalizaciones, setFinalizaciones] = useState<Finalizacion[]>([]);
  const [programaciones, setProgramaciones] = useState<Programacion[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [quirofanos, setQuirofanos] = useState<Quirofano[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [tiposAnestesia, setTiposAnestesia] = useState<TipoAnestesia[]>([]);
  const [complejidades, setComplejidades] = useState<Complejidad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [idCirugia, setIdCirugia] = useState<number>(0);
  const [, setIdEspecialidad]  = useState<number>(0);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>('');
  const [cirugiaCreada, setCirugiaCreada] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalData, setModalData] = useState({ show: false, title: '', message: '' });
  const token = localStorage.getItem('token');


  const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [finalizacionesRes, programacionesRes, unidadesRes, especialidadesRes, tiposAnestesiaRes, complejidadesRes] = await Promise.all([
          

          axiosInstance.get('/finalizaciones/get/all', { headers: {Authorization: `Bearer ${token}`}}),
          axiosInstance.get('/programaciones/get/all', {headers: {Authorization : `Bearer ${token}`}}),
          axiosInstance.get('/unidades/get/all', {headers: {Authorization: `Bearer ${token}`}}),
          axiosInstance.get('/especialidades/get/all', {headers: {Authorization: `Bearer ${token}`}}),
          axiosInstance.get('/tiposanestesias/get/all', {headers: {Authorization: `Bearer ${token}`}}),
          axiosInstance.get('/complejidades/get/all', {headers: {Authorization: `Bearer ${token}`}}),

        ]);
        setFinalizaciones(finalizacionesRes.data.data);
        setProgramaciones(programacionesRes.data.data);
        setUnidades(unidadesRes.data.data);
        setEspecialidades(especialidadesRes.data.data);
        setTiposAnestesia(tiposAnestesiaRes.data.data);
        setComplejidades(complejidadesRes.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const fetchQuirofanos = async (idUnidad: number) => {
    try {
        const data = { id_unidad: idUnidad };
        //console.log('Datos enviados al backend:', JSON.stringify(data, null, 2));

        const response = await axiosInstance({
            method: 'POST',
            url: '/quirofanos/unidades/get/id',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: data
        });

        setQuirofanos(response.data.data);
    } catch (error) {
      handleAxiosError(error, 'Error fetching quirofanos:');
    }
};

const handleAxiosError = (error: any, message: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`${message} ${error.response.status}: ${error.response.data}`);
      setModalData({
        show: true,
        title: 'Server Error',
        message: `Server Error: ${error.response.data.message}`
      });
    } else if (error.request) {
      console.error(`${message} No response received: ${error.request}`);
      setModalData({
              show: true,
              title: 'Network Error',
              message: 'Network Error: No response received from server'
            });
    } else {
      console.error(`${message} ${error.message}`);
      setModalData({
        show: true,
        title: 'Error',
        message: `Error: ${error.message}`
      });
    }
  } else {
    console.error(`${message} ${error}`);
    setModalData({
      show: true,
      title: 'Unexpected Error',
      message: `Unexpected Error: ${error}`
    });
  }
};

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleWarningClose = () => {
    setShowWarning(false);
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
  };

  const handleShowDiagnostico = (idCirugia: number, especialidadSeleccionada: string) => {
    navigate('/cirugiadiagnostico', { 
      state: { 
        id_cirugia: idCirugia,
        especialidad: especialidadSeleccionada 
      } 
    });
  };
  if (loading) {
    return <Spinner animation="border" />;
  }

  const handleFinalize = () => {
    setShowWarning(true);
  };

  return (
    <div className="navbar-container">
      <br /><br />
        <Container className="d-flex align-items-center justify-content-center vh-100 ">
          <Row className="justify-content-md-center ">
            <Col className="p-3 border rounded bg-light shadow-sm">
            <Formik
              initialValues={{
                fecha_inicio: new Date(),
                hora_inicio: new Date(),
                fecha_fin: new Date(),
                hora_fin: new Date(),
                id_finalizacion:'',
                id_programacion:'',
                estado: '',
                lista_espera: '',
                id_unidad:'',
                id_quirofano: '0',
                id_especialidad: '', 
                id_tipo_anestesia_solicitada: '',
                id_tipo_anestesia_realizada: '',
                id_complejidad: '',
                comentarios: '',
              }}
              validationSchema={Yup.object({
                fecha_inicio: Yup.date().required('Requerido'),
                hora_inicio: Yup.date().required('Requerido'),
                fecha_fin: Yup.date().required('Requerido'),
                hora_fin: Yup.date().required('Requerido'),
                id_finalizacion: Yup.number().required('Requerido'),
                id_programacion: Yup.number().required('Requerido'),
                id_unidad: Yup.number().required('Requerido'),
                id_quirofano: Yup.number().required('Requerido'),
                id_especialidad: Yup.number().required('Requerido'),
                id_tipo_anestesia_solicitada: Yup.number().required('Requerido'),
                id_tipo_anestesia_realizada: Yup.number().required('Requerido'),
                id_complejidad: Yup.number().required('Requerido'),
                comentarios: Yup.string(),
                estado: Yup.string().required('Requerido'), 
                lista_espera: Yup.string().required('Requerido') 
              })}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    //console.log(JSON.stringify(values, null, 2));
                    
                    // Guarda las fechas y horas en variables
                    const fechaInicio = new Date(values.fecha_inicio);
                    const horaInicio = new Date(values.hora_inicio);
                    const fechaFin = new Date(values.fecha_fin);
                    const horaFin = new Date(values.hora_fin);

                    // imprime en consola los datos obtenidos de DatePicker
                    //console.log("Fecha inicio seleccionada:", fechaInicio);
                    //console.log("Hora inicio seleccionada:", horaInicio);
                    //console.log("Fecha fin seleccionada:", fechaFin);
                    //console.log("Hora fin seleccionada:", horaFin);

                    // Formatea las fechas y horas
                    const fechaInicioStr = formatDate(fechaInicio);
                    const horaInicioStr = formatTime(horaInicio);
                    const fechaFinStr = formatDate(fechaFin);
                    const horaFinStr = formatTime(horaFin);

                    // Imprime en consola los datos formateados
                    //console.log("Fecha inicio string:", fechaInicioStr);
                    //console.log("Hora inicio string:", horaInicioStr);
                    //console.log("Fecha fin string:", fechaFinStr);
                    //console.log("Hora fin string:", horaFinStr);

                    // Obtiene el valor de programado según el valor de es_urgencia
                  const programacionSeleccionada = programaciones.find(
                    (programacion) => programacion.id_programacion === parseInt(values.id_programacion)
                  );
                  const programado = programacionSeleccionada ? !programacionSeleccionada.es_urgencia : false;

                    // Crea el objeto con las fechas y horas formateadas
                  const formattedValues = {
                    fecha_inicio: fechaInicioStr,
                    hora_inicio: horaInicioStr,
                    fecha_fin: fechaFinStr,
                    hora_fin: horaFinStr,
                    id_unidad: parseInt(values.id_unidad),
                    id_quirofano: parseInt(values.id_quirofano),
                    id_especialidad:  parseInt(values.id_especialidad),
                    id_tipo_anestesia_solicitada: parseInt(values.id_tipo_anestesia_solicitada),
                    id_tipo_anestesia_realizada: parseInt(values.id_tipo_anestesia_realizada),
                    id_paciente: pacienteId,
                    id_finalizacion: parseInt(values.id_finalizacion),
                    id_programacion: parseInt(values.id_programacion),
                    id_complejidad: parseInt(values.id_complejidad),
                    comentarios: values.comentarios,
                    programado: programado,
                    estado: values.estado === 'true',
                    lista_espera: values.lista_espera === 'true',
                  };

                    // Imprime en consola el JSON que se enviará
                    //console.log("JSON enviado:", JSON.stringify(formattedValues, null, 2));
                    
                  const response = await axiosInstance.post('/cirugias/post', formattedValues, {
                    headers: {Authorization: `Bearer ${token}`}
                  }); 

                  //console.log("Respuesta recibida:", JSON.stringify(response.data, null, 2));

                  if (response.status === 200 || response.status === 201) {
                    const idCirugiaResponse = response.data.data.id_cirugia;
                    const idEspecialidadResponse = response.data.data.id_especialidad;
                    setModalData({
                      show: true,
                      title: 'Éxito',
                      message: `Cirugía número: ${idCirugiaResponse} con éxito`
                    });

                    setCirugiaCreada(true);
                    setSaveButtonDisabled(true); // esto se agrego
                    setIdCirugia(idCirugiaResponse); 
                    setIdEspecialidad(idEspecialidadResponse);
                    //console.log('ID Cirugía:', response.data.data.id_cirugia);
                    //console.log('ID Cirugía2:', idCirugia);//no utilizar este dato
                    //console.log('ID Especialidad:', response.data.data.id_especialidad)
                    setEspecialidadSeleccionada(
                      especialidades.find((e) => e.id_especialidad === parseInt(values.id_especialidad))?.especialidad || ''
                    );
                    //console.log("id Cirugia:",  response.data.data.id_cirugia);
                    //console.log("id Especialidad:", parseInt(values.id_especialidad));
                    //console.log('Datos recibidos del backend:', response.data);
                  }

                } catch (error) {
                  handleAxiosError(error, 'Error al enviar el formulario:');
                  setCirugiaCreada(false);
                  setModalData({
                    show: true,
                    title: 'Error',
                    message: 'Error al crear la cirugía'
                  });;
                  setSaveButtonDisabled(false); // esto se agrego 
                } finally {
                  setSubmitting(false);
                }
              }}
              >
              {({ isSubmitting, setFieldValue, handleBlur, errors, touched }) => (
              <div className='scrollable-form '>
                <FormikForm className="p-3 border rounded bg-light shadow-sm  ">
                <h3 className="form-title">FORMULARIO DE CIRUGÍA</h3>
                    <Row>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label htmlFor="fecha_inicio">Fecha inicio</Form.Label>
                          <Field name="fecha_inicio">
                            {({ field }: any) => (
                              <DatePicker
                                {...field}   
                                id="fecha_inicio"                          
                                dateFormat="dd/MM/yyyy"
                                selected={field.value}
                                onChange={(val: Date) => setFieldValue('fecha_inicio', val)}
                                className="form-control"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="fecha_inicio" component="div" className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label htmlFor="hora_inicio">Hora inicio</Form.Label>
                          <Field  name="hora_inicio">
                            {({ field }: any) => (
                              <DatePicker
                                {...field}
                                id="hora_inicio"
                                selected={field.value}
                                onChange={(val: Date) => setFieldValue('hora_inicio', val)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Hora"
                                dateFormat="HH:mm:ss"
                                className="form-control"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="hora_inicio" component="div" className="text-danger" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col  md={4}>
                        <Form.Group>
                          <Form.Label  htmlFor="fecha_fin">Fecha fin</Form.Label>
                          <Field  name="fecha_fin"  >
                            {({ field }: any) => (
                              <DatePicker
                                {...field}
                                id="fecha_fin"
                                dateFormat="dd/MM/yyyy"
                                selected={field.value}
                                onChange={(val: Date) => setFieldValue('fecha_fin', val)}
                                className="form-control"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="fecha_fin" component="div" className="text-danger" />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label htmlFor="hora_fin">Hora fin</Form.Label>
                          <Field  name="hora_fin">
                            {({ field }: any) => (
                              <DatePicker
                                {...field}
                                id="hora_fin"
                                selected={field.value}
                                onChange={(val: Date) => setFieldValue('hora_fin', val)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Hora"
                                dateFormat="HH:mm:ss"
                                className="form-control"
                              />
                            )}
                          </Field>
                          <ErrorMessage name="hora_fin" component="div" className="text-danger" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_finalizacion">Finalización</Form.Label>
                      <Field as="select" id="id_finalizacion" name="id_finalizacion" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {finalizaciones.map((finalizacion) => (
                          <option key={finalizacion.id_finalizacion} value={finalizacion.id_finalizacion}>
                            {finalizacion.finalizacion}
                          </option>
                        ))}
                      </Field>
                      {errors.id_finalizacion && touched.id_finalizacion ? (
                        <div className="text-danger">{errors.id_finalizacion}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_programacion">Programación</Form.Label>
                      <Field as="select" id="id_programacion" name="id_programacion" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {programaciones.map((programacion) => (
                          <option key={programacion.id_programacion} value={programacion.id_programacion}>
                            {programacion.programacion}
                          </option>
                        ))}
                      </Field>
                      {errors.id_programacion && touched.id_programacion ? (
                        <div className="text-danger">{errors.id_programacion}</div>
                      ) : null}
                    </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="estado">Requiere cama</Form.Label>
                      <Field as="select" id="estado" name="estado" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </Field>
                      {errors.estado && touched.estado ? (
                        <div className="text-danger">{errors.estado}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="lista_espera">Lista de espera</Form.Label>
                      <Field as="select" id="lista_espera" name="lista_espera" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </Field>
                      {errors.lista_espera && touched.lista_espera ? (
                        <div className="text-danger">{errors.lista_espera}</div>
                      ) : null}
                    </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_unidad">Unidad</Form.Label>
                      <Field as="select" id="id_unidad" name="id_unidad" className="form-control"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const idUnidad = parseInt(e.target.value, 10);
                          setFieldValue('id_unidad', idUnidad);
                          fetchQuirofanos(idUnidad);
                        }}
                        onBlur={handleBlur}                    
                      >
                        <option value="">Seleccione una opción</option>
                        {unidades.map((unidad) => (
                          <option key={unidad.id_unidad} value={unidad.id_unidad}>
                            {unidad.unidad}
                          </option>
                        ))}
                      </Field>
                      {errors.id_unidad && touched.id_unidad ? (
                        <div className="text-danger">{errors.id_unidad}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_quirofano">Quirófano</Form.Label>
                      <Field as="select" id="id_quirofano" name="id_quirofano" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {quirofanos.map((quirofano) => (
                          <option key={quirofano.id_quirofano} value={quirofano.id_quirofano}>
                            {quirofano.quirofano}
                          </option>
                        ))}
                      </Field>
                      {errors.id_quirofano && touched.id_quirofano ? (
                        <div className="text-danger">{errors.id_quirofano}</div>
                      ) : null}
                    </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label  htmlFor="id_complejidad">Complejidad</Form.Label>
                      <Field as="select" id="id_complejidad" name="id_complejidad" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {complejidades.map((complejidad) => (
                          <option key={complejidad.id_complejidad} value={complejidad.id_complejidad}>
                            {complejidad.complejidad}
                          </option>
                        ))}
                      </Field>
                      {errors.id_complejidad && touched.id_complejidad ? (
                        <div className="text-danger">{errors.id_complejidad}</div>
                      ) : null}
                    </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_especialidad">Especialidad</Form.Label>
                      <Field as="select" id="id_especialidad" name="id_especialidad" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {especialidades.map((especialidad) => (
                          <option key={especialidad.id_especialidad} value={especialidad.id_especialidad}>
                            {especialidad.especialidad}
                          </option>
                        ))}
                      </Field>
                      {errors.id_especialidad && touched.id_especialidad ? (
                        <div className="text-danger">{errors.id_especialidad}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_tipo_anestesia_solicitada">Anestesia solicitada</Form.Label>
                      <Field as="select" id="id_tipo_anestesia_solicitada" name="id_tipo_anestesia_solicitada" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {tiposAnestesia.map((tipo) => (
                          <option key={tipo.id_tipo_anestesia} value={tipo.id_tipo_anestesia}>
                            {tipo.tipo_anestesia}
                          </option>
                        ))}
                      </Field>
                      {errors.id_tipo_anestesia_solicitada && touched.id_tipo_anestesia_solicitada ? (
                        <div className="text-danger">{errors.id_tipo_anestesia_solicitada}</div>
                      ) : null}
                    </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="id_tipo_anestesia_realizada">Anestesia realizada</Form.Label>
                      <Field as="select" id="id_tipo_anestesia_realizada" name="id_tipo_anestesia_realizada" className="form-control" onBlur={handleBlur}>
                        <option value="">Seleccione una opción</option>
                        {tiposAnestesia.map((tipo) => (
                          <option key={tipo.id_tipo_anestesia} value={tipo.id_tipo_anestesia}>
                            {tipo.tipo_anestesia}
                          </option>
                        ))}
                      </Field>
                      {errors.id_tipo_anestesia_realizada && touched.id_tipo_anestesia_realizada ? (
                        <div className="text-danger">{errors.id_tipo_anestesia_realizada}</div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label htmlFor="comentarios">Comentarios</Form.Label>
                      <Field as="textarea" id="comentarios" name="comentarios" className="form-control" placeholder="Indicar aquí en caso de: anatomía patológica, cultivos, número de pulsera neo o cualquier otra información sobre esta cirugía" />
                      <ErrorMessage name="comentarios" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <br></br>
                <Button 
                      type="button" 
                      variant="danger" 
                      onClick={handleFinalize}>  
                      Cancelar
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting || isSaveButtonDisabled}
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button 
                      type="button" 
                      variant="primary" 
                      disabled={!cirugiaCreada}
                      onClick={() => handleShowDiagnostico(idCirugia, especialidadSeleccionada)}>  
                      Siguiente
                    </Button>
                    <br /><br />
                    
                </FormikForm>
                </div>
              )}
            </Formik>
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
                message="¿Está seguro de cerrar el formulario?, Si ya guardo datos debe crear un ticket"
            />
            </Col>
            </Row>
          </Container>
          <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow}  pageTitle="Nueva Cirugía"/>
  </div>
  );
};
export default NuevaCirugia;
