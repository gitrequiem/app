import React, { useEffect, useState } from 'react';
import { Modal, Button, Form as BootstrapForm, Alert } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../axiosConfig';

interface NuevoTicketProps {
    show: boolean;
    handleClose: () => void;
    userId: number;
    id_fk: number | null;
    onTicketSubmit: () => void;
}

interface Entidad {
    id_ticket_entidad: number;
    table_fk: string;
}

const NuevoTicket: React.FC<NuevoTicketProps> = ({ show, handleClose, userId, id_fk, onTicketSubmit }) => {
    const [, setEntidades] = useState<Entidad[]>([]);
    const [cirugiaEntidad, setCirugiaEntidad] = useState<Entidad | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'danger' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            axiosInstance.get('/ticketsentidades/get/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (response.data.status === 'success' && Array.isArray(response.data.data)) {
                        setEntidades(response.data.data);
                        const entidadCirugias = response.data.data.find((entidad: Entidad) => entidad.table_fk === 'Cirugías');
                        if (entidadCirugias) {
                            setCirugiaEntidad(entidadCirugias);
                        }
                    } else {
                        console.error('Unexpected response data:', response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching entidades:', error);
                });
        }
    }, [token]);

    const handleSubmit = (values: { entidad: string; detalles: string }, setSubmitting: (isSubmitting: boolean) => void) => {
        setIsSubmitting(true);
        const ticketData = {
            id_user_generator: userId,
            time_generated: new Date().toISOString(),
            id_table_fk: values.entidad,
            id_fk: id_fk,
            memo_generated: values.detalles,
        };

        if (token) {
            axiosInstance.post('/tickets/post', ticketData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (response.data.status === 'success') {
                        setMessage('Envío exitoso');
                        setMessageType('success');
                        setTimeout(() => {
                            setMessage(null);
                            setMessageType(null);
                            handleClose();
                            onTicketSubmit();
                            setIsSubmitting(false);
                        }, 2000);
                    } else {
                        setMessage('Envío fallido');
                        setMessageType('danger');
                        setIsSubmitting(false);
                    }
                    setSubmitting(false);
                })
                .catch(error => {
                    console.error('Error sending ticket:', error);
                    setMessage('Envío fallido');
                    setMessageType('danger');
                    setSubmitting(false);
                    setIsSubmitting(false);
                });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear nuevo ticket Cirugia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && <Alert variant={messageType || undefined}>{message}</Alert>}
                <Formik
                    initialValues={{ entidad: cirugiaEntidad ? cirugiaEntidad.id_ticket_entidad.toString() : '', detalles: '' }}
                    validationSchema={Yup.object({
                        entidad: Yup.string().required('Entidad es requerida'),
                        detalles: Yup.string().required('Detalles son requeridos'),
                    })}
                    onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
                    enableReinitialize
                >
                    <Form>
                        <BootstrapForm.Group controlId="formEntidad">
                            <BootstrapForm.Label>Entidad</BootstrapForm.Label>
                            <Field as="select" name="entidad" className="form-control" disabled>
                                {cirugiaEntidad && (
                                    <option key={cirugiaEntidad.id_ticket_entidad} value={cirugiaEntidad.id_ticket_entidad}>
                                        {cirugiaEntidad.table_fk}
                                    </option>
                                )}
                            </Field>
                            <ErrorMessage name="entidad" component="div" className="text-danger" />
                        </BootstrapForm.Group>

                        <BootstrapForm.Group controlId="formDetalles">
                            <BootstrapForm.Label>Detalles</BootstrapForm.Label>
                            <Field as="textarea" name="detalles" className="form-control" />
                            <ErrorMessage name="detalles" component="div" className="text-danger" />
                        </BootstrapForm.Group>

                        <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                            Enviar
                        </Button>
                    </Form>
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default NuevoTicket;