import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Spinner, Container, Col, Form } from 'react-bootstrap';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardFast, faBackwardStep, faForwardFast, faForwardStep, faStethoscope, faList } from '@fortawesome/free-solid-svg-icons';
import { Paciente } from './Types';
import MostrarDatosPaciente from './MostrarDatosPaciente';
import NuevoPaciente from './NuevoPaciente';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

interface PacientesResponse {
  count: number;
  data: Paciente[];
  status: string;
}

const ITEMS_PER_PAGE = 5;

const Pacientes: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [fuse, setFuse] = useState<Fuse<Paciente> | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Paciente; direction: 'asc' | 'desc' } | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<PacientesResponse>('/pacientes/get/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 'success') {
        setPacientes(response.data.data);
        setFilteredPacientes(response.data.data);
        setFuse(new Fuse(response.data.data, {
          keys: ['nombre', 'apellidos', 'id_doc_tipo', 'doc_numero', 'id_localidad', 'id_nacionalidad'],
          threshold: 0.3,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (value === '') {
      setFilteredPacientes(pacientes);
    } else if (fuse) {
      const results = fuse.search(value).map(result => result.item);
      setFilteredPacientes(results);
    }
    setCurrentPage(1);
  };

  const handleSort = (key: keyof Paciente) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...filteredPacientes].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredPacientes(sortedData);
  };

  const getSortIndicator = (key: keyof Paciente) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredPacientes.length / ITEMS_PER_PAGE);
  const currentData = filteredPacientes.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE));

  const handleAdd = () => {
    fetchPacientes();
  };

  const handleShowDetail = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    setShowDetailModal(true);
  };

  const handleShowCirugia = (paciente: Paciente) => {
    navigate('/nuevacirugia', { state: { pacienteId: paciente.id_paciente } });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="navbar-container">
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Col>
          <Form className="p-3 border rounded bg-light shadow-sm">
            <h1 className="display-6 text-center mb-4">Consulta Pacientes</h1>
            <Button className="mb-3 text-light" variant="info" onClick={() => { setShowAddModal(true); }}>
              Crear nuevo paciente
            </Button>
            <InputGroup className="mb-3">
              <FormControl
                placeholder=" Buscar por nombre, apellido o documento"
                aria-label="Buscar"
                aria-describedby="basic-addon1"
                value={search}
                onChange={handleSearch}
              />
            </InputGroup>
            <div className="table-responsive">
              <div style={{ overflowX: 'auto' }}>
                <Table striped bordered hover className='table-responsive'>
                  <thead>
                    <tr>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>Nombre{getSortIndicator('nombre')}</th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('apellidos')}>Apellido{getSortIndicator('apellidos')}</th>
                      <th style={{ cursor: 'pointer' }} onClick={() => handleSort('doc_numero')}>N°Doc{getSortIndicator('doc_numero')}</th>
                      <th>Info</th>
                      <th>Cirugía</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map(paciente => (
                      <tr key={paciente.id_paciente}>
                        <td>{paciente.nombre}</td>
                        <td>{paciente.apellidos}</td>
                        <td>{paciente.doc_numero}</td>
                        <td>
                          <Button variant="primary" onClick={() => handleShowDetail(paciente)}> <FontAwesomeIcon icon={faList} />
                          </Button>
                        </td>
                        <td>
                          <Button variant="success" onClick={() => handleShowCirugia(paciente)}> <FontAwesomeIcon icon={faStethoscope} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              > <FontAwesomeIcon icon={faBackwardFast} />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              > <FontAwesomeIcon icon={faBackwardStep} />
              </Button>
              <span className="px-3">Página {currentPage} de {totalPages}</span>
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              > <FontAwesomeIcon icon={faForwardStep} />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              > <FontAwesomeIcon icon={faForwardFast} />
              </Button>
            </div>
          </Form>
        </Col>
      </Container>
      <MostrarDatosPaciente 
        show={showDetailModal} 
        handleClose={() => setShowDetailModal(false)}
        paciente={selectedPaciente}
        userId={userId}
        fetchPacientes={fetchPacientes}
      />
      <NuevoPaciente 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)} 
        handleAdd={handleAdd} 
      />
      <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Pacientes"/>
    </div>
  );
};

export default Pacientes;