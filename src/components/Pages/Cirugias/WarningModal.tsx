import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


interface WarningModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  message: string;
}

const WarningModal: React.FC<WarningModalProps> = ({ show, handleClose, handleConfirm, message }) => {
  const navigate = useNavigate();

  const handleConfirmAndNavigate = () => {
    handleConfirm();
    navigate('/pacientes');
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Advertencia</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleConfirmAndNavigate}>
          Cerrar formulario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningModal;
