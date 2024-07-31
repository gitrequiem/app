import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner } from 'react-bootstrap';
import axiosInstance from '../../axiosConfig';

interface Diagnostico {
  id_diagnostico: number;
  diagnostico: string;
}

interface MostrarDiagnosticosProps {
  show: boolean;
  handleClose: () => void;
  id_cirugia: number | null;
}

const MostrarDiagnosticos: React.FC<MostrarDiagnosticosProps> = ({ show, handleClose, id_cirugia }) => {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id_cirugia) {
      fetchDiagnosticos(id_cirugia);
    }
  }, [id_cirugia]);

  const fetchDiagnosticos = async (id_cirugia: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cirugiadiagnosticos/get/cirugias/id/diagnosticos', { id_cirugia_buscada: id_cirugia }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 'success') {
        setDiagnosticos(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching diagnosticos:', error);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Diagnósticos de la Cirugía</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table bordered>
            <thead>
              <tr>
                <th>ID Diagnóstico</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticos.map(diagnostico => (
                <tr key={diagnostico.id_diagnostico}>
                  <td>{diagnostico.diagnostico}</td>
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

export default MostrarDiagnosticos;