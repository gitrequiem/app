import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosConfig';

interface Intervencion {
id_intervencion: number;
intervencion: string;
}

interface MostrarIntervencionesProps {
show: boolean;
handleClose: () => void;
id_cirugia: number | null;
}

const MostrarIntervenciones: React.FC<MostrarIntervencionesProps> = ({ show, handleClose, id_cirugia }) => {
const [intervenciones, setIntervenciones] = useState<Intervencion[]>([]);
const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
    if (id_cirugia !== null) {
    fetchIntervenciones(id_cirugia);
    }
}, [id_cirugia]);

const fetchIntervenciones = async (id: number) => {
    setLoading(true);
    try {
    const response = await axiosInstance.post('/cirugiaintervenciones/get/intervenciones', { id_cirugia: id }, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (response.data.status === 'success') {
        setIntervenciones(response.data.data);
    }
    setLoading(false);
    } catch (error) {
    console.error('Error fetching intervenciones:', error);
    setLoading(false);
    }
};

return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
        <Modal.Title>Intervenciones de la Cirugía</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {loading ? (
        <Spinner animation="border" />
        ) : (
        <Table bordered>
            <thead>
            <tr>
                <th>Intervención</th>
            </tr>
            </thead>
            <tbody>
            {intervenciones.map((inter) => (
                <tr key={inter.id_intervencion}>
                <td>{inter.intervencion}</td>
                </tr>
            ))}
            </tbody>
        </Table>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
    </Modal.Footer>
    </Modal>
);
};

export default MostrarIntervenciones;