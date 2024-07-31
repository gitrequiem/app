import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Paciente } from './Types';
import NuevoTicketPaciente from '../Tickets/NuevoTicketPaciente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

interface MostrarDatosPacienteProps {
  show: boolean;
  handleClose: () => void;
  paciente: Paciente | null;
  userId: number;
  fetchPacientes: () => void;
}

const MostrarDatosPaciente: React.FC<MostrarDatosPacienteProps> = ({ show, handleClose, paciente, userId, fetchPacientes }) => {
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);

  if (!paciente) return null;

  const handleShowTicket = () => {
    setShowTicketModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Datos del Paciente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <tbody>
              <tr>
                <th>Nombre</th>
                <td>{paciente.nombre}</td>
              </tr>
              <tr>
                <th>Apellidos</th>
                <td>{paciente.apellidos}</td>
              </tr>
              <tr>
                <th>Número de Documento</th>
                <td>{paciente.doc_numero}</td>
              </tr>
              <tr>
                <th>Tipo de Documento</th>
                <td>{paciente.doc_tipo}</td>
              </tr>
              <tr>
                <th>Localidad</th>
                <td>{paciente.localidad}</td>
              </tr>
              <tr>
                <th>Nacionalidad</th>
                <td>{paciente.nacionalidad}</td>
              </tr>
              <tr>
                <th>Crear Ticket</th>
                <td><Button variant="danger" onClick={handleShowTicket}><FontAwesomeIcon icon={faPaperclip} /></Button></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
          
        </Modal.Footer>
      </Modal>
      <NuevoTicketPaciente 
        show={showTicketModal} 
        handleClose={() => setShowTicketModal(false)} 
        userId={userId}
        id_fk={paciente.id_paciente}
        onTicketSubmit={fetchPacientes} 
      />
    </>
  );
};

export default MostrarDatosPaciente;