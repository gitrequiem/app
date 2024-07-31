import React, { useEffect, useState } from 'react';
import { Modal, Button, Table} from 'react-bootstrap';
import axiosInstance from '../../axiosConfig';

interface Staff {
  id_staff_cirugia: number;
  nombres: string;
  apellidos: string;
  rol_cirugia: string;
}

interface MostrarStaffProps {
  show: boolean;
  handleClose: () => void;
  id_cirugia: number | null;
}

const MostrarStaff: React.FC<MostrarStaffProps> = ({ show, handleClose, id_cirugia }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id_cirugia) {
      fetchStaff(id_cirugia);
    }
  }, [id_cirugia]);

  const fetchStaff = async (id: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/cirugiastaffs/get/staffs/id', { id_cirugia: id }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 'success') {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Personal de la Cirugía</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Rol en la Cirugía</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id_staff_cirugia}>
                <td>{member.nombres}</td>
                <td>{member.apellidos}</td>
                <td>{member.rol_cirugia}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MostrarStaff;