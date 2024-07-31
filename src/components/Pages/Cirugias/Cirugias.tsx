import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Container, Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import axiosInstance from '../axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardFast, faBackwardStep, faForwardFast, faForwardStep, faList } from '@fortawesome/free-solid-svg-icons';
import OffcanvasMenu from '../../Navbar/OffcanvasMenu';
import MostrarDatosCirugia from './Datos/MostrarDatosCirugia';
import Fuse from 'fuse.js';

interface Cirugia {
  id_cirugia: number;
  fecha_inicio: string;
  hora_inicio: string;
  apellido_nombre: string;
  doc_numero: number;
  intervenciones: string;
}

interface CirugiasResponse {
  count: number;
  data: Cirugia[];
  status: string;
}

const ITEMS_PER_PAGE = 5;

const Cirugias: React.FC = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [cirugias, setCirugias] = useState<Cirugia[]>([]);
  const [filteredCirugias, setFilteredCirugias] = useState<Cirugia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCirugiaId, setSelectedCirugiaId] = useState<number | null>(null);
  const [showDatosCirugia, setShowDatosCirugia] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [fuse, setFuse] = useState<Fuse<Cirugia> | null>(null);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    fetchCirugias();
  }, []);

  const fetchCirugias = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post<CirugiasResponse>('/cirugias/get/misultimascirugias', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.status === 'success') {
        setCirugias(response.data.data);
        setFilteredCirugias(response.data.data);
        setFuse(new Fuse(response.data.data, {
          keys: ['fecha_inicio', 'hora_inicio', 'apellido_nombre', 'doc_numero', 'intervenciones'],
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
      setFilteredCirugias(cirugias);
    } else if (fuse) {
      const results = fuse.search(value).map(result => result.item);
      setFilteredCirugias(results);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleShowDatosCirugiaModal = (id_cirugia: number) => {
    setSelectedCirugiaId(id_cirugia);
    setShowDatosCirugia(true);
  };

  const formatFechaHora = (fecha: string, hora: string) => {
    const date = new Date(`${fecha}T${hora}`);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const totalPages = Math.ceil(filteredCirugias.length / ITEMS_PER_PAGE);
  const currentData = filteredCirugias.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage * ITEMS_PER_PAGE));

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="navbar-container">
      <Container className="d-flex align-items-center justify-content-center vh-100">
        <Col>
          <Form className="p-3 border rounded bg-light shadow-sm">
            <h1 className="display-6 text-center mb-4">Mis Últimas Cirugías</h1>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Buscar por fecha, paciente, documento o intervención"
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
                      <th>Fecha y Hora</th>
                      <th>Paciente</th>
                      <th>Doc.</th>
                    
                      <th>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map(cirugia => (
                      <tr key={cirugia.id_cirugia}>
                        <td>{formatFechaHora(cirugia.fecha_inicio, cirugia.hora_inicio)}</td>
                        <td>{cirugia.apellido_nombre}</td>
                        <td>{cirugia.doc_numero}</td>
                        
                        <td>
                          <Button variant="primary" onClick={() => handleShowDatosCirugiaModal(cirugia.id_cirugia)}>
                            <FontAwesomeIcon icon={faList} />
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
      <OffcanvasMenu show={show} handleClose={handleClose} handleShow={handleShow} pageTitle="Cirugías" />
      <MostrarDatosCirugia 
        show={showDatosCirugia} 
        handleClose={() => setShowDatosCirugia(false)} 
        id_cirugia={selectedCirugiaId} 
        userId={userId}
        fetchCirugias={fetchCirugias}
      />
    </div>
  );
};

export default Cirugias;