import { Modal, Button } from 'react-bootstrap';

interface ResponseModalProps {
    show: boolean;
    handleClose: () => void;
    title: string;
    message: string;
  }
  
const ResponseModal: React.FC<ResponseModalProps> = ({ show, handleClose, title, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResponseModal;
