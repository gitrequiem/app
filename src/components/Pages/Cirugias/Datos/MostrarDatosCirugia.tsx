import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosConfig';
import MostrarDiagnosticos from './MostrarDiagnosticos';
import MostrarIntervenciones from './MostrarIntervenciones';
import MostrarStaff from './MostrarStaff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import NuevoTicketCirugia from '../../Tickets/NuevoTicketCirugia';

interface CirugiaDetails {
    id_cirugia: number;
    fecha_inicio: string;
    fecha_fin: string;
    hora_inicio: string;
    hora_fin: string;
    apellido_nombre: string;
    doc_numero: number;
    complejidad: string;
    especialidad: string;
    finalizacion: string;
    programacion: string;
    quirofano: string;
    unidad: string;
    anestesia_solicitada: string;
    anestesia_realizada: string;
}

interface MostrarDatosCirugiaProps {
    show: boolean;
    handleClose: () => void;
    id_cirugia: number | null;
    userId: number;
    fetchCirugias: () => void;
}

const MostrarDatosCirugia: React.FC<MostrarDatosCirugiaProps> = ({ show, handleClose, id_cirugia, userId, fetchCirugias }) => {
    const [cirugia, setCirugia] = useState<CirugiaDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showDiagnosticos, setShowDiagnosticos] = useState<boolean>(false);
    const [showIntervenciones, setShowIntervenciones] = useState<boolean>(false);
    const [showStaff, setShowStaff] = useState<boolean>(false);
    const [showNuevoTicketCirugia, setShowNuevoTicketCirugia] = useState<boolean>(false);

useEffect(() => {
    if (id_cirugia !== null) {
    fetchCirugiaDetails(id_cirugia);
    }
}, [id_cirugia]);

const fetchCirugiaDetails = async (id: number) => {
    setLoading(true);
    try {
    const response = await axiosInstance.post('/cirugias/get/misultimascirugias/vermas', { id_cirugia: id }, {
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (response.data.status === 'success') {
        setCirugia(response.data.data);
    }
    setLoading(false);
    } catch (error) {
    console.error('Error fetching data:', error);
    setLoading(false);
    }
};

return (
    <>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Detalles de la Cirugía</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {loading ? (
            <Spinner animation="border" />
        ) : (
            cirugia && (
            <Table bordered>
                <tbody>
                <tr>
                    <th>Cirugía N°</th>
                    <td>{cirugia.id_cirugia}</td>
                </tr>
                <tr>
                <th>Fecha Inicio</th>
                <td>{cirugia.fecha_inicio}</td>
                </tr>
                <tr>
                <th>Fecha Fin</th>
                <td>{cirugia.fecha_fin}</td>
                </tr>
                <tr>
                <th>Hora Inicio</th>
                <td>{cirugia.hora_inicio}</td>
                </tr>
                <tr>
                <th>Hora Fin</th>
                <td>{cirugia.hora_fin}</td>
                </tr>
                <tr>
                <th>Apellido y Nombre</th>
                <td>{cirugia.apellido_nombre}</td>
                </tr>
                <tr>
                <th>Documento</th>
                <td>{cirugia.doc_numero}</td>
                </tr>
                <tr>
                <th>Complejidad</th>
                <td>{cirugia.complejidad}</td>
                </tr>
                <tr>
                <th>Especialidad</th>
                <td>{cirugia.especialidad}</td>
                </tr>
                <tr>
                <th>Finalización</th>
                <td>{cirugia.finalizacion}</td>
                </tr>
                <tr>
                <th>Programación</th>
                <td>{cirugia.programacion}</td>
                </tr>
                <tr>
                <th>Quirófano</th>
                <td>{cirugia.quirofano}</td>
                </tr>
                <tr>
                <th>Unidad</th>
                <td>{cirugia.unidad}</td>
                </tr>
                <tr>
                <th>Anestesia Solicitada</th>
                <td>{cirugia.anestesia_solicitada}</td>
                </tr>
                <tr>
                <th>Anestesia Realizada</th>
                <td>{cirugia.anestesia_realizada}</td>
                </tr>
                <tr>
                <th>Diagnósticos</th>
                <td><Button variant="warning" onClick={() => setShowDiagnosticos(true)}>
                    <FontAwesomeIcon icon={faPaperclip} />
                    </Button></td>
                </tr>
                <tr>
                    <th>Intervenciones</th>
                    <td><Button variant="warning" onClick={() => setShowIntervenciones(true)}>
                    <FontAwesomeIcon icon={faPaperclip} />
                    </Button></td>
                </tr>
                <tr>
                    <th>Personal</th>
                    <td><Button variant="warning" onClick={() => setShowStaff(true)}>
                    <FontAwesomeIcon icon={faPaperclip} />
                    </Button></td>
                </tr>
                <tr>
                    <th>Crear Ticket</th>
                    <td><Button variant="danger" onClick={() => setShowNuevoTicketCirugia(true)}>
                    <FontAwesomeIcon icon={faPaperclip} />
                    </Button></td>
                </tr>
                </tbody>
            </Table>
            )
        )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        </Modal.Footer>
    </Modal>

    <MostrarDiagnosticos
        show={showDiagnosticos}
        handleClose={() => setShowDiagnosticos(false)}
        id_cirugia={id_cirugia}
    />
    <MostrarIntervenciones
        show={showIntervenciones}
        handleClose={() => setShowIntervenciones(false)}
        id_cirugia={id_cirugia} 
    />
    <MostrarStaff
        show={showStaff}
        handleClose={() => setShowStaff(false)}
        id_cirugia={id_cirugia} 
    />
    <NuevoTicketCirugia 
        show={showNuevoTicketCirugia} 
        handleClose={() => setShowNuevoTicketCirugia(false)} 
        userId={userId}
        id_fk={id_cirugia} 
        onTicketSubmit={fetchCirugias} 
    />
    </>
);
};

export default MostrarDatosCirugia;